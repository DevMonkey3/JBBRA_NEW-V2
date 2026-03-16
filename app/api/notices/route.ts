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
 *
 * NOTE: Cross-table sorted pagination is done by fetching a window from each table,
 * merging in JS, then slicing. This is acceptable for small-to-medium content volumes
 * (hundreds of notices). If you ever have thousands, move to a unified Notice table.
 *
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

    // FIX: Fetch the correct window size (skip + limit) instead of limit * 2
    // This ensures we have enough rows even if all results come from one table
    const fetchPerTable = skip + limit;

    // FIX: Run all 6 queries in parallel (3 data + 3 counts) instead of sequentially
    const [newsletters, seminars, announcements, nlCount, semCount, annCount] = await Promise.all([
      prisma.newsletter.findMany({
        select: { id: true, title: true, excerpt: true, slug: true, publishedAt: true },
        orderBy: { publishedAt: 'desc' },
        take: fetchPerTable,
      }),
      prisma.seminar.findMany({
        select: { id: true, title: true, excerpt: true, slug: true, publishedAt: true },
        orderBy: { publishedAt: 'desc' },
        take: fetchPerTable,
      }),
      prisma.announcement.findMany({
        select: { id: true, title: true, excerpt: true, slug: true, publishedAt: true },
        orderBy: { publishedAt: 'desc' },
        take: fetchPerTable,
      }),
      prisma.newsletter.count(),
      prisma.seminar.count(),
      prisma.announcement.count(),
    ]);

    const total = nlCount + semCount + annCount;

    // Combine, tag with type, sort descending by date
    const allNotices: Notice[] = [
      ...newsletters.map(n => ({ ...n, type: 'newsletter' as const })),
      ...seminars.map(s => ({ ...s, type: 'seminar' as const })),
      ...announcements.map(a => ({ ...a, type: 'announcement' as const })),
    ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const notices = allNotices.slice(skip, skip + limit);
    const hasMore = skip + notices.length < total;

    return NextResponse.json({ notices, total, hasMore });
  } catch (error) {
    console.error("GET notices error:", error);
    return NextResponse.json({ notices: [], total: 0, hasMore: false });
  }
}
