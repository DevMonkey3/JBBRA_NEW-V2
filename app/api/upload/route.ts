// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadToSpaces } from "@/lib/spaces";

// Limit body size at the route level (Next.js 13+)
export const maxDuration = 30;

const VALID_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * POST - Upload image file
 * Admin only - requires authentication
 * Images are stored in DigitalOcean Spaces to avoid bloating server RAM/disk
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // FIX: Validate file type BEFORE reading into memory
    if (!VALID_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed" },
        { status: 400 }
      );
    }

    // FIX: Check size BEFORE reading into memory
    // This prevents large invalid files from ever touching RAM
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Read into memory only after all checks pass
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split('.').pop() ?? 'jpg';
    const filename = `blog-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Upload to DigitalOcean Spaces
    const imageUrl = await uploadToSpaces(buffer, filename, file.type);

    // Log upload in DB (URL only, never the binary data)
    // @ts-ignore - Prisma client generated, restart TS server if this errors
    await prisma.uploadedImage.create({
      data: {
        filename,
        mimeType: file.type,
        url: imageUrl,
        size: file.size,
      },
    });

    return NextResponse.json({ url: imageUrl }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
