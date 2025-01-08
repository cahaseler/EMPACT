import { test as base, type Browser, type BrowserContext } from "@playwright/test"

type TestFixtures = {
    context: BrowserContext
}

type WorkerFixtures = {
    browser: Browser
}

// Create test fixtures for each role
export const test = {
    asAdmin: base.extend<TestFixtures, WorkerFixtures>({
        context: async ({ browser }, use: (r: BrowserContext) => Promise<void>) => {
            const context = await browser.newContext({
                storageState: "./playwright/.auth/admin.json",
            })
            await use(context)
            await context.close()
        },
    }),

    asCollectionManager: base.extend<TestFixtures, WorkerFixtures>({
        context: async ({ browser }, use: (r: BrowserContext) => Promise<void>) => {
            const context = await browser.newContext({
                storageState: "./playwright/.auth/collectionManager.json",
            })
            await use(context)
            await context.close()
        },
    }),

    asLeadFacilitator: base.extend<TestFixtures, WorkerFixtures>({
        context: async ({ browser }, use: (r: BrowserContext) => Promise<void>) => {
            const context = await browser.newContext({
                storageState: "./playwright/.auth/leadFacilitator.json",
            })
            await use(context)
            await context.close()
        },
    }),

    asFacilitator: base.extend<TestFixtures, WorkerFixtures>({
        context: async ({ browser }, use: (r: BrowserContext) => Promise<void>) => {
            const context = await browser.newContext({
                storageState: "./playwright/.auth/facilitator.json",
            })
            await use(context)
            await context.close()
        },
    }),

    asParticipant: base.extend<TestFixtures, WorkerFixtures>({
        context: async ({ browser }, use: (r: BrowserContext) => Promise<void>) => {
            const context = await browser.newContext({
                storageState: "./playwright/.auth/participant.json",
            })
            await use(context)
            await context.close()
        },
    }),

    // Base test without auth for unauthenticated tests
    default: base,
}

export { expect } from "@playwright/test"
