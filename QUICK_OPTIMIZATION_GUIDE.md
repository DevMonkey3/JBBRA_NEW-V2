# ⚡ Quick Image Optimization Guide

## 🎯 One Command to Rule Them All

```bash
npm run optimize:all
```

This will automatically:
1. ✅ Convert all PNG/JPG to AVIF (60-70% smaller!)
2. ✅ Update all image references in code
3. ✅ Add lazy loading to components
4. ✅ Show you a complete audit report

**Estimated time:** 2-5 minutes
**Estimated savings:** 60-70MB (from 109MB → ~40MB)

---

## 📋 Step-by-Step Commands

If you prefer to run each step individually:

### 1. Convert Images to AVIF
```bash
npm run optimize:images
```
- Creates backup at `public-backup/`
- Converts PNG/JPG to AVIF
- Shows before/after file sizes

### 2. Update Code References
```bash
npm run optimize:update-refs
```
- Changes `image.png` → `image.avif` in all files
- Updates `.tsx`, `.ts`, `.jsx`, `.js` files

### 3. Add Lazy Loading
```bash
npm run optimize:lazy-load
```
- Adds `loading="lazy"` to HeroUI Image components
- Next.js Images already lazy load by default!

### 4. Audit Results
```bash
npm run optimize:audit
```
- Shows which images are optimized
- Identifies any remaining issues

---

## ✅ After Optimization

1. **Test locally:**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 and check all pages

2. **Build for production:**
   ```bash
   npm run build
   ```
   Make sure build succeeds

3. **Commit changes:**
   ```bash
   git add .
   git commit -m "Optimize images: Convert to AVIF and add lazy loading"
   git push
   ```

---

## 📊 Expected Results

### Before:
- 💾 Public folder: **109MB**
- 🐌 Page load: **5-8 seconds**
- 📦 Largest image: **3.8MB PNG**

### After:
- 💾 Public folder: **~40MB** (63% smaller!)
- 🚀 Page load: **2-3 seconds** (60% faster!)
- 📦 Largest image: **~500KB AVIF** (87% smaller!)

---

## 🆘 Need Help?

Read the full guide:
```bash
cat IMAGE_OPTIMIZATION_GUIDE.md
```

Or check what each script does:
- `scripts/optimize-images.ts` - Converts images
- `scripts/update-image-references.ts` - Updates code
- `scripts/add-lazy-loading.ts` - Adds lazy loading
- `scripts/audit-lazy-loading.ts` - Checks optimization

---

## 🎉 Pro Tips

1. **Backup is automatic** - Original images saved in `public-backup/`
2. **Next.js Images** - Already lazy load by default!
3. **HeroUI Images** - Script automatically adds `loading="lazy"`
4. **Hero images** - Use `priority` for above-the-fold images only

---

**Ready to optimize?** Run `npm run optimize:all` now! ⚡
