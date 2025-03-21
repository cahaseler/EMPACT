# Testing and Authentication Guide

This guide explains our testing setup and authentication system in a practical
way, with examples of how to write tests and work with user roles.

## Quick Start

To run tests:

```bash
# Run all tests
yarn test

# Run tests with UI for debugging
yarn test:ui

# Run tests in development mode (uses yarn dev instead of yarn start)
yarn test:ui:dev
```

## Understanding Our Auth System

Our authentication system is built on NextAuth and provides:

- Role-based access control through `systemRoles`
- Assessment-specific permissions through `assessmentUser` and
  `assessmentCollectionUser`
- Test accounts for each role (admin, collection manager, etc.)

### Available Test Accounts

We have predefined test accounts for each role:

```typescript
admin: "test_admin@pars.doe.gov"
collectionManager: "test_collection_manager@pars.doe.gov"
leadFacilitator: "test_lead_facilitator@pars.doe.gov"
facilitator: "test_facilitator@pars.doe.gov"
participant: "test_participant@pars.doe.gov"
```

## Writing Tests

### 1. Basic Test Structure

We use role-specific fixtures to write tests for different user types. Here's a
basic example:

```typescript
import { expect } from "@playwright/test"

import { test } from "./fixtures"

// Test as admin user
test.asAdmin("admin can access admin dashboard", async ({ page }) => {
  await page.goto("/admin")
  await expect(page.getByRole("heading")).toContainText("Admin Dashboard")
})

// Test as facilitator
test.asFacilitator("facilitator can see assessments", async ({ page }) => {
  await page.goto("/assessments")
  await expect(page.getByRole("heading")).toContainText("My Assessments")
})
```

### 2. Testing Role-Specific Access

You can test that users can only access appropriate pages:

```typescript
import { expect } from "@playwright/test"

import { test } from "./fixtures"

test.describe("role-based access", () => {
  test.asParticipant(
    "participant cannot access admin area",
    async ({ page }) => {
      // Should redirect to home page
      await page.goto("/admin")
      await expect(page).toHaveURL("/")
    }
  )

  test.asCollectionManager(
    "collection manager can access collections",
    async ({ page }) => {
      await page.goto("/collections")
      await expect(page).toHaveURL("/collections")
    }
  )
})
```

## Working with Auth in Components

### 1. Getting User Role Information

You can access role information from the session in your components. Here's how:

```typescript


// In a Server Component:

const isAdmin = session?.user.systemRoles.some(role => role.name === 'Admin')

// Or in a Client Component:
'use client'
import { useSession } from "next-auth/react"

const MyComponent = () => {
  const { data: session } = useSession()
  const isAdmin = session?.user.systemRoles.some(role => role.name === 'Admin')

  return isAdmin ? <AdminContent /> : <RegularContent />
}
```

### 2. Role-Based Rendering

Example of conditional rendering based on roles:

```typescript


async function NavMenu() {


  const isAdmin = session?.user.systemRoles.some(role => role.name === 'Admin')
  const isCollectionManager = session?.user.systemRoles.some(
    role => role.name === 'CollectionManager'
  )

  return (
    <nav>
      {/* Always visible */}
      <Link href="/">Home</Link>

      {/* Only visible to admins */}
      {isAdmin && (
        <Link href="/admin">Admin Dashboard</Link>
      )}

      {/* Only visible to collection managers */}
      {isCollectionManager && (
        <Link href="/collections">Manage Collections</Link>
      )}
    </nav>
  )
}
```

### 3. Assessment-Specific Permissions

Users can have roles in specific assessments or collections:

```typescript
async function AssessmentPage({ assessmentId }: { assessmentId: string }) {


  // Check if user has access to this assessment
  const hasAccess = session?.user.assessmentUser.some(
    au => au.assessmentId === assessmentId
  )

  // Check if user is a facilitator for this assessment
  const isFacilitator = session?.user.assessmentUser.some(
    au => au.assessmentId === assessmentId && au.role === 'Facilitator'
  )

  if (!hasAccess) {
    return <AccessDenied />
  }

  return (
    <div>
      <h1>Assessment Details</h1>
      {isFacilitator && (
        <Button>Edit Assessment</Button>
      )}
    </div>
  )
}
```

## Environment Setup

1. Create a `.env.test` file with:

```env
TEST_USER_PASSWORD=your_test_password
ENABLE_AUTOMATED_TEST_LOGIN=true
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_SECRET=test-secret
```

2. Make sure these paths are in your `.gitignore`:

```gitignore
/test-results/
/playwright-report/
/playwright/.auth/
```

## Best Practices

1. **Use Role-Specific Fixtures**

   - Always use the appropriate role fixture for your test
   - Don't use a higher-privileged role than necessary

2. **Test Access Control**

   - Verify that users can access what they should
   - Verify that users cannot access what they shouldn't
   - Test redirects for unauthorized access

3. **Check Role Information**

   - Use session.user.systemRoles for system-wide permissions
   - Use session.user.assessmentUser for assessment-specific roles
   - Use session.user.assessmentCollectionUser for collection-specific roles

4. **Keep Tests Focused**

   - Test one piece of functionality at a time
   - Use descriptive test names that include the role being tested
   - Group related tests using test.describe()

5. **Handle Loading States**
   - Remember that role information might not be immediately available
   - Use appropriate loading states in your components
   - Test both authenticated and unauthenticated states
