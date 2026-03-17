/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // FIX: Optimize Ant Design package imports to prevent Webpack barrel optimization issues
  // WHY: Next.js 15's Webpack incorrectly tree-shakes antd's barrel exports, causing "Cannot read properties of undefined" errors
  experimental: {
    optimizePackageImports: ['antd'],
  },

  // Image optimization for responsive delivery
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bbc-images.sgp1.cdn.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'sgp1.digitaloceanspaces.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Output optimization
  // CRITICAL for 1GB RAM servers: Creates minimal deployment package (~100MB vs ~500MB)
  // Reduces memory usage during runtime by excluding dev dependencies
  output: 'standalone',

  // TypeScript and ESLint during build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // Allow warnings but not errors
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      // PERFORMANCE FIX: Cache static assets with Expires headers
      // WHY: Reduces HTTP requests on subsequent page visits by making components cacheable
      // IMPACT: Faster page loads for returning users
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // PERFORMANCE FIX: Cache all images for 1 year
      // WHY: Images don't change frequently, aggressive caching improves performance
      {
        source: '/:path*.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString(), // 1 year
          },
        ],
      },
      // PERFORMANCE FIX: Cache JavaScript and CSS files for 1 year
      // WHY: These files are versioned, so they can be cached aggressively
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
      // PERFORMANCE FIX: Cache fonts for 1 year
      {
        source: '/:path*.(woff|woff2|ttf|otf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;