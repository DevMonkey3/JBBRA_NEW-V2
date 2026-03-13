# 🖼️ Image Optimization Guide

Complete step-by-step guide to optimize your website images and improve performance.

## 📊 Current Status

- **Public Directory Size:** 109MB
- **Largest Images:** 3.8MB PNG files
- **Issue:** Pages load slowly due to unoptimized images
- **Target:** Reduce to ~30-40MB with AVIF conversion

---

## 🎯 Optimization Benefits

**AVIF Format:**
- ✅ **50-70% smaller** file size vs PNG/JPG
- ✅ Better quality at same file size
- ✅ Supported by all modern browsers

**Lazy Loading:**
- ✅ Only loads images when user scrolls to them
- ✅ Faster initial page load
- ✅ Reduced bandwidth usage

---

## 📋 Step-by-Step Guide

### Step 1: Install Required Dependency

```bash
npm install sharp --save-dev
```

**What is Sharp?**
Sharp is a high-performance image processing library for Node.js.

---

### Step 2: Run Image Conversion Script

```bash
npx ts-node scripts/optimize-images.ts
```

**What this does:**
1. ✅ Creates backup of your `public/` folder (saved as `public-backup/`)
2. ✅ Scans all `.jpg`, `.jpeg`, `.png` files in `public/`
3. ✅ Converts them to `.avif` format (80% quality)
4. ✅ Keeps original files (you can delete them later)
5. ✅ Shows conversion statistics

**Example output:**
```
✅ Converted: home/Home_page_content8_personImage.png
   Original: 3.8 MB → AVIF: 450 KB
   Saved: 3.35 MB (88.2%)
```

**⏱️ Expected time:** 2-5 minutes depending on number of images

---

### Step 3: Update Image References in Code

```bash
npx ts-node scripts/update-image-references.ts
```

**What this does:**
1. ✅ Scans all `.tsx`, `.ts`, `.jsx`, `.js` files
2. ✅ Finds image references like `"/home/image.png"`
3. ✅ Updates them to `"/home/image.avif"`
4. ✅ Shows update statistics

**Example output:**
```
✅ Updated: app/page.tsx (3 replacements)
✅ Updated: components/Hero.tsx (1 replacement)
```

---

### Step 4: Implement Lazy Loading

The Next.js `Image` component has lazy loading **enabled by default**! But let's make sure:

#### ✅ Good - Default Lazy Loading (Below the fold)
```tsx
import Image from 'next/image';

<Image
  src="/home/image.avif"
  alt="Description"
  width={500}
  height={300}
  // loading="lazy" is default - no need to specify
/>
```

#### ⚡ Priority Loading (Above the fold - Hero images)
```tsx
<Image
  src="/hero.avif"
  alt="Hero"
  width={1200}
  height={600}
  priority  // ← Load immediately (for hero/banner images)
/>
```

#### 🎨 HeroUI Image Component
If you're using `@heroui/image`:

```tsx
import { Image } from "@heroui/image";

<Image
  src="/image.avif"
  alt="Description"
  loading="lazy"  // ← Add this for lazy loading
  width={200}
  height={150}
/>
```

---

### Step 5: Test Your Website

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Check these pages:**
   - Home page (`/`)
   - Blog page (`/blog`)
   - Services page (`/jbbc/services`)
   - All pages with images

3. **Verify images load:**
   - Images should display correctly
   - No broken images
   - Smooth loading experience

4. **Check browser console:**
   - No 404 errors
   - No warnings about images

---

### Step 6: Build and Test Production

```bash
npm run build
npm run start
```

**Check:**
- ✅ Build completes successfully
- ✅ All pages work in production mode
- ✅ Images load correctly

---

### Step 7: Measure Performance Improvement

**Before optimization:**
- Page load: ~5-8 seconds
- Total size: ~15-20MB per page

