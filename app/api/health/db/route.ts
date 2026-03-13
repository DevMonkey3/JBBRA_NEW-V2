export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const count = await prisma.subscription.count();
  return NextResponse.json({ ok: true, subscriptions: count });
}
