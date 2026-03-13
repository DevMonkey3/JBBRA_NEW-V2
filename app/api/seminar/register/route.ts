import { google } from "googleapis";
import { NextResponse } from "next/server";

// Timeout for Google Sheets API calls (5 seconds)
const GOOGLE_SHEETS_TIMEOUT = 5000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      seminarId,
      seminarTitle,
      name,
      companyName,
      phone,
      prefecture,
      email,
      consentPI,
    } = body;

    // Validate required fields
    if (!seminarId || !name || !phone || !prefecture || !email || !consentPI) {
      return NextResponse.json(
        { error: "必須項目を入力してください" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    // Validate phone format (Japanese phone numbers)
    const phoneRegex = /^[\d-]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "有効な電話番号を入力してください" },
        { status: 400 }
      );
    }

    // Set up Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Seminar registration spreadsheet ID
    const spreadsheetId = "1YPq8wXaPwVyJfmmtQo2FTLGyV1t1YVsaYqGMOgCJjqo";

    // Add timestamp
    const timestamp = new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });

    // Prepare row data
    const rowData = [
      timestamp,
      seminarTitle || "",
      seminarId,
      name,
      companyName || "",
      phone,
      prefecture,
      email,
      consentPI ? "同意" : "未同意",
    ];

    // Append data to the sheet with timeout
    const appendPromise = sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:I",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowData],
      },
    });

    // Race between the API call and timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Google Sheets API timeout")), GOOGLE_SHEETS_TIMEOUT)
    );

    await Promise.race([appendPromise, timeoutPromise]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
    
    // Return success even if Sheets fails - don't block user experience
    if (error instanceof Error && error.message.includes("timeout")) {
      console.warn("Google Sheets timeout, but seminar registration succeeded");
      return NextResponse.json({ success: true, warning: "Recorded but sheet update delayed" });
    }
    
    return NextResponse.json(
      { error: "送信に失敗しました" },
      { status: 500 }
    );
  }
}
