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
        command: process.env.PLAYWRIGHT_SERVER_COMMAND ?? "yarn dev",
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
