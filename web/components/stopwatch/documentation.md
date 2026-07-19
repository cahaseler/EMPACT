# Stopwatch Feature Documentation

## Overview

The Stopwatch feature provides a real-time synchronized timer for each assessment that can be controlled by facilitators. This component enables coordinated timing across all participants in an assessment, ensuring everyone stays synchronized during timed activities.

## Architecture

### Frontend Components
- Built using Next.js 15 App Router and React Components
- Main component: `Stopwatch.tsx` with subcomponents for modular functionality
- Uses Server-Sent Events (SSE) via `EventSource` for real-time updates

### Backend Structure
- Implemented using Next.js API Routes (`/api/stopwatch/*`)
- Utilizes SSE stream for real-time state broadcasting
- Manages state in-memory for immediate responsiveness

### Communication Flow
1. Client connects to SSE stream for real-time updates
2. Control actions sent via POST requests
3. Server broadcasts state updates through SSE
4. All clients receive synchronized updates

## Backend Details

### State Management (`stopwatchState.ts`)

The state management system uses a `CountdownState` interface and maintains state in an in-memory `Map` keyed by `assessmentId`. The system uses `globalThis` to ensure consistent state across development environments.

Key Functions:
- `getCountdownState`: Retrieves current state for an assessment
- `updateCountdownState`: Modifies timer state
- `removeClient`: Handles client disconnection
- `broadcastCountdownState`: Notifies all clients of state changes
- `calculateCurrentRemainingDuration`: Computes current remaining time

### SSE Stream (`/api/stopwatch/stream/route.ts`)

Handles real-time communication with clients:
- Processes GET requests for stream initialization
- Manages client connections in the `clients` set
- Sends initial state on connection
- Maintains connection with keep-alive messages
- Handles client disconnection via `req.signal.onabort`

### Control Endpoint (`/api/stopwatch/control/route.ts`)

Manages stopwatch control operations:
- Handles POST requests for timer control
- Required parameters:
  - `assessmentId`: Identifies the specific assessment
  - `action`: Supports `start`, `pause`, `reset`, `add_time`
  - Optional: `duration` or `timeToAddMs` for specific actions
- Performs authorization checks (admin/facilitator only)
- Updates state and triggers broadcasts

## Frontend Details

### Main Component (`Stopwatch.tsx`)

Core functionality:
- Uses `useParams` to get `assessmentId`
- State management:
  - `useReducer` for server state and UI flags
  - `useState` for display time and flash effect
- Effect handlers:
  - Permissions verification
  - SSE connection management
  - Display updates via `requestAnimationFrame`
- Event handlers for control actions

### Subcomponents

1. `StopwatchContainer.tsx`
   - Manages layout structure
   - Handles minimize/maximize states
   - Implements flash effect background

2. `StopwatchDisplay.tsx`
   - Renders formatted time string
   - Pure presentation component

3. `StopwatchAdminControls.tsx`
   - Contains control buttons and inputs
   - Available only to facilitators

4. `StopwatchUserCount.tsx`
   - Shows number of connected users
   - Updates in real-time

### State Flow
1. User initiates action
2. Handler triggers `sendControlAction`
3. API request sent to server
4. Server updates internal state
5. `broadcastCountdownState` notifies all clients
6. Clients receive 'update' via SSE
7. Reducer updates `serverState`
8. `requestAnimationFrame` recalculates time
9. `displayTimeString` updates
10. UI reflects changes

### Flash Effect Implementation
- Logic in `Stopwatch.tsx` detects specific time marks
- Uses `useState` for flash state management
- `setTimeout` controls flash duration
- `StopwatchContainer` applies visual effect

## Key Concepts

1. Server-Sent Events (SSE)
   - Enables efficient real-time updates
   - Maintains persistent connection
   - Reduces server load compared to polling

2. Single Source of Truth
   - Server maintains authoritative state
   - Prevents desynchronization issues
   - Ensures consistency across clients

3. Client-Side Time Calculation
   - Uses `requestAnimationFrame` for smooth updates
   - Reduces server load
   - Maintains visual accuracy

4. In-Memory State Considerations
   - Fast access and updates
   - Not persistent across server restarts
   - Limited by single-server architecture

## Integration

- Component designed for assessment layouts
- Typically used in `[assessmentId]/layout.tsx`
- Requires `assessmentId` in URL parameters
- Integrates with assessment permission system

## Future Enhancement Opportunities

1. State Persistence
   - Implement Redis backing store
   - Enable horizontal scaling
   - Provide restart recovery

2. Additional Features
   - Countdown mode
   - Multiple timer support
   - Custom alert thresholds
   - Advanced notification options

3. Performance Optimizations
   - WebSocket alternative for bi-directional communication
   - Client-side state prediction
   - Reduced broadcast frequency

4. Reliability Improvements
   - Automatic reconnection handling
   - Offline mode support
   - State reconciliation mechanisms