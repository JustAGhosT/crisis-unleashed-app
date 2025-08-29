import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// NextAuth v5 Route Handlers
const nextAuthExports = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
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
          // Remove /api from the path since it's already handled by the rewrite in next.config.js
          const res = await fetch(`${backendUrl}/auth/login`, {
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
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      // Initial sign in
      if (user && account) {
        // For social logins (OAuth providers)
        if (account.provider === 'google' || account.provider === 'discord') {
          try {
            // Register or link the social account with our system
            const backendUrl = process.env.AUTH_BACKEND_URL;
            if (backendUrl) {
              // Remove /api from the path since it's already handled by the rewrite
              const res = await fetch(`${backendUrl}/auth/social-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  provider: account.provider,
                  providerId: account.providerAccountId,
                  email: user.email,
                  name: user.name,
                  image: user.image,
                }),
              });
              
              if (res.ok) {
                const data = await res.json();
                // Use the user data from our backend
                if (data.user?.id) {
                  token.authUser = {
                    id: data.user.id,
                    name: data.user.username ?? user.name ?? undefined,
                    email: data.user.email ?? user.email ?? undefined,
                    image: data.user.avatar ?? user.image ?? undefined,
                    role: data.user.role ?? "user",
                  };
                  return token;
                }
              }
            }
          } catch (error) {
            console.error("Error syncing social login with backend:", error);
          }
        }

        // Fallback for social login or default for credentials login
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
  debug: process.env.NODE_ENV === "development",
});

export const { GET, POST } = nextAuthExports.handlers;