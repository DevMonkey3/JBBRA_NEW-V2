/**
 * SAFE DEBUG ENDPOINT
 *
 * Protected by DEBUG_SECRET environment variable.
 * Set DEBUG_SECRET=some-long-random-string in your DigitalOcean env vars.
 * Access: GET /api/debug?secret=your-secret-here
 *
 * Once your production issues are resolved, delete this file entirely.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  // Gate behind a secret — never expose this openly
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (!process.env.DEBUG_SECRET || secret !== process.env.DEBUG_SECRET) {
    // Return a 404 instead of 401 so it doesn't advertise the endpoint exists
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    env: {
      DATABASE_URL:     process.env.DATABASE_URL     ? '✅ Set' : '❌ Not set',
      NEXTAUTH_SECRET:  process.env.NEXTAUTH_SECRET  ? '✅ Set' : '❌ Not set',
      NEXTAUTH_URL:     process.env.NEXTAUTH_URL     ? '✅ Set' : '❌ Not set',
      RESEND_API_KEY:   process.env.RESEND_API_KEY   ? '✅ Set' : '❌ Not set',
      GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Set' : '❌ Not set',
    },
    database: { connected: false, adminUserCount: 0, error: null as string | null },
  };

  try {
    const adminCount = await prisma.adminUser.count();
    diagnostics.database = { connected: true, adminUserCount: adminCount, error: null };
  } catch (err: unknown) {
    diagnostics.database = {
      connected: false,
      adminUserCount: 0,
      // Safe: only expose message, not stack or query details
      error: err instanceof Error ? err.message : 'Unknown DB error',
    };
  }

  return NextResponse.json(diagnostics);
}
