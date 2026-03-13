// app/api/notices/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface Notice {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  publishedAt: Date | string;
  type: 'newsletter' | 'seminar' | 'announcement';
}

export interface GetNoticesResponse {
  notices: Notice[];
  total: number;
  hasMore: boolean;
}

/**
 * GET - Get all public notices (newsletters, seminars, announcements) with pagination
 * Public endpoint - no authentication required
 * Query params:
 *   - page: Page number (default: 1)
 *   - limit: Notices per page (default: 12, max: 50)
 */
export async function GET(request: Request): Promise<NextResponse<GetNoticesResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const skip = (page - 1) * limit;

    // Fetch all types of notices with pagination
    const [newsletters, seminars, announcements] = await Promise.all([
      prisma.newsletter.findMany({
        select: {
          id: true,
          title: true,
          excerpt: true,
          slug: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: 'desc' },
        take: limit * 2, // Fetch more to ensure we have enough after merging
      }),
      prisma.seminar.findMany({
        select: {
          id: true,
          title: true,
          excerpt: true,
          slug: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: 'desc' },
        take: limit * 2,
      }),
      prisma.announcement.findMany({
        select: {
          id: true,
          title: true,
          excerpt: true,
          slug: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: 'desc' },
        take: limit * 2,
      }),
    ]);

    // Combine and add type
    const allNotices: Notice[] = [
      ...newsletters.map(n => ({ ...n, type: 'newsletter' as const })),
      ...seminars.map(s => ({ ...s, type: 'seminar' as const })),
      ...announcements.map(a => ({ ...a, type: 'announcement' as const })),
    ];

    // Sort by published date descending
    allNotices.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

    // Get total count for pagination metadata
    const total = await prisma.newsletter.count() + 
                  await prisma.seminar.count() + 
                  await prisma.announcement.count();

    // Apply pagination after sorting
    const notices = allNotices.slice(skip, skip + limit);
    const hasMore = skip + notices.length < total;

    return NextResponse.json({ notices, total, hasMore });
  } catch (error) {
    console.error("GET notices error:", error);
    return NextResponse.json({ notices: [], total: 0, hasMore: false });
  }
}
