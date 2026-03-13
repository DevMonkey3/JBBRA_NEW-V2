import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Export default middleware using withAuth for robust auth protection
export default withAuth(
  async function middleware(req: NextRequest) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public access to non-admin routes
        if (!pathname.startsWith('/admin')) {
          return true;
        }

        // Allow access to login page
        if (pathname === '/admin/login') {
          return true;
        }

        // Require authentication for all other admin routes
        return !!token;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
