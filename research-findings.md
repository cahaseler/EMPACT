# Research Findings: Test Suite Analysis (`web/tests/`)

This document summarizes the analysis of the test suite located in `/home/ubuntu/projects/EMPACT/web/tests/`.

## 1. Directory Contents (`web/tests/`)

The directory contains the following files and subdirectories:

*   **`testing-and-auth.md`**: Documentation file explaining the testing setup, authentication mechanism for tests, and guidelines for writing tests.
*   **`e2e/` (directory)**: Contains the End-to-End (E2E) test suite.
    *   **`auth.test.ts`**: Contains Playwright tests specifically for authentication flows, including login success/failure, redirects for unauthenticated users, and verifying access for different user roles.
    *   **`fixtures.ts`**: Defines custom Playwright test fixtures. Notably, it includes fixtures like `test.asAdmin`, `test.asParticipant`, etc., which allow tests to run pre-authenticated as a specific user role.
    *   **`global-setup.ts`**: A script configured in `playwright.config.ts` to run once before the entire test suite. It likely handles setting up the necessary authentication state (e.g., logging in test users and saving the state) required by the role-specific fixtures.
    *   **`header.test.ts`**: Contains Playwright tests likely focused on verifying the functionality and appearance of the main application header component for logged-in users.
    *   **`test-accounts.ts`**: Exports an object containing the email addresses used for the predefined test accounts corresponding to different application roles (e.g., `admin`, `collectionManager`).

## 2. Testing Framework

*   The project utilizes **Playwright** as its E2E testing framework.
*   **Evidence:**
    *   Presence of `web/playwright.config.ts`.
    *   `playwright.config.ts` imports `@playwright/test`.
    *   Configuration specifies `testDir: "./tests/e2e"` and `globalSetup: "./tests/e2e/global-setup.ts"`.
    *   Test files (`*.test.ts`) use Playwright's `test` function and `expect` assertions.

## 3. Purpose of `e2e/` Subdirectory and Contents

*   This directory houses the **End-to-End (E2E) test suite**.
*   **Goal:** To test the application flow from a user's perspective by interacting with the UI in a real browser environment.
*   **Coverage Focus:**
    *   **Authentication:** Login/logout, credential validation, redirects.
    *   **Authorization / Role-Based Access Control (RBAC):** Ensuring users with different roles can access appropriate pages/features and are restricted from others. This is heavily reliant on the custom fixtures in `fixtures.ts`.
    *   **Basic UI Functionality:** Testing core components like the header and form interactions.
*   **Key Files:**
    *   `auth.test.ts` & `header.test.ts`: Contain the actual test cases.
    *   `fixtures.ts`, `global-setup.ts`, `test-accounts.ts`: Provide the infrastructure and data to support the tests, particularly the role-based authentication simulation.

## 4. Purpose of `testing-and-auth.md`

*   This file is **developer documentation** for the testing framework and process.
*   It details:
    *   How to execute tests.
    *   The test accounts available.
    *   How the test authentication system works (using fixtures and global setup).
    *   Examples and best practices for writing new E2E tests, especially concerning different user roles.
    *   Guidance on checking user roles within the application's components.
    *   Required environment setup (`.env.test`).

## 5. Overall Testing Strategy Summary

*   The application employs an **E2E testing strategy using Playwright**.
*   The **primary focus** is on validating **authentication and authorization (RBAC)** flows for various user roles, ensuring the application behaves correctly from an end-user perspective regarding access control.
*   The strategy leverages Playwright **fixtures** and **global setup** to efficiently manage test preconditions, especially user authentication states.
*   Comprehensive **documentation (`testing-and-auth.md`)** supports developer understanding and contribution to the test suite.
*   Based on the contents of `web/tests/`, there is **no indication of unit or integration tests** being part of this specific test suite structure. The emphasis is on higher-level, browser-based validation.