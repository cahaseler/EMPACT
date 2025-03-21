import fs from "fs"
import path from "path"

import { chromium } from "@playwright/test"

import { testAccounts } from "./test-accounts"

const AUTH_EXPIRY_MS = 60 * 60 * 1000 * 23 // 23 hours

interface AuthState {
  cookies: unknown[]
  origins: unknown[]
  timestamp: number
}

function isAuthStateValid(authPath: string): boolean {
  try {
    if (!fs.existsSync(authPath)) return false

    const authState = JSON.parse(
      fs.readFileSync(authPath, "utf-8")
    ) as AuthState
    const now = Date.now()

    return (
      Boolean(authState.timestamp) && now - authState.timestamp < AUTH_EXPIRY_MS
    )
  } catch {
    return false
  }
}

async function createAuthState(email: string, storePath: string) {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto(process.env.NEXT_PUBLIC_APP_URL ?? "/")

  // Wait for the form to be visible
  await page.waitForSelector('input[name="email"]', { state: "visible" })

  // Fill in credentials
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!)

  // Click sign in and wait for navigation
  await page.click('button[type="submit"]')

  // Wait for navigation to complete and URL to be correct
  await page.waitForURL(process.env.NEXT_PUBLIC_APP_URL ?? "/", {
    timeout: 10000,
  })

  // Get the current storage state
  const state = await context.storageState()

  // Add timestamp to the state
  const stateWithTimestamp = {
    ...state,
    timestamp: Date.now(),
  }

  // Ensure the directory exists
  const dir = path.dirname(storePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Store the authenticated state with timestamp
  fs.writeFileSync(storePath, JSON.stringify(stateWithTimestamp, null, 2))

  // Close browser
  await browser.close()
}

async function globalSetup() {
  // Create auth states only for accounts that need it
  for (const [role, email] of Object.entries(testAccounts)) {
    const authPath = path.join(
      process.cwd(),
      "playwright",
      ".auth",
      `${role}.json`
    )
    if (!isAuthStateValid(authPath)) {
      console.log(`Creating auth state for ${role}...`)
      await createAuthState(email, authPath)
    } else {
      console.log(`Using existing auth state for ${role}`)
    }
  }
}

export default globalSetup
