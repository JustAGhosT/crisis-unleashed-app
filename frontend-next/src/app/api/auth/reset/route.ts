import { NextRequest, NextResponse } from "next/server";
import { consumeResetToken, validateResetToken } from "./request/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = String(body?.token || "");
    const newPassword = String(body?.password || "");
    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }
    const ctx = validateResetToken(token);
    if (!ctx) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }
    // TODO: integrate backend user service to actually update password for ctx.email
    // For development, consume the token and return ok
    consumeResetToken(token);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


