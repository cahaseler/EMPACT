# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EMPACT (Environment and Maturity Program Assessment and Control Tool) is a full-stack assessment platform implementing the IP2M METRR evaluation model. It's built with Next.js 15, TypeScript, and supports both web and desktop deployment via Tauri.

## Development Commands

All commands should be run from the `web/` directory unless specified otherwise:

```bash
# Development
yarn dev              # Start development server on http://localhost:3000

# Building
yarn build            # Generate Prisma clients and build Next.js app
yarn start            # Start production server

# Code Quality
yarn lint             # Run ESLint
yarn lint:fix         # Run ESLint with auto-fix
yarn typecheck        # Run TypeScript type checking

# Testing
yarn test             # Build and run Playwright tests
yarn test:ui          # Run tests with UI
yarn test:debug       # Run tests in debug mode

# Database
yarn prisma-generate  # Generate Prisma clients for all database types

# Data Import
yarn import:ip2m      # Import legacy IP2M METRR data from Excel
                      # See web/scripts/README.md for detailed documentation
```

## Architecture Overview

The application uses Next.js App Router with a clear separation between frontend routes and API endpoints:

- **Frontend Routes** (`app/(frontend)/`): 
  - Protected routes under `(logged-in)/` require authentication via Clerk
  - Public routes under `(logged-out)/` for authentication flows
  - Key pages: Dashboard, Assessments, Collections, Recommendations, Questionnaire

- **API Layer** (`app/api/`):
  - RESTful endpoints for data operations
  - Clerk webhook handling for user synchronization
  - Database operations via Prisma ORM

- **Database Architecture**:
  - Multi-database support (MSSQL primary, PostgreSQL/SQLite for flexibility)
  - Prisma schemas in `web/prisma/[db-type]/schema.prisma`
  - Generated clients in `web/prisma/generated/[db-type]/`
  - Use `getDatabaseClient()` from `web/lib/db.ts` for database access

- **Component Structure**:
  - Shared components in `web/components/`
  - UI components from Shadcn UI library
  - All components use TypeScript with proper type definitions

## Key Patterns and Conventions

1. **Authentication**: 
   - Clerk handles authentication with SSO support
   - User sync happens via webhooks to maintain database records
   - Check authentication state using Clerk's hooks/utilities

2. **Database Access**:
   - Always use the database client from `lib/db.ts`
   - Follow existing query patterns in API routes
   - Use Prisma's type-safe query builders

3. **State Management**:
   - Server components by default in App Router
   - Client components marked with 'use client'
   - Use URL state for filters and pagination

4. **Error Handling**:
   - API routes return appropriate HTTP status codes
   - Client-side error boundaries for graceful degradation
   - Consistent error response format

5. **Testing**:
   - Playwright for E2E tests
   - Tests located in `web/tests/`
   - Follow existing test patterns for new features

## Important Context

- The project implements the IP2M METRR evaluation model for project maturity assessment
- Three main user roles: System Admin, Collection Manager, Assessment Manager
- Collections group related assessments together
- Recent work includes facilitator-controlled stopwatch functionality for timed assessments
- The application supports both online (web) and offline (Tauri desktop) usage