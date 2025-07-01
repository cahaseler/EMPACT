# System Patterns and Standards

*This document outlines identified architectural patterns, coding standards, and conventions used within the EMPACT project, based on the codebase analysis.*

## Identified Patterns

*This section details the core architectural and implementation patterns observed.*

### Architecture & Deployment
- **Monorepo:** Uses Yarn Workspaces to manage `web` (Next.js) and `src-tauri` (Desktop) packages (`README.md`).
- **Shared Codebase Architecture:** Core UI components (likely Next.js) are shared between the web and desktop application builds (`EMPACT Architecture.drawio`).
- **Platform-Specific Builds:**
  - **Web:** Intended to use Next.js Standalone Export packaged into Docker, but `output: "standalone"` is currently commented out in `next.config.mjs` due to "Prisma issues". A custom `build-linux` script in `package.json` exists as a workaround, manually copying Prisma binaries. The `Dockerfile` is single-stage, explicitly installs `openssl`, and sets execute permissions for Prisma engines. Uses standard SQL DB (MSSQL primary) via Prisma.
  - **Desktop:** Next.js Static Export bundled with SQLite DB using Tauri (`EMPACT Architecture.drawio`, `src-tauri/`). Uses SQLite via Prisma. Data access via TypeScript calling Rust functions.

### Data Management
- **ORM:** Prisma is used for database interaction.
  - **Multi-Database Support:** Separate, largely equivalent schemas are maintained for MSSQL, PostgreSQL, and SQLite in `web/prisma/`. The web application targets SQL Server (`web/lib/db.ts`). The `web/package.json` `build` script generates clients for all three.
  - **Seeding:** Database seeding is handled by `web/prisma/seed.ts`, currently prioritizing MSSQL. It populates core assessment model structure (Types, Parts, Sections, Attributes, Levels) from JSON definitions (`web/prisma/seed/ip2m_model/`) and adds test data (users, roles, assessments).
- **Data Modeling (Assessment Structure):**
  - **Template/Instance Pattern:** Generic assessment structures (`AssessmentType`, `Part`, `Section`, `Attribute`, `Level`) define reusable templates. Specific `Assessment` instances link to these templates via join tables (`AssessmentPart`, `AssessmentAttribute`).
  - **Responses:** User answers are stored in `AssessmentUserResponse`, linking `User`, `Assessment`, `Attribute`, and chosen `Level`.
- **Data Access (Client-Side): Server Action Prisma Wrappers:** Standardized pattern used in `web/app/utils/`. Each file corresponds to a Prisma model and re-exports basic CRUD operations (e.g., `findMany`, `create`, `update`) as Next.js Server Actions (`"use server"`). This provides a secure way for client components to invoke database operations via the server. These wrappers contain no custom business logic but are noted as the intended location for future permission checks.
- **Data Fetching (Server-Side): Server Components + Helper Functions:** Server Components (`page.tsx`, `layout.tsx`) handle primary data fetching using async/await. They call helper functions located in `web/app/(frontend)/(logged-in)/utils/dataFetchers.ts` which encapsulate direct Prisma client calls (`db.<model>.<operation>`).
- **Mutations (Client-Side): Client Components + Server Actions:** Client Components (`"use client"`) trigger data mutations (create, update, delete) by calling Server Actions defined in `web/app/(frontend)/(logged-in)/utils/dataActions.ts`. These actions likely perform the necessary database operations (potentially using the Prisma wrappers from `web/app/utils/`).
- **Server Action Validation:** Server Actions used for mutations (e.g., in `admin/actions.ts`) utilize **Zod** for input validation before performing database operations.
- **Data Refresh after Mutation:** Client components typically call `revalidatePath()` or `router.refresh()` after successful Server Action calls to update the displayed data.
- **Database Documentation:** A DBML file (`web/prisma/sqlite/dbml/schema.dbml`) is generated for the SQLite schema, likely for documentation/visualization.

### Authentication & Authorization (RBAC)
- **Authentication:** Uses Clerk. Leverages Next.js middleware (`web/middleware.ts`) for route protection and **syncing custom DB permissions/roles to Clerk public metadata** upon login (includes `databaseId`, `systemRoles`, `assessmentUser`, `assessmentCollectionUser`). Middleware also handles DB user creation/updates and redirects unauthorized users. An `auth.ts` adapter maps Clerk session + metadata to an internal `Session` type for compatibility.
- **Authorization/Permissions:** Permission logic (Role-Based Access Control - RBAC) is checked within Server Components and dedicated helper functions (`web/app/(frontend)/(logged-in)/utils/permissions.ts`), often using data fetched from the user's session (`auth()`) and the database. This determines UI visibility (buttons, links) and guards Server Action execution.
- **User Roles/Permissions (Data Model):** Multi-layered roles exist: `SystemRole` (global), `AssessmentCollectionUser` (collection management), `AssessmentUser` (assessment participation/facilitation) linked to granular `Permission`s.
- **Session Context Augmentation:** Uses global type declarations (`web/types/globals.d.ts`) to augment Clerk's JWT session claims (`CustomJwtSessionClaims`) with application-specific metadata (`databaseId`, `systemRoles`, `assessmentUser`, `assessmentCollectionUser`), making user context readily available for authorization checks.
- **Authentication State Handling:** Uses a specific wrapper (`multisessionAppSupport.tsx`) with React `key` based on Clerk `session.id` to force remounts on auth changes.

### UI & Components
- **UI Components:** Uses Shadcn UI (`web/tailwind.config.ts`, `web/components/ui/`) as the base component library.
  - **Customized DataTable:** The standard Shadcn DataTable (`web/components/ui/data-table/`) is enhanced with clickable rows that navigate to detail pages based on a `urlHeader` prop.
