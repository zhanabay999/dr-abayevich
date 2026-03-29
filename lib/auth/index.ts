import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users, admins } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}

declare module 'next-auth' {
  interface JWT {
    role?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Логин', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Сначала ищем в таблице users (CRM)
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (user.length > 0 && user[0].isActive) {
          const isValid = await bcrypt.compare(password, user[0].password);
          if (isValid) {
            return {
              id: user[0].id.toString(),
              email: user[0].email,
              name: user[0].name,
              role: user[0].role,
            };
          }
        }

        // Фоллбэк на таблицу admins (legacy)
        const admin = await db
          .select()
          .from(admins)
          .where(eq(admins.email, email))
          .limit(1);

        if (admin.length > 0) {
          const isValid = await bcrypt.compare(password, admin[0].password);
          if (isValid) {
            return {
              id: admin[0].id.toString(),
              email: admin[0].email,
              name: admin[0].name,
              role: 'superadmin',
            };
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || 'superadmin';
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = (token.role as string) || 'superadmin';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
