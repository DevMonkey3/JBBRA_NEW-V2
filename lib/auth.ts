import type { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds) {
        try {
          // FIX: Added detailed logging to debug production auth issues
          console.log('[AUTH] Login attempt for email:', creds?.email);

          if (!creds?.email || !creds?.password) {
            console.log('[AUTH] Missing email or password');
            return null;
          }

          // FIX: Check database connection
          const user = await prisma.adminUser.findUnique({
            where: { email: creds.email }
          });

          if (!user) {
            console.log('[AUTH] User not found in database:', creds.email);
            return null;
          }

          console.log('[AUTH] User found, checking password...');
          const ok = await bcrypt.compare(creds.password, user.passwordHash);

          if (!ok) {
            console.log('[AUTH] Password mismatch');
            return null;
          }

          console.log('[AUTH] Login successful for:', user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name || 'Admin'
          };
        } catch (error) {
          console.error('[AUTH] Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as any;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
}
