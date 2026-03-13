import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type, // 法人 or 個人
      inquiryType, // Array of selected inquiry types
      companyName,
      name,
      email,
      phone,
      postalCode,
      prefecture,
      address,
      businessContent,
      inquiryContent,
      agreedToTerms,
    } = body;

    // Validate required fields
    if (!type || !name || !email || !phone || !inquiryContent || !agreedToTerms) {
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

    // Your inquiry spreadsheet ID
    const spreadsheetId = "1gWhuYtbO0EAKGydQHYcu226hrb_Z2ZmmcP3Y6eG1Fzk";

    // Add timestamp
    const timestamp = new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });

    // Prepare row data based on type
    const rowData =
      type === "法人"
        ? [
            timestamp,
            type,
            Array.isArray(inquiryType) ? inquiryType.join(", ") : inquiryType || "",
            companyName || "",
            name,
            email,
            phone,
            postalCode || "",
            prefecture || "",
            address || "",
            businessContent || "",
            inquiryContent,
          ]
        : [
            timestamp,
            type,
            Array.isArray(inquiryType) ? inquiryType.join(", ") : inquiryType || "",
            "",
            name,
            email,
            phone,
            postalCode || "",
            prefecture || "",
            address || "",
            "",
            inquiryContent,
          ];

    // Append data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:L", // Adjust sheet name if different
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowData],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
    return NextResponse.json(
      { error: "送信に失敗しました" },
      { status: 500 }
    );
  }
}
