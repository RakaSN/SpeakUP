import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/shared/server/db';
import bcrypt from 'bcryptjs';
import { authConfig } from '@/config/auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: authConfig.secret,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@sekolah.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Cari user berdasarkan email (aktif dan tidak terhapus)
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || user.deletedAt) {
          return null; // Invalid credentials or soft-deleted
        }

        // Validasi password dengan bcrypt
        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password);
        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login', // Nanti kita buat halaman login kustom di Task 0.7
  },
});
