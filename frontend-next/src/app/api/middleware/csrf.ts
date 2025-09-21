import { NextRequest, NextResponse } from "next/server";

const CSRF_COOKIE = "csrf_token";

function generateCsrfToken(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export function withCsrf(handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const method = req.method.toUpperCase();
    const url = new URL(req.url);
    const isStateChanging = ["POST", "PUT", "DELETE", "PATCH"].includes(method);

    // Ensure CSRF cookie exists (double-submit cookie pattern)
    const existing = req.cookies.get(CSRF_COOKIE)?.value;
    const token = existing || generateCsrfToken();

    if (isStateChanging) {
      const headerToken = req.headers.get("x-csrf-token") || req.headers.get("X-CSRF-Token");
      if (!headerToken || headerToken !== token) {
        const res = NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
        res.cookies.set(CSRF_COOKIE, token, { httpOnly: false, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
        return res;
      }
    }

    const res = await handler(req);
    // Always set cookie for GET/HEAD as well so clients can pick it up
    res.cookies.set(CSRF_COOKIE, token, { httpOnly: false, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
    return res;
  };
}