- **User Management UI:** Uses a combination of `DataTable` (Tanstack Table) for displaying lists, `Dialog` components for editing individual records (e.g., `AssessmentUser`, system `User`), `AlertDialog` for delete confirmations, and `AgGridReact` for bulk-add scenarios with inline configuration (e.g., adding multiple assessment users with roles/groups). Inline editing is also used in simpler tables (e.g., managing `AssessmentUserGroup`s).
- **UI Composition:** Complex views (e.g., assessment participation, editing, user management) are built by composing smaller Server and Client Components, often nested via layouts. Reusable components like `DataTable` are employed for lists. Client components often use `useRouter().refresh()` after mutations to update the view.
- **Theming:** Uses `next-themes` integrated with Shadcn (`theme-provider.tsx`, `mode-toggle.tsx`).

### Development Workflow & Testing
- **Custom Types:** Defines specific types for application logic (e.g., `AssessmentPartToAdd` in `web/types/assessment.ts`).
- **Developer Utilities:** Conditionally renders debugging components (`debug-session-info.tsx`, `tailwind-indicator.tsx`) based on environment variables.
- **Testing:** Uses **Playwright** for End-to-End (E2E) tests (`web/tests/e2e/`). Focuses primarily on authentication and role-based access control (RBAC). Leverages Playwright fixtures (`fixtures.ts`) and global setup (`global-setup.ts`) to manage pre-authenticated states for different user roles. Test documentation is maintained in `web/tests/testing-and-auth.md`. No unit/integration tests were identified in this structure.

## Coding Standards

*This section outlines specific coding standards enforced or observed.*

- **Commit Messages:** Follows Angular commit convention, used by Semantic Release (`.releaserc.json`). Specific types (`docs`, `test`, `ci`, `scope: no-release`) do not trigger releases. `refactor`, `chore`, `build`, `style` trigger patch releases.
- **Dependency Management:** Uses Yarn v1 (`web/package.json`). Uses **canary** versions of Next.js (`^15.3.0-canary.14`) and React 19 (`web/package.json`).
- **Database Schema Conventions:**
  - Most primary keys are auto-incrementing integers, but core template models (`Section`, `Attribute`, `Level`) use non-auto-incrementing IDs (likely predefined constants/identifiers).
  - Referential integrity uses `onDelete: NoAction` extensively, implying application-level logic is required for safe deletion of template data.
  - Enum-like fields (`status`, `role`) are defined as `String` in the schema; constraints are likely handled in application code.
- *(Further standards to be identified from `.eslintrc.json`, `prettier.config.cjs`, etc.)*

## Conventions

*This section describes established practices and configurations.*

- **Automated Versioning:** `semantic-release` manages version bumps and releases based on commits to `main` (`.releaserc.json`). Version numbers are automatically updated in multiple files (`package.json`, `tauri.conf.json`, `Cargo.toml`, specific `.tsx` and `.ts` files).
- **Automated Dependency Updates:** Renovate bot manages dependency updates, grouping non-major updates and requiring approval for majors. Specific rules for automerging dev dependencies and patch updates (`renovate.json`).
- **CI/CD:** GitHub Actions are used for CI processes, including Docker builds. Note the custom `build-linux` script workaround for standalone builds (`web/package.json`).
- **Licensing:** Code/Documentation is licensed under CC BY 4.0 (`LICENSE`, `README.md`). The "EMPACT" name and logo are trademarked (`TrademarkPolicy`, `README.md`).
- **Configuration Files:** Standard configuration files are present. Notable non-standard settings:
  - `next.config.mjs`: `output: "standalone"` commented out, uses deprecated `experimental.nodeMiddleware`, explicit `tsconfigPath`.
  - `tailwind.config.ts`: Includes custom `sidebar` color palette extension.
  - `package.json`: Includes `@tauri-apps/cli` and `pkg` config, suggesting potential non-web deployment targets.
- **Directory Structure (`web/`):** Follows standard Next.js App Router structure (`app/`, `components/`, `lib/`, `public/`, `hooks/`, `tests/`, `types/`). `prisma/` subdirectory contains multi-DB setup (MSSQL, Postgres, SQLite).
- **Directory Structure (`web/app/(frontend)/`):** Uses Next.js Route Groups (`(logged-in)`, `(logged-out)`) to organize routes based on authentication state without affecting URL paths. Contains shared frontend components.
- **Directory Structure (`web/app/(frontend)/(logged-in)/.../assessments/`):** Utilizes nested dynamic routes (`[assessmentGroupId]`, `[assessmentId]`, `[roleName]`, `[partName]`, `[sectionId]`, `[attributeId]`) to structure the assessment workflow. Specific functionality (add, edit, view, respond) is further organized into subdirectories.
- **Directory Structure (`web/app/(frontend)/(logged-in)/.../users/`):** Organizes user management by context (assessment vs. collection) using subdirectories (`assessment/[assessmentId]`, `collection/[collectionId]`). Further subdirectories handle specific actions like adding users (`add-assessment-users`, `add-collection-managers`) or managing related entities (`manage-user-groups`).
- **Directory Structure (`web/app/(frontend)/(logged-in)/(home)/admin/`):** Relatively flat structure containing components (`data-table.tsx`, `columns.tsx`, `add-users-dialog.tsx`), Server Actions (`actions.ts`), and the main page (`page.tsx`) for system user management. Includes a placeholder `dashboard/` subdirectory.
- **Directory Structure (`web/components/`):** Contains custom shared components (`theme-provider.tsx`, `mode-toggle.tsx`, `multisessionAppSupport.tsx`, `userback-provider-client.tsx`, dev utilities) alongside the `ui/` subdirectory for Shadcn components.