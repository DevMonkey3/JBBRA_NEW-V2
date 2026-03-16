// app/api/admin/blog/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendBlogEmail } from "@/lib/email";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  excerpt: string | null;
  publishedAt: Date;
  likeCount: number;
}

export interface GetBlogPostsResponse {
  posts: BlogPost[];
}

export interface CreateBlogPostRequest {
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  excerpt?: string;
}

export interface BlogPostResponse {
  post: BlogPost;
}

export interface ApiError {
  error: string;
}

/**
 * GET - List all blog posts (admin view) with pagination
 * Query params:
 *   - page: Page number (default: 1)
 *   - limit: Posts per page (default: 20, max: 100)
 */
export async function GET(request: Request): Promise<NextResponse<GetBlogPostsResponse & { total: number; hasMore: boolean } | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

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
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

/**
 * POST - Create new blog post
 */
export async function POST(req: Request): Promise<NextResponse<BlogPostResponse | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateBlogPostRequest = await req.json();
    const { title, slug, content, coverImage, excerpt } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Blog post with this slug already exists" },
        { status: 409 }
      );
    }

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        coverImage: coverImage || null,
        excerpt: excerpt || null,
      },
    });

    // Send emails to subscribers using cursor-based pagination to reduce RAM usage
    // This runs in the background without blocking the response
    (async () => {
      const maxRetries = 3;
      const batchSize = 500; // Process 500 subscribers at a time
      let cursor: string | undefined = undefined;
      let hasMore = true;
      let totalSent = 0;
      let failedBatches = 0;

      try {
        while (hasMore) {
          const subscribers: { id: string; email: string }[] = await prisma.subscription.findMany({
            where: {
              unsubscribedAt: null,
            },
            select: { id: true, email: true },
            take: batchSize,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
            orderBy: { id: 'asc' },
          });

          if (subscribers.length === 0) {
            break;
          }

          const emailList = subscribers.map((s) => s.email);

          // Retry logic for email sending
          let emailSuccess = false;
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              const result = await sendBlogEmail(emailList, {
                title: post.title,
                excerpt: post.excerpt || undefined,
                content: post.content,
                slug: post.slug,
                coverImage: post.coverImage || undefined,
              });

              if (result.success) {
                emailSuccess = true;
                totalSent += emailList.length;

                // Log notifications for this batch
                try {
                  await prisma.notification.createMany({
                    data: emailList.map((email) => ({
                      type: 'blog',
                      refId: post.id,
                      email,
                    })),
                  });
                } catch (logError) {
                  console.error('Failed to log notifications:', logError);
                  // Don't fail the batch if logging fails
                }
                break;
              } else {
                console.error(`Email sending failed: ${result.error}`);
              }
            } catch (sendError) {
              console.error(`Email send attempt ${attempt}/${maxRetries} failed:`, sendError);
            }

            if (attempt < maxRetries) {
              const delay = 1000 * Math.pow(2, attempt - 1); // Exponential backoff
              console.log(`Retrying in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }

          if (!emailSuccess) {
            failedBatches++;
            console.error(`Failed to send email batch after ${maxRetries} attempts. Continuing with next batch.`);
          }

          // Update cursor for next batch
          if (subscribers.length < batchSize) {
            hasMore = false;
          } else {
            cursor = subscribers[subscribers.length - 1].id;
          }

          // Clear batch from memory
          subscribers.length = 0;
          emailList.length = 0;
        }

        const logMessage = `Blog post email completed. Sent: ${totalSent}, Failed batches: ${failedBatches}`;
        console.log(logMessage);
        
        // Log final status if there were failures
        if (failedBatches > 0) {
          console.warn(`Warning: ${failedBatches} batches failed to send. Consider manual retry.`);
        }
      } catch (error) {
        console.error('Background email sending failed with critical error:', error);
      }
    })();

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("POST blog post error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
