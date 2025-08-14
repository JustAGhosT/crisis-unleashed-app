import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// NextAuth v5 Route Handlers
const nextAuthExports = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const backendUrl = process.env.AUTH_BACKEND_URL;
        if (!backendUrl) {
          // Backend URL not configured; fail closed
          return null;
        }
        try {
          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          if (!res.ok) return null;
          const data = await res.json();
          // Expecting { user: { id, username, email, role, avatar? }, token? }
          const user = data?.user as
            | {
                id: string;
                username?: string;
                email: string;
                role?: "user" | "admin";
                avatar?: string | null;
              }
            | undefined;
          if (!user?.id) return null;
          return {
            id: user.id,
            name: user.username ?? user.email,
            email: user.email,
            image: user.avatar ?? undefined,
            role: user.role ?? "user",
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.authUser = {
          id: (user as { id: string }).id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          image: (user as { image?: string }).image,
          role: (user as { role?: "user" | "admin" }).role ?? "user",
        };
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      const t = token as JWT & {
        authUser?: {
          id: string;
          name?: string;
          email?: string;
          image?: string;
          role: "user" | "admin";
        };
      };
      if (t.authUser && session.user) {
        const u = t.authUser;
        // Preserve existing object to satisfy NextAuth's internal types
        const mutUser = session.user as typeof session.user & {
          id?: string;
          role?: "user" | "admin";
        };
        mutUser.id = u.id;
        mutUser.role = u.role;
        session.user.name = u.name ?? session.user.name ?? null;
        session.user.email = u.email ?? session.user.email ?? null;
        session.user.image = u.image ?? session.user.image ?? null;
      }
      return session;
    },
  },
});

export const { GET, POST } = nextAuthExports.handlers;
