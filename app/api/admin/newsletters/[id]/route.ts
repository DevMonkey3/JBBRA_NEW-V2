// app/api/admin/newsletters/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
  UpdateNewsletterRequest,
  NewsletterResponse,
  ApiError
} from "@/types";

/**
 * PUT - Update newsletter
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<NewsletterResponse | ApiError>> {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateNewsletterRequest = await req.json();
    const { title, body: content, excerpt, slug } = body;

    // Check if newsletter exists
    const existing = await prisma.newsletter.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
    }

    // If slug is being changed, check for conflicts
    if (slug && slug !== existing.slug) {
      const conflicting = await prisma.newsletter.findUnique({ where: { slug } });
      if (conflicting) {
        return NextResponse.json(
          { error: "Newsletter with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const newsletter = await prisma.newsletter.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { body: content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(slug && { slug }),
      },
    });

    return NextResponse.json({ newsletter });
  } catch (error) {
    console.error("PUT newsletter error:", error);
    return NextResponse.json({ error: "Failed to update newsletter" }, { status: 500 });
  }
}

/**
 * DELETE - Delete newsletter
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ success: boolean } | ApiError>> {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.newsletter.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
    }

    // Delete associated notifications first
    await prisma.notification.deleteMany({
      where: { refId: id, type: 'newsletter' },
    });

    await prisma.newsletter.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE newsletter error:", error);
    return NextResponse.json({ error: "Failed to delete newsletter" }, { status: 500 });
  }
}
