import { withCsrf } from "@/app/api/middleware/csrf";
import { NextRequest, NextResponse } from "next/server";

// In-memory reset token store for development.
// Maps reset token -> { email, expiresAt }
const RESET_TOKENS = new Map<string, { email: string; expiresAt: number }>();

// Simple in-memory rate limiter: key -> timestamps[] (ms)
const RL_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RL_MAX_REQUESTS = 5; // per window
const RATE_MAP = new Map<string, number[]>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const arr = RATE_MAP.get(key) ?? [];
  // drop old
  const recent = arr.filter((t) => now - t < RL_WINDOW_MS);
  if (recent.length >= RL_MAX_REQUESTS) {
    RATE_MAP.set(key, recent);
    return false;
  }
  recent.push(now);
  RATE_MAP.set(key, recent);
  return true;
}

function generateToken(): string {
  // URL-safe token
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export const POST = withCsrf(async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Apply simple rate limiting per IP+email
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rlKey = `${ip}:${email}`;
    if (!rateLimit(rlKey)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Generate a short-lived reset token (15 minutes)
    const token = generateToken();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    RESET_TOKENS.set(token, { email, expiresAt });

    // In production, send email with a link like:
    // `${origin}/auth/reset?token=${token}`
    // For development, return the token in the response so it can be tested without email.
    return NextResponse.json({ ok: true, token, expiresAt });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
});

// Utility for other handlers to validate reset tokens
export function validateResetToken(token: string): { email: string } | null {
  const entry = RESET_TOKENS.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    RESET_TOKENS.delete(token);
    return null;
  }
  return { email: entry.email };
}

export function consumeResetToken(token: string): void {
  RESET_TOKENS.delete(token);
}


