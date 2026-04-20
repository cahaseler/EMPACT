// web/app/utils/stopwatchState.ts

/**
 * Represents the state of a single countdown timer instance.
 */
export interface CountdownState {
	duration: number | null; // Total duration in milliseconds
	startTime: number | null; // Timestamp when the timer was started or resumed
	pausedAt: number | null; // Timestamp when the timer was paused
	remainingDurationOnPause: number | null; // Remaining duration when paused (ms)
	isRunning: boolean;
	clients: Set<ReadableStreamDefaultController<Uint8Array>>; // Connected SSE clients
}

/**
 * In-memory store for all active countdown timer states, keyed by assessmentId.
 */
declare global {
	// eslint-disable-next-line no-var
	var __countdownStates__: Map<string, CountdownState> | undefined;
}

const countdownStates = globalThis.__countdownStates__ ?? new Map<string, CountdownState>();
if (process.env.NODE_ENV !== 'production') globalThis.__countdownStates__ = countdownStates;

/**
 * Retrieves the state for a given assessmentId, creating it if it doesn't exist.
 * @param assessmentId - The ID of the assessment.
 * @returns The state object for the assessment.
 */
export function getCountdownState(assessmentId: string): CountdownState {
	if (!countdownStates.has(assessmentId)) {
		countdownStates.set(assessmentId, {
			duration: null,
			startTime: null,
			pausedAt: null,
			remainingDurationOnPause: null,
			isRunning: false,
			clients: new Set(),
		});
	}
	// Non-null assertion is safe because we just created it if it didn't exist.
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return countdownStates.get(assessmentId)!;
}

/**
 * Calculates the current remaining duration based on the timer's state.
 * @param state - The CountdownState object.
 * @returns The remaining duration in milliseconds. Returns 0 if duration is not set.
 */
export function calculateCurrentRemainingDuration(state: CountdownState): number {
	if (state.duration === null) {
		return 0;
	}

	if (!state.isRunning) {
		return state.remainingDurationOnPause ?? state.duration;
	}

	if (state.startTime === null) {
		// Should not happen if isRunning is true, but handle defensively
		return state.duration;
	}

	const elapsed = Date.now() - state.startTime;
	const remaining = state.duration - elapsed;

	return Math.max(0, remaining);
}

/**
 * Encodes and sends an SSE message using the stream controller.
 * @param controller - The ReadableStreamDefaultController for the client.
 * @param encoder - A TextEncoder instance.
 * @param event - The event name.
 * @param data - The data payload (will be JSON.stringify'd).
 */
function enqueueEvent(
	controller: ReadableStreamDefaultController<Uint8Array>,
	encoder: TextEncoder,
	event: string,
	data: unknown,
): void {
	try {
		// Check if the stream is still writable before attempting to enqueue
		// desiredSize will be null if closed or errored, or <= 0 if backpressure applies
		if (controller.desiredSize === null || controller.desiredSize <= 0) {
			return;
		}
		controller.enqueue(encoder.encode(`event: ${event}\n`));
		controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
	} catch (error) {
		// If enqueue fails, the stream is likely broken or closed.
		// Attempt to close it from our side.
		try {
			controller.close();
		} catch {
			// Ignore errors closing an already potentially broken controller
		}
		// We should ensure this controller is removed from the active set,
		// but that responsibility lies with the caller (broadcastCountdownState or keepAlive)
		// which has the assessmentId context.
		// Re-throw the error to signal the caller to remove the client.
		throw error;
	}
}

/**
	* Broadcasts the current countdown state (remaining duration and running status)
	* to all connected clients for a specific assessment using the 'update' event.
	* @param assessmentId - The ID of the assessment.
	*/
export function broadcastCountdownState(assessmentId: string): void {
	const state = countdownStates.get(assessmentId);
	if (!state) {
		return;
	}

	const remainingDuration = calculateCurrentRemainingDuration(state);
	   const clientCount = state.clients.size;
	// Send the *full relevant server state* needed by the client reducer
	const dataToSend = {
	 // remainingDuration, // Client can calculate this now
	 isRunning: state.isRunning,
	 clientCount,
	 duration: state.duration,
	 startTime: state.startTime,
	 pausedAt: state.pausedAt,
	};

	// console.log(`[Broadcast ${assessmentId}] Broadcasting state (Clients: ${clientCount}):`, dataToSend); // REMOVED DEBUG LOG
	const encoder = new TextEncoder();
	const controllersToRemove = new Set<
		ReadableStreamDefaultController<Uint8Array>
	>();

	state.clients.forEach((controller) => {
		try {
			// console.log(`[Broadcast ${assessmentId}] Attempting to send to client controller...`); // REMOVED DEBUG LOG
			// Always use the 'update' event for broadcasting state
			enqueueEvent(controller, encoder, 'update', dataToSend);
			// console.log(`[Broadcast ${assessmentId}] Send successful for one client.`); // REMOVED DEBUG LOG
		} catch (error) {
			// enqueueEvent now throws on failure, indicating the controller should be removed.
			// console.error(`[Broadcast ${assessmentId}] Error sending to client controller:`, error); // REMOVED DEBUG LOG
			controllersToRemove.add(controller);
		}
	});

	controllersToRemove.forEach((controller) => {
		removeClient(assessmentId, controller);
	});
}

/**
	* Removes a client controller from the set for a given assessmentId and closes its stream.
 * @param assessmentId - The ID of the assessment.
 * @param controller - The controller to remove.
 */
export function removeClient(
	assessmentId: string,
	controller: ReadableStreamDefaultController<Uint8Array>,
): void {
	const state = countdownStates.get(assessmentId);
	if (state && state.clients.has(controller)) {
		state.clients.delete(controller);
		try {
			controller.close();
		} catch (error) {
			// Ignore errors if the controller is already closed or errored
		}
		// After successfully removing a client, broadcast the new state (mainly client count)
		broadcastCountdownState(assessmentId);

	} else if (state) {
	}
}

/**
 * Sends a keep-alive message using the stream controller.
 * @param controller - The ReadableStreamDefaultController for the client.
 * @param encoder - A TextEncoder instance.
 */
export function sendKeepAlive(
	controller: ReadableStreamDefaultController<Uint8Array>,
	encoder: TextEncoder,
): void {
	try {
		// Check desiredSize before sending keep-alive as well
		if (controller.desiredSize === null || controller.desiredSize <= 0) {
			throw new Error('Stream not writable for keep-alive'); // Throw to signal failure
		}
		// SSE comments start with ':'
		controller.enqueue(encoder.encode(': keep-alive\n\n'));
	} catch (error) {
		// If sending keep-alive fails, assume the client is gone.
		try {
			controller.close();
		} catch {
			// Ignore errors closing an already potentially broken controller
		}
		// Re-throw the error so the interval knows it failed and can trigger removal.
		throw error;
	}
}

// Added function to update state - useful for the control API
/**
 * Updates the state for a given assessmentId.
 * @param assessmentId - The ID of the assessment.
 * @param updates - Partial state updates.
 */
export function updateCountdownState(
	assessmentId: string,
	updates: Partial<CountdownState>,
): CountdownState {
	const state = getCountdownState(assessmentId);
	const newState = { ...state, ...updates };
	countdownStates.set(assessmentId, newState);
	return newState;
}