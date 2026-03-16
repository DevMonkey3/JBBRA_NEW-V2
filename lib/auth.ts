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
          console.log('[AUTH] Login attempt for email:', creds?.email);

          if (!creds?.email || !creds?.password) {
            console.log('[AUTH] Missing email or password');
            return null;
          }

          const user = await prisma.adminUser.findUnique({
            where: { email: creds.email }
          });

          if (!user) {
            console.log('[AUTH] User not found in database:', creds.email);
            return null;
          }

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
      // If token doesn't have user data, return session without user (handles stale/decrypted cookies)
      if (!token?.user) {
        return session;
      }
      session.user = token.user as any;
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log('[AUTH] User signed in:', user.email);
    },
    async signOut({ token }) {
      console.log('[AUTH] User signed out');
    },
    // FIX: removed 'error' event — not a valid NextAuth EventCallback type
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === 'development',
}
