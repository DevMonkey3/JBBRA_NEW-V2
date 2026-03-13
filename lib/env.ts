// lib/env.ts
// Environment variable validation

function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value || '';
}

export const env = {
  // Database
  databaseUrl: getEnvVar('DATABASE_URL'),

  // Auth
  nextAuthUrl: getEnvVar('NEXTAUTH_URL'),
  nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),

  // Email
  resendApiKey: getEnvVar('RESEND_API_KEY', false),

  // Admin
  adminEmail: getEnvVar('ADMIN_EMAIL', false),
  adminPassword: getEnvVar('ADMIN_PASSWORD', false),

  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// Validate on import in development
if (env.isDevelopment) {
  console.log('✅ Environment variables loaded successfully');
}
