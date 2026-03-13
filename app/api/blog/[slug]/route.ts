// app/api/blog/[slug]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface BlogPostDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  excerpt: string | null;
  publishedAt: Date | string;
  likeCount: number;
}

export interface BlogPostDetailResponse {
  post: BlogPostDetail;
}

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET - Get single blog post by slug
 * Public endpoint - no authentication required
 */
export async function GET(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse<BlogPostDetailResponse | { error: string }>> {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("GET blog post error:", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}
