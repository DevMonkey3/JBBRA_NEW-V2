// app/uploads/blog/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET - Serve uploaded image from database
 * This route serves images stored in MongoDB as base64
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Fetch image from database
    // @ts-ignore - Prisma client generated, restart TS server if error persists
    const image = await prisma.uploadedImage.findUnique({
      where: { filename },
      select: {
        data: true,
        mimeType: true,
      },
    });

    if (!image || !image.data) {
      return new NextResponse("Image not found or migrated to CDN", { status: 404 });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(image.data, 'base64');

    // Return image with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': image.mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error("Image serving error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
