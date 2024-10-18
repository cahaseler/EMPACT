import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"

import { cn } from "@/lib/utils"
import "../globals.css"

import { colors } from "@/app/(frontend)/branding"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "./components/footer"
import { Nav } from "./components/nav"

export const metadata: Metadata = {
  title: "EMPACT",
  description: "Environmental and Maturity Program Assessment and Control Tool",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
          <div className={cn(colors.background, "flex min-h-screen flex-col")}>
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
      </body>
    </html>
  )
}
