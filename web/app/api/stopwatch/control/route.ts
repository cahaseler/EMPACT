// web/app/api/stopwatch/control/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
	isAdmin,
	isLeadForAssessment,
	isFacForAssessment,
} from '@/app/(frontend)/(logged-in)/utils/permissions';
import {
	getCountdownState,
	updateCountdownState,
	broadcastCountdownState,
	type CountdownState,
} from '@/app/utils/stopwatchState';

interface ControlPayload {
	assessmentId: string;
	action: 'start' | 'pause' | 'reset' | 'add_time';
	duration?: number;
	   timeToAddMs?: number;
}

export async function POST(req: NextRequest) {
	const session = await auth();

	if (!session?.user?.id) {
		return new NextResponse('Unauthorized', { status: 401 });
	}

	let payload: ControlPayload;
	try {
		payload = await req.json();
	} catch (error) {
		return new NextResponse('Invalid JSON body', { status: 400 });
	}

	const { assessmentId, action, duration, timeToAddMs } = payload;

	if (!assessmentId || !action) {
		return new NextResponse('Missing assessmentId or action in payload', {
			status: 400,
		});
	}

	const isUserAdmin = isAdmin(session);
	const isUserLeadFac = isLeadForAssessment(session, assessmentId);
	const isUserFac = isFacForAssessment(session, assessmentId);

	const canControl = isUserAdmin || isUserLeadFac || isUserFac;

	if (!canControl) {
		return new NextResponse(
			JSON.stringify({
				error:
					'User is not authorized to control the stopwatch for this assessment.',
			}),
			{
				status: 403,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	}

	const state = getCountdownState(assessmentId);

	switch (action) {
		case 'reset': {
			if (typeof duration !== 'number' || duration <= 0) {
				return new NextResponse(
					'Missing or invalid duration for reset action',
					{ status: 400 },
				);
			}
			updateCountdownState(assessmentId, {
				duration: duration,
				startTime: null,
				pausedAt: null,
				remainingDurationOnPause: duration, // Initially, remaining is the full duration
				isRunning: false,
			});
			broadcastCountdownState(assessmentId);
			return new NextResponse('Timer reset successfully', { status: 200 });
		}

		case 'start': {
		          let currentDuration = state.duration;
		          // If duration isn't set, default to 4 minutes (240000 ms)
		          if (currentDuration === null) {
		              currentDuration = 4 * 60 * 1000;
		              updateCountdownState(assessmentId, {
		                  duration: currentDuration,
		                  startTime: null,
		                  pausedAt: null,
		                  remainingDurationOnPause: currentDuration, // Full duration remaining
		                  isRunning: false,
		              });
		          }

			if (state.isRunning) {
				return new NextResponse('Timer is already running', { status: 200 });
			}

			let newStartTime: number;
			if (state.remainingDurationOnPause !== null && currentDuration !== null) {
				const elapsedBeforePause =
					currentDuration - state.remainingDurationOnPause;
				newStartTime = Date.now() - elapsedBeforePause;
			} else {
				newStartTime = Date.now();
			}

			updateCountdownState(assessmentId, {
			             duration: currentDuration,
				startTime: newStartTime,
				pausedAt: null,
				remainingDurationOnPause: null,
				isRunning: true,
			});

			broadcastCountdownState(assessmentId);
			return new NextResponse('Timer started successfully', { status: 200 });
		}

		case 'pause': {
			if (state.duration === null) {
				return new NextResponse('Timer duration not set.', { status: 400 });
			}
			if (!state.isRunning) {
				return new NextResponse('Timer is not running', { status: 200 }); // Or 409?
			}
			if (state.startTime === null) {
				return new NextResponse('Internal timer state error', {
					status: 500,
				});
			}

			const pausedTimestamp = Date.now();
			const elapsed = pausedTimestamp - state.startTime;
			const remainingDuration = Math.max(0, state.duration - elapsed);

			updateCountdownState(assessmentId, {
				pausedAt: pausedTimestamp,
				remainingDurationOnPause: remainingDuration,
				isRunning: false,
			});
			broadcastCountdownState(assessmentId);
			return new NextResponse('Timer paused successfully', { status: 200 });
		}

			     case 'add_time': {
			         const timeToAdd = timeToAddMs ?? 60000; // Default to 1 minute if not specified
			         if (typeof timeToAdd !== 'number' || timeToAdd <= 0) {
			             return new NextResponse(
			                 'Invalid timeToAddMs for add_time action',
			                 { status: 400 },
			             );
			         }

			         let newDuration: number;
			         let newRemainingDuration: number | null = null;
			         let newStateChanges: Partial<CountdownState> = {};

			         const baseDuration = state.duration ?? (4 * 60 * 1000); // Default to 4 mins if unset

			         if (state.isRunning && state.startTime !== null) {
			             newDuration = baseDuration + timeToAdd;
			             // Keep the same elapsed time by adjusting startTime backwards
			             const currentElapsed = Date.now() - state.startTime;
			             const newStartTime = Date.now() - currentElapsed; // Keep elapsed the same

			             newStateChanges = {
			                 duration: newDuration,
			                 startTime: newStartTime, // Adjust start time to reflect added duration
			             };

			         } else {
			              const currentRemaining = state.remainingDurationOnPause ?? baseDuration;
			              newRemainingDuration = currentRemaining + timeToAdd;
			              newDuration = baseDuration + timeToAdd; // Also increase the base duration

			              newStateChanges = {
			                  duration: newDuration,
			                  remainingDurationOnPause: newRemainingDuration,
			              };
			         }

			         updateCountdownState(assessmentId, newStateChanges);
			         broadcastCountdownState(assessmentId);
			         return new NextResponse('Time added successfully', { status: 200 });
			     }

		default:
			return new NextResponse('Invalid action specified', { status: 400 });
	}
}