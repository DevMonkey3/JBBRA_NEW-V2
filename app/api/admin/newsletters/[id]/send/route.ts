// app/api/admin/newsletters/[id]/send/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewsletterEmail } from "@/lib/email";
import type { NewsletterResponse, ApiError } from "@/types";

/**
 * POST - Send existing newsletter to subscribers
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<NewsletterResponse | ApiError>> {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the newsletter
    const newsletter = await prisma.newsletter.findUnique({
      where: { id },
    });

    if (!newsletter) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
    }

    // Use cursor-based pagination to reduce RAM usage when sending to many subscribers
    const batchSize = 500; // Process 500 subscribers at a time
    let cursor: string | undefined = undefined;
    let hasMore = true;
    let totalSent = 0;

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
        if (totalSent === 0) {
          return NextResponse.json({ error: "No subscribers found" }, { status: 404 });
        }
        hasMore = false;
        break;
      }

      const emailList = subscribers.map((s) => s.email);

      // Send emails to this batch
      const result = await sendNewsletterEmail(emailList, {
        title: newsletter.title,
        excerpt: newsletter.excerpt || undefined,
        body: newsletter.body,
        slug: newsletter.slug,
      });

      if (!result.success) {
        console.error(`Failed to send newsletter batch: ${result.error}`);
        // Continue with next batch instead of failing completely
      } else {
        totalSent += emailList.length;

        // Log notifications for this batch
        try {
          await prisma.notification.createMany({
            data: emailList.map((email) => ({
              type: 'newsletter',
              refId: newsletter.id,
              email,
            })),
          });
        } catch (logError) {
          console.error('Failed to log notifications:', logError);
        }
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

    console.log(`Newsletter sent to ${totalSent} subscribers`);

    return NextResponse.json({ newsletter });
  } catch (error) {
    console.error("POST send newsletter error:", error);
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 });
  }
}