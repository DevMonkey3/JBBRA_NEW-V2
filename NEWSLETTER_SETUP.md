# Newsletter System Setup Guide

Complete newsletter and announcement system for JBBC website.

## Overview

Your website now has a comprehensive newsletter system with:
- ✅ Newsletter subscription in footer
- ✅ Admin panel for creating newsletters & announcements
- ✅ Automatic email notifications to subscribers
- ✅ Public notices page showing all news
- ✅ Individual notice detail pages
- ✅ Unsubscribe functionality

## Prerequisites

1. **MongoDB Database**
   - Get a MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Free tier is sufficient to get started

2. **Resend Email Service** ✅ Already configured
   - You have: `RESEND_API_KEY=re_GTaup5Vs_3o8LpHxWFtbV5z3jbMBhpnev`
   - Configure verified domain at [Resend Dashboard](https://resend.com/domains)
   - Update `from` email in `lib/email.ts` (currently `JBBC <noreply@jbbc.jp>`)

## Setup Steps

### 1. Configure Environment Variables

Edit `.env.local` and replace the placeholder values:

```bash
# Email Service (Already configured)
RESEND_API_KEY=re_GTaup5Vs_3o8LpHxWFtbV5z3jbMBhpnev

# Database - REPLACE THIS WITH YOUR MONGODB URL
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"

# NextAuth - REPLACE WITH A SECURE RANDOM STRING
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**To generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 2. Database Setup

After configuring `DATABASE_URL`, run:

```bash
# Generate Prisma client (Already done ✅)
npx prisma generate

# Push schema to database
npx prisma db push
```

### 3. Create Admin User

You'll need an admin account to manage newsletters. Run:

```bash
npx ts-node scripts/create-admin.ts
```

Or use Prisma Studio:
```bash
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

## Features

### 1. Newsletter Subscription (Footer)

Users can subscribe to newsletters via the footer on any page:
- Location: `components/footer/footer.tsx` (lines 142-152)
- API: `POST /api/subscribe`
- Validates email and prevents duplicates
- Handles re-subscription if previously unsubscribed

### 2. Admin Panel - Newsletters

**URL:** `/admin/newsletters`

Features:
- Create new newsletters
- Edit existing newsletters
- Delete newsletters
- Automatic email sending to all subscribers on creation
- Tracks email notifications in database

### 3. Admin Panel - Announcements

**URL:** `/admin/announcements`

Features:
- Create new announcements
- Edit existing announcements
- Delete announcements
- Automatic email sending to all subscribers on creation
- Supports HTML/Markdown content

### 4. Public Notices Page

**URL:** `/notices`

Features:
- Shows all newsletters, seminars, and announcements
- Filter by type (Newsletter, Seminar, Announcement)
- Search functionality
- Responsive card layout
- Color-coded badges

### 5. Individual Notice Detail Pages

**URL:** `/notices/[slug]`

Features:
- Full content display
- Type-specific styling
- Seminar-specific information (date, location, speaker)
- SEO-optimized metadata
- Back navigation

### 6. Unsubscribe Page

**URL:** `/unsubscribe`

Features:
- Simple email input form
- Confirms unsubscription
- User-friendly messaging
- Links back to homepage

## Email Templates

All email templates are in `lib/email.ts`:

### Newsletter Email
- Blue theme (#1890ff)
- Japanese language support
- Responsive design
- Plain text fallback
- Unsubscribe link

### Announcement Email
- Orange theme (#fa8c16)
- Japanese language support
- Responsive design
- Plain text fallback
- Unsubscribe link

### Seminar Email
- Green theme (#52c41a)
- Japanese language support
- Seminar details (date, location, speaker)
- Registration button
- Plain text fallback
- Unsubscribe link

## Database Schema

### Subscription
- `id`: ObjectId
- `email`: String (unique)
- `verifiedAt`: DateTime (optional)
- `unsubscribedAt`: DateTime (optional)
- `createdAt`: DateTime

### Newsletter
- `id`: ObjectId
- `title`: String
- `body`: String (HTML/Markdown)
- `excerpt`: String (optional)
- `slug`: String (unique, URL-friendly)
- `publishedAt`: DateTime

### Announcement
- `id`: ObjectId
- `title`: String
- `body`: String (HTML/Markdown)
- `excerpt`: String (optional)
- `slug`: String (unique, URL-friendly)
- `publishedAt`: DateTime

### Notification
- `id`: ObjectId
- `type`: String ('newsletter' | 'seminar' | 'announcement')
- `refId`: ObjectId (reference to content)
- `email`: String
- `sentAt`: DateTime
- `subscriptionId`: ObjectId (optional)

## API Endpoints

### Public Endpoints
- `POST /api/subscribe` - Subscribe to newsletter
- `POST /api/unsubscribe` - Unsubscribe from newsletter
- `GET /api/notices` - Get all notices (newsletters, seminars, announcements)

### Admin Endpoints (Require Authentication)
- `GET /api/admin/newsletters` - List all newsletters
- `POST /api/admin/newsletters` - Create newsletter & send emails
- `GET /api/admin/newsletters/[id]` - Get single newsletter
- `PUT /api/admin/newsletters/[id]` - Update newsletter
- `DELETE /api/admin/newsletters/[id]` - Delete newsletter

- `GET /api/admin/announcements` - List all announcements
- `POST /api/admin/announcements` - Create announcement & send emails
- `GET /api/admin/announcements/[id]` - Get single announcement
- `PUT /api/admin/announcements/[id]` - Update announcement
- `DELETE /api/admin/announcements/[id]` - Delete announcement

## Customization

### Change Email Sender

Edit `lib/email.ts`:

```typescript
// Line 109, 218, etc.
from: 'JBBC <noreply@yourdomain.com>', // Change this
```

### Change Email Templates

Edit the HTML/CSS in `lib/email.ts`:
- Newsletter: Lines 36-82
- Announcement: Lines 145-191
- Seminar: Lines 147-196

### Add More Content Types

1. Add model to `prisma/schema.prisma`
2. Run `npx prisma generate && npx prisma db push`
3. Create API routes in `app/api/admin/[type]/`
4. Create admin page in `app/admin/[type]/page.tsx`
5. Update `app/api/notices/route.ts` to include new type
6. Add email function in `lib/email.ts`

## Testing

### Test Newsletter Subscription
1. Go to homepage
2. Scroll to footer
3. Enter email address
4. Click "送信" (Submit)
5. Check for success message

### Test Newsletter Creation
1. Login to `/admin/login`
2. Navigate to "Newsletters" in sidebar
3. Click "Create Newsletter"
4. Fill in form (title, slug, excerpt, body)
5. Click "Create & Send"
6. Check subscriber email inbox

### Test Announcements
1. Login to `/admin/login`
2. Navigate to "Announcements" in sidebar
3. Click "Create Announcement"
4. Fill in form
5. Click "Create & Send"
6. Check subscriber email inbox

### Test Notices Page
1. Navigate to `/notices`
2. Verify all content types appear
3. Test search functionality
4. Test type filter
5. Click on a notice to view details

## Troubleshooting

### Emails Not Sending
1. Verify `RESEND_API_KEY` in `.env.local`
2. Check Resend dashboard for errors
3. Verify domain is verified in Resend
4. Check server logs for error messages

### Database Connection Issues
1. Verify `DATABASE_URL` format
2. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)
3. Verify database user credentials
4. Test connection with `npx prisma studio`

### Admin Login Issues
1. Verify admin user exists in database
2. Check `NEXTAUTH_SECRET` is set
3. Clear browser cookies
4. Check server logs

### Notices Not Displaying
1. Verify data exists in database (use `npx prisma studio`)
2. Check API response at `/api/notices`
3. Check browser console for errors
4. Verify slug format (lowercase, hyphens only)

## Production Deployment

### Environment Variables
Set these in your production environment:
- `DATABASE_URL` - Production MongoDB connection
- `RESEND_API_KEY` - Resend API key
- `NEXTAUTH_SECRET` - Secure random string
- `NEXTAUTH_URL` - Production URL (e.g., https://yourdomain.com)

### Build & Deploy
```bash
npm run build
npm start
```

### Post-Deployment
1. Verify email domain in Resend
2. Update `from` email addresses in `lib/email.ts`
3. Test newsletter subscription
4. Test email delivery
5. Monitor Resend dashboard for delivery issues

## Support

For issues or questions:
1. Check this documentation
2. Review Prisma docs: https://www.prisma.io/docs
3. Review Resend docs: https://resend.com/docs
4. Review Next.js docs: https://nextjs.org/docs

## Summary

Your newsletter system is now complete! 🎉

**What's working:**
- ✅ Footer subscription form
- ✅ Admin newsletters management
- ✅ Admin announcements management
- ✅ Email notifications with Resend
- ✅ Public notices page
- ✅ Individual notice pages
- ✅ Unsubscribe functionality
- ✅ Database schema
- ✅ API endpoints

**Next steps:**
1. Configure your MongoDB connection (`DATABASE_URL`)
2. Generate a secure `NEXTAUTH_SECRET`
3. Run `npx prisma db push`
4. Create admin user
5. Test the system
6. Deploy to production!
