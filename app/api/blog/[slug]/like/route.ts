// app/api/blog/[slug]/like/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * POST - Like/Unlike a blog post
 * Public endpoint - uses IP + User-Agent as unique identifier
 */
export async function POST(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse<{ liked: boolean; likeCount: number } | { error: string }>> {
  try {
    const { slug } = await params;

    // Find the blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Get user identifier from IP + User-Agent
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";
    const userKey = `${ip}-${userAgent}`.substring(0, 200); // Limit length

    // Check if user already liked this post
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userKey: {
          postId: post.id,
          userKey,
        },
      },
    });

    let liked: boolean;
    let likeCount: number;

    if (existingLike) {
      // Unlike - remove the like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      // Decrement like count
      const updated = await prisma.blogPost.update({
        where: { id: post.id },
        data: { likeCount: { decrement: 1 } },
      });

      liked = false;
      likeCount = updated.likeCount;
    } else {
      // Like - add the like
      await prisma.like.create({
        data: {
          postId: post.id,
          userKey,
        },
      });

      // Increment like count
      const updated = await prisma.blogPost.update({
        where: { id: post.id },
        data: { likeCount: { increment: 1 } },
      });

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
 * GET - Check if user has liked this post
 */
export async function GET(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse<{ liked: boolean } | { error: string }>> {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Get user identifier
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";
    const userKey = `${ip}-${userAgent}`.substring(0, 200);

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userKey: {
          postId: post.id,
          userKey,
        },
      },
    });

    return NextResponse.json({ liked: !!existingLike });
  } catch (error) {
    console.error("GET like status error:", error);
    return NextResponse.json({ error: "Failed to check like status" }, { status: 500 });
  }
}
