import { withCsrf } from "@/app/api/middleware/csrf";
import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKENS = new Map<string, { email: string; expiresAt: number }>();

// Simple in-memory rate limiter for verification requests
const RL_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RL_MAX_REQUESTS = 5; // per window
const RATE_MAP = new Map<string, number[]>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const arr = RATE_MAP.get(key) ?? [];
  const recent = arr.filter((t) => now - t < RL_WINDOW_MS);
  if (recent.length >= RL_MAX_REQUESTS) {
    RATE_MAP.set(key, recent);
    return false;
  }
  recent.push(now);
  RATE_MAP.set(key, recent);
  return true;
}

function token(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export const POST = withCsrf(async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rlKey = `${ip}:${email}`;
    if (!rateLimit(rlKey)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    const t = token();
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1h
    VERIFY_TOKENS.set(t, { email, expiresAt });
    return NextResponse.json({ ok: true, token: t, expiresAt });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
});

export function consumeVerifyToken(t: string): { email: string } | null {
  const entry = VERIFY_TOKENS.get(t);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    VERIFY_TOKENS.delete(t);
    return null;
  }
  VERIFY_TOKENS.delete(t);
  return { email: entry.email };
}


