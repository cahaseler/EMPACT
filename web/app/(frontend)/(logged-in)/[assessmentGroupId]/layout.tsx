import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"

import { cn } from "@/lib/utils"
import "../../globals.css"

import { fetchAssessmentType } from "../utils/dataFetchers"

import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "../../components/footer"
import { Nav } from "../../components/nav"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { auth } from "@/auth"
import { isAdmin, canViewUsers } from "../utils/permissions"

export const metadata: Metadata = {
  title: "EMPACT",
  description: "Environmental and Maturity Program Assessment and Control Tool",
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: { assessmentGroupId: string }
}>) {
  const session = await auth()
  const assessmentType = await fetchAssessmentType(params.assessmentGroupId)
  return (
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
          <div className={"bg-white dark:bg-indigo-600/20 flex min-h-screen flex-col"}>
            <header>
              <Nav 
                assessmentType={assessmentType} 
                name={session?.user?.name}
                isAdmin={isAdmin(session)} 
                canViewUsers={canViewUsers(session)}
              />
            </header>
            <main className="flex h-full grow flex-col">{children}</main>
            <footer>
              <TailwindIndicator />
              <Footer />
            </footer>
          </div>
        </ThemeProvider>
        <SpeedInsights/>
      </body>
    </html>
  )
}
