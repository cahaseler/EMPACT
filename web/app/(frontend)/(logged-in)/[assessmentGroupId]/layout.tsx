import type { Metadata } from "next"


export const dynamic = "force-dynamic"; // Force dynamic rendering, disable static caching
import { GeistSans } from "geist/font/sans"

import { cn } from "@/lib/utils"

import "../../globals.css"

import { SpeedInsights } from "@vercel/speed-insights/next"

import NotFound from "@/app/(frontend)/components/notFound"
import { auth } from "@/auth"
import { DebugSessionInfo } from "@/components/debug-session-info"
import { MultisessionAppSupport } from "@/components/multisessionAppSupport"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from "@clerk/nextjs"
import { UserbackProviderClient } from '@/components/userback-provider-client';
import { Footer } from "../../components/footer"
import { Nav } from "../../components/nav"
import { fetchAssessmentType } from "../utils/dataFetchers"
import { canViewUsers, isAdmin } from "../utils/permissions"

export const metadata: Metadata = {
  title: "EMPACT",
  description: "Environmental and Maturity Program Assessment and Control Tool",
}

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode
    params: { assessmentGroupId: string }
  }>
) {
  const params = await props.params

  const { children } = props

  const session = await auth()
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  // Check for Userback token early
  if (!process.env.USERBACK_TOKEN) {
    console.error("USERBACK_TOKEN is not defined. Userback will not be initialized.");
    // Optionally render without Userback or throw error depending on requirements
    // For now, let's proceed but Userback won't work.
  }
  const userbackToken = process.env.USERBACK_TOKEN || ""; // Provide default empty string for TS

  const userbackOptions = {
    name: session.user.name,
    email: session.user.email,
  };

  if (assessmentType) {
    return (
      <ClerkProvider afterMultiSessionSingleSignOutUrl="/">
        <MultisessionAppSupport>
          {/* Wrap the html element */}
          <UserbackProviderClient token={userbackToken} options={userbackOptions}>
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
                      <Nav
                        assessmentType={assessmentType}
                        isAdmin={isAdmin(session)}
                        canViewUsers={canViewUsers(session)}
                      />
                    </header>
                    <main className="flex h-full grow flex-col">
                      <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
                        {children}
                      </div>
                    </main>
                    <footer>
                      <TailwindIndicator />
                      <Toaster />
                      <Footer />
                      <DebugSessionInfo />
                    </footer>
                  </div>
                </ThemeProvider>
                <SpeedInsights />
              </body>
            </html>
          </UserbackProviderClient>
        </MultisessionAppSupport>
      </ClerkProvider>
    );
  }

  // Render NotFound case
  return (
    <ClerkProvider>
      {/* Wrap the html element */}
      <UserbackProviderClient token={userbackToken} options={userbackOptions}>
        <html lang="en">
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
                  <Nav
                    isAdmin={isAdmin(session)}
                    canViewUsers={canViewUsers(session)}
                  />
                </header>
                <main className="flex h-full grow flex-col">
                  <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
                    <NotFound pageType="type" />
                  </div>
                </main>
                <footer>
                  <TailwindIndicator />
                  <Toaster />
                  <Footer />
                  <DebugSessionInfo />
                </footer>
              </div>
            </ThemeProvider>
            <SpeedInsights />
          </body>
        </html>
      </UserbackProviderClient>
    </ClerkProvider>
  );
}
