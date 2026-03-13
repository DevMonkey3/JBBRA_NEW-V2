# Seminar System - Complete Guide

## Overview
The seminar system has been completely rebuilt with the following features:
- Admin dashboard for creating/editing/deleting seminars
- Public seminar list page showing all upcoming seminars
- Individual seminar detail pages with registration forms
- Google Sheets integration for storing registrations
- News/Announcements section on the homepage

## System Architecture

### 1. Database (Prisma + MongoDB)
The Prisma schema already includes:
- `Seminar` model - stores seminar information
- `SeminarRegistration` model - stores user registrations (optional, but data goes to Google Sheets)

### 2. Admin Interface
**Location:** `/admin/seminar`

**Features:**
- Create new seminars with all details
- Edit existing seminars
- Delete seminars
- Upload hero images and thumbnails
- Add speaker information
- Set date/time and location

**Fields:**
- Title* (required)
- Location* (required)
- Start Date/Time* (required)
- End Date/Time* (required)
- Slug* (required, auto-generated from title)
- Excerpt (optional, short description for cards)
- Description (optional, full details shown on detail page)
- Hero Image URL (optional, large image on detail page)
- Thumbnail URL (optional, card image on list page)
- Speaker Name (optional)
- Speaker Title (optional)
- Speaker Organization (optional)

**Note:** The admin interface already exists and uses API endpoints at:
- `POST /api/admin/seminars` - Create seminar
- `PUT /api/admin/seminars/[id]` - Update seminar
- `DELETE /api/admin/seminars/[id]` - Delete seminar

### 3. Public Pages

#### A. Seminar List Page
**URL:** `/seminar` or `/seminar/page.tsx`

**Features:**
- Displays all upcoming seminars (starting from 1 week ago)
- Shows seminar cards with:
  - Thumbnail image or default gradient
  - Date badge
  - Title
  - Excerpt
  - Time and location
  - Speaker info (if available)
  - "詳細を見る・申し込む" button
- Responsive grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
- Loading state
- Empty state when no seminars

#### B. Seminar Detail Page
**URL:** `/seminar/[slug]`

**Features:**
- Left column: Seminar details
  - Hero image (if available)
  - Title
  - Meta info box with date, time, location, speaker
  - Full description
- Right column: Registration form (sticky)
  - Name* (required)
  - Company Name (optional)
  - Phone* (required)
  - Prefecture* (required, dropdown with all 47 prefectures)
  - Email* (required)
  - Privacy consent checkbox* (required)
- Form validation:
  - Name: min 2 characters
  - Phone: digits and hyphens only
  - Email: valid email format
  - All required fields enforced
- Success modal after submission
- Redirects to seminar list after success

### 4. Google Sheets Integration

**Spreadsheet ID:** `1YPq8wXaPwVyJfmmtQo2FTLGyV1t1YVsaYqGMOgCJjqo`

**API Endpoint:** `POST /api/seminar/register`

**Data Stored (in order):**
1. Timestamp (automatic, Japanese timezone)
2. Seminar Title
3. Seminar ID
4. Name
5. Company Name
6. Phone
7. Prefecture
8. Email
9. Consent Status (同意 or 未同意)

**Sheet Structure:**
```
Column A: Timestamp
Column B: Seminar Title
Column C: Seminar ID
Column D: Name
Column E: Company Name
Column F: Phone
Column G: Prefecture
Column H: Email
Column I: Consent
```

**Setup Required:**
1. Share the Google Spreadsheet with the service account email from `.env.local`:
   - Email: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
2. Give "Editor" permissions
3. Ensure Sheet1 exists in the spreadsheet (or update the range in the API)

### 5. News Section on Homepage

**Location:** Homepage after hero banner/slider

**Component:** `components/homeComponents/NewsSection.tsx`

**Features:**
- Fetches latest 3 announcements from database
- Displays in card format with:
  - Date
  - Title
  - Excerpt
- "すべてのお知らせを見る" button → redirects to `/notices`
- Only shows if there are announcements
- Gradient background for visual appeal

**API:** `GET /api/announcements?limit=3`

## API Endpoints

### Public APIs
```
GET  /api/seminars           - List all upcoming seminars
GET  /api/seminars/[slug]    - Get seminar by slug
POST /api/seminar/register   - Register for a seminar
GET  /api/announcements      - List announcements (supports ?limit parameter)
```

### Admin APIs
```
POST   /api/admin/seminars      - Create seminar
PUT    /api/admin/seminars/[id] - Update seminar
DELETE /api/admin/seminars/[id] - Delete seminar
```

## User Flow

### For Admins:
1. Login to admin dashboard
2. Navigate to `/admin/seminar`
3. Fill out the seminar form with all details
4. Upload images (hero and thumbnail) to `/public/images/seminars/` or use external URLs
5. Click "Create seminar"
6. Seminar appears in the list below
7. Can edit by clicking "Edit" next to any seminar
8. Can delete by clicking "Delete" button in edit mode

