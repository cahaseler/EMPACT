'use client';

import React, { useEffect, useRef, useCallback, useReducer, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { toast } from '@/components/ui/use-toast';
import { isAdmin, isFacForAssessment } from '@/app/(frontend)/(logged-in)/utils/permissions';
import StopwatchAdminControls from './StopwatchAdminControls';
import StopwatchDisplay from './StopwatchDisplay';
import StopwatchContainer from './StopwatchContainer';
import StopwatchUserCount from './StopwatchUserCount';

const formatTime = (ms: number | null | undefined): string => {
	if (ms === null || ms === undefined || ms < 0) {
		return '--:--';
	}
	const totalSeconds = Math.max(0, Math.floor(ms / 1000));
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
		2,
		'0',
	)}`;
};

// Parses duration input string (e.g., "5", "5.5", "5:20") into milliseconds
const parseDurationInput = (input: string): number | null => {
	input = input.trim();
	if (!input) return null;

	if (input.includes(':')) {
		const parts = input.split(':');
		if (parts.length === 2 && parts[0] !== undefined && parts[1] !== undefined) {
			const minutes = parseInt(parts[0], 10);
			const seconds = parseInt(parts[1], 10);
			if (!isNaN(minutes) && !isNaN(seconds) && seconds >= 0 && seconds < 60 && minutes >= 0) {
				return (minutes * 60 + seconds) * 1000;
			}
		}
	}

	const minutesFloat = parseFloat(input);
	if (!isNaN(minutesFloat) && minutesFloat > 0) {
		return minutesFloat * 60 * 1000;
	}

	return null;
};


interface ServerState {
  duration: number | null;
  startTime: number | null;
  pausedAt: number | null;
  isRunning: boolean;
}

interface StopwatchState {
  // isInitialized: boolean; // Removed - we use serverState === null to check if initial state arrived
  serverState: ServerState | null;
  canControl: boolean;
  showAdminControls: boolean;
  isMinimized: boolean;
  connectedClientCount: number;
  customDurationInput: string;
}

type StopwatchAction =
  // | { type: 'INITIALIZE'; payload: { ... } } // Removed INITIALIZE action type
  | { type: 'SET_CAN_CONTROL'; payload: boolean }
  | { type: 'UPDATE_FROM_SSE'; payload: { // This now handles initial state too
      duration?: number | null;
      startTime?: number | null;
      pausedAt?: number | null;
      isRunning: boolean;
      clientCount: number;
    } }
  | { type: 'TOGGLE_ADMIN_CONTROLS' }
  | { type: 'TOGGLE_MINIMIZE' }
  | { type: 'SET_CUSTOM_DURATION_INPUT'; payload: string };

const initialState: StopwatchState = {
  // isInitialized: false, // Removed
  serverState: null, // Initial state is null until first SSE message
  canControl: false,
  showAdminControls: false,
  isMinimized: false,
  connectedClientCount: 0,
  customDurationInput: '5',
};

const stopwatchReducer = (state: StopwatchState, action: StopwatchAction): StopwatchState => {
  switch (action.type) {
    // case 'INITIALIZE': { ... } // Removed INITIALIZE case

    case 'SET_CAN_CONTROL':
      return { ...state, canControl: action.payload };

    case 'UPDATE_FROM_SSE': {
      // This action now handles both initial state and subsequent updates.
      // No need for isInitialized check anymore.

      // Update the full server state based on SSE payload
      const serverState: ServerState = {
        duration: action.payload.duration ?? state.serverState?.duration ?? null,
        startTime: action.payload.startTime ?? state.serverState?.startTime ?? null,
        pausedAt: action.payload.pausedAt ?? state.serverState?.pausedAt ?? null,
        isRunning: action.payload.isRunning
      };
      return {
        ...state,
        serverState, // Set/update serverState
        connectedClientCount: action.payload.clientCount,
        // isInitialized: true // No longer needed
      };
    }

    case 'TOGGLE_ADMIN_CONTROLS':
      return { ...state, showAdminControls: !state.showAdminControls };

    case 'TOGGLE_MINIMIZE':
      return { ...state, isMinimized: !state.isMinimized };

    case 'SET_CUSTOM_DURATION_INPUT':
      return { ...state, customDurationInput: action.payload };

    default:
      return state;
  }
};


const Stopwatch: React.FC = () => {
	const params = useParams();
	const assessmentId = params.assessmentId as string | undefined;
	const { user } = useUser();
	const eventSourceRef = useRef<EventSource | null>(null);
	const animationFrameRef = useRef<number | null>(null);
	const prevSecondsRef = useRef<number | null>(null);
	const flashTimeoutRef = useRef<NodeJS.Timeout[]>([]);
	const hasZeroFlashedRef = useRef<boolean>(false);
	const [displayTimeString, setDisplayTimeString] = useState<string>('--:--');
	const [isFlashing, setIsFlashing] = useState<boolean>(false);

	   // Helper function to calculate remaining time from server state
    const calculateRemainingTime = (state: ServerState): number | null => {
        if (!state.duration) return null;
        if (!state.isRunning) return state.duration;
        
        if (state.startTime) {
            const elapsed = Date.now() - state.startTime;
            return Math.max(0, state.duration - elapsed);
        }
        
        return state.duration;
    };

    // Use reducer for state management
    const [state, dispatch] = useReducer(stopwatchReducer, initialState);
    const {
        // isInitialized, // Removed
        serverState,
        canControl,
        showAdminControls,
        isMinimized,
        connectedClientCount,
        customDurationInput,
    } = state;

    // Derive values from serverState
    const isRunning = serverState?.isRunning ?? false;
    const remainingTime = serverState ? calculateRemainingTime(serverState) : null;

	// Effect to determine control permissions
	useEffect(() => {
		const userMetadata = user?.publicMetadata;
		if (userMetadata && assessmentId) {
			const controlPermission =
				isAdmin({ user: userMetadata }) ||
				isFacForAssessment({ user: userMetadata }, assessmentId);
			dispatch({ type: 'SET_CAN_CONTROL', payload: controlPermission });
		} else {
			dispatch({ type: 'SET_CAN_CONTROL', payload: false });
		}
	}, [user, assessmentId]);

	   // Removed the separate useEffect hook for fetching initial state via HTTP.
	      // State initialization is now handled by the first message from the SSE stream.

	// Effect for SSE Connection
	useEffect(() => {
	 if (!assessmentId) return;

	 const connectSSE = () => {
	  const url = `/api/stopwatch/stream?assessmentId=${assessmentId}`;
	  eventSourceRef.current = new EventSource(url);

	  eventSourceRef.current.onopen = () => {};

	  eventSourceRef.current.onerror = () => {};

	  eventSourceRef.current.addEventListener('update', (event) => {
	   try {
	   	const data = JSON.parse(event.data);
	       // console.log('[Stopwatch SSE] Received "update" event. Data:', data); // REMOVED DEBUG LOG
	   	dispatch({
	   		type: 'UPDATE_FROM_SSE',
	   		payload: {
							duration: data.duration ?? null,
							startTime: data.startTime ?? null,
							pausedAt: data.pausedAt ?? null,
							isRunning: data.isRunning ?? false,
							clientCount: data.clientCount ?? 0,
						}
					});
				} catch (error) {
					toast({
						title: 'Error',
						description: 'Failed to process timer update.',
						variant: 'destructive',
					});
				}
			});

			eventSourceRef.current.onerror = (error) => {
	               // Attempt to reconnect or handle error appropriately
				eventSourceRef.current?.close();
	               // Maybe add a delay and retry connection here?
			};
		};

		connectSSE();

		// Cleanup function
		return () => {
			eventSourceRef.current?.close();
			eventSourceRef.current = null;
		};
	}, [assessmentId]);

	// Effect for animation frame-based timer updates
	useEffect(() => {
		// Start ticking only after the initial state has arrived via SSE
		if (serverState === null) return;

		const tick = () => {
			if (!serverState) {
				setDisplayTimeString('--:--');
				return;
			}

			if (serverState.isRunning && serverState.startTime && serverState.duration) {
				const now = Date.now();
				const elapsed = now - serverState.startTime;
				const remaining = Math.max(0, serverState.duration - elapsed);
				const currentSeconds = Math.floor(remaining / 1000);
				
				// Store previous seconds before we check for zero
				const prevSeconds = prevSecondsRef.current;
				prevSecondsRef.current = currentSeconds;
				
				// Detect minute mark transitions
				// Only flash if we have a previous value and we're not just starting
				if (prevSeconds !== null &&
					elapsed > 1000 && // Ensure we're not just starting
					Math.floor(prevSeconds % 60) === 0 &&
					Math.floor(currentSeconds % 60) === 59 &&
					remaining > 0) {
					// Clear any existing timeouts
					flashTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
					flashTimeoutRef.current = [];
					
					// Trigger minute flash
					setIsFlashing(true);
					const timeout = setTimeout(() => setIsFlashing(false), 1000);
					flashTimeoutRef.current.push(timeout);
				}
				
				// Detect transition to zero - check if we just crossed the zero threshold
				if (currentSeconds === 0 && typeof prevSeconds === 'number' && prevSeconds > 0) {
					// Clear any existing timeouts
					flashTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
					flashTimeoutRef.current = [];
					
					// Original triple flash sequence
					setIsFlashing(true);
					const timeouts = [
						setTimeout(() => setIsFlashing(false), 300),  // Flash 1 off
						setTimeout(() => setIsFlashing(true), 400),   // Flash 2 on
						setTimeout(() => setIsFlashing(false), 700),  // Flash 2 off
						setTimeout(() => setIsFlashing(true), 800),   // Flash 3 on
						setTimeout(() => setIsFlashing(false), 1100), // Flash 3 off
					];
					
					flashTimeoutRef.current = timeouts;
				}
				
				const formattedTime = formatTime(remaining);
				setDisplayTimeString(formattedTime);
				
				// Continue animation frame for a short while after zero to ensure flash completes
				if (remaining > 0 || (remaining === 0 && flashTimeoutRef.current.length > 0)) {
					animationFrameRef.current = requestAnimationFrame(tick);
				}
			} else {
				// Timer is not running (paused or reset)
				let timeToDisplay: number | null = null;
				if (serverState.pausedAt && serverState.startTime && serverState.duration) {
					// Timer is PAUSED: Calculate remaining time at the moment of pause
					const elapsedBeforePause = serverState.pausedAt - serverState.startTime;
					timeToDisplay = Math.max(0, serverState.duration - elapsedBeforePause);
					// console.log('[Stopwatch Tick] Paused. Using calculated remaining time at pause (ms):', timeToDisplay); // REMOVED DEBUG LOG
				} else {
					// Timer is RESET or in initial state: Use the full duration
					timeToDisplay = serverState.duration ?? null;
					// console.log('[Stopwatch Tick] Reset/Initial. Using duration (ms):', timeToDisplay); // REMOVED DEBUG LOG
				}
				const formattedTime = formatTime(timeToDisplay);
				// console.log('[Stopwatch Tick] Not Running. Setting displayTimeString:', formattedTime); // REMOVED DEBUG LOG
				setDisplayTimeString(formattedTime);
			}
		};

		tick();

		// Cleanup function
		return () => {
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
			// Clear any active flash timeouts
			flashTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
			flashTimeoutRef.current = [];
		};
	// serverState is now the dependency that triggers starting/updating the tick loop
	}, [serverState]);

	const sendControlAction = useCallback(
		async (
			action: 'start' | 'pause' | 'reset' | 'add_time',
			payload?: { duration?: number; timeToAddMs?: number },
		) => {
			if (!assessmentId) {
				toast({
					title: 'Error',
					description: 'Assessment ID is missing.',
					variant: 'destructive',
				});
				return false;
			}

			const bodyPayload = {
				assessmentId,
				action,
				...payload,
			};


			try {
				const response = await fetch('/api/stopwatch/control', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(bodyPayload),
				});

				if (!response.ok) {
					let errorText = `HTTP error! status: ${response.status}`;
					try {
						const text = await response.text();
						if (text) {
							errorText = `HTTP error! status: ${response.status} - ${text}`;
						}
					} catch (textError) {
					}
					throw new Error(errorText);
				}
                return true;
			} catch (error) {
				toast({
					title: 'API Error',
					description: `Failed to ${action} stopwatch. ${
						error instanceof Error ? error.message : String(error)
					}`,
					variant: 'destructive',
				});
                return false;
			}
		},
		[assessmentId], // sendControlAction depends only on assessmentId
	);

		  // Handler to set a specific duration (used by presets and custom input)
		  const handleSetDuration = useCallback(async (durationMs: number) => {
		      await sendControlAction('reset', { duration: durationMs });
		      // State updates handled by SSE via reducer
		  }, [sendControlAction]);

		  // Handler for the custom duration input field
	const handleCustomDurationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		      dispatch({ type: 'SET_CUSTOM_DURATION_INPUT', payload: e.target.value });
		  };

		  // Handler for the "Set" button next to the custom duration input
	const handleSetCustomDuration = () => {
		const durationMs = parseDurationInput(customDurationInput);
		if (durationMs !== null && durationMs > 0) {
			handleSetDuration(durationMs);
		} else {
			toast({
				title: 'Invalid Duration',
				description: 'Use numbers (e.g., 5, 2.5) or MM:SS (e.g., 2:30).',
				variant: 'destructive',
			});
		}
	};

		  // Handler for preset duration buttons
		  const handlePresetDuration = (minutes: number) => {
		      handleSetDuration(minutes * 60 * 1000);
		  };

		  // Handler for Start/Pause button
	const handleTogglePlayPause = async () => {
		if (isRunning) {
		 await sendControlAction('pause');
		 // State updates handled by SSE via reducer
		} else {
		 // Only start if there's time remaining
		 if ((remainingTime ?? 0) > 0) {
		  await sendControlAction('start');
		  // State updates handled by SSE via reducer
		 } else {
		  toast({
		  	title: 'Cannot Start',
		  	description: 'Timer is at zero. Reset or set a duration.',
		  	variant: 'destructive',
		  });
		 }
		}
	};

		  // Handler for Reset button
	const handleReset = () => {
		      // Use the last duration from server state, or fallback to a default (e.g., 4 minutes)
		const resetDuration = serverState?.duration ?? (4 * 60 * 1000);
		      sendControlAction('reset', { duration: resetDuration });
		      if (!serverState?.duration) {
		           toast({
		              title: 'Resetting',
		              description: 'Resetting to default 4 minutes (no duration previously set).',
		           });
		      }
		      // State updates handled by SSE via reducer
	};

		  // Handler for "+1 Minute" button
		  const handleAddMinute = () => {
		      sendControlAction('add_time', { timeToAddMs: 60000 });
		      // State updates handled by SSE via reducer
		  };

		  // Handler for Minimize/Maximize button
		  const handleToggleMinimize = () => {
		      dispatch({ type: 'TOGGLE_MINIMIZE' });
		  };

		  // Handler for Show/Hide Admin Controls button
		  const handleToggleAdminControls = () => {
		      dispatch({ type: 'TOGGLE_ADMIN_CONTROLS' });
		  };


	if (!assessmentId) {
		return null;
	}

	// Show loading state until the first SSE message arrives and populates serverState
	if (serverState === null) {
		return (
			<div className="absolute top-20 right-12 z-50 p-4 bg-background rounded-md shadow-md border w-64 text-center text-muted-foreground">
				Loading Timer...
			</div>
		);
	}

	// Calculate user count display (exclude self if controller)
	const displayUserCount = canControl ? Math.max(0, connectedClientCount - 1) : connectedClientCount;

	return (
		<StopwatchContainer
			isMinimized={isMinimized}
			canControl={canControl}
			showAdminControls={showAdminControls}
			onToggleMinimize={handleToggleMinimize}
			onToggleAdminControls={handleToggleAdminControls}
			isFlashing={isFlashing}
		>
			<StopwatchDisplay displayTimeString={displayTimeString} />

			{canControl && showAdminControls && (
				<StopwatchAdminControls
					isRunning={isRunning}
					remainingTime={remainingTime}
					customDurationInput={customDurationInput}
					onTogglePlayPause={handleTogglePlayPause}
					onReset={handleReset}
					onAddMinute={handleAddMinute}
					onPresetDuration={handlePresetDuration}
					onCustomDurationInputChange={handleCustomDurationInputChange}
					onSetCustomDuration={handleSetCustomDuration}
				/>
			)}

			{canControl && (
				<StopwatchUserCount count={displayUserCount} />
			)}
		</StopwatchContainer>
	);
};

export default Stopwatch;