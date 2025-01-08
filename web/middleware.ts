import { auth } from "./auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const session = await auth()

    // Determine login path based on environment
    const loginPath =
        process.env.ENABLE_AUTOMATED_TEST_LOGIN === "true" ? "/test-auth" : "/login"

    // Public paths that don't require authentication
    const publicPaths = [loginPath, "/api/auth"]

    // Check if the current path is public
    const isPublicPath = publicPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    )

    // Handle authentication
    if (!session) {
        // If not authenticated and trying to access a protected route
        if (!isPublicPath) {
            const url = new URL(loginPath, request.url)
            url.searchParams.set("callbackUrl", request.url)
            return NextResponse.redirect(url)
        }
    } else if (request.nextUrl.pathname.startsWith(loginPath)) {
        return NextResponse.redirect(new URL("/", request.url))
    }


    return NextResponse.next()
}

// Configure which routes should be handled by middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. _next/static (static files)
         * 2. _next/image (image optimization files)
         * 3. favicon.ico (favicon file)
         * 4. public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