### For Users:
1. Visit homepage - see latest news/announcements
2. Click "セミナー・イベント" in navbar or navigate to `/seminar`
3. Browse available seminars
4. Click "詳細を見る・申し込む" on interested seminar
5. Read seminar details on left side
6. Fill out registration form on right side
7. Check privacy consent checkbox
8. Click "申し込む" to submit
9. See success modal
10. Registration data is stored in Google Spreadsheet
11. Admin can access spreadsheet to see all registrations and contact attendees

## File Structure

```
app/
├── seminar/
│   ├── page.tsx                    # Seminar list page
│   └── [slug]/
│       └── page.tsx                # Individual seminar detail + registration form
├── api/
│   ├── seminars/
│   │   ├── route.ts                # GET list of seminars
│   │   └── [slug]/
│   │       └── route.ts            # GET seminar by slug
│   ├── seminar/
│   │   └── register/
│   │       └── route.ts            # POST registration to Google Sheets
│   └── announcements/
│       └── route.ts                # GET announcements
├── admin/
│   └── seminar/
│       ├── page.tsx                # Admin seminar management
│       └── seminar-form.tsx        # Seminar create/edit form
└── page.tsx                        # Homepage (includes NewsSection)

components/
└── homeComponents/
    └── NewsSection.tsx             # News section component

prisma/
└── schema.prisma                   # Database schema (Seminar, SeminarRegistration models)
```

## Environment Variables

Required in `.env.local`:
```env
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Database
DATABASE_URL="mongodb+srv://..."
```

## Testing Checklist

### Admin Side:
- [ ] Can create new seminar
- [ ] Can edit existing seminar
- [ ] Can delete seminar
- [ ] Slug auto-generates from title
- [ ] Images display correctly
- [ ] Speaker info saves properly
- [ ] Date/time validation works

### Public Side:
- [ ] Seminar list page loads
- [ ] All seminars display correctly
- [ ] Card images show (or default gradient)
- [ ] Clicking seminar goes to detail page
- [ ] Detail page loads with correct data
- [ ] Registration form validates all fields
- [ ] Form submission works
- [ ] Data appears in Google Spreadsheet
- [ ] Success modal shows
- [ ] Redirects to list after success
- [ ] News section shows on homepage
- [ ] News section links work

### Integration:
- [ ] Google Sheets receives data correctly
- [ ] All 9 columns populated
- [ ] Timestamp is in Japanese format
- [ ] Privacy consent shows as "同意"

## Customization

### To change the spreadsheet:
1. Update the spreadsheet ID in `app/api/seminar/register/route.ts` line 59
2. Ensure the sheet name matches (default: "Sheet1")

### To modify form fields:
1. Edit the form in `app/seminar/[slug]/page.tsx`
2. Update the API payload in the same file
3. Update the Google Sheets row data in `app/api/seminar/register/route.ts`
4. Adjust columns in spreadsheet

### To change news limit:
Edit `components/homeComponents/NewsSection.tsx` line 21:
```typescript
const res = await fetch('/api/announcements?limit=5'); // Change from 3 to 5
```

## Image Upload

For now, images are referenced by URL. To add images:

**Option 1: Use public folder**
1. Create directory: `public/images/seminars/`
2. Upload images there
3. Reference as: `/images/seminars/your-image.jpg`

**Option 2: Use external URLs**
1. Upload to image hosting service
2. Use full URL: `https://yourdomain.com/images/seminar.jpg`

**Future Enhancement:**
Consider adding file upload functionality to admin panel using:
- Next.js API route for file upload
- Cloud storage (AWS S3, Cloudinary, etc.)
- Or store in `public/uploads/` directory

## Troubleshooting

### Seminars not showing:
- Check if startsAt date is within range (not older than 7 days)
- Verify database connection
- Check console for API errors

### Registration not saving to spreadsheet:
- Verify Google service account has editor access
- Check GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in .env.local
- Verify spreadsheet ID
- Check sheet name (default: "Sheet1")

### News section not showing:
- Ensure there are announcements in database
- Create announcements via `/admin/announcements`
- Check API endpoint `/api/announcements`

## Next Steps

1. Test the complete flow
2. Create a few test seminars in admin
3. Register for a seminar
4. Verify data in Google Spreadsheet
5. Create some announcements to test news section
6. Customize styling if needed
7. Add actual seminar images

## Success Criteria

✅ Admin can create/edit/delete seminars
✅ Public can browse seminars
✅ Users can register for seminars
✅ Form validates correctly
✅ Data stores in Google Spreadsheet
✅ Success modal appears
✅ News section shows on homepage
✅ All links work correctly
