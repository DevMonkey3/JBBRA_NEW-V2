// app/api/admin/blog/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { BlogPost, BlogPostResponse, CreateBlogPostRequest, ApiError } from "../route";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET - Get single blog post
 */
export async function GET(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse<BlogPostResponse | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
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

/**
 * PUT - Update blog post
 */
export async function PUT(
  req: Request,
  { params }: RouteParams
): Promise<NextResponse<BlogPostResponse | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body: CreateBlogPostRequest = await req.json();
    const { title, content, coverImage, excerpt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        content,
        coverImage: coverImage || null,
        excerpt: excerpt || null,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("PUT blog post error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

/**
 * DELETE - Delete blog post
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

    // Delete related likes first
    await prisma.like.deleteMany({
      where: { postId: id },
    });

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE blog post error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
