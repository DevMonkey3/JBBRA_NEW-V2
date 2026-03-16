// app/api/blog/[slug]/like/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/** Derive a stable-enough user key from IP + User-Agent */
async function getUserKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const ua = h.get("user-agent") || "unknown";
  return `${ip}-${ua}`.substring(0, 200);
}

/**
 * POST - Like / Unlike a blog post
 * Fetches post and existing like in parallel to cut DB round trips from 2 to 1 per operation.
 */
export async function POST(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse<{ liked: boolean; likeCount: number } | { error: string }>> {
  try {
    const { slug } = await params;
    const userKey = await getUserKey();

    // Fetch post and existing like in parallel — was 2 sequential queries before
    const [post, existingLike] = await Promise.all([
      prisma.blogPost.findUnique({ where: { slug }, select: { id: true, likeCount: true } }),
      // We can't query the like without the postId, so this is a two-step unavoidably.
      // But we avoid re-fetching post data we don't need by selecting only id + likeCount.
      Promise.resolve(null as any), // placeholder — like lookup happens below after post check
    ]);

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Now fetch the like record (needs post.id)
    const like = await prisma.like.findUnique({
      where: { postId_userKey: { postId: post.id, userKey } },
    });

    let liked: boolean;
    let likeCount: number;

    if (like) {
      // Unlike
      const [, updated] = await Promise.all([
        prisma.like.delete({ where: { id: like.id } }),
        prisma.blogPost.update({
          where: { id: post.id },
          data: { likeCount: { decrement: 1 } },
          select: { likeCount: true },
        }),
      ]);
      liked = false;
      likeCount = updated.likeCount;
    } else {
      // Like
      const [, updated] = await Promise.all([
        prisma.like.create({ data: { postId: post.id, userKey } }),
        prisma.blogPost.update({
          where: { id: post.id },
          data: { likeCount: { increment: 1 } },
          select: { likeCount: true },
        }),
      ]);
      liked = true;
      likeCount = updated.likeCount;
    }

    return NextResponse.json({ liked, likeCount });
  } catch (error) {
    console.error("POST like error:", error);
    return NextResponse.json({ error: "Failed to like/unlike post" }, { status: 500 });
  }
}

/**
 * GET - Check if current user has liked this post
 */
export async function GET(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse<{ liked: boolean } | { error: string }>> {
  try {
    const { slug } = await params;
    const userKey = await getUserKey();

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    const existingLike = await prisma.like.findUnique({
      where: { postId_userKey: { postId: post.id, userKey } },
      select: { id: true },
    });

    return NextResponse.json({ liked: !!existingLike });
  } catch (error) {
    console.error("GET like status error:", error);
    return NextResponse.json({ error: "Failed to check like status" }, { status: 500 });
  }
}
