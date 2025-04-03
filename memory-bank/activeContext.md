# Active Context

This file tracks the project's current status, including recent changes, current goals, and open questions.
2025-04-03 09:14:24 - Log of updates made.

*

## Current Focus

*   Initial project exploration and Memory Bank setup.
*   Understanding the relationship between `web/`, `web_static/`, and `src-tauri/`.
*   Active development seems focused on the Next.js application in `web/`.

*   [2025-04-03 10:06] Implementing Monorepo Refactor Plan - Step 2: Configured Yarn Workspaces in root `package.json`.
*   [2025-04-03 10:27] Implementing Monorepo Refactor Plan - Step 3: Consolidated common devDependencies to root `package.json` and ran `yarn install`.
*   [2025-04-03 10:48] Implementing Monorepo Refactor Plan - Step 4: Standardized configurations.
## Recent Changes

*   Analyzed `web/app/` structure (Next.js App Router, route groups, layouts) (2025-04-03)
*   Analyzed API Endpoints (`web/app/api/`), found `/api/version` (2025-04-03)
*   Analyzed Shared Logic & Utilities (`web/lib/`, `web/app/utils/`), identified Prisma setup (MSSQL), `cn` utility, and Server Action pattern for DB access (2025-04-03)
*   Analyzed Database Schema (`web/prisma/`), confirmed multi-DB structure, core models, MSSQL schema complexity, and seed script logic (2025-04-03)
*   Analyzed UI Components (`web/components/`), confirmed Shadcn UI usage and identified custom components (debug, theme, session) (2025-04-03)
*   Analyzed Authentication (`web/auth.ts`, `web/middleware.ts`), confirmed Clerk usage, middleware logic (route protection, DB/metadata sync), session adapter pattern, and identified obsolete `middleware_todo.ts` (2025-04-03)
*   Analyzed Tauri Backend (`src-tauri/src/main.rs`), confirmed minimal boilerplate with no custom logic/commands (2025-04-03)
*   Memory Bank initialized (2025-04-03).
*   Project structure analyzed (2025-04-03).
*   Standardized ESLint, TypeScript, Tailwind configurations (root and web/), removed web_static configs (2025-04-03 10:48).
*   Completed Monorepo Refactor Plan Step 7 (Testing): Web dev server started successfully after removing Turbopack flag. E2E tests (`yarn workspace empact_web test`) were skipped as they are currently non-functional per user report. (2025-04-03)
*   Completed Monorepo Refactor Plan (Yarn Workspaces) and updated documentation (README.md, progress.md, activeContext.md) (2025-04-03)

## Open Questions/Issues

*   How will the dynamic Next.js application in `web/` be adapted for static export or integration with Tauri for the offline desktop version? (Marked for future revisit).
*   Confirm the primary source of documentation (assumed to be GitHub Wiki based on README/docs).
*   The divergence between the MSSQL schema and the Postgres/SQLite schemas needs clarification. Is MSSQL the primary target, or are the others lagging behind?