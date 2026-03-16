import { PrismaClient } from "@prisma/client";

// Optimized for 1GB RAM / shared CPU DigitalOcean server.
// Each MongoDB connection uses ~5-10MB RAM.
// With maxPoolSize=5 and two app instances, peak usage stays under ~100MB for connections.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getDatabaseUrl = (): string => {
  const base = process.env.DATABASE_URL ?? '';
  if (!base) return base;

  try {
    const url = new URL(base.startsWith('mongodb') ? base : `mongodb://${base}`);
    const params: Record<string, string> = {
      maxPoolSize: '5',
      minPoolSize: '1',            // Keep 1 warm connection to avoid cold start latency
      maxIdleTimeMS: '45000',      // Slightly longer than Atlas M0 idle timeout
      serverSelectionTimeoutMS: '10000',
      connectTimeoutMS: '10000',
      socketTimeoutMS: '45000',
      heartbeatFrequencyMS: '10000', // Ping Atlas every 10s - prevents dropped connections
      retryReads: 'true',            // Auto-reconnect if Atlas drops connection mid-request
      retryWrites: 'true',
    };
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    return url.toString();
  } catch {
    // If URL parsing fails, return the original and let Prisma surface the error
    return base;
  }
};

function createPrismaClient(): PrismaClient {
  // Do NOT call $connect() here.
  // Prisma connects lazily on the first query — eager connect wastes a
  // connection at cold start even if the request never touches the DB.
  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error'],
    datasources: {
      db: { url: getDatabaseUrl() },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
