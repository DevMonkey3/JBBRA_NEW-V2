// app/api/contact/route.ts
// DELETE THIS FILE if you have no plans to use it.
// It currently does nothing useful and exposes a write endpoint on your server.
//
// When you're ready to wire it up, implement one of:
//   A) Save to DB:  prisma.inquiry.create(...)
//   B) Send email:  resend.emails.send(...)
//   C) Write to Google Sheets (see /api/form-submit for the pattern)

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 }
  );
}
