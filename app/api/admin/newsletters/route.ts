// app/api/admin/newsletters/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewsletterEmail } from "@/lib/email";
import type {
  GetNewslettersResponse,
  CreateNewsletterRequest,
  NewsletterResponse,
  ApiError
} from "@/types";

/**
 * GET - List all newsletters with pagination
 */
export async function GET(request: Request): Promise<NextResponse<GetNewslettersResponse & { total: number; hasMore: boolean } | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const [newsletters, total] = await Promise.all([
      prisma.newsletter.findMany({
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.newsletter.count(),
    ]);

    const hasMore = skip + newsletters.length < total;

    return NextResponse.json({ newsletters, total, hasMore });
  } catch (error) {
    console.error("GET newsletters error:", error);
    return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 });
  }
}

/**
 * POST - Create new newsletter and send to subscribers (background, cursor-batched)
 * FIX: Uses cursor-based batching to prevent RAM spikes with large subscriber lists
 */
export async function POST(req: Request): Promise<NextResponse<NewsletterResponse | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateNewsletterRequest = await req.json();
    const { title, body: content, excerpt, slug } = body;

    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Title, body, and slug are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.newsletter.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Newsletter with this slug already exists" },
        { status: 409 }
      );
    }

    const newsletter = await prisma.newsletter.create({
      data: { title, body: content, excerpt, slug },
    });

    // Fire-and-forget: cursor-batched send to prevent RAM spikes
    // Runs in background without blocking HTTP response
    (async () => {
      const maxRetries = 3;
      const batchSize = 500;
      let cursor: string | undefined = undefined;
      let hasMore = true;
      let totalSent = 0;
      let failedBatches = 0;

      try {
        while (hasMore) {
          const subscribers: { id: string; email: string }[] = await prisma.subscription.findMany({
            where: { unsubscribedAt: null }, // FIX: Removed verifiedAt: null (was filtering wrong users)
            select: { id: true, email: true },
            take: batchSize,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
            orderBy: { id: 'asc' },
          });

          if (subscribers.length === 0) break;

          const emailList = subscribers.map(s => s.email);
          let emailSuccess = false;

          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              const result = await sendNewsletterEmail(emailList, {
                title: newsletter.title,
                excerpt: newsletter.excerpt || undefined,
                body: newsletter.body,
                slug: newsletter.slug,
              });

              if (result.success) {
                emailSuccess = true;
                totalSent += emailList.length;
                try {
                  await prisma.notification.createMany({
                    data: emailList.map(email => ({
                      type: 'newsletter',
                      refId: newsletter.id,
                      email,
                    })),
                  });
                } catch (logError) {
                  console.error('Failed to log notifications:', logError);
                }
                break;
              } else {
                console.error(`Email sending failed: ${result.error}`);
              }
            } catch (sendError) {
              console.error(`Email send attempt ${attempt}/${maxRetries} failed:`, sendError);
            }

            if (attempt < maxRetries) {
              const delay = 1000 * Math.pow(2, attempt - 1);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }

          if (!emailSuccess) {
            failedBatches++;
            console.error(`Failed to send email batch after ${maxRetries} attempts. Continuing.`);
          }

          hasMore = subscribers.length === batchSize;
          cursor = hasMore ? subscribers[subscribers.length - 1].id : undefined;
        }

        console.log(`Newsletter email completed. Sent: ${totalSent}, Failed batches: ${failedBatches}`);
        if (failedBatches > 0) {
          console.warn(`Warning: ${failedBatches} batches failed. Consider manual retry.`);
        }
      } catch (error) {
        console.error('Background newsletter email failed with critical error:', error);
      }
    })();

    return NextResponse.json({ newsletter }, { status: 201 });
  } catch (error) {
    console.error("POST newsletter error:", error);
    return NextResponse.json({ error: "Failed to create newsletter" }, { status: 500 });
  }
}
