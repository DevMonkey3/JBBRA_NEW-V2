# 📧 JBBC Email Notification System - Complete Guide

## ✅ System Status: FULLY OPERATIONAL

All email notifications are configured and working with Resend API.

**Domain:** jbbc.co.jp (Verified ✓)
**From Address:** JBBC <noreply@jbbc.co.jp>
**Email Service:** Resend API
**Database:** MongoDB (subscribers, notifications, content)

---

## 📬 Email Types & Triggers

### 1️⃣ Newsletter Emails (Blue Theme)

**When Sent:**
- **Automatically:** When admin creates a new newsletter
- **Manually:** When admin clicks "Send" button on existing newsletter

**Email Template:**
- Header: Blue (#1890ff) with "JBBC ニュースレター"
- Content: Title, Excerpt, Body, "続きを読む" button
- Subject: 【JBBC】{Title}
- From: JBBC <noreply@jbbc.co.jp>

**How to Send:**
1. Login to admin: `/admin/login`
2. Go to **Newsletters** section
3. Click **"Create Newsletter"**
4. Fill in: Title, Slug, Excerpt, Body
5. Click **"Create"** → Emails sent automatically to ALL subscribers
6. OR click **"Send"** button on existing newsletter to resend

**API Endpoints:**
- `POST /api/admin/newsletters` - Create and auto-send
- `POST /api/admin/newsletters/[id]/send` - Manual send

**Function:** `sendNewsletterEmail()` in `lib/email.ts`

---

### 2️⃣ Blog Post Emails (Red Theme)

**When Sent:**
- **Automatically:** When admin creates a new blog post

**Email Template:**
- Header: Red (#cf1322) with "📝 新しいブログ記事"
- Content: Title, Cover Image, Excerpt, Preview (300 chars), "続きを読む" button
- Subject: 【JBBC ブログ】{Title}
- From: JBBC <noreply@jbbc.co.jp>

**How to Send:**
1. Login to admin: `/admin/login`
2. Go to **Blog** section
3. Click **"Create Blog Post"**
4. Fill in: Title, Slug, Content, Cover Image, Excerpt
5. Click **"Create"** → Emails sent automatically to ALL subscribers

**API Endpoint:**
- `POST /api/admin/blog` - Create and auto-send

**Function:** `sendBlogEmail()` in `lib/email.ts`

---

### 3️⃣ Announcement Emails (Orange Theme)

**When Sent:**
- **Automatically:** When admin creates a new announcement

**Email Template:**
- Header: Orange (#fa8c16) with "📢 JBBC お知らせ"
- Content: Title, Excerpt, Body, "詳細を見る" button
- Subject: 【JBBC お知らせ】{Title}
- From: JBBC <noreply@jbbc.co.jp>

**How to Send:**
1. Login to admin: `/admin/login`
2. Go to **Announcements** section
3. Click **"Create Announcement"**
4. Fill in: Title, Slug, Excerpt, Body
5. Click **"Create"** → Emails sent automatically to ALL subscribers

**API Endpoint:**
- `POST /api/admin/announcements` - Create and auto-send

**Function:** `sendAnnouncementEmail()` in `lib/email.ts`

---

### 4️⃣ Seminar Emails (Green Theme)

**When Sent:**
- **Automatically:** When admin creates a new seminar

**Email Template:**
- Header: Green (#52c41a) with "🎓 新しいセミナーのお知らせ"
- Content: Title, Date/Time, Location, Description, "詳細を見る・申し込む" button
- Subject: 【JBBC】新しいセミナー: {Title}
- From: JBBC <noreply@jbbc.co.jp>

**How to Send:**
1. Login to admin: `/admin/login`
2. Go to **Seminars** section
3. Click **"Create Seminar"**
4. Fill in: Title, Slug, Description, Location, Start/End Time
5. Click **"Create"** → Emails sent automatically to ALL subscribers

**API Endpoint:**
- `POST /api/admin/seminars` - Create and auto-send

**Function:** `sendSeminarNotificationEmail()` in `lib/email.ts`

---

## 👥 Subscriber Management

### View All Subscribers
1. Go to admin dashboard: `/admin`
2. Scroll down to **"All Subscribers"** section
3. See complete list with:
   - Email addresses
   - Status (Active/Unsubscribed)
   - Subscription date
   - Unsubscribe date (if applicable)

### Features
- **Search:** Filter by email
- **Sort:** Click column headers
- **Export:** Download CSV of all subscribers
- **Delete:** Remove individual subscribers
- **Statistics:** Total, Active, Unsubscribed counts

### Subscription Flow
1. User enters email in footer form on any page
2. Clicks "送信" button
3. Email stored in MongoDB `Subscription` collection
4. User receives all future newsletters/blogs/seminars/announcements

---

## 🔧 Technical Details

### Email Function Parameters

All email functions accept an array of subscriber emails and content data:

```typescript
// Newsletter
sendNewsletterEmail(
  subscribers: string[],
  newsletter: {
    title: string;
    excerpt?: string;
    body: string;
    slug: string;
  }
)

// Blog
sendBlogEmail(
  subscribers: string[],
  blog: {
    title: string;
    excerpt?: string;
    content: string;
    slug: string;
    coverImage?: string;
  }
)

// Announcement
sendAnnouncementEmail(
  subscribers: string[],
  announcement: {
    title: string;
    excerpt?: string;
    body: string;
    slug: string;
  }
)

// Seminar
sendSeminarNotificationEmail(
  subscribers: string[],
  seminar: {
    title: string;
    description: string;
    startsAt: Date | string;
    location: string;
    slug: string;
  }
)
```

### Batch Processing
All emails are sent in batches of **100 recipients** to:
- Avoid rate limits
- Reduce memory usage
- Handle large subscriber lists efficiently

### Memory Optimization
- Uses cursor-based pagination (500 subscribers per batch)
- Clears memory after each batch
- Runs in background without blocking API response
- Perfect for 1GB RAM server

### Notification Tracking
Every email sent is logged in the `Notification` collection:
```typescript
{
  type: 'newsletter' | 'blog' | 'announcement' | 'seminar',
  refId: string, // ID of the content
  email: string, // Recipient email
  sentAt: DateTime // Timestamp
}
```

---

## 📊 Database Schema

### Subscription Model
```prisma
model Subscription {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  email          String    @unique
  verifiedAt     DateTime?
  unsubscribedAt DateTime?
  createdAt      DateTime  @default(now())
  notifications  Notification[]
}
```

### Notification Model
```prisma
model Notification {
  id     String   @id @default(auto()) @map("_id") @db.ObjectId
  type   String   // "newsletter" | "seminar" | "announcement" | "blog"
  refId  String   @db.ObjectId
  email  String
  sentAt DateTime @default(now())
}
```

---

## 🧪 Testing

### Test Individual Email Types

Run this command to test each email type:

```bash
# Create a test newsletter in admin UI:
1. Login: http://localhost:3000/admin/login
2. Navigate to section (Newsletter/Blog/Announcement/Seminar)
3. Create new content
4. Check your inbox: tashdidhassan27@gmail.com or s.tashdid@gradute.utm.my
```

### Verify Email Delivery

Check Resend Dashboard:
1. Go to: https://resend.com/emails
2. See all sent emails, delivery status, and logs
3. Click on email to see full details

---

## 🎨 Email Color Themes

Each email type has a distinct color for easy identification:

| Type | Color | Hex Code | Header Text |
|------|-------|----------|-------------|
| Newsletter | Blue | #1890ff | JBBC ニュースレター |
| Blog | Red | #cf1322 | 📝 新しいブログ記事 |
| Announcement | Orange | #fa8c16 | 📢 JBBC お知らせ |
| Seminar | Green | #52c41a | 🎓 新しいセミナーのお知らせ |

---

## ⚙️ Configuration

### Environment Variables (.env.local)

```bash
RESEND_API_KEY=re_GTaup5Vs_3o8LpHxWFtbV5z3jbMBhpnev
NEXTAUTH_URL="https://jbbc.co.jp"
DATABASE_URL="mongodb+srv://..."
```

### Email Settings

**From Address:** JBBC <noreply@jbbc.co.jp>
**Reply-To:** Not configured (emails are no-reply)
**Unsubscribe:** Link included in all emails → `/unsubscribe`

---

## 📈 Resend Limits

**Free Plan:**
- 100 emails per day
- 3,000 emails per month
- Verified domain required for production

**Current Usage:**
- 6 active subscribers
- Each content creation = 6 emails sent
- Safe for testing and small-scale production

---

## 🚀 Production Deployment

### Before Deploying:

1. ✅ Domain verified in Resend (jbbc.co.jp)
2. ✅ RESEND_API_KEY in production .env
3. ✅ NEXTAUTH_URL set to https://jbbc.co.jp
4. ✅ MongoDB connection configured
5. ✅ All email templates tested

### Post-Deployment:

1. Test all 4 email types in production
2. Monitor Resend dashboard for delivery rates
3. Check spam folders for first few emails
4. Verify unsubscribe link works

---

## 🛠️ Troubleshooting

### Emails Not Sending?

1. Check RESEND_API_KEY is correct
2. Verify domain is verified in Resend
3. Check Resend dashboard for errors
4. Look at server logs for error messages

### Emails Going to Spam?

1. Add SPF record to DNS (already done)
2. Add DKIM record to DNS (already done)
3. Warm up your domain (send gradually)
4. Ask recipients to whitelist noreply@jbbc.co.jp

### Subscribers Not Receiving?

1. Check subscriber is active (not unsubscribed)
2. Verify email address is correct
3. Check Notification table for send logs
4. Look for bounces in Resend dashboard

---

## 📝 Summary

✅ **4 Email Types:** Newsletter, Blog, Announcement, Seminar
✅ **Auto-Send:** All content types automatically notify subscribers
✅ **Manual Send:** Newsletters can be resent via "Send" button
✅ **Subscriber Management:** Full admin dashboard with export
✅ **Professional Templates:** Beautiful HTML emails with unique colors
✅ **Production Ready:** Verified domain, optimized for 1GB RAM server

---

**Last Updated:** January 10, 2026
**System Status:** ✅ Fully Operational
