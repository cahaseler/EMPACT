# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2025-04-03 09:14:00 - Log of updates made will be appended as footnotes to the end of this file.

*

## Project Goal

*   Develop EMPACT (Environment and Maturity Program Assessment and Control Tool), an open-source implementation of the IP2M METRR model for assessing project management maturity and environmental factors.
*   Provide both a web-based application and an installable offline desktop application from a single codebase.

## Key Features

*   Comprehensive Environment and Maturity Assessments (IP2M METRR).
*   Assessment collections for evaluating different groups/sites.
*   Multi-dimensional data analysis (group, organization, time).
*   AI-powered analysis of written survey results.
*   Mobile/tablet support for assessment completion.
*   Flexible SSO (OIDC) and local account management.

## Overall Architecture

*   **Frontend/Web:** Next.js (`web/` directory) using the App Router. Key technologies include React, TypeScript, Tailwind CSS, Shadcn UI, Prisma (SQLite, Postgres, MSSQL), and Clerk (Auth).
    *   UI: Built with React, Shadcn UI components (`web/components/ui/`), and custom components (`web/components/`) styled with Tailwind CSS.
    *   Authentication: Uses Clerk (`@clerk/nextjs`).
        *   Middleware (`web/middleware.ts`) handles route protection, user creation/update in the local DB, and synchronization of roles/IDs between the local DB and Clerk session metadata.
        *   A custom `auth()` function (`web/auth.ts`) acts as an adapter, formatting Clerk session data for compatibility with application code expecting a different session structure (likely from a previous auth system).
    *   Structure utilizes route groups (`(frontend)`, `(logged-in)`, `(logged-out)`) for organization and auth state separation.
    *   Database: Prisma ORM configured for multi-DB support (MSSQL, Postgres, SQLite) with separate schema definitions (`web/prisma/`).
        *   Core Models: User, AssessmentType, AssessmentCollection, Assessment, Part, Section, Attribute, Level, AssessmentUserResponse, Roles.
        *   Note: MSSQL schema (`web/prisma/mssql/schema.prisma`) is currently more complex/feature-rich than Postgres/SQLite schemas.
    *   Includes API routes (`web/app/api/`) and shared utilities (`web/app/utils/`).
    *   Currently contains minimal boilerplate setup (`src-tauri/src/main.rs`) with no custom commands or logic.
*   **Desktop Wrapper:** Tauri (`src-tauri/` directory) - Rust-based wrapper for the web frontend.
    *   Includes API routes (`web/app/api/`), currently featuring a `/api/version` endpoint.
    *   Utilizes Next.js Server Actions (`"use server"`) in `web/app/utils/` to provide a secure database access layer (e.g., for assessments).
*   **Deployment:** Intended for both web server deployment and standalone desktop application builds.
    *   Employs utility functions like `cn` (`web/lib/utils.ts`) for conditional Tailwind CSS class merging.
*   **Current State:** Early development. `web/` contains the active Next.js app. `src-tauri/` exists but its integration with the web app (via the outdated `web_static/` approach) needs revisiting. Documentation primarily on GitHub Wiki.
*   **Update Log:**
    *   2025-04-03 09:23:57: Added details about Next.js App Router structure based on `web/app/` analysis.
    *   2025-04-03 09:29:39: Added detail about `/api/version` endpoint.
    *   2025-04-03 09:32:20: Added details about Server Actions for DB access and `cn` utility.
    *   2025-04-03 09:36:09: Added details about Prisma multi-DB structure, core models, and MSSQL schema complexity.
    *   2025-04-03 09:39:04: Added details about UI component structure (Shadcn UI, custom components).
    *   2025-04-03 09:42:09: Added details about Clerk authentication, middleware logic (DB/metadata sync, route protection), and session adapter pattern.
    *   2025-04-03 09:46:09: Confirmed Tauri backend (`main.rs`) is currently minimal boilerplate.