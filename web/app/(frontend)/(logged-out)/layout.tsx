import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"

import { cn } from "@/lib/utils"
import "../globals.css"

import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "../components/footer"
import { Nav } from "../components/nav"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { auth } from "@/auth"

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
              <Nav />
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
