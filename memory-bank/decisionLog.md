# Decision Log

This file records architectural and implementation decisions using a list format.
2025-04-03 09:15:01 - Log of updates made.

*

## Decision

*   [2025-04-03] Use Next.js for the primary web application interface (`web/` directory).
*   [2025-04-03] Use Tauri for the desktop application wrapper (`src-tauri/` directory).
*   [2025-04-03] Adopt Prisma as the ORM, supporting multiple database backends (SQLite, Postgres, MSSQL).
*   [2025-04-03] Structure Prisma configuration to support multiple database backends (MSSQL, Postgres, SQLite) via separate schema files.
*   [2025-04-03] Utilize Next.js App Router for frontend structure and routing.
*   [2025-04-03] Use Clerk middleware (`clerkMiddleware`) for route protection and session management.
*   [2025-04-03] Synchronize user data (creation/updates) and application-specific roles/IDs between the local database and Clerk session metadata within the middleware.
*   [2025-04-03] Create a custom `auth()` adapter (`web/auth.ts`) to maintain compatibility with existing code expecting a specific session object structure.
*   [2025-04-03] Employ route groups (`(frontend)`, `(logged-in)`, `(logged-out)`) for organizational clarity and separation of concerns based on authentication state.
*   [2025-04-03] Utilize Clerk for authentication.
*   [2025-04-03] Employ Shadcn UI components with Tailwind CSS for the frontend styling.
*   [2025-04-03] Implement database access logic via Next.js Server Actions (`"use server"`) located in `web/app/utils/` for enhanced security and direct client-side invocation.
*   [2025-04-03] Use `clsx` and `tailwind-merge` (via `cn` utility) for conditional and conflict-free CSS class application.
*   [2025-04-03] Defer the strategy for Tauri integration with the dynamic Next.js app (original `web_static` approach is outdated).
*   [2025-04-03 10:06] Use Yarn Workspaces to manage the monorepo structure.

## Rationale

*   Next.js provides a robust framework for modern web development with features like SSR, SSG, and API routes.
*   Tauri allows building cross-platform desktop apps using web technologies with a Rust backend for performance and security.
*   Prisma offers type-safe database access and simplifies migrations across different database systems.
*   Clerk provides a managed authentication solution, simplifying user management and SSO integration.
*   Shadcn UI/Tailwind CSS offer a flexible and efficient way to build the user interface.
*   The complexity of integrating a dynamic Next.js app (requiring a server) into a static Tauri build requires further investigation once the web app is more mature.
*   Allows flexibility in deployment environments.
*   App Router provides modern Next.js features and conventions for routing and layouts.
*   Route groups allow logical separation of UI sections without affecting URL paths, improving maintainability.

## Implementation Details
*   Yarn Workspaces provide a standard mechanism for managing dependencies and running scripts across multiple packages within a single repository, simplifying the monorepo setup.
*   Clerk provides managed authentication services.
*   Middleware synchronization ensures Clerk session tokens contain necessary application data (roles, DB ID) and keeps the local DB consistent with Clerk user info.
*   Adapter pattern avoids widespread refactoring of session data consumption points after migrating to Clerk.
*   Server Actions allow secure execution of server-side code (like DB operations) directly from client components without manually creating API endpoints.
*   `cn` utility simplifies Tailwind class management in components.

*   Web application source code resides in `web/`.
*   Tauri source code resides in `src-tauri/`.
*   Prisma schemas are located in `web/prisma/`.
*   UI components are in `web/components/ui/`.
*   Authentication logic uses `@clerk/nextjs`.
*   Separate directories and `schema.prisma` files under `web/prisma/` (e.g., `web/prisma/mssql/`).
*   Seed script (`web/prisma/seed.ts`) populates initial data (currently focused on MSSQL).
*   Tauri configuration (`src-tauri/tauri.conf.json`) currently points to the outdated `web_static` directory and will need updating later.
*   App Router structure implemented within `web/app/`.
*   Route groups are defined by directories like `web/app/(frontend)/`, `web/app/(frontend)/(logged-in)/`, etc.
*   Server Actions defined in files like `web/app/utils/assessment.ts`.
*   `cn` utility function defined in `web/lib/utils.ts`.
*   Clerk middleware implemented in `web/middleware.ts`.
*   Synchronization logic uses Prisma (`db`) and Clerk functions (`auth().sessionClaims`, `clerkClient.users.updateUserMetadata`).
*   Session adapter defined in `web/auth.ts`.
*   Added `"workspaces": ["web", "src-tauri"]` to the root `package.json`.