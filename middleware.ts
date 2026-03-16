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
     * Match all request paths except:
     * - api routes (api/)
     * - static files (_next/static/)
     * - image optimization (_next/image/)
     * - favicon and manifest
     * - static media files (images, fonts, videos)
     * 
     * FIX: Exclude static assets to reduce CPU usage on 1GB RAM server
     * This prevents middleware from running on every image/CSS/JS request
     */
    '/((?!api/|_next/static/|_next/image/|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|eot|mp4|webm)).*)',
  ],
};
