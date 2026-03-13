/**
 * Simple health check endpoint - no database required
 * Use this to verify if the Next.js server is running
 */
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: "Server is running"
  });
}
