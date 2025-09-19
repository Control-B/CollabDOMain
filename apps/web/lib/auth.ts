import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { z } from 'zod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth({
  ...({ trustHost: true } as any),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: creds.email,
              password: creds.password,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            console.error('Login error:', error);
            return null;
          }

          const data = await response.json();
          
          return {
            id: data.user.id,
            name: `${data.user.firstName} ${data.user.lastName}`,
            email: data.user.email,
            tenantId: data.user.tenantId,
            facilityId: data.user.facilityId,
            roles: data.user.roles,
            accessToken: data.token,
          } as any;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.tenantId = (user as any).tenantId;
        token.facilityId = (user as any).facilityId;
        token.roles = (user as any).roles;
        token.accessToken = (user as any).accessToken;
      }
      
      // Handle Google OAuth
      if (account?.provider === 'google' && user) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/social`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider: 'google',
              idToken: account.id_token || '',
              email: user.email,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
            }),
          });

          if (response.ok) {
            const data = await response.json();
            token.tenantId = data.user.tenantId;
            token.facilityId = data.user.facilityId;
            token.roles = data.user.roles;
            token.accessToken = data.token;
          }
        } catch (error) {
          console.error('Google OAuth error:', error);
        }
      }
      
      return token as any;
    },
    async session({ session, token }) {
      (session as any).tenantId = (token as any).tenantId;
      (session as any).facilityId = (token as any).facilityId;
      (session as any).roles = (token as any).roles;
      (session as any).accessToken = (token as any).accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
});
export const requireSession = async () => {
  const session = await auth();
  if (!session) throw new Error('UNAUTHENTICATED');
  return session as any;
};