**After optimization (expected):**
- Page load: ~2-3 seconds ⚡
- Total size: ~4-6MB per page ⚡
- 60-70% reduction in image size 🎉

**Tools to measure:**
1. **Chrome DevTools:**
   - Press F12 → Network tab
   - Reload page
   - Check "Size" column

2. **Google PageSpeed Insights:**
   - Visit: https://pagespeed.web.dev/
   - Enter your URL
   - Check "Performance" score

---

### Step 8: Clean Up (Optional)

After verifying everything works:

1. **Delete original images:**
   ```bash
   # Delete old PNG/JPG files (AVIF versions now exist)
   # BE CAREFUL - Make sure AVIF versions work first!
   find public -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -delete
   ```

2. **Delete backup:**
   ```bash
   rm -rf public-backup
   ```

3. **Remove temp build logs:**
   ```bash
   rm build-output.log build-output2.log
   ```

---

### Step 9: Commit Optimizations

```bash
git add .
git commit -m "Optimize images: Convert to AVIF format and add lazy loading"
git push origin main
```

---

## 🔧 Advanced Configuration

### Adjust AVIF Quality

Edit `scripts/optimize-images.ts`:

```typescript
const CONFIG = {
  avifQuality: 80, // Change this (60-100)
  // 60 = smaller files, lower quality
  // 80 = balanced (recommended)
  // 100 = best quality, larger files
};
```

### Skip Small Images

```typescript
const CONFIG = {
  minFileSize: 50 * 1024, // Skip files < 50KB
  // Increase to 100 * 1024 to only convert files > 100KB
};
```

### Target Specific Directories

```typescript
// Convert only home page images
const PUBLIC_DIR = path.join(process.cwd(), 'public/home');
```

---

## ⚠️ Troubleshooting

### Issue: "Cannot find module 'sharp'"
**Solution:**
```bash
npm install sharp --save-dev
```

### Issue: "Permission denied"
**Solution:** Run terminal as Administrator (Windows) or use `sudo` (Mac/Linux)

### Issue: Images look blurry
**Solution:** Increase AVIF quality to 90-100 in the script

### Issue: Some images not converting
**Solution:**
- Check file permissions
- Make sure images aren't corrupted
- Look for errors in console output

---

## 📈 Expected Results

### File Size Reduction
- **PNG (3.8MB)** → **AVIF (450KB)** = 88% smaller
- **Overall public folder:** 109MB → ~30-40MB = 65% reduction

### Performance Improvement
- **First Contentful Paint:** -40% faster
- **Largest Contentful Paint:** -50% faster
- **Total Page Size:** -60% smaller
- **Load Time:** -50% faster

---

## 🎯 Next Level Optimizations (Optional)

1. **Use CDN for images:**
   - Upload to Digital Ocean Spaces
   - Serve from CDN for faster delivery

2. **Responsive images:**
   - Generate multiple sizes (thumbnail, medium, large)
   - Use `srcset` for different screen sizes

3. **Image compression:**
   - Use TinyPNG API for additional compression
   - Implement progressive loading

4. **WebP fallback:**
   - Generate both AVIF and WebP
   - Use `<picture>` element for compatibility

---

## 📚 Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [AVIF Browser Support](https://caniuse.com/avif)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)

---

## ✅ Checklist

- [ ] Install sharp: `npm install sharp --save-dev`
- [ ] Run conversion: `npx ts-node scripts/optimize-images.ts`
- [ ] Update references: `npx ts-node scripts/update-image-references.ts`
- [ ] Add lazy loading to components
- [ ] Test locally: `npm run dev`
- [ ] Test production build: `npm run build && npm start`
- [ ] Measure performance improvement
- [ ] Delete original images (optional)
- [ ] Commit and push changes

---

**Need Help?** Check the console output for detailed error messages and statistics.

**Estimated Total Time:** 10-15 minutes

**Estimated Performance Gain:** 60-70% faster page loads! 🚀
