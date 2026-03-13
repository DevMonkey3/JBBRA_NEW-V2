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
 * GET - List all newsletters
 */
export async function GET(): Promise<NextResponse<GetNewslettersResponse | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newsletters = await prisma.newsletter.findMany({
      orderBy: { publishedAt: 'desc' },
    });

    return NextResponse.json({ newsletters });
  } catch (error) {
    console.error("GET newsletters error:", error);
    return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 });
  }
}

/**
 * POST - Create new newsletter and send to subscribers
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

    // Check if slug already exists
    const existing = await prisma.newsletter.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Newsletter with this slug already exists" },
        { status: 409 }
      );
    }

    // Create newsletter
    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        body: content,
        excerpt,
        slug,
      },
    });

    // Get all active subscribers
    const subscribers = await prisma.subscription.findMany({
      where: {
        unsubscribedAt: null,
        verifiedAt: null, // Include all (or add verification logic if needed)
      },
      select: { email: true },
    });

    // Send emails in background (don't wait for completion)
    if (subscribers.length > 0) {
      const emailList = subscribers.map(s => s.email);

      // Send emails asynchronously
      sendNewsletterEmail(emailList, {
        title: newsletter.title,
        excerpt: newsletter.excerpt || undefined,
        body: newsletter.body,
        slug: newsletter.slug,
      }).then(result => {
        if (result.success) {
          // Log notifications
          prisma.notification.createMany({
            data: emailList.map(email => ({
              type: 'newsletter',
              refId: newsletter.id,
              email,
            })),
          }).catch(err => console.error('Failed to log notifications:', err));
        }
      }).catch(err => console.error('Failed to send emails:', err));
    }

    return NextResponse.json({ newsletter }, { status: 201 });
  } catch (error) {
    console.error("POST newsletter error:", error);
    return NextResponse.json({ error: "Failed to create newsletter" }, { status: 500 });
  }
}
