import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Build connection URL with optimization parameters for MongoDB Atlas
// OPTIMIZED for 1GB RAM server: Faster timeouts prevent resource exhaustion
const getDatabaseUrl = () => {
  const baseUrl = process.env.DATABASE_URL || '';
  if (!baseUrl) return baseUrl;

  const urlObj = new URL(baseUrl.startsWith('mongodb') ? baseUrl : `mongodb://${baseUrl}`);

  // Enforce critical timeouts and pool settings for low-memory servers
  const params = {
    maxPoolSize: '25',              // Per-app pool (total ~50 for both apps)
    minPoolSize: '1',               // Keep minimum 1 connection alive
    maxIdleTimeMS: '60000',         // Close idle connections after 1 minute
    serverSelectionTimeoutMS: '30000',  // 30s for MongoDB Atlas cold starts
    connectTimeoutMS: '20000',          // 20s for network latency
    socketTimeoutMS: '60000',           // 60s for slow queries
  };

  // Add or update parameters
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });

  return urlObj.toString();
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["warn", "error"],
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

// FIX: Add connection error handler to prevent app crash on DB issues
prisma.$connect().catch((error) => {
  console.error('[PRISMA] Failed to connect to database:', error.message);
  console.error('[PRISMA] App will continue running but database operations may fail');
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
