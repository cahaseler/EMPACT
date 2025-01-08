import { expect } from "@playwright/test"
import { test } from "./fixtures"

test.asAdmin("shows admin menu when logged in as admin", async ({ page }) => {
    // Navigate to home page
    await page.goto("/")

    // Admin menu should be visible
    const adminMenu = page.getByRole("link", { name: "Admin" })
    await expect(adminMenu).toBeVisible()
})

test.asParticipant("hides admin menu when logged in as non-admin", async ({ page }) => {
    // Navigate to home page
    await page.goto("/")

    // Admin menu should not be visible
    const adminMenu = page.getByRole("link", { name: "Admin" })
    await expect(adminMenu).not.toBeVisible()
})
