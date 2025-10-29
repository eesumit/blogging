import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(request) {
        const { pathname } = request.nextUrl;
        const token = request.cookies.get("auth-token"); // Replace with your actual authentication token key
        
        // Redirect logged-in users away from /login and /register
        if (token && (pathname === "/login" || pathname === "/register")) {
            return NextResponse.redirect(new URL("/home", request.url));
        }
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ req, token }) {
                const { pathname } = req.nextUrl;

                // Public routes that don't require authentication
                if (pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register" ||
                    pathname === "/" ||
                    pathname.startsWith("/api/videos") ||
                    pathname.startsWith("/api/checkUsername") ||
                    pathname === "/forgot-password" ||
                    pathname === "/reset-password"
                ) {
                    return true;
                }

                // All other routes require authentication
                return !!token;
            }
        }
    }
);

export const config = {
    // Match all routes except public assets
    matcher: [
        /*
         * Match all request paths except:
         * 1. /api/auth/* (authentication routes)
         * 2. /login (login page)
         * 3. /register (registration page)
         * 4. /_next/static (static files)
         * 5. /_next/image (image optimization files)
         * 6. /favicon.ico (favicon file)
         */
        '/((?!api/auth|login|register|_next/static|_next/image|favicon.ico).*)',
    ],
};
