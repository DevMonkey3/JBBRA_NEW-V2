// app/api/admin/announcements/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAnnouncementEmail } from "@/lib/email";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  excerpt: string | null;
  slug: string;
  publishedAt: Date;
}

export interface GetAnnouncementsResponse {
  announcements: Announcement[];
  total: number;
  hasMore: boolean;
}

export interface CreateAnnouncementRequest {
  title: string;
  body: string;
  excerpt?: string;
  slug: string;
}

export interface AnnouncementResponse {
  announcement: Announcement;
}

export interface ApiError {
  error: string;
}

/**
 * GET - List announcements with pagination
 * Admin only - requires authentication
 * Query params:
 *   - page: Page number (default: 1)
 *   - limit: Announcements per page (default: 20, max: 100)
 */
export async function GET(request: Request): Promise<NextResponse<GetAnnouncementsResponse | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    // FIX: Run both queries in parallel to reduce DB round-trips
    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.announcement.count(),
    ]);

    const hasMore = skip + announcements.length < total;

    return NextResponse.json({ announcements, total, hasMore });
  } catch (error) {
    console.error("GET announcements error:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

/**
 * POST - Create new announcement and send to subscribers
 */
export async function POST(req: Request): Promise<NextResponse<AnnouncementResponse | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateAnnouncementRequest = await req.json();
    const { title, body: content, excerpt, slug } = body;

    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Title, body, and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.announcement.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Announcement with this slug already exists" },
        { status: 409 }
      );
    }

    // Create announcement
    const announcement = await prisma.announcement.create({
      data: {
        title,
        body: content,
        excerpt,
        slug,
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
              const result = await sendAnnouncementEmail(emailList, {
                title: announcement.title,
                excerpt: announcement.excerpt || undefined,
                body: announcement.body,
                slug: announcement.slug,
              });

              if (result.success) {
                emailSuccess = true;
                totalSent += emailList.length;

                // Log notifications for this batch
                try {
                  await prisma.notification.createMany({
                    data: emailList.map((email) => ({
                      type: 'announcement',
                      refId: announcement.id,
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

        const logMessage = `Announcement email completed. Sent: ${totalSent}, Failed batches: ${failedBatches}`;
        console.log(logMessage);
        
        // Log final status if there were failures
        if (failedBatches > 0) {
          console.warn(`Warning: ${failedBatches} batches failed to send. Consider manual retry.`);
        }
      } catch (error) {
        console.error('Background email sending failed with critical error:', error);
      }
    })();

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error("POST announcement error:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
