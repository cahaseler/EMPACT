import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"

import { cn } from "@/lib/utils"
import "../../globals.css"

import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "../../components/footer"
import { Nav } from "../../components/nav"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { auth } from "@/auth"
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
              <Nav isAdmin={isAdmin(session)} name={session?.user?.name}/>
            </header>
            <main className="flex h-full grow flex-col">
              <div className="flex h-full flex-col items-center justify-start p-2 sm:p-10">
                {children}
              </div>
            </main>
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
