import { NextRequest, NextResponse } from "next/server";

const CSRF_COOKIE = "csrf_token";

function generateCsrfToken(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export async function GET(req: NextRequest) {
  const existing = req.cookies.get(CSRF_COOKIE)?.value;
  const token = existing || generateCsrfToken();
  const res = NextResponse.json({ token });
  res.cookies.set(CSRF_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return res;
}


