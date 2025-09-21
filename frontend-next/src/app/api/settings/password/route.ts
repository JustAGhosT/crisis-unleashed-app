import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "../../_utils/auth";

type PasswordRecord = { hash: string };
const PASSWORDS = new Map<string, PasswordRecord>();

function hash(pw: string): string {
  // Dev-only: trivial hash placeholder
  const enc = new TextEncoder().encode(pw);
  let h = 0;
  for (let i = 0; i < enc.length; i++) h = (h * 31 + enc[i]) >>> 0;
  return h.toString(16);
}

export async function POST(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as {
      currentPassword: string;
      newPassword: string;
    };
    if (!body?.currentPassword || !body?.newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const rec = PASSWORDS.get(auth.userId) ?? { hash: hash("password") };
    if (rec.hash !== hash(body.currentPassword)) {
      return NextResponse.json({ error: "Current password invalid" }, { status: 400 });
    }
    PASSWORDS.set(auth.userId, { hash: hash(body.newPassword) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


