# 🔴 504 Gateway Timeout - Complete Fix Guide

**Issue:** All requests to jbbc.co.jp returning 504 errors (even static files)

**Root Cause:** Next.js server on Digital Ocean is not responding or crashed

---

## ✅ What Was Fixed (Code Changes)

### 1. Increased Database Connection Timeouts
**Files Modified:**
- `.env.local` (line 6)
- `lib/prisma.ts` (line 20)

**Changes:**
```
Before: serverSelectionTimeoutMS=5000 (5 seconds)
After:  serverSelectionTimeoutMS=30000 (30 seconds)

Before: socketTimeoutMS=10000 (10 seconds)
After:  socketTimeoutMS=45000 (45 seconds)
```

**Why:** MongoDB Atlas can be slow to respond, especially during cold starts. The 5-second timeout was too aggressive and causing the app to crash.

---

### 2. Added Simple Health Check Endpoint
**New File:** `app/api/health/route.ts`

**URL:** `https://jbbc.co.jp/api/health`

**Purpose:** Check if server is alive without requiring database access

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-12T...",
  "uptime": 123.45,
  "message": "Server is running"
}
```

---

### 3. Added Timeout Protection to Middleware
**File Modified:** `middleware.ts`

**Changes:**
- Added 10-second timeout to auth checks
- If auth check hangs, redirect to login instead of timing out
- Prevents entire app from hanging on slow database

---

### 4. Made Database Connection Non-Blocking
**File Modified:** `lib/prisma.ts`

**Changes:**
- Database connection errors no longer crash the app
- Server starts even if MongoDB is temporarily unavailable
- Connection errors are logged but app continues running

---

## 🚀 Deployment Steps (CRITICAL - DO THESE NOW)

### Step 1: Update Digital Ocean Environment Variables

1. Go to: https://cloud.digitalocean.com/apps
2. Select your app → **Settings** → **Environment Variables**
3. Update `DATABASE_URL` to:
   ```
   mongodb+srv://tashdidhassan27_db_user:nqRtTymqrb9tPUxb@jbbc.emou4zp.mongodb.net/jbbc?retryWrites=true&w=majority&maxPoolSize=10&serverSelectionTimeoutMS=30000&socketTimeoutMS=45000&connectTimeoutMS=30000
   ```
4. **IMPORTANT:** Click **"Save"** and trigger a new deployment

---

### Step 2: Push Code Changes to GitHub

```bash
git add .
git commit -m "Fix 504 errors: Increase DB timeouts, add health check, improve error handling"
git push origin main
```

**This will trigger automatic deployment on Digital Ocean**

---

### Step 3: Monitor Deployment

1. Go to Digital Ocean Dashboard → Your App
2. Watch the **Build Logs** for errors
3. Wait for deployment to complete (usually 3-5 minutes)
4. Check **Runtime Logs** for any errors after deployment

---

### Step 4: Test the Fixes

**Test 1: Basic Health Check**
```bash
# Visit in browser:
https://jbbc.co.jp/api/health

# Should return:
{"status":"ok","timestamp":"...","uptime":123,"message":"Server is running"}
```

**Test 2: Database Health Check**
```bash
# Visit in browser:
https://jbbc.co.jp/api/health/db

# Should return:
{"ok":true,"subscriptions":X}
```

**Test 3: Homepage**
```bash
# Visit in browser:
https://jbbc.co.jp

