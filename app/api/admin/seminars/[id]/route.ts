import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    return NextResponse.json(
      { error: 'Failed to update seminar' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.seminar.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting seminar:', error);
    return NextResponse.json(
      { error: 'Failed to delete seminar' },
      { status: 500 }
    );
  }
}
