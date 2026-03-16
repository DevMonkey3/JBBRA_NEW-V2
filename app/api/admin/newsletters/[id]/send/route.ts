// app/api/admin/newsletters/[id]/send/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewsletterEmail } from "@/lib/email";
import type { ApiError } from "@/types";

/**
 * POST - Send existing newsletter to all active subscribers
 * FIX: Responds 202 immediately, sends in background via cursor-batched fire-and-forget
 * This prevents HTTP timeout on large subscriber lists
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ queued: true } | ApiError>> {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newsletter = await prisma.newsletter.findUnique({ where: { id } });
    if (!newsletter) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
    }

    // Check there is at least one subscriber before queuing
    const subscriberCount = await prisma.subscription.count({
      where: { unsubscribedAt: null },
    });
    if (subscriberCount === 0) {
      return NextResponse.json({ error: "No active subscribers found" }, { status: 404 });
    }

    // Fire-and-forget: don't block the HTTP response
    // Email sending happens asynchronously in background
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
            where: { unsubscribedAt: null },
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

        console.log(`Newsletter send complete. Sent: ${totalSent}, Failed batches: ${failedBatches}`);
        if (failedBatches > 0) {
          console.warn(`Warning: ${failedBatches} batches failed. Consider manual retry.`);
        }
      } catch (error) {
        console.error('Background newsletter send failed with critical error:', error);
      }
    })();

    // Respond immediately — sending happens in background
    return NextResponse.json({ queued: true }, { status: 202 });
  } catch (error) {
    console.error("POST send newsletter error:", error);
    return NextResponse.json({ error: "Failed to queue newsletter send" }, { status: 500 });
  }
}