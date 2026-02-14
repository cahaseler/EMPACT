import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
	getCountdownState,
	type CountdownState,
} from '@/app/utils/stopwatchState';

// Removed unused calculateRemainingDuration function

export async function GET(req: NextRequest) {
	const session = await auth();
	if (!session?.user?.id) {
		return new NextResponse('Unauthorized', { status: 401 });
	}

	const searchParams = req.nextUrl.searchParams;
	const assessmentId = searchParams.get('assessmentId');

	if (!assessmentId) {
		return new NextResponse('Missing assessmentId query parameter', { status: 400 });
	}

	try {
		const state = getCountdownState(assessmentId);
		// No need to calculate remainingDuration here, client does that.
		const clientCount = state.clients.size;

		// Return the full state needed by the client, consistent with SSE format
		const currentState = {
			duration: state.duration,
			startTime: state.startTime, // Add startTime
			pausedAt: state.pausedAt,   // Add pausedAt
			isRunning: state.isRunning,
			clientCount,
		};

		return NextResponse.json(currentState);

	} catch (error) {
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}