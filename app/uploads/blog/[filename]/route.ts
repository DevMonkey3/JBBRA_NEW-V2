// app/uploads/blog/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET - Legacy image redirect for images previously stored in MongoDB as base64.
 *
 * CRITICAL FIX: The old implementation fetched the full binary image from MongoDB,
 * decoded it into a Buffer in Node.js RAM, and streamed it back on every request.
 * On a 1GB server this caused RAM spikes proportional to image size × concurrent requests.
 *
 * New behavior:
 *   1. Look up the image record to get its CDN URL
 *   2. Return a permanent 301 redirect to the CDN URL
 *   3. The browser fetches the image directly from DigitalOcean Spaces — zero RAM cost
 *
 * If the record has no CDN url (truly legacy data), return 404.
 * Once all old images are migrated to Spaces, delete this file entirely.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // @ts-ignore - Prisma client generated, restart TS server if error persists
    const image = await prisma.uploadedImage.findUnique({
      where: { filename },
      // Only select the CDN url — never pull binary data into memory
      select: { url: true },
    });

    if (!image?.url) {
      return new NextResponse("Image not found or not yet migrated to CDN", { status: 404 });
    }

    // Permanent redirect to CDN — browser and CDN edge will cache this,
    // so repeat requests for the same image never hit this server again
    return NextResponse.redirect(image.url, {
      status: 301,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error("Image redirect error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
