// app/api/admin/announcements/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Announcement, AnnouncementResponse, CreateAnnouncementRequest, ApiError } from "../route";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET - Get single announcement
 */
export async function GET(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse<AnnouncementResponse | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error("GET announcement error:", error);
    return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 });
  }
}

/**
 * PUT - Update announcement
 */
export async function PUT(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse<AnnouncementResponse | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body: CreateAnnouncementRequest = await req.json();
    const { title, body: content, excerpt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        body: content,
        excerpt,
      },
    });

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error("PUT announcement error:", error);
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

/**
 * DELETE - Delete announcement
 */
export async function DELETE(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse<{ success: boolean } | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Delete related notifications first
    await prisma.notification.deleteMany({
      where: { refId: id, type: 'announcement' },
    });

    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE announcement error:", error);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
