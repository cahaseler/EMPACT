
NOTE: Deprecated. Needs to be rewritten to work with Clerk.

# Configuring Playwright with Authentication

This guide explains how Playwright is configured in this project, including authentication setup, test accounts, and CI/CD integration.

## Project Setup

### 1. Installation

```bash
yarn add -D @playwright/test
yarn exec playwright install
```

### 2. Configuration Files

The main configuration is in `playwright.config.ts`:

```typescript
import { defineConfig, devices } from "@playwright/test"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, ".env.test") })

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60 * 1000,
  reporter: "html",
  use: {
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  globalSetup: "./tests/e2e/global-setup.ts",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: process.env.PLAYWRIGHT_SERVER_COMMAND ?? "yarn start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: "pipe",
    env: {
      ...process.env,
      TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD ?? "",
      ENABLE_AUTOMATED_TEST_LOGIN: "true",
    },
  },
})
```

### 3. Authentication Setup

#### Test Credentials Provider

The project includes a special test credentials provider in `auth.ts` that's only enabled during testing:

```typescript
...(process.env.ENABLE_AUTOMATED_TEST_LOGIN === "true"
  ? [
      Credentials({
        id: "test-credentials",
        name: "Test Credentials",
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials): Promise<User | null> => {
          const { email, password } =
            await signInSchema.parseAsync(credentials)

          // Verify it's a test account
          if (!Object.values(testAccounts).includes(email)) {
            throw new Error("Invalid test account")
          }

          // Verify password matches environment variable
          if (password !== process.env.TEST_USER_PASSWORD) {
            throw new Error("Invalid password")
          }

          return {
            id: email,
            email,
            name:
              email.split("@")[0].split("_")[0].toUpperCase() +
              " " +
              email.split("@")[0].split("_")[1].toUpperCase(),
          }
        },
      }),
    ]
  : [])
```

Key features of the test auth provider:
- Only enabled when `ENABLE_AUTOMATED_TEST_LOGIN=true`
- Validates credentials against test accounts
- Verifies password against `TEST_USER_PASSWORD` environment variable
- Automatically formats user names from email addresses
- Uses a special test auth page at `/test-auth` instead of the normal login page

#### Authentication Path Configuration

The authentication system is configured to use different paths during testing:

1. In `auth.ts`, the sign-in page is configured based on the environment:
```typescript
pages: {
  signIn:
    process.env.ENABLE_AUTOMATED_TEST_LOGIN === "true"
      ? "/test-auth"
      : "/login",
},
```

2. In `middleware.ts`, the login redirect path is similarly configured:
```typescript
const loginPath =
  process.env.ENABLE_AUTOMATED_TEST_LOGIN === "true" ? "/test-auth" : "/login"
```

The middleware handles several authentication-related scenarios:
- Redirects unauthenticated users to the appropriate login page (either `/test-auth` or `/login`)
- Preserves the original destination URL in the `callbackUrl` parameter
- Redirects authenticated users away from the login page to their intended destination
- Excludes certain paths from authentication checks (see matcher configuration)

#### Global Setup

The project uses a global setup file (`tests/e2e/global-setup.ts`) to handle authentication. This creates authenticated states for different user roles that can be reused across tests.

Key features:
- Stores authentication state for each user role
- Automatically refreshes auth states after 23 hours
- Uses a test auth page for automated login
- Shows progress bar during auth state creation

### 4. Test Accounts

Test accounts are defined in `tests/e2e/test-accounts.ts`:

```typescript
export const testAccounts = {
  admin: "test_admin@pars.doe.gov",
  collectionManager: "test_collection_manager@pars.doe.gov",
  leadFacilitator: "test_lead_facilitator@pars.doe.gov",
  facilitator: "test_facilitator@pars.doe.gov",
  participant: "test_participant@pars.doe.gov",
}
```

### 5. Test Fixtures

Fixtures in `tests/e2e/fixtures.ts` provide easy access to authenticated contexts:

