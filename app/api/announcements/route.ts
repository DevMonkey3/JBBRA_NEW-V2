import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const announcements = await prisma.announcement.findMany({
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}
