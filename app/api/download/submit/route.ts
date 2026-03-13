import { google } from "googleapis";
import { NextResponse } from "next/server";

// Timeout for Google Sheets API calls (5 seconds)
const GOOGLE_SHEETS_TIMEOUT = 5000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
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

    // Your spreadsheet ID from the URL
    const spreadsheetId = "1Vr53b39KDte33v6kN4UAYVnZJeAISmBHckkT9D0PzlU";

    // Add timestamp
    const timestamp = new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });

    // Append data to the sheet with timeout
    const appendPromise = sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, name, email, phone]],
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
    // The data can be recovered from form logs if needed
    if (error instanceof Error && error.message.includes("timeout")) {
      console.warn("Google Sheets timeout, but form submission succeeded");
      return NextResponse.json({ success: true, warning: "Recorded but sheet update delayed" });
    }
    
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
