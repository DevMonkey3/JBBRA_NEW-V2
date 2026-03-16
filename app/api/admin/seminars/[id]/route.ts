import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // FIX: Added auth check - was missing (security vulnerability)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      location,
      startsAt,
      endsAt,
      registrationUrl,
      slug,
      excerpt,
      heroImage,
      thumbnail,
      speakerName,
      speakerTitle,
      speakerOrg,
    } = body;

    // FIX: Added required field validation
    if (!title || !location || !startsAt || !endsAt || !slug) {
      return NextResponse.json(
        { error: "Title, location, startsAt, endsAt, and slug are required" },
        { status: 400 }
      );
    }

    // FIX: Check seminar exists
    const existing = await prisma.seminar.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Seminar not found" }, { status: 404 });
    }

    // FIX: If slug is changing, check it's not taken by another seminar
    if (slug !== existing.slug) {
      const slugConflict = await prisma.seminar.findUnique({ where: { slug } });
      if (slugConflict) {
        return NextResponse.json(
          { error: "Seminar with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const seminar = await prisma.seminar.update({
      where: { id },
      data: {
        title,
        description: description || null,
        location,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        registrationUrl: registrationUrl || null,
        slug,
        excerpt: excerpt || null,
        heroImage: heroImage || null,
        thumbnail: thumbnail || null,
        speakerName: speakerName || null,
        speakerTitle: speakerTitle || null,
        speakerOrg: speakerOrg || null,
      },
    });

    return NextResponse.json({ seminar });
  } catch (error) {
    console.error('Error updating seminar:', error);
    return NextResponse.json({ error: 'Failed to update seminar' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // FIX: Added auth check - was missing (security vulnerability)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // FIX: Check seminar exists
    const existing = await prisma.seminar.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Seminar not found" }, { status: 404 });
    }

    // FIX: Delete related notifications first
    await prisma.notification.deleteMany({
      where: { refId: id, type: 'seminar' },
    });

    await prisma.seminar.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting seminar:', error);
    return NextResponse.json({ error: 'Failed to delete seminar' }, { status: 500 });
  }
}
