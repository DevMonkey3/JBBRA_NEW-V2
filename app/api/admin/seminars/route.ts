import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { sendSeminarNotificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // FIX: Added auth check - was missing (security vulnerability)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      location,
      startsAt,
      endsAt,
      registrationUrl,
      slug,
      excerpt,
      heroImage,
      thumbnail,
      speakerName,
      speakerTitle,
      speakerOrg,
    } = body;

    // FIX: Added required field validation
    if (!title || !location || !startsAt || !endsAt || !slug) {
      return NextResponse.json(
        { error: "Title, location, startsAt, endsAt, and slug are required" },
        { status: 400 }
      );
    }

    // FIX: Check for duplicate slug
    const existing = await prisma.seminar.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Seminar with this slug already exists" },
        { status: 409 }
      );
    }

    const seminar = await prisma.seminar.create({
      data: {
        title,
        description: description || null,
        location,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        registrationUrl: registrationUrl || null,
        slug,
        excerpt: excerpt || null,
        heroImage: heroImage || null,
        thumbnail: thumbnail || null,
        speakerName: speakerName || null,
        speakerTitle: speakerTitle || null,
        speakerOrg: speakerOrg || null,
      },
    });

    // Fire-and-forget: cursor-batched email send to prevent RAM spikes
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
              const result = await sendSeminarNotificationEmail(emailList, {
                title: seminar.title,
                description: seminar.description || '',
                startsAt: seminar.startsAt,
                location: seminar.location,
                slug: seminar.slug,
              });

              if (result.success) {
                emailSuccess = true;
                totalSent += emailList.length;
                try {
                  await prisma.notification.createMany({
                    data: emailList.map(email => ({
                      type: 'seminar',
                      refId: seminar.id,
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

        console.log(`Seminar email completed. Sent: ${totalSent}, Failed batches: ${failedBatches}`);
        if (failedBatches > 0) {
          console.warn(`Warning: ${failedBatches} batches failed. Consider manual retry.`);
        }
      } catch (err) {
        console.error('Background seminar email failed with critical error:', err);
      }
    })();

    return NextResponse.json({ seminar }, { status: 201 });
  } catch (error) {
    console.error('Error creating seminar:', error);
    return NextResponse.json({ error: 'Failed to create seminar' }, { status: 500 });
  }
}
