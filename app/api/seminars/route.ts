import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const seminars = await prisma.seminar.findMany({
      where: {
        endsAt: {
          gte: now, // Show all seminars that haven't ended yet
        },
      },
      orderBy: {
        startsAt: 'asc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        startsAt: true,
        endsAt: true,
        slug: true,
        excerpt: true,
        thumbnail: true,
        speakerName: true,
        speakerTitle: true,
        speakerOrg: true,
      },
    });

    return NextResponse.json({ seminars });
  } catch (error) {
    console.error("Error fetching seminars:", error);
    return NextResponse.json(
      { error: "Failed to fetch seminars" },
      { status: 500 }
    );
  }
}
