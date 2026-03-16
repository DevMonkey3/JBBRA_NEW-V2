# Memory Optimization Guide

## Problem
The application was using ~57% (1.1GB) of available 2GB RAM on DigitalOcean, causing potential performance issues and crash risks.

## Root Causes Identified

### 1. **MongoDB Connection Pool Too Large**
- Original: `maxPoolSize: 15` per app instance
- With 2 instances running: 30 connections total
- Each connection uses ~5-10MB RAM = 150-300MB just for DB connections

### 2. **No Node.js Memory Limits**
- Without `--max-old-space-size`, Node.js can use all available RAM
- No garbage collection optimization

### 3. **Unpaginated API Routes**
- Some admin routes fetched entire collections into memory
- No limits on data retrieval

## Fixes Applied

### 1. Reduced MongoDB Connection Pool (lib/prisma.ts)
```typescript
// Before
maxPoolSize: '15',
minPoolSize: '1',
maxIdleTimeMS: '60000',

// After
maxPoolSize: '5',              // Reduced from 15
minPoolSize: '0',              // Allow all connections to close
maxIdleTimeMS: '30000',        // 30s instead of 60s
serverSelectionTimeoutMS: '10000',  // 10s instead of 30s
connectTimeoutMS: '10000',          // 10s instead of 20s
waitQueueTimeoutMS: '5000',         // New: prevent queue buildup
```

**Impact**: Reduces DB connection memory from ~300MB to ~100MB total

### 2. Added Node.js Memory Limits (package.json)
```json
{
  "scripts": {
    "start": "node --max-old-space-size=1024 --max-semi-space-size=64 --optimize-for-size server.js"
  }
}
```

**Flags explained**:
- `--max-old-space-size=1024`: Limits heap to 1GB (50% of total RAM)
- `--max-semi-space-size=64`: Limits young generation to 64MB
- `--optimize-for-size`: Favors code size over speed

**Impact**: Prevents runaway memory growth, forces earlier GC

### 3. Added Procfile for Deployment
```procfile
web: node --max-old-space-size=1024 --max-semi-space-size=64 --optimize-for-size server.js
```

### 4. Added Pagination to API Routes

| Route | Before | After |
|-------|--------|-------|
| `/api/admin/subscribers` | All records | 50/page, max 200 |
| `/api/admin/blog` | All records | 20/page, max 100 |

**Impact**: Reduces memory per request from potentially MBs to KBs

### 5. Email Sending Already Optimized
The newsletter/seminar/blog email sending already uses:
- Cursor-based pagination (500 records/batch)
- Background async processing
- Batch memory cleanup (`array.length = 0`)

## Expected Results

### Memory Usage Breakdown (After Fixes)
| Component | Before | After |
|-----------|--------|-------|
| Node.js Base | ~200MB | ~200MB |
| Next.js Runtime | ~300MB | ~300MB |
| MongoDB Connections | ~300MB | ~100MB |
| API Request Buffers | ~200MB | ~50MB |
| V8 Heap (unlimited) | ~400MB | ~350MB (capped) |
| **Total** | **~1.4GB (70%)** | **~1GB (50%)** |

### Projected Memory Usage
- **Idle**: ~400-500MB (20-25%)
- **Normal Load**: ~600-800MB (30-40%)
- **Peak Load**: ~900MB-1GB (45-50%)
- **Headroom**: ~500MB+ for spikes

## Monitoring Recommendations

### 1. DigitalOcean App Platform
- Monitor "Memory %" metric
- Set alert at 70%
- Set auto-restart at 85% (if available)

### 2. Add Health Check Endpoint
Already available at `/api/health` - use for monitoring

### 3. Log Analysis
Watch for these warning signs:
```
[PRISMA] Failed to connect to database
Failed to send email batch
Request timeout
```

## Additional Optimizations (If Needed)

### 1. Enable Next.js Caching
```typescript
// next.config.js
experimental: {
  swrCacheTTL: 60, // Cache dynamic routes for 60s
}
```

### 2. Reduce Middleware Overhead
Current middleware is already minimal (just `NextResponse.next()`)

### 3. Image Optimization
- Images are already uploaded to DigitalOcean Spaces
- Consider adding CloudFlare CDN in front

### 4. Database Query Optimization
- All queries already use indexes (defined in schema)
- Consider adding composite indexes for complex queries

## Deployment Checklist

- [ ] Rebuild application: `npm run build`
- [ ] Deploy with new Procfile
- [ ] Monitor memory for 24 hours
- [ ] Test all admin pagination endpoints
- [ ] Verify email sending still works
- [ ] Check database connection stability

## Troubleshooting

### Memory Still High?

1. **Check for memory leaks**:
   ```bash
   # Add to package.json scripts
   "start:debug": "node --inspect --max-old-space-size=1024 server.js"
   ```

2. **Profile with Chrome DevTools**:
   - Open `chrome://inspect`
   - Connect to Node.js process
   - Take heap snapshots

3. **Check concurrent requests**:
   - High concurrency = more memory
   - Consider rate limiting: `express-rate-limit`

### Database Connection Issues?

1. **Increase timeouts slightly**:
   ```typescript
   serverSelectionTimeoutMS: '15000', // Instead of 10000
   ```

2. **Check MongoDB Atlas metrics**:
   - Connection count
   - Query performance

### Email Sending Fails?

1. **Reduce batch size**:
   ```typescript
   const batchSize = 200; // Instead of 500
   ```

2. **Increase retry delay**:
   ```typescript
   const delay = 2000 * Math.pow(2, attempt - 1);
   ```

## Related Files Modified

- `lib/prisma.ts` - Connection pool optimization
- `package.json` - Start script with memory limits
- `Procfile` - Deployment configuration
- `app/api/admin/subscribers/route.ts` - Added pagination
- `app/api/admin/blog/route.ts` - Added pagination

## References

- [Node.js Memory Limits](https://nodejs.org/api/cli.html#cli_max_old_space_size_size_in_megabytes)
- [MongoDB Connection Pooling](https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-pool/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