```typescript
import { test as base } from "@playwright/test"

export const test = {
  asAdmin: base.extend({
    context: async ({ browser }, use) => {
      const context = await browser.newContext({
        storageState: "./playwright/.auth/admin.json",
      })
      await use(context)
    },
  }),
  // ... similar fixtures for other roles
}
```

## Usage in Tests

### 1. Writing Authenticated Tests

```typescript
import { test } from './fixtures'

// Test as admin
test.asAdmin('admin can accessa dmin dashboard', async ({ page }) => {
  await page.goto('/admin')
  // ... test code
})

// Test as facilitator user
test.asFacilitator('facilitator can see homepage', async ({ page }) => {
  await page.goto('/')
  // ... test code
})
```

### 2. Running Tests

Available npm scripts:
```json
{
  "test": "yarn build && playwright test",
  "test:ui": "yarn build && playwright test --ui",
  "test:debug": "yarn build && playwright test --debug",
  "test:headless": "yarn build && playwright test --reporter=list",
  "test:ui:dev": "cross-env PLAYWRIGHT_SERVER_COMMAND=\"yarn dev\" playwright test --ui",
  "test:ci": "playwright test --reporter=list",
  "test:nobuild:ui": "playwright test --ui",
  "test:nobuild": "playwright test"
}
```

## Environment Setup

### 1. Required Environment Variables

Create a `.env.test` file with:
```env
# Base URLs
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Test Authentication
TEST_USER_PASSWORD=your_test_password
ENABLE_AUTOMATED_TEST_LOGIN=true

# Auth Configuration
NEXTAUTH_SECRET=test-secret

# Note: Other auth providers (OneID, others) are disabled during testing
# as the test credentials provider is used instead
```

The `ENABLE_AUTOMATED_TEST_LOGIN=true` setting affects multiple parts of the authentication system:
1. Enables the test credentials provider in auth.ts
2. Changes the sign-in page to `/test-auth` instead of `/login` in both:
   - NextAuth configuration (auth.ts)
   - Middleware redirects (middleware.ts)
3. Allows the global setup script to authenticate (OneID, others)
5. Modifies middleware behavior to handle test authentication paths:
   - Redirects unauthenticated users to `/test-auth` instead of `/login`
   - Preserves callback URLs for post-authentication redirects
   - Excludes test-related paths from authentication checks

### 2. GitIgnore Entries

Add these entries to `.gitignore`:
```gitignore
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
/playwright/.auth/
/tests/e2e/.auth/
```

## CI/CD Integration

### GitHub Actions Configuration

The project includes GitHub Actions workflow for running tests on pull requests:

```yaml
- name: Install Playwright Browsers
  run: yarn exec playwright install

- name: Run Playwright tests
  run: yarn test:ci
  env:
    NEXTAUTH_URL: http://localhost:3000
    NEXT_PUBLIC_BASE_URL: http://localhost:3000
    ENVIRONMENT: test
    NODE_ENV: test
    TEST_USER_PASSWORD: ${{ secrets.AUTOMATED_TEST_USER_PASSWORD }}
    ENABLE_AUTOMATED_TEST_LOGIN: true
```

Key CI/CD features:
- Runs on Ubuntu latest
- Uses Node.js 20.15.1
- Caches yarn dependencies
- Installs required system dependencies
- Sets up environment variables from GitHub secrets
- Generates Prisma client before running tests
- Runs tests in headless mode with list reporter

## Best Practices

1. **Auth State Management**
   - Auth states are automatically created and cached
   - States expire after 23 hours to ensure fresh credentials
   - Each user role has its own auth state file

2. **Test Organization**
   - Use role-specific fixtures for authenticated tests
   - Group tests by feature in separate files
   - Use descriptive test names that include the role being tested

3. **Environment Configuration**
   - Keep sensitive data in GitHub secrets
   - Use different configurations for local and CI environments
   - Enable test-specific features through environment variables

4. **Error Handling**
   - Screenshots are captured on test failures
   - Traces are recorded on first retry
   - CI includes automatic retries for flaky tests
