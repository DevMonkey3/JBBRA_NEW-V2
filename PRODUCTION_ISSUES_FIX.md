# Production Issues - Complete Fix Guide

## 🔴 Current Problems:

### Problem 1: MongoDB Connection Failed (CRITICAL)
**Error:** `Server selection timeout: No available servers`

**Root Cause:** Digital Ocean's IP addresses are BLOCKED by MongoDB Atlas Network Access

### Problem 2: Build Fails on `/admin/blog`
**Error:** `Cannot destructure property 'data' of useSession()`

**Root Cause:** Was fixed in commit `501063c` but Digital Ocean may have cached build

---

## ✅ IMMEDIATE FIXES REQUIRED:

### Fix #1: Allow Digital Ocean to Access MongoDB (DO THIS FIRST!)

**Step-by-step:**

1. **Go to MongoDB Atlas:**
   - Visit: https://cloud.mongodb.com/
   - Login with your credentials

2. **Navigate to Network Access:**
   - Click on your cluster
   - Click **"Network Access"** in the left sidebar

3. **Add IP Whitelist:**
   - Click **"ADD IP ADDRESS"** button
   - Select **"ALLOW ACCESS FROM ANYWHERE"**
   - IP Address: `0.0.0.0/0`
   - Comment: `Allow all IPs - temporary for testing`
   - Click **"Confirm"**

4. **Wait 2-3 minutes** for changes to propagate

5. **Verify it worked:**
   - Visit: `https://jbbc-kl8cy.ondigitalocean.app/api/debug`
   - Should show: `"connected": true`

**Security Note:** After testing, replace `0.0.0.0/0` with specific Digital Ocean IP ranges:
```
159.203.0.0/16
161.35.0.0/16
104.131.0.0/16
```

---

### Fix #2: Update Digital Ocean Environment Variables

**Go to:** Digital Ocean Dashboard → Your App → Settings → Environment Variables

**Update `DATABASE_URL` to:**
```
mongodb+srv://tashdidhassan27_db_user:nqRtTymqrb9tPUxb@jbbc.emou4zp.mongodb.net/jbbc?retryWrites=true&w=majority&maxPoolSize=10&serverSelectionTimeoutMS=5000&socketTimeoutMS=10000
```

**Verify all these are set:**
```env
DATABASE_URL=mongodb+srv://tashdidhassan27_db_user:nqRtTymqrb9tPUxb@jbbc.emou4zp.mongodb.net/jbbc?retryWrites=true&w=majority&maxPoolSize=10&serverSelectionTimeoutMS=5000&socketTimeoutMS=10000

NEXTAUTH_SECRET=4EJ/4n76Lj08TvrfWpYEnucnVR46XSZWyD2UzqkNeq8=

NEXTAUTH_URL=https://jbbc.co.jp

ADMIN_EMAIL=admin@jbbc.jp

ADMIN_PASSWORD=ChangeMe123!

NODE_ENV=production
```

Click **"Save"** and wait for auto-redeploy.

---

### Fix #3: Force Clean Build on Digital Ocean

**Option A: Trigger Manual Rebuild**
1. Digital Ocean Dashboard → Your App
2. Click **"Actions"** dropdown (top right)
3. Select **"Force Rebuild and Deploy"**
4. Wait 3-5 minutes for build to complete

**Option B: Clear Build Cache**
1. Digital Ocean Dashboard → Your App → Settings
2. Scroll to **"Build Phase"**
3. Click **"Edit"**
4. Add build command:
```bash
npm run build -- --no-cache
```

---

### Fix #4: Seed the Database

**After database connection works:**

1. Go to Digital Ocean → Your App → **Console** tab

2. Run these commands:
```bash
npx prisma generate
npx prisma db seed
```

3. Verify admin user created:
```bash
npx prisma studio
```

Or check via API:
```
https://jbbc-kl8cy.ondigitalocean.app/api/debug
```

Should show:
```json
{
  "database": {
    "adminUserExists": true,
    "admins": [{"email": "admin@jbbc.jp"}]
  }
}
```

---

## 🧪 Testing Checklist:

After ALL fixes are applied:

- [ ] MongoDB connection works (`/api/debug` shows `connected: true`)
- [ ] Admin user exists (`/api/debug` shows admin email)
- [ ] Build succeeds (no errors in Digital Ocean logs)
- [ ] Can access https://jbbc-kl8cy.ondigitalocean.app
- [ ] Can login at https://jbbc-kl8cy.ondigitalocean.app/admin/login
  - Email: `admin@jbbc.jp`
  - Password: `ChangeMe123!`
- [ ] SSL certificate works (no browser warnings)

---

## 🆘 If Build Still Fails:

### Check Digital Ocean Logs:
```
Digital Ocean Dashboard → Your App → Runtime Logs
```

Look for errors starting with `[AUTH]` or `prisma`

### Common Issues:

**Issue:** `useSession is undefined`
**Fix:** Already fixed in code, force rebuild needed

**Issue:** `Prisma Client not generated`
**Fix:** Add to build command:
```bash
npx prisma generate && npm run build
```

**Issue:** Environment variables not loading
**Fix:** Make sure they're set at **App-Level**, not Component-Level

---

## 📞 Debug URLs:

After deployment, test these:

1. **Debug endpoint:**
   ```
   https://jbbc-kl8cy.ondigitalocean.app/api/debug
   ```

2. **Health check:**
   ```
   https://jbbc-kl8cy.ondigitalocean.app/api/health/db
   ```

3. **Admin login:**
   ```
   https://jbbc-kl8cy.ondigitalocean.app/admin/login
   ```

4. **Main site:**
   ```
   https://jbbc.co.jp
   ```

---

## ⚡ Quick Commands:

**Test login locally:**
```bash
npm run dev
# Visit http://localhost:3000/admin/login
```

**Build locally to verify:**
```bash
npm run build
```

**Check logs on production:**
```bash
# In Digital Ocean Console tab:
npm run logs
```

---

## 📝 Summary:

**The #1 CRITICAL issue:** MongoDB Atlas is blocking Digital Ocean's IPs

**Fix:** Go to MongoDB Atlas → Network Access → Add `0.0.0.0/0`

**Then:** Force rebuild on Digital Ocean

**Finally:** Seed database with `npx prisma db seed`

---

Last Updated: 2025-10-06
