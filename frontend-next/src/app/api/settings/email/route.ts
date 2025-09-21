import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "../../_utils/auth";
import { consumeVerifyToken } from "../../auth/verify/request/route";
import { withCsrf } from "../../middleware/csrf";

const PENDING_EMAIL = new Map<string, { email: string; token: string; expiresAt: number }>();

export const POST = withCsrf(async function POST(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const newEmail = String(body?.email || "").trim().toLowerCase();
    const token = String(body?.token || "");

    if (newEmail && !token) {
      // Stage email change; caller must separately request verify token
      const expiresAt = Date.now() + 60 * 60 * 1000;
      PENDING_EMAIL.set(auth.userId, { email: newEmail, token: "", expiresAt });
      return NextResponse.json({ ok: true, staged: true, expiresAt });
    }

    if (token) {
      const ctx = consumeVerifyToken(token);
      if (!ctx) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
      const pending = PENDING_EMAIL.get(auth.userId);
      if (!pending || Date.now() > pending.expiresAt) {
        return NextResponse.json({ error: "No pending email change" }, { status: 400 });
      }
      if (ctx.email !== pending.email) {
        return NextResponse.json({ error: "Token does not match pending email" }, { status: 400 });
      }
      // Commit change (dev-only: no persistent user store; acknowledge success)
      PENDING_EMAIL.delete(auth.userId);
      return NextResponse.json({ ok: true, email: ctx.email });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
});


