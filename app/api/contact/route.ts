// app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ ok: true, message: "contact GET ok" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // handle body as needed...
    return NextResponse.json({ ok: true, data: body });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
}
