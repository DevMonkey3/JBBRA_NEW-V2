import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const seminar = await prisma.seminar.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        startsAt: true,
        endsAt: true,
        slug: true,
        excerpt: true,
        heroImage: true,
        thumbnail: true,
        speakerName: true,
        speakerTitle: true,
        speakerOrg: true,
      },
    });

    if (!seminar) {
      return NextResponse.json(
        { error: "Seminar not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ seminar });
  } catch (error) {
    console.error("Error fetching seminar:", error);
    return NextResponse.json(
      { error: "Failed to fetch seminar" },
      { status: 500 }
    );
  }
}
