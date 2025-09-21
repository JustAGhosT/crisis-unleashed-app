import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export type AuthContext = {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  role: "user" | "admin" | null;
};

export async function getAuthContext(req: NextRequest): Promise<AuthContext> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return { isAuthenticated: false, userId: null, email: null, role: null };
  const encKey = new TextEncoder().encode(secret);

  // Try NextAuth session token first
  const nextAuthToken = req.cookies.get("next-auth.session-token")?.value
    || req.cookies.get("__Secure-next-auth.session-token")?.value;
  if (nextAuthToken) {
    try {
      const { payload } = await jwtVerify(nextAuthToken, encKey);
      const authUser = (payload as any).authUser as
        | { id: string; email?: string; role?: "user" | "admin" }
        | undefined;
      if (authUser?.id) {
        return {
          isAuthenticated: true,
          userId: authUser.id,
          email: authUser.email ?? null,
          role: authUser.role ?? null,
        };
      }
    } catch {
      // fallthrough
    }
  }

  // Fallback: custom auth_token from dev login
  const custom = req.cookies.get("auth_token")?.value;
  if (custom) {
    try {
      const { payload } = await jwtVerify(custom, encKey);
      const userId = (payload as any).sub as string | undefined;
      const email = (payload as any).email as string | undefined;
      const role = (payload as any).role as ("user" | "admin") | undefined;
      if (userId) {
        return {
          isAuthenticated: true,
          userId,
          email: email ?? null,
          role: role ?? null,
        };
      }
    } catch {
      // ignore
    }
  }

  return { isAuthenticated: false, userId: null, email: null, role: null };
}


