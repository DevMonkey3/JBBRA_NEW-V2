# Quick Start Guide

## 1. Setup Database (5 minutes)

### Get MongoDB Connection String
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free tier is enough)
3. Create a cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### Configure Environment
Edit `.env.local`:
```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/jbbc?retryWrites=true&w=majority"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

### Push Database Schema
```bash
npx prisma db push
```

## 2. Create Admin User (2 minutes)

```bash
npx ts-node scripts/create-admin.ts
```

Enter:
- Email: `admin@jbbc.jp`
- Name: `Admin`
- Password: (minimum 6 characters)

## 3. Start Development (1 minute)

```bash
npm run dev
```

Open: http://localhost:3000

## 4. Test Newsletter System

### Test Subscription
1. Go to homepage
2. Scroll to footer newsletter section
3. Enter email: `test@example.com`
4. Click "送信"

### Test Admin Panel
1. Go to http://localhost:3000/admin/login
2. Login with admin credentials
3. Navigate to "Newsletters" or "Announcements"
4. Create a test newsletter:
   - Title: `テストニュースレター`
   - Slug: `test-newsletter-2025`
   - Excerpt: `これはテストです`
   - Body: `<h2>こんにちは</h2><p>これはテストニュースレターです。</p>`
5. Click "Create & Send"

### View Notices
1. Go to http://localhost:3000/notices
2. See all newsletters, announcements, and seminars
3. Click on any notice to see details

## 5. Configure Email (Optional)

The system already has Resend configured, but to send emails from your own domain:

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add and verify your domain
3. Update `lib/email.ts`:
   ```typescript
   from: 'JBBC <noreply@yourdomain.com>'
   ```

## Done! 🎉

Your newsletter system is now fully operational.

## Next Steps

- Read `NEWSLETTER_SETUP.md` for detailed documentation
- Customize email templates in `lib/email.ts`
- Add more content through admin panel
- Deploy to production

## Common Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Open database GUI
npx prisma studio

# Create admin user
npx ts-node scripts/create-admin.ts

# Development
npm run dev

# Production build
npm run build
npm start
```

## Troubleshooting

**"Can't connect to database"**
- Check `DATABASE_URL` in `.env.local`
- Verify MongoDB Atlas IP whitelist

**"Unauthorized" on admin pages**
- Create admin user with script
- Clear browser cookies
- Verify `NEXTAUTH_SECRET` is set

**Emails not sending**
- Check `RESEND_API_KEY` in `.env.local`
- Verify domain in Resend dashboard
- Check Resend logs

## Support

Check `NEWSLETTER_SETUP.md` for detailed troubleshooting and configuration options.
