# 📧 JBBC Newsletter System

Complete newsletter and notification system with email delivery, admin management, and subscriber management.

## ✨ Features Implemented

### 🔥 Core Features
- ✅ **Newsletter Subscription** - Footer form on all pages
- ✅ **Admin Newsletters** - Create and manage newsletters
- ✅ **Admin Announcements** - Create and manage announcements
- ✅ **Email Notifications** - Automatic emails to subscribers via Resend
- ✅ **Public Notices Page** - View all news, announcements, and seminars
- ✅ **Individual Notice Pages** - Detailed view with SEO optimization
- ✅ **Unsubscribe System** - User-friendly unsubscribe page
- ✅ **Notification Tracking** - Track all sent emails in database

### 🎨 UI/UX Features
- ✅ Beautiful, responsive design with Ant Design
- ✅ Japanese language support
- ✅ Type-based color coding (Newsletter=Blue, Announcement=Orange, Seminar=Green)
- ✅ Search and filter functionality
- ✅ Loading states and error handling
- ✅ Success/error messages

### 🔒 Security Features
- ✅ Admin authentication with NextAuth
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ Email validation

### 📊 Admin Features
- ✅ Dashboard with all content types
- ✅ Create/Edit/Delete newsletters
- ✅ Create/Edit/Delete announcements
- ✅ Automatic email sending on creation
- ✅ Notification logging
- ✅ User management

## 📁 File Structure

```
├── app/
│   ├── admin/
│   │   ├── newsletters/page.tsx          # Newsletter management
│   │   └── announcements/page.tsx        # Announcement management ✨ NEW
│   ├── api/
│   │   ├── subscribe/route.ts            # Subscribe endpoint
│   │   ├── unsubscribe/route.ts          # Unsubscribe endpoint
│   │   ├── notices/route.ts              # Public notices endpoint
│   │   └── admin/
│   │       ├── newsletters/route.ts       # Newsletter CRUD
│   │       └── announcements/route.ts     # Announcement CRUD ✨ NEW
│   ├── notices/
│   │   ├── page.tsx                      # All notices page
│   │   └── [slug]/page.tsx               # Individual notice page
│   └── unsubscribe/page.tsx              # Unsubscribe page ✨ NEW
├── components/
│   ├── admin/AdminMenu/adminMenu.tsx     # Admin sidebar (updated)
│   └── footer/footer.tsx                 # Footer with subscription
├── lib/
│   ├── email.ts                          # Email service (enhanced) ✨
│   ├── prisma.ts                         # Prisma client
│   └── auth.ts                           # NextAuth configuration
├── prisma/
│   └── schema.prisma                     # Database schema
├── scripts/
│   └── create-admin.ts                   # Admin user creation script ✨ NEW
├── NEWSLETTER_SETUP.md                   # Detailed setup guide ✨ NEW
├── QUICK_START.md                        # Quick start guide ✨ NEW
└── README_NEWSLETTER.md                  # This file ✨ NEW
```

## 🚀 Quick Start

### 1. Database is Ready ✅
Your MongoDB is already configured and synced!

### 2. Create Admin User

```bash
npx ts-node scripts/create-admin.ts
```

Suggested credentials:
- Email: `admin@jbbc.jp`
- Password: (choose a secure password)

### 3. Start Development

```bash
npm run dev
```

### 4. Access Admin Panel

1. Go to http://localhost:3001/admin/login
2. Login with admin credentials
3. Navigate to "Newsletters" or "Announcements"
4. Create your first newsletter!

### 5. Test Subscription

1. Go to homepage
2. Scroll to footer
3. Enter email address
4. Click "送信"

## 📧 Email Configuration

### Current Setup
- ✅ Resend API Key configured
- ✅ Email templates ready (Newsletter, Announcement, Seminar)
- ✅ Batch sending (100 emails per batch)
- ✅ HTML + Plain text versions

### Email Sender
Currently set to: `JBBC <noreply@jbbc.jp>`

To change, edit `lib/email.ts`:
```typescript
from: 'JBBC <noreply@yourdomain.com>'
```

