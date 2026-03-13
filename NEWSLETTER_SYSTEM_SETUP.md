# Newsletter System - Complete Setup Guide

## 📧 Overview

The JBBC website has a fully automated newsletter system that sends email notifications to subscribers whenever new content is published.

## ✅ What's Already Implemented

### 1. **Email Templates** (`lib/email.ts`)
Three beautifully designed email templates:
- **Newsletter/Blog Posts**: Blue theme with JBBC branding
- **Announcements**: Orange theme with announcement styling
- **Seminars**: Green theme with event details and date/time

### 2. **Subscription System**
- ✅ Public subscription endpoint: `POST /api/subscribe`
- ✅ Subscription storage in MongoDB via Prisma
- ✅ Unsubscribe functionality at `/unsubscribe`
- ✅ Re-subscription support for previously unsubscribed users
- ✅ Duplicate prevention

### 3. **Auto-Email on Content Creation**
When admin creates new content, emails are automatically sent to all subscribers:

#### ✅ Blog Posts (`/api/admin/blog`)
- Creates blog post
- Fetches all active subscribers
- Sends newsletter email to all subscribers
- Logs notifications in database

#### ✅ Announcements (`/api/admin/announcements`)
- Creates announcement
- Fetches all active subscribers
- Sends announcement email to all subscribers
- Logs notifications in database

#### ✅ Seminars (`/api/admin/seminars`)
- Creates seminar
- Fetches all active subscribers
- Sends seminar notification email to all subscribers
- Logs notifications in database

### 4. **Email Features**
- ✅ Batch sending (100 recipients per batch to avoid rate limits)
- ✅ Both HTML and plain text versions
- ✅ Unsubscribe link in every email
- ✅ Japanese language support
- ✅ Responsive email design
- ✅ JBBC branding

## 🔧 Setup Requirements

### Step 1: Get Resend API Key

1. **Sign up for Resend**
   - Go to https://resend.com/
   - Create a free account
   - Free tier includes: 3,000 emails/month, 100 emails/day

2. **Verify Your Domain (IMPORTANT)**
   - Add your domain to Resend
   - Add DNS records (SPF, DKIM, DMARC)
   - Wait for verification (usually 15-30 minutes)
   - **Example domain**: `jbbc.jp` or `mail.jbbc.jp`

3. **Get API Key**
   - Go to API Keys section
   - Create new API key
   - Copy the key (starts with `re_`)

### Step 2: Configure Environment Variables

Add to your `.env.local` file:

```env
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here

# Base URL (for email links)
NEXTAUTH_URL=https://your-production-domain.com
# OR for development:
# NEXTAUTH_URL=http://localhost:3000
```

### Step 3: Update Sender Email

In `lib/email.ts`, update the `from` email address (lines 109, 217, 317):

```typescript
from: 'JBBC <noreply@jbbc.jp>', // Change to your verified domain
```

**MUST match your verified domain in Resend!**

### Step 4: Test the System

#### Test Subscription
```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

#### Test Creating Content
1. Log into admin dashboard: `/admin`
2. Create a new blog post, announcement, or seminar
3. Check your email inbox
4. All subscribers should receive an email within seconds

## 📊 Database Schema

The system uses these Prisma models:

```prisma
model Subscription {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  email          String    @unique
  subscribedAt   DateTime  @default(now())
  unsubscribedAt DateTime?
}

model Notification {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  type      String   // "blog", "announcement", "seminar"
  refId     String   // ID of the blog/announcement/seminar
  email     String   // Recipient email
  sentAt    DateTime @default(now())
}
```

## 🔍 How It Works

### When Admin Creates Content:

1. **Admin creates blog/announcement/seminar** via admin dashboard
2. **API endpoint saves to database**
3. **Fetch all active subscribers** (where `unsubscribedAt` is null)
4. **Send emails asynchronously** (doesn't block the API response)
5. **Log notifications** to track who received what

### When User Subscribes:

1. **User enters email** in footer newsletter form
2. **POST to `/api/subscribe`**
3. **Email saved to database**
4. **Success message displayed**
5. **User automatically receives all future content emails**

### When User Unsubscribes:

1. **User clicks unsubscribe link** in any email
2. **Lands on `/unsubscribe` page**
3. **Enters email and confirms**
4. **`unsubscribedAt` timestamp set** in database
5. **No longer receives emails** (but can re-subscribe anytime)

## 🎨 Email Examples

### Blog Post Email
- Subject: `【JBBC】[Blog Title]`
- Blue header with "JBBC ニュースレター"
- Blog title, excerpt, and content
- "続きを読む" button → links to full blog post
- Unsubscribe link in footer

### Announcement Email
- Subject: `【JBBC お知らせ】[Announcement Title]`
- Orange header with "📢 JBBC お知らせ"
- Title, excerpt, and body
- "詳細を見る" button → links to announcement
- Unsubscribe link in footer

### Seminar Email
- Subject: `【JBBC】新しいセミナー: [Seminar Title]`
- Green header with "🎓 新しいセミナーのお知らせ"
- Info box with date/time and location
- Description
- "詳細を見る・申し込む" button → links to seminar page
- Unsubscribe link in footer

## 📈 Monitoring & Analytics

### Check Sent Emails
View in Resend dashboard:
- Email delivery status
- Open rates
- Click rates
- Bounce rates
- Spam complaints

### Check Subscribers
Query database:
```typescript
// Get total active subscribers
const count = await prisma.subscription.count({
  where: { unsubscribedAt: null }
});

// Get all subscribers
const subscribers = await prisma.subscription.findMany({
  where: { unsubscribedAt: null }
});
```

### Check Notifications Log
```typescript
// Get all notifications for a specific content
const notifications = await prisma.notification.findMany({
  where: { refId: "content-id-here" }
});
```

## ⚠️ Important Notes

1. **Rate Limits**: Resend free tier = 100 emails/day
   - If you have >100 subscribers, upgrade plan
   - Batch sending already implemented (100 per batch)

2. **Domain Verification**: CRITICAL!
   - Emails will NOT send without verified domain
   - Takes 15-30 minutes for DNS propagation
   - Test with your actual domain, not localhost

3. **Email Best Practices**:
   - Always include unsubscribe link (legal requirement)
   - Don't send too frequently (spam risk)
   - Monitor bounce rates and spam complaints
   - Use clear, descriptive subject lines

4. **Testing**:
   - Test with real email addresses
   - Check spam folder if emails don't arrive
   - Verify all links work correctly
   - Test on mobile and desktop email clients

## 🚀 Production Checklist

Before going live:

- [ ] Resend account created
- [ ] Domain verified in Resend
- [ ] DNS records added and verified
- [ ] `RESEND_API_KEY` in production `.env`
- [ ] `NEXTAUTH_URL` set to production domain
- [ ] Sender email updated to verified domain
- [ ] Test email sent successfully
- [ ] Unsubscribe flow tested
- [ ] Re-subscribe tested
- [ ] All email links tested
- [ ] Mobile email tested
- [ ] Spam filter checked

## 🎯 Summary

✅ **Fully Automated**: No manual work needed
✅ **All Content Types**: Blog, Announcements, Seminars
✅ **Professional Emails**: Beautiful, branded templates
✅ **Legally Compliant**: Unsubscribe links included
✅ **Scalable**: Batch sending, async processing
✅ **Tracked**: Notification logging in database

**Just add your Resend API key and you're done!** 🎉

---

**Questions?** Check the Resend documentation: https://resend.com/docs
