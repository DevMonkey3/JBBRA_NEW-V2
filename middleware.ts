import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware for JBBRA public site
// Note: Admin functionality is handled by JBBC admin panel
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the api routes.
     * - api routes (api/)
     */
    '/((?!api/).*)',
  ],
};