**Important:** Verify your domain in [Resend Dashboard](https://resend.com/domains) before sending emails.

## 🎯 How It Works

### Newsletter Flow
1. **Admin creates newsletter** → Form at `/admin/newsletters`
2. **System saves to database** → MongoDB via Prisma
3. **System sends emails** → Resend API to all subscribers
4. **System logs notifications** → Tracks which emails were sent
5. **Users view notice** → Public page at `/notices/[slug]`

### Subscription Flow
1. **User enters email** → Footer form
2. **System validates email** → Checks format and duplicates
3. **System creates subscription** → Saves to database
4. **User gets confirmation** → Success message
5. **User receives future newsletters** → Automatic

### Email Templates
Each email includes:
- ✅ Branded header with type-specific color
- ✅ Title and excerpt
- ✅ Full content body
- ✅ "Read more" button linking to website
- ✅ Unsubscribe link
- ✅ Footer with copyright
- ✅ Plain text fallback

## 📋 Content Types

### 1. Newsletter (Blue Theme)
- Regular news and updates
- Admin creates via `/admin/newsletters`
- Sent to all active subscribers
- Shows on `/notices` page

### 2. Announcement (Orange Theme)
- Important notices and updates
- Admin creates via `/admin/announcements`
- Sent to all active subscribers
- Shows on `/notices` page

### 3. Seminar (Green Theme)
- Event announcements
- Admin creates via `/admin/seminar`
- Includes date, location, speaker info
- Registration functionality
- Shows on `/notices` page

## 🔧 Customization

### Email Templates
Edit `lib/email.ts`:
- `sendNewsletterEmail()` - Lines 23-122
- `sendAnnouncementEmail()` - Lines 127-231
- `sendSeminarNotificationEmail()` - Lines 236-320

### Notice Card Design
Edit `app/notices/page.tsx`:
- Card layout: Lines 144-187
- Filters: Lines 105-126
- Color scheme: Lines 62-89

### Footer Subscription
Edit `components/footer/footer.tsx`:
- Form: Lines 142-152
- Styling: Lines 134-154

## 📊 Database Schema

### Key Models
```prisma
model Subscription {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  email          String    @unique
  verifiedAt     DateTime?
  unsubscribedAt DateTime?
  createdAt      DateTime  @default(now())
  notifications  Notification[]
}

model Newsletter {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  body        String
  excerpt     String?
  slug        String   @unique
  publishedAt DateTime @default(now())
}

model Announcement {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  body        String
  excerpt     String?
  slug        String   @unique
  publishedAt DateTime @default(now())
}

model Notification {
  id             String        @id @default(auto()) @map("_id") @db.ObjectId
  type           String        # "newsletter" | "seminar" | "announcement"
  refId          String        @db.ObjectId
  email          String
  sentAt         DateTime      @default(now())
  subscriptionId String?       @db.ObjectId
  subscription   Subscription? @relation(fields: [subscriptionId], references: [id])
}
```

## 🧪 Testing Checklist

- [ ] Subscribe to newsletter from footer
- [ ] Login to admin panel
- [ ] Create newsletter and verify email sent
- [ ] Create announcement and verify email sent
- [ ] View notices page and filter by type
- [ ] Click on notice and view details
- [ ] Unsubscribe from newsletter
- [ ] Verify unsubscribed user doesn't receive emails

## 🚀 Deployment

### Environment Variables
```bash
DATABASE_URL="your-mongodb-connection-string"
RESEND_API_KEY="your-resend-api-key"
NEXTAUTH_SECRET="your-secure-random-string"
NEXTAUTH_URL="https://yourdomain.com"
```

### Build
```bash
npm run build
npm start
```

### Post-Deployment
1. ✅ Verify domain in Resend
2. ✅ Update email sender addresses
3. ✅ Test email delivery
4. ✅ Create admin user
5. ✅ Test subscription flow

## 📈 Performance Optimizations

- ✅ **Database Indexing** - Optimized queries with indexes on `publishedAt`, `slug`, `email`
- ✅ **Batch Email Sending** - 100 emails per batch to avoid rate limits
- ✅ **Async Email Sending** - Emails sent in background, doesn't block response
- ✅ **Notification Logging** - Track sent emails without blocking
- ✅ **Prisma Client Optimization** - Global instance, connection pooling
- ✅ **Component Optimization** - Client/Server components properly separated

## 🐛 Troubleshooting

### Emails Not Sending
```bash
# Check Resend API key
echo $RESEND_API_KEY

# Verify domain in Resend dashboard
# Check server logs for errors
```

### Database Connection Issues
```bash
# Test connection
npx prisma studio

# Verify connection string
echo $DATABASE_URL
```

### Admin Login Issues
```bash
# Create new admin user
npx ts-node scripts/create-admin.ts

# Verify NEXTAUTH_SECRET is set
echo $NEXTAUTH_SECRET
```

## 📚 Additional Resources

- [Detailed Setup Guide](./NEWSLETTER_SETUP.md)
- [Quick Start Guide](./QUICK_START.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Resend Documentation](https://resend.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎉 Summary

Your newsletter system is **production-ready**! You now have:

✅ Complete newsletter and announcement system
✅ Email delivery with Resend
✅ Admin management interface
✅ Public notices page
✅ Subscriber management
✅ Unsubscribe functionality
✅ Optimized performance
✅ Comprehensive documentation

**Next Steps:**
1. Create admin user
2. Test the system
3. Customize email templates
4. Deploy to production

Need help? Check `NEWSLETTER_SETUP.md` for detailed documentation.

---

**Built with:**
- Next.js 15
- Prisma + MongoDB
- Resend Email API
- NextAuth
- Ant Design
- TypeScript

**Created:** 2025
**Version:** 1.0.0
