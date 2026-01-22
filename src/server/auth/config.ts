import type { DefaultSession, NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '~/db';
import { env } from '~/env';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
    } & DefaultSession['user'];
  }
}

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.image = user.image;
      }
      if (!token.sub) return token;
      const existingUser = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
      });
      if (existingUser) {
        token.image = existingUser.image;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
  events: {
    createUser: async ({ user }) => {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
} satisfies NextAuthConfig;