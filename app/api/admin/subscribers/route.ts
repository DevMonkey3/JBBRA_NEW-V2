// app/api/admin/subscribers/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface Subscriber {
  id: string;
  email: string;
  verifiedAt: Date | null;
  unsubscribedAt: Date | null;
  createdAt: Date;
}

export interface GetSubscribersResponse {
  subscribers: Subscriber[];
  total: number;
  active: number;
  unsubscribed: number;
}

export interface ApiError {
  error: string;
}

/**
 * GET - List all subscribers with statistics
 */
export async function GET(): Promise<NextResponse<GetSubscribersResponse | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all subscribers
    const subscribers = await prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Calculate statistics
    const total = subscribers.length;
    const active = subscribers.filter(s => !s.unsubscribedAt).length;
    const unsubscribed = subscribers.filter(s => s.unsubscribedAt).length;

    return NextResponse.json({
      subscribers,
      total,
      active,
      unsubscribed
    });
  } catch (error) {
    console.error("GET subscribers error:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

/**
 * DELETE - Remove a subscriber
 */
export async function DELETE(req: Request): Promise<NextResponse<{ success: boolean } | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID is required" }, { status: 400 });
    }

    // Delete the subscriber
    await prisma.subscription.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE subscriber error:", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
