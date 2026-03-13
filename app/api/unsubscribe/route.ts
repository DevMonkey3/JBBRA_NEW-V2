// app/api/unsubscribe/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UnsubscribeRequest, ApiError } from "@/types";

/**
 * POST - Unsubscribe from newsletter
 * Public endpoint - no authentication required
 */
export async function POST(req: Request): Promise<NextResponse<{ success: boolean } | ApiError>> {
  try {
    const body: UnsubscribeRequest = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { email },
    });

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    if (subscription.unsubscribedAt) {
      return NextResponse.json({ error: "Already unsubscribed" }, { status: 409 });
    }

    await prisma.subscription.update({
      where: { email },
      data: { unsubscribedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}
