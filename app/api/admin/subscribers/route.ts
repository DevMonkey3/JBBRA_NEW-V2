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
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  error: string;
}

/**
 * GET - List all subscribers with statistics and pagination
 * Query params:
 *   - page: Page number (default: 1)
 *   - limit: Subscribers per page (default: 50, max: 200)
 */
export async function GET(request: Request): Promise<NextResponse<GetSubscribersResponse | ApiError>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const skip = (page - 1) * limit;

    // FIX: Run all three queries in parallel instead of sequentially
    const [subscribers, total, active] = await Promise.all([
      prisma.subscription.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.subscription.count(),
      prisma.subscription.count({
        where: { unsubscribedAt: null },
      }),
    ]);

    const unsubscribed = total - active;
    const hasMore = skip + subscribers.length < total;

    return NextResponse.json({
      subscribers,
      total,
      active,
      unsubscribed,
      page,
      limit,
      hasMore,
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

    // FIX: Check subscriber exists before deleting (return 404 if not found)
    const existing = await prisma.subscription.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    await prisma.subscription.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE subscriber error:", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
