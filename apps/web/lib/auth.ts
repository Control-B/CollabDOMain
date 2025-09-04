import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

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
        if (!creds?.email) return null;
        const user = {
          id: 'u_demo',
          name: 'Demo User',
          email: creds.email,
          tenantId: 't_demo',
          facilityId: 'f_demo',
          roles: ['Admin'],
        } as any;
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = (user as any).tenantId;
        token.facilityId = (user as any).facilityId;
        token.roles = (user as any).roles;
      }
      return token as any;
    },
    async session({ session, token }) {
      (session as any).tenantId = (token as any).tenantId;
      (session as any).facilityId = (token as any).facilityId;
      (session as any).roles = (token as any).roles;
      return session;
    },
  },
});
export const requireSession = async () => {
  const session = await auth();
  if (!session) throw new Error('UNAUTHENTICATED');
  return session as any;
};
