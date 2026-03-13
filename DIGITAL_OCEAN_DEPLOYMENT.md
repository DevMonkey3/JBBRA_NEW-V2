# Digital Ocean Deployment Guide ($10/month - 1GB RAM)

## ✅ Completed Optimizations

1. **Standalone Output Enabled** - Reduces deployment size from ~500MB to ~100MB
2. **Prisma Auto-Generate** - Prisma client generated automatically during build
3. **TypeScript Errors Fixed** - All type definitions created and validated
4. **Build Successful** - All 63 pages generated without errors

---

## 📦 Build Locally, Deploy to Server

### Step 1: Build Locally (on your Windows machine)

```bash
cd "D:\New folder (6)\New folder\JBBRa-new-main"

# Install dependencies
npm install

# Build the project (creates standalone output)
npm run build
```

This creates:
- `.next/standalone/` folder (~100MB)
- `.next/static/` folder (static assets)

---

### Step 2: Prepare Digital Ocean Server

**SSH into your server:**
```bash
ssh root@your-server-ip
```

**Install Node.js 20.x:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify installation
node -v  # Should show v20.x
npm -v   # Should show 9.x or higher
```

**Install PM2 (Process Manager):**
```bash
npm install -g pm2
```

**Create 2GB Swap Space (CRITICAL for 1GB RAM servers):**
```bash
# Create swap file
fallocate -l 2G /swapfile

# Set secure permissions
chmod 600 /swapfile

# Set up swap
mkswap /swapfile
swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab

# Verify
free -h  # Should show 2G swap
```

**Create app directory:**
```bash
mkdir -p /var/www/jbbc
cd /var/www/jbbc
```

---

### Step 3: Upload Build Files

**Option A: Using SCP (from your local machine)**

```bash
# From your project folder
cd .next/standalone

# Copy standalone files
scp -r * root@your-server-ip:/var/www/jbbc

# Copy static files
scp -r ../static root@your-server-ip:/var/www/jbbc/static

# Copy package.json
scp ../../package.json root@your-server-ip:/var/www/jbbc
```

**Option B: Using Git**

```bash
# On server
cd /var/www/jbbc
git clone your-repo-url .
npm install
npm run build

