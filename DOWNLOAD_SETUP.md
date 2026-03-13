# Download Page Setup Guide

This guide will help you set up the download page with Google Sheets integration.

## Setup Steps

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 2. Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details and click "Create"
4. Skip the optional steps and click "Done"
5. Click on the created service account
6. Go to the "Keys" tab
7. Click "Add Key" > "Create new key"
8. Select "JSON" and click "Create"
9. Download the JSON file
10. And it is done.

### 3. Share Google Spreadsheet

1. Open your Google Spreadsheet: https://docs.google.com/spreadsheets/d/1Vr53b39KDte33v6kN4UAYVnZJeAISmBHckkT9D0PzlU/edit
2. Click "Share" button
3. Add the service account email (found in the JSON file as `client_email`)
4. Give it "Editor" permissions
5. Click "Send"

### 4. Configure Environment Variables

1. Open the downloaded JSON file from step 2
2. Add these variables to your `.env.local` file:

```env
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Important:** Copy the entire private_key value from the JSON file, including the BEGIN and END lines.

### 5. Prepare Your Google Sheet

Make sure your Google Sheet has the following structure in Sheet1:

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Timestamp | Name | Email | Phone |

The headers are optional, but recommended. The API will append data starting from row 1 (or the next empty row).

### 6. Add Your PDF File

1. Create a folder: `public/downloads/`
2. Place your PDF file there as: `document.pdf`
3. Or update the file path in `app/download/success/page.tsx` (line 13)

## Testing

1. Start your development server: `npm run dev`
2. Navigate to `/download`
3. Fill out the form with:
   - Name: At least 2 characters
   - Email: Valid email format
   - Phone: 10-11 digits (Japanese format)
4. Submit the form
5. Check your Google Spreadsheet for the new entry
6. Verify the PDF downloads automatically on the success page

## Features

### Form Validation
- **Name:** Minimum 2 characters
- **Email:** Standard email format validation
- **Phone:** Japanese phone number format (10-11 digits, accepts hyphens)

### User Flow
1. User clicks "ダウンロード" button in navbar
2. User fills out the form
3. Form validates input in real-time
4. On submit, data is sent to Google Sheets
5. User is redirected to success page
6. PDF automatically downloads
7. User can re-download or return home

### Mobile Support
- Download button is available in both desktop and mobile menus
- Form is fully responsive
- Touch-friendly input fields

## Troubleshooting

### "Failed to submit form" error
- Check that your service account has editor access to the spreadsheet
- Verify environment variables are correctly set
- Ensure private key includes `\n` characters (not actual newlines)

### PDF doesn't download
- Verify the PDF file exists at `public/downloads/document.pdf`
- Check browser console for errors
- Ensure the file path in success page matches your PDF location

### Data not appearing in spreadsheet
- Verify the spreadsheet ID in `app/api/download/submit/route.ts` (line 28)
- Check the sheet name (default is "Sheet1")
- Ensure the service account email has been shared with the spreadsheet

## Files Created

- `app/download/page.tsx` - Main download form page
- `app/download/success/page.tsx` - Success page with PDF download
- `app/api/download/submit/route.ts` - API endpoint for Google Sheets
- `components/navbar/navbar.tsx` - Updated with download button

## Customization

### Change PDF Name
Edit `app/download/success/page.tsx` line 14:
```typescript
link.download = "Your-Custom-Name.pdf";
```

### Change Sheet Name
Edit `app/api/download/submit/route.ts` line 29:
```typescript
range: "YourSheetName!A:D",
```

### Modify Form Fields
Edit `app/download/page.tsx` to add/remove fields and update the validation logic.
