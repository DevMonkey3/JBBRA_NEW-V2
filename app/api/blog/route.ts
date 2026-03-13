// app/api/blog/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  excerpt: string | null;
  publishedAt: Date | string;
  likeCount: number;
}

export interface GetBlogPostsResponse {
  posts: BlogPost[];
  total: number;
  hasMore: boolean;
}

/**
 * GET - Get public blog posts with pagination
 * Public endpoint - no authentication required
 * Query params:
 *   - page: Page number (default: 1)
 *   - limit: Posts per page (default: 20, max: 50)
 */
export async function GET(request: Request): Promise<NextResponse<GetBlogPostsResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    // Run both queries in parallel to reduce latency
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.blogPost.count(),
    ]);

    const hasMore = skip + posts.length < total;

    return NextResponse.json({ posts, total, hasMore });
  } catch (error) {
    console.error("GET blog posts error:", error);
    return NextResponse.json({ posts: [], total: 0, hasMore: false });
  }
}
