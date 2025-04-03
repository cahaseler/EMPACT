# System Patterns *Optional*

This file documents recurring patterns and standards used in the project.
It is optional, but recommended to be updated as the project evolves.
2025-04-03 09:15:43 - Log of updates made.

*

## Coding Patterns

*   **Language:** TypeScript (Web), Rust (Tauri Backend)
*   **Framework:** Next.js (Web)
    *   Using App Router conventions (layouts, pages, route groups).
*   **UI Library:** React with Shadcn UI components
    *   Utilizing Shadcn UI library for base components (`web/components/ui/`).
*   **Styling:** Tailwind CSS
    *   Using `clsx` and `tailwind-merge` via `cn` utility (`web/lib/utils.ts`) for managing CSS classes.
*   **State Management:** (Likely React Context/Hooks, needs confirmation)
*   **Data Fetching:** (Likely Next.js API routes, React Hooks, needs confirmation)
*   **ORM:** Prisma
    *   Data fetching via utility functions (e.g., `web/app/(frontend)/(logged-in)/utils/dataFetchers.ts`) called within Server Components (e.g., `page.tsx`).
*   **Auth:** Clerk (using `@clerk/nextjs`)
    *   Multi-database support pattern: Separate Prisma schema files (`schema.prisma`) per provider under `web/prisma/<provider>/`.
    *   Using Clerk (`@clerk/nextjs`) for authentication.
    *   Global Prisma client instance managed in `web/lib/db.ts` (currently configured for MSSQL).
    *   Database seeding via script (`web/prisma/seed.ts`) capable of targeting specific schemas, loading initial data (e.g., assessment structures, test users) from JSON/code.
*   **Linting/Formatting:** ESLint, Prettier (configs present)

## Architectural Patterns

*   **Monorepo Structure:** Separate directories for `web` frontend and `src-tauri` desktop wrapper.
*   **Web/Desktop Hybrid:** Aiming for a single web codebase (`web/`) to serve both a dynamic web application and be bundled into a Tauri desktop application. (Integration method TBD).
*   **API Routes:** Likely using Next.js API routes (`web/app/api/`) for backend logic within the web application.
*   **Multi-Database Support:** Prisma configured for SQLite, PostgreSQL, and MSSQL (`web/prisma/`).
*   **Component-Based UI:** Using React components, organized in `web/components/`.
*   **API Route Handlers:** Using Next.js API route handlers (`route.ts`) within the `app/api/` directory (e.g., `app/api/version/route.ts` for GET requests).
*   **Route Groups:** Using Next.js App Router route groups (`(...)`) for organizing routes based on layout or authentication state (e.g., `(frontend)`, `(logged-in)`, `(logged-out)`).

*   **Component Structure:** Base UI components (Shadcn) in `web/components/ui/`, custom application-specific components directly in `web/components/`.
## Testing Patterns

*   **Server Actions:** Using Next.js Server Actions (`"use server"`) to expose database operations securely to client components (e.g., `web/app/utils/assessment.ts`). This acts as a dedicated data access layer per model.
*   **E2E Testing:** Playwright configured (`web/playwright.config.ts`, `web/tests/e2e/`).
*   **Authentication Middleware:** Using `clerkMiddleware` (`web/middleware.ts`) to protect routes, manage sessions, synchronize user data between Clerk and local DB, and update Clerk session metadata.
*   **Session Adapter Pattern:** Custom `auth()` function (`web/auth.ts`) wraps Clerk's `auth()` to provide session data in a specific format for application compatibility.
*   **(Unit/Integration Testing):** (No specific frameworks identified yet, needs confirmation).
*   **Hierarchical Data Model:** Core assessment data follows a hierarchy: AssessmentType -> Part -> Section -> Attribute -> Level.