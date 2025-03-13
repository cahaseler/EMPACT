import { expect } from "@playwright/test"
import { test } from "./fixtures"
import { testAccounts } from "./test-accounts"



test.default("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/")
    expect(page.url()).toContain("/test-auth")
})

test.asAdmin("admin can access protected routes", async ({ page }) => {
    await page.goto("/")
    console.log(page.url())
    await expect(page).not.toHaveURL("/test-auth")
})

test.asCollectionManager(
    "collection manager can access protected routes",
    async ({ page }) => {
        await page.goto("/")
        await expect(page).not.toHaveURL("/test-auth")
    }
)

test.asLeadFacilitator(
    "lead facilitator can access protected routes",
    async ({ page }) => {
        await page.goto("/")
        await expect(page).not.toHaveURL("/test-auth")
    }
)

test.asFacilitator(
    "facilitator can access protected routes",
    async ({ page }) => {
        await page.goto("/")
        await expect(page).not.toHaveURL("/test-auth")
    }
)

test.asParticipant(
    "participant can access protected routes",
    async ({ page }) => {
        await page.goto("/")
        await expect(page).not.toHaveURL("/test-auth")
    }
)



test.default("allows login with valid test credentials", async ({ page }) => {
    await page.goto("/test-auth")

    // Fill in test credentials
    await page.fill('input[name="email"]', testAccounts.admin)
    await page.fill(
        'input[name="password"]',
        process.env.TEST_USER_PASSWORD ?? ""
    )

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for auth request to complete
    await page.waitForResponse((response) =>
        response.url().includes("/api/auth/callback/test-credentials")
    )

    // Wait for navigation to complete
    await page.waitForURL("/", { timeout: 10000 })

    // Should be on home page
    await expect(page).toHaveURL("/")
})

test.default("shows error with invalid credentials", async ({ page }) => {
    await page.goto("/test-auth")

    // Fill in invalid credentials
    await page.fill('input[name="email"]', "invalid@example.com")
    await page.fill('input[name="password"]', "wrongpassword")

    // Submit form
    await page.click('button[type="submit"]')

    // Should stay on login page
    await expect(page).toHaveURL("/test-auth")
})

