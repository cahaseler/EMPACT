import type { Metadata } from "next"


export const dynamic = "force-dynamic"; // Force dynamic rendering, disable static caching
import { GeistSans } from "geist/font/sans"

import { cn } from "@/lib/utils"

import "../../globals.css"

import { ClerkProvider } from "@clerk/nextjs"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { auth } from "@/auth"
import { DebugSessionInfo } from "@/components/debug-session-info"
import { MultisessionAppSupport } from "@/components/multisessionAppSupport"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "../../components/footer"
import { Nav } from "../../components/nav"
import { isAdmin } from "../utils/permissions"

export const metadata: Metadata = {
  title: "EMPACT",
  description: "Environmental and Maturity Program Assessment and Control Tool",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <ClerkProvider afterMultiSessionSingleSignOutUrl="/">
      <MultisessionAppSupport>
        <html lang="en" suppressHydrationWarning>
          <head />
          <body
            className={cn(
              "bg-background font-sans antialiased min-w-screen min-h-screen",
              GeistSans.className
            )}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div
                className={
                  "bg-white dark:bg-indigo-600/20 flex min-h-screen flex-col"
                }
              >
                <header>
                  <Nav isAdmin={isAdmin(session)} />
                </header>
                <main className="flex h-full grow flex-col">
                  <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
                    {children}
                  </div>
                </main>
                <footer>
                  <TailwindIndicator />
                  <Footer />
                  <DebugSessionInfo />
                </footer>
              </div>
            </ThemeProvider>
            <SpeedInsights />
          </body>
        </html>
      </MultisessionAppSupport>
    </ClerkProvider>
  )
}
