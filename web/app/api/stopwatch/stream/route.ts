// web/app/api/stopwatch/stream/route.ts
import { type NextRequest } from 'next/server';
import {
	getCountdownState,
	removeClient,
	sendKeepAlive,
	// calculateCurrentRemainingDuration, // No longer needed here
	broadcastCountdownState, // Import broadcast function
} from '@/app/utils/stopwatchState';

const KEEP_ALIVE_INTERVAL = 30000;


export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const assessmentId = searchParams.get('assessmentId');

	if (!assessmentId) {
		return new Response('Missing assessmentId query parameter', { status: 400 });
	}

	let controller: ReadableStreamDefaultController<Uint8Array> | null = null;
	let keepAliveIntervalId: NodeJS.Timeout | null = null;

	const stream = new ReadableStream({
		start(streamController) {
			controller = streamController;
			const encoder = new TextEncoder();
			const state = getCountdownState(assessmentId);
			state.clients.add(controller);
			try {
				controller.enqueue(encoder.encode('retry: 1000\n\n'));

				// Send the *full relevant server state* needed by the client reducer
				// Consistent with broadcastCountdownState
				const initialStateData = {
					// remainingDuration: calculateCurrentRemainingDuration(state), // Client can calculate
					isRunning: state.isRunning,
					clientCount: state.clients.size,
					duration: state.duration,
					startTime: state.startTime, // Include startTime
					pausedAt: state.pausedAt,   // Include pausedAt
				};
				controller.enqueue(
					encoder.encode(
						`event: update\ndata: ${JSON.stringify(initialStateData)}\n\n`,
					),
				);
				// Broadcast the updated state (mainly for client count) to everyone
				broadcastCountdownState(assessmentId);
			} catch (error) {
				// If sending initial state fails, remove the client and stop
				removeClient(assessmentId, controller);
				// Also broadcast the removal in case the count was briefly incremented
				broadcastCountdownState(assessmentId);
				return; // Stop further processing for this stream
			}

			// Setup keep-alive after successful initial send and broadcast
			keepAliveIntervalId = setInterval(() => {
				if (!controller) {
					if (keepAliveIntervalId) clearInterval(keepAliveIntervalId);
					return;
				}
				try {
					sendKeepAlive(controller, encoder);
				} catch (error) {
					if (keepAliveIntervalId) clearInterval(keepAliveIntervalId);
					removeClient(assessmentId, controller);
				}
			}, KEEP_ALIVE_INTERVAL);

			req.signal.addEventListener('abort', () => {
				if (keepAliveIntervalId) clearInterval(keepAliveIntervalId);
				if (controller) {
					removeClient(assessmentId, controller);
				}
			});
		},
		cancel(reason) {
			if (keepAliveIntervalId) clearInterval(keepAliveIntervalId);
			if (assessmentId && controller) {
				removeClient(assessmentId, controller);
			}
		},
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-transform',
			Connection: 'keep-alive',
		},
	});
}