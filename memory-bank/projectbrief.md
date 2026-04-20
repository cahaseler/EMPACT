# Project Brief: EMPACT

*This file provides a high-level overview of the EMPACT project.*

## Project Description

**EMPACT (Environment and Maturity Program Assessment and Control Tool)** is an open-source web and desktop application designed to implement the **IP2M METRR Environmental and Maturity evaluation model**. Sponsored by the Department of Energy's Office of Project Management, it provides a tool for assessing project management maturity and environmental factors.

**Note:** While based on DOE-funded research (IP2M METRR by ASU), this project is independently developed and not affiliated with ASU's proprietary software.

## Key Goals & Features (Identified/Inferred)

*   **Implement IP2M METRR Model:** Provide a platform for conducting assessments based on the defined model structure (Environment & Maturity parts, sections, attributes, levels).
*   **Dual Deployment:** Function as both a web application (likely using Docker) and an installable offline desktop application (using Tauri) from a single Next.js codebase.
*   **Assessment Management:** Allow creation, management, and participation in assessments. Support grouping assessments into collections.
*   **Data Analysis:** Enable analysis of assessment results, potentially broken down by groups or aggregated over time (AI features mentioned in README but not yet observed in code analysis).
*   **User Roles & Permissions:** Implement a multi-layered permission system (System Admins, Collection Managers, Assessment Leads/Facilitators/Participants).
*   **Authentication:** Utilize Clerk for authentication, supporting SSO/OIDC and local accounts, with custom role/permission synchronization via middleware.
*   **Technology Stack:** Next.js (App Router), React, TypeScript, Prisma (MSSQL primary, Postgres/SQLite secondary), Tailwind CSS, Shadcn UI, Playwright (E2E Testing), Tauri (Desktop).


*(This brief summarizes the project based on initial analysis. Details may evolve.)*