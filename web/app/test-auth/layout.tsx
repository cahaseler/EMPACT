import { ThemeProvider } from "@/components/theme-provider"

export default function TestAuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className="min-h-screen bg-background font-sans antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className="flex min-h-screen flex-col">
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    )
}
