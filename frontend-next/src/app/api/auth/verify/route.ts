import { NextRequest, NextResponse } from "next/server";
import { consumeVerifyToken } from "./request/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = String(body?.token || "");
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });
    const ctx = consumeVerifyToken(token);
    if (!ctx) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    // TODO: update user record as verified for ctx.email (backend integration)
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


