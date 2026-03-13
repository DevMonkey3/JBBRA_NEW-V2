# Production Login Issues - Debug Guide

## Problem Summary
- ✅ Login works on localhost
- ❌ Login returns 401 Unauthorized on https://jbbc.co.jp
- ❌ "Not Secure" warning on production site

---

## Step 1: Check Environment Variables on Digital Ocean

Go to your Digital Ocean App Platform dashboard:

1. Navigate to your app → **Settings** → **App-Level Environment Variables**
2. Make sure these are set:

```env
DATABASE_URL=mongodb+srv://tashdidhassan27_db_user:nqRtTymqrb9tPUxb@jbbc.emou4zp.mongodb.net/jbbc?retryWrites=true&w=majority
NEXTAUTH_SECRET=4EJ/4n76Lj08TvrfWpYEnucnVR46XSZWyD2UzqkNeq8=
NEXTAUTH_URL=https://jbbc.co.jp
ADMIN_EMAIL=admin@jbbc.jp
ADMIN_PASSWORD=ChangeMe123!
RESEND_API_KEY=re_GTaup5Vs_3o8LpHxWFtbV5z3jbMBhpnev
```

**IMPORTANT:** After adding/changing environment variables, you MUST trigger a new deployment!

---

## Step 2: Use the Debug API

I've created a debug endpoint. Visit in your browser:

```
https://jbbc.co.jp/api/debug
```

This will show you:
- ✅/❌ If environment variables are set
- ✅/❌ If database connection works
- ✅/❌ If admin user exists in database
- List of admin users (without passwords)

**Expected Output:**
```json
{
  "env": {
    "DATABASE_URL": "✅ Set",
    "NEXTAUTH_SECRET": "✅ Set",
    "NEXTAUTH_URL": "https://jbbc.co.jp",
    "ADMIN_EMAIL": "admin@jbbc.jp",
    "ADMIN_PASSWORD": "✅ Set"
  },
  "database": {
    "connected": true,
    "adminUserExists": true,
    "adminUserCount": 1,
    "admins": [
      {
        "email": "admin@jbbc.jp",
        "name": "JBBC Admin"
      }
    ]
  }
}
```

---

## Step 3: Seed the Database (if admin user doesn't exist)

If the debug endpoint shows `adminUserExists: false`, you need to seed:

### Option A: Via Digital Ocean Console

1. Go to your Digital Ocean app
2. Click **Console** tab
3. Run these commands:
```bash
npx prisma generate
npx prisma db seed
```

### Option B: Via SSH

If you have SSH access:
```bash
ssh your-server
cd /path/to/your/app
npx prisma db seed
```

---

## Step 4: Check MongoDB Atlas IP Whitelist

Your MongoDB Atlas might be blocking Digital Ocean's IP:

1. Go to https://cloud.mongodb.com/
2. Click your cluster → **Network Access**
3. Check if Digital Ocean IP is allowed
4. **Easiest fix:** Add `0.0.0.0/0` (allow all IPs) for testing
   - ⚠️ For production, add only your Digital Ocean app's IP

---

## Step 5: Check Digital Ocean Logs

View real-time logs to see auth errors:

1. Digital Ocean Dashboard → Your App → **Runtime Logs**
2. Look for lines starting with `[AUTH]`
3. Try to login on https://jbbc.co.jp/admin/login
4. Check what error appears:
   - `[AUTH] User not found` → Database not seeded
   - `[AUTH] Password mismatch` → Wrong password or hash issue
   - `[AUTH] Error during authentication` → Database connection issue

---

## Step 6: Fix HTTPS "Not Secure" Warning

Digital Ocean should auto-provide SSL. Check:

1. Digital Ocean Dashboard → Your App → **Settings** → **Domains**
2. Make sure SSL certificate is active
3. If not, click **Add Domain** and follow SSL setup

---

## Step 7: Fix Chunk Loading Error

The chunk loading error is likely due to:
1. Old cached build
2. Missing static files

**Fix:**
1. Digital Ocean Dashboard → **Actions** → **Force Rebuild**
2. Clear browser cache
3. Hard refresh (Ctrl+Shift+R)

---

## Quick Test Commands

After each fix, test login at:
```
https://jbbc.co.jp/admin/login

Email: admin@jbbc.jp
Password: ChangeMe123!
```

---

## If Still Not Working

Check these in order:

1. ✅ Environment variables set on Digital Ocean
2. ✅ App redeployed after setting env vars
3. ✅ Database connection works (check /api/debug)
4. ✅ Admin user exists in database
5. ✅ MongoDB allows Digital Ocean IP
6. ✅ NEXTAUTH_URL is exactly `https://jbbc.co.jp` (no trailing slash)
7. ✅ NEXTAUTH_SECRET is set
8. ✅ SSL certificate is active

---

## Delete Debug Route After Fixing

For security, delete the debug endpoint after you're done:

```bash
rm app/api/debug/route.ts
```

Then commit and redeploy.
