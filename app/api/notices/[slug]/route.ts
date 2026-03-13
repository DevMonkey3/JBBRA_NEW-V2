/**
 * FIX: API route to fetch individual notice by slug
 * WHY: Support client-side data fetching for notice detail page
 * PURPOSE: Returns full content for newsletter, seminar, or announcement based on slug
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface NoticeDetailResponse {
  content: any;
  type: 'newsletter' | 'seminar' | 'announcement';
}

/**
 * GET - Get a single notice by slug
 * Public endpoint - no authentication required
 * Searches across newsletters, seminars, and announcements
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<NoticeDetailResponse | { error: string }>> {
  try {
    const { slug } = await params;

    // Try to find in all content types
    const [newsletter, seminar, announcement] = await Promise.all([
      prisma.newsletter.findUnique({
        where: { slug },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          body: true,
          publishedAt: true,
        },
      }),
      prisma.seminar.findUnique({
        where: { slug },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          description: true,
          publishedAt: true,
          startsAt: true,
          endsAt: true,
          location: true,
          speakerName: true,
          speakerTitle: true,
          speakerOrg: true,
          registrationUrl: true,
        },
      }),
      prisma.announcement.findUnique({
        where: { slug },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          body: true,
          publishedAt: true,
        },
      }),
    ]);

    // Determine which type was found
    if (newsletter) {
      return NextResponse.json({
        content: newsletter,
        type: 'newsletter'
      });
    }

    if (seminar) {
      return NextResponse.json({
        content: seminar,
        type: 'seminar'
      });
    }

    if (announcement) {
      return NextResponse.json({
        content: announcement,
        type: 'announcement'
      });
    }

    // Not found
    return NextResponse.json(
      { error: 'Notice not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error("GET notice by slug error:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
