/**
 * DEBUG API ROUTE
 * WHY: This helps diagnose production environment issues
 *
 * Access at: https://jbbc.co.jp/api/debug
 *
 * This will show you:
 * - If DATABASE_URL is set
 * - If NEXTAUTH_SECRET is set
 * - If NEXTAUTH_URL is correct
 * - If database connection works
 * - If admin user exists
 *
 * DELETE THIS FILE AFTER DEBUGGING FOR SECURITY!
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,

      // Check environment variables (without revealing full values)
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Not Set',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not Set',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ Not Set',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'Using default: admin@jbbc.jp',
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '✅ Set' : 'Using default: ChangeMe123!',
      },

      // Test database connection
      database: {
        connected: false,
        adminUserExists: false,
        adminUserCount: 0,
        error: null
      }
    };

    // Try to connect to database
    try {
      const adminCount = await prisma.adminUser.count();
      diagnostics.database.connected = true;
      diagnostics.database.adminUserCount = adminCount;
      diagnostics.database.adminUserExists = adminCount > 0;

      // Get admin users (without passwords)
      const admins = await prisma.adminUser.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      });
      diagnostics.database.admins = admins;

    } catch (dbError: any) {
      diagnostics.database.error = dbError.message;
    }

    return NextResponse.json(diagnostics, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Diagnostic failed',
      message: error.message
    }, { status: 500 });
  }
}
