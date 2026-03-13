// app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CreateSubscriptionRequest, SubscriptionResponse, ApiError } from "@/types";

/**
 * POST - Subscribe to newsletter
 * Public endpoint - no authentication required
 */
export async function POST(req: Request): Promise<NextResponse<SubscriptionResponse | ApiError>> {
  try {
    const body: CreateSubscriptionRequest = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.subscription.findUnique({
      where: { email },
    });

    if (existing) {
      // If previously unsubscribed, resubscribe
      if (existing.unsubscribedAt) {
        const subscription = await prisma.subscription.update({
          where: { email },
          data: { unsubscribedAt: null },
        });
        return NextResponse.json({ 
          success: true,
          subscription: {
            id: subscription.id,
            email: subscription.email,
            verifiedAt: subscription.verifiedAt,
            unsubscribedAt: subscription.unsubscribedAt,
          }
        }, { status: 200 });
      }

      return NextResponse.json(
        { error: "Already subscribed" },
        { status: 409 }
      );
    }

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: { email },
    });

    return NextResponse.json({ 
      success: true,
      subscription: {
        id: subscription.id,
        email: subscription.email,
        verifiedAt: subscription.verifiedAt,
        unsubscribedAt: subscription.unsubscribedAt,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
