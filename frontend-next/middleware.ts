import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Decode auth from either NextAuth JWT cookie or our custom auth_token JWT.
// Returns role and a boolean indicating authentication present.
async function getAuthContext(req: NextRequest): Promise<{ role: string | null; isAuthenticated: boolean }> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return { role: null, isAuthenticated: false };

  const encKey = new TextEncoder().encode(secret);

  // Try NextAuth JWT cookie first (strategy: 'jwt')
  const nextAuthToken = req.cookies.get("next-auth.session-token")?.value
    || req.cookies.get("__Secure-next-auth.session-token")?.value;
  if (nextAuthToken) {
    try {
      const { payload } = await jwtVerify(nextAuthToken, encKey);
      const authUser = (payload as any).authUser as { role?: string } | undefined;
      const role = authUser?.role ?? (payload as any).role ?? null;
      return { role, isAuthenticated: true };
    } catch {
      // fallthrough
    }
  }

  // Fallback: custom auth_token issued by our login route
  const customToken = req.cookies.get("auth_token")?.value;
  if (customToken) {
    try {
      const { payload } = await jwtVerify(customToken, encKey);
      const role = (payload as any).role ?? null;
      return { role, isAuthenticated: true };
    } catch {
      // ignore
    }
  }

  return { role: null, isAuthenticated: false };
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = ["/profile", "/deck-builder", "/game", "/settings", "/admin"].some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isProtected) return NextResponse.next();

  const { role, isAuthenticated } = await getAuthContext(req);

  // Require auth for protected routes
  if (!isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Require admin role for admin routes
  if (pathname.startsWith("/admin") && role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/deck-builder/:path*",
    "/game/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};