# Copy standalone folder
cp -r .next/standalone/* .
cp -r .next/static ./static
```

**Option C: Using rsync (faster for updates)**

```bash
# From your local machine
rsync -avz --exclude='node_modules' --exclude='.env' \
  .next/standalone/ root@your-server-ip:/var/www/jbbc/

rsync -avz .next/static/ root@your-server-ip:/var/www/jbbc/static/
```

---

### Step 4: Configure Environment Variables on Server

**On your server:**
```bash
cd /var/www/jbbc
nano .env
```

**Paste your environment variables:**
```env
# Database
DATABASE_URL=mongodb+srv://tashdidhassan27_db_user:nqRtTymqrb9tPUxb@jbbc.emou4zp.mongodb.net/jbbc?retryWrites=true&w=majority&maxPoolSize=5&serverSelectionTimeoutMS=5000&socketTimeoutMS=10000&connectTimeoutMS=5000

# Email Service (Resend)
RESEND_API_KEY=re_GTaup5Vs_3o8LpHxWFtbV5z3jbMBhpnev

# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!

# NextAuth
NEXTAUTH_SECRET="4EJ/4n76Lj08TvrfWpYEnucnVR46XSZWyD2UzqkNeq8="
NEXTAUTH_URL="https://jbbc.co.jp"

# Google Sheets
GOOGLE_SHEETS_SPREADSHEET_ID=1Vr53b39KDte33v6kN4UAYVnZJeAISmBHckkT9D0PzlU
GOOGLE_SERVICE_ACCOUNT_EMAIL=jbbc-downloads-writer@jbbc-474209.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3yMkvtnM1hBQI\nd7AvUANV6vOzRr2zer51QWu+dpJNBVwUfig3Zi/uhgegpLLrUZgf6RpmocoTgBfd\nDCazkG1QqcbbDnDyinrORptm8N8B6eYrMW+8PE9MpuXcMFt4ylckS9qcyyThrqRD\noyY9C57LMR+rL8qxLU4WlxSOMAo/12ic9DDVexdOYkFi9gI/z0lDvawtQRnSZbSW\nAfCo5/m48env3HP261HF25/99p7ytrmud6UdknwPr8NIFdbhmHQfMryKaKaUbmDZ\nmVMr/jr6qCv21VU8qZPB9wzzJ7yPQ+4WpTMmDDi7jPfCITZIHMy0GYnIQVW0JRRS\n/QNIxAUbAgMBAAECggEABLpLNxBxBESiiKBXIuzijmpBatsYrRHXmDKXobvi5ZQa\nRfUgZ/Derh46iR0MZo7Y5GokzEZrMHc6+0GBUkCIUSPkCVc6GF3TXrCdoFdKlVM9\ny8H8XKAKxGgisyoh9Za6euv+ZHUPkif+R8TsUXOyS7Tvr7qqAPF2acmwCnU5sAyy\nRNbmfq5omUitDWjwBXAS3sK7feAN7Wgo4T+i/Q1RW3PpAcLhija7Jr8E63GczHFi\noacEwYNYZYlQspsHOzBk58UJV6scltVAaURgw3RqUVysKBmi65nZFg2GnBRObaAS\nzz0KfIDvspicpNDllhfq42wDBQU2kR+GM+AwvjrwsQKBgQD3UApAip82AHWllrcJ\ncEnM8bJUHjAN9rbCFWUug0oe1YeXzfNPKbiBjWw9oYW7yG1eF0D4kyh7YpXaLXcp\nmTkRsv55jRGh70DmbazisImjGp36ebDKuGD4Nl4mq3D9ilNhVVodtjA8TXcmgR9a\nykFrIFr+kZ2aMaRt94xbHuAJswKBgQC+PXeQDNW/KxNQC8mpkq7kwAJlrv+Yybwy\n7OuMeTjL8NawF6LCItnB+bZqcKPwb2Iuo0NEGy2QTyrhz3ZtkxJQu5RHzyjZzG3t\nG06dBCSJOvKyNOk7jZkz0GBLWmu9fot80G7x5/DxwOWgyHERUKXMV7qHWEfo6X4j\nFRMO0SQS+QKBgAwplId+CbxnI2IEWnYNXqPEkyeN4IEfS/eZg8NY05FWoPd3Omr/\nO0KryNHzGpeUkMRa0mgnHIuM2p/DMqQKFANp0Rf7Nw3GrWNnq2PumKY7zd8ekvI1\nRReP3Ot77O+bGOSlhOwHJLIigSSUnw0g+zygd7kjQiPuIw8BaJammw//AoGBAKF/\n5QRxIPQNSXPmzegbEkY3itFv4qR+fjptTvoN3t2jM16CcjWFCH/X0bhCr6nppNwa\n1Xv35pJf4vOX/929wQqwc40SnIdpONjVGcPKRIoLdQU8TdO0vZ5zA4x00oon55qq\nB8VtNerF6yq3fuVIJbh3sW48z682qVJ3DZrCiXFhAoGBAJfL/t2YWEsV0mKS2FiJ\niWez1BdnYO/HhStJdpIeAiacySnskw+eFSEvAa3IjapVGDnnXJyLWhpxmOIzqwrl\nJJvucOSR1SYWnvyUY1nlRCw9olShZHEM85z+G3aw4K0oZE3SyK8xsXDsxQsJxYrs\ngVVqM7o9O+fvyg2h8/6D2zMM\n-----END PRIVATE KEY-----\n"

# Digital Ocean Spaces
SPACES_REGION=sgp1
SPACES_ENDPOINT=https://sgp1.digitaloceanspaces.com
SPACES_BUCKET=bbc-images
SPACES_ACCESS_KEY_ID=DO801HWQ6B6M7LJ8PRKT
SPACES_SECRET_KEY=9OWuMMTbFSpPr+ZwcksSLvdFgebb6dM11EzM+uZNf8k
SPACES_CDN_ENDPOINT=https://bbc-images.sgp1.cdn.digitaloceanspaces.com
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

---

### Step 5: Install Production Dependencies

```bash
cd /var/www/jbbc

# Install ONLY production dependencies (smaller footprint)
npm install --production

# Generate Prisma Client
npx prisma generate
```

---

### Step 6: Start Application with PM2

```bash
cd /var/www/jbbc

# Start the application
pm2 start server.js --name jbbc

# Save PM2 configuration (auto-restart on server reboot)
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command that pm2 startup outputs
```

**Monitor your application:**
```bash
# View logs
pm2 logs jbbc

# Monitor resources
pm2 monit

# Check status
pm2 status

# Restart app
pm2 restart jbbc

# Stop app
pm2 stop jbbc
```

---

### Step 7: Setup Nginx Reverse Proxy

**Install Nginx:**
```bash
apt-get update
apt-get install -y nginx
```

**Create Nginx configuration:**
```bash
nano /etc/nginx/sites-available/jbbc
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name jbbc.co.jp www.jbbc.co.jp;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static assets - cache for 1 year
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

**Enable the site:**
```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/jbbc /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

---

### Step 8: Setup SSL with Let's Encrypt (FREE)

```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d jbbc.co.jp -d www.jbbc.co.jp

# Auto-renewal is setup automatically
# Test renewal
certbot renew --dry-run
```

---

## 🔧 Maintenance Commands

### View Application Logs
```bash
pm2 logs jbbc --lines 100
```

### Monitor Memory Usage
```bash
pm2 monit
```

### Check Server Resources
```bash
free -h  # RAM and swap usage
df -h    # Disk usage
top      # CPU and memory usage
```

### Restart Application
```bash
pm2 restart jbbc
```

### Update Application
```bash
cd /var/www/jbbc

# Pull latest changes (if using git)
git pull

# Or upload new build from local machine
# ... (see Step 3)

# Install dependencies
npm install --production

# Restart
pm2 restart jbbc
```

### Backup Database
```bash
# MongoDB Atlas has automatic backups
# Access via MongoDB Compass or Atlas web interface
```

---

## ⚠️ Troubleshooting

### Application Won't Start
```bash
# Check logs
pm2 logs jbbc --err

# Check if port 3000 is in use
netstat -tulpn | grep 3000

# Kill process on port 3000
kill $(lsof -t -i:3000)
```

### Out of Memory Errors
```bash
# Check swap is active
free -h

# If swap is 0, re-enable it
swapon /swapfile

# Reduce Next.js worker threads
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=512"
```

### Database Connection Errors
```bash
# Test MongoDB connection
node -e "const {MongoClient} = require('mongodb'); MongoClient.connect(process.env.DATABASE_URL).then(() => console.log('Connected!'))"

# Check .env file
cat .env | grep DATABASE_URL
```

### High CPU Usage
```bash
# Check PM2 processes
pm2 status

# Monitor in real-time
pm2 monit

# Check server load
uptime
```

---

## 📊 Expected Performance

### Resource Usage (Idle)
- RAM: ~300-400MB
- CPU: ~1-5%
- Disk: ~500MB

### Resource Usage (Under Load)
- RAM: ~500-700MB
- CPU: ~20-40%
- Concurrent Users: 20-30

### Page Load Times
- Homepage: 1.5-2.5s
- Blog Posts: 1-1.5s
- Admin Dashboard: 2-3s
- API Responses: <500ms

---

## 🎯 Next Steps

1. **Monitor for 24 hours** - Watch logs and resource usage
2. **Setup uptime monitoring** - Use UptimeRobot (free)
3. **Configure backup strategy** - MongoDB Atlas automatic backups
4. **Setup error tracking** - Consider Sentry (free tier)
5. **Enable CDN** - Already using Digital Ocean Spaces ✅

---

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs jbbc`
2. Check server resources: `pm2 monit`
3. Verify environment variables: `cat .env`
4. Test database connection: `npm run db:test` (if available)

---

**Last Updated:** March 2026
**Next.js Version:** 15.5.12
**Node.js Version:** 20.x
**Server:** Digital Ocean $10/month (1GB RAM, 1 CPU, 25GB SSD)
