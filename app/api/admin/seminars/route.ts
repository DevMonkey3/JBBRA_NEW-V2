import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSeminarNotificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
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

    // Send emails in background using cursor-based pagination to reduce RAM usage
    // Don't wait for completion - process asynchronously with retry logic
    const sendEmailsInBackground = async () => {
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
            hasMore = false;
            break;
          }

          const emailList = subscribers.map(s => s.email);

          // Retry logic for email sending
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

                // Log notifications for this batch
                await prisma.notification.createMany({
                  data: emailList.map(email => ({
                    type: 'seminar',
                    refId: seminar.id,
                    email,
                  })),
                }).catch(err => {
                  console.error('Failed to log notifications:', err);
                  // Don't fail the batch if logging fails
                });
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

        const logMessage = `Seminar email completed. Sent: ${totalSent}, Failed batches: ${failedBatches}`;
        console.log(logMessage);
        
        // Log final status if there were failures
        if (failedBatches > 0) {
          console.warn(`Warning: ${failedBatches} batches failed to send. Consider manual retry.`);
        }
      } catch (err) {
        console.error('Background email sending failed with critical error:', err);
      }
    };

    // Start background process (fire and forget)
    sendEmailsInBackground().catch(err => console.error('Background email error:', err));

    return NextResponse.json({ seminar }, { status: 201 });
  } catch (error) {
    console.error('Error creating seminar:', error);
    return NextResponse.json(
      { error: 'Failed to create seminar' },
      { status: 500 }
    );
  }
}