# Should load without 504 errors
```

**Test 4: Static Files**
```bash
# Check browser console - should see no 504 errors for:
- _next/static/chunks/*.js
- Images
- Manifest files
```

---

## 🔍 If Still Getting 504 Errors

### Check 1: Is the Server Running?

```bash
# Digital Ocean Dashboard → Your App
# Status should be: "Running" (green)
# If "Failed" or "Crashed", click "Restart"
```

---

### Check 2: Check Runtime Logs

```bash
# Digital Ocean Dashboard → Your App → Runtime Logs
# Look for:
- "[PRISMA] Failed to connect to database" (DB issue)
- "ECONNREFUSED" (DB unreachable)
- "Out of memory" (need to upgrade plan)
- "[MIDDLEWARE] Auth check failed" (timeout protection working)
```

---

### Check 3: Verify MongoDB Atlas is Up

```bash
1. Go to: https://cloud.mongodb.com/
2. Check your cluster status
3. If cluster is "Paused", click "Resume"
4. Check "Network Access" → Allow Digital Ocean IP or 0.0.0.0/0
```

---

### Check 4: Force Rebuild

```bash
# Digital Ocean Dashboard → Your App
# Click: "Actions" → "Force Rebuild and Deploy"
# This clears cache and rebuilds from scratch
```

---

### Check 5: Check Resource Usage

```bash
# Digital Ocean Dashboard → Your App → Insights
# Check:
- Memory usage (should be < 80%)
- CPU usage (should be < 80%)
# If maxed out, upgrade to a larger plan
```

---

## 🆘 Emergency Fixes

### If Nothing Else Works:

**Option 1: Rollback to Previous Deploy**
```bash
# Digital Ocean Dashboard → Your App → Deployments
# Click on a previous successful deployment
# Click "Redeploy"
```

**Option 2: Clear All Caches**
```bash
# In your local project:
rm -rf .next
rm -rf node_modules
npm install
git add .
git commit -m "Clear caches"
git push origin main
```

**Option 3: Check Digital Ocean Status**
```bash
# Visit: https://status.digitalocean.com/
# Check if there are any ongoing incidents
```

---

## 📊 Expected Timeline

| Step | Duration | Status |
|------|----------|--------|
| Update env vars | 1 min | ⏳ |
| Git push | 1 min | ⏳ |
| Digital Ocean build | 3-5 min | ⏳ |
| Server startup | 30-60 sec | ⏳ |
| Test endpoints | 2 min | ⏳ |
| **Total** | **~10 min** | |

---

## ✅ Success Checklist

After deployment completes, verify:

- [ ] `/api/health` returns `{"status":"ok"}`
- [ ] `/api/health/db` returns database connection status
- [ ] Homepage loads without errors
- [ ] No 504 errors in browser console
- [ ] Static files (JS/CSS/images) load correctly
- [ ] NextAuth session check works
- [ ] No errors in Digital Ocean Runtime Logs

---

## 📝 Prevention Tips

**To prevent 504 errors in the future:**

1. **Monitor MongoDB Atlas**
   - Keep cluster running (don't let it pause)
   - Monitor connection count
   - Set up alerts for slow queries

2. **Monitor Digital Ocean Resources**
   - Check memory/CPU usage weekly
   - Scale up if usage > 70% consistently

3. **Use Health Checks**
   - Set up uptime monitoring (UptimeRobot, Pingdom)
   - Monitor `/api/health` endpoint
   - Get alerts if server goes down

4. **Keep Dependencies Updated**
   - Update Next.js monthly
   - Update Prisma when available
   - Test updates in dev before production

5. **Database Best Practices**
   - Add indexes to frequently queried fields
   - Implement query caching where possible
   - Use connection pooling (already configured)

---

## 🔗 Useful Links

- **Digital Ocean Dashboard:** https://cloud.digitalocean.com/apps
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **GitHub Repo:** (your repo URL)
- **Production Site:** https://jbbc.co.jp
- **Health Check:** https://jbbc.co.jp/api/health

---

## 📞 Need Help?

If you're still experiencing issues after following this guide:

1. Check Digital Ocean Runtime Logs
2. Check MongoDB Atlas connection
3. Verify environment variables are set correctly
4. Try a force rebuild
5. Consider upgrading Digital Ocean plan if resource-limited

---

**Last Updated:** 2026-01-12
**Issue:** 504 Gateway Timeout
**Status:** FIXES APPLIED - AWAITING DEPLOYMENT
