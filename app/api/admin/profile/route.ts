// app/api/admin/profile/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Body: { adminId: string; name: string; password?: string }
 */
export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { adminId, name, password } = await req.json();

    if (!adminId || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify the user is updating their own profile
    const admin = await prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.email !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data: any = { name };
    if (password && password.trim().length >= 8) {
      data.passwordHash = await bcrypt.hash(password, 12);
    }

    await prisma.adminUser.update({
      where: { id: adminId },
      data,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
