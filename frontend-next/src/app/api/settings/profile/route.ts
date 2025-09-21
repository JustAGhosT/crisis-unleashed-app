import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "../../_utils/auth";

type ProfilePayload = {
  username: string;
  email: string;
  preferredFaction?: string;
};

// In-memory dev store
const PROFILES = new Map<string, ProfilePayload>();

export async function PUT(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Partial<ProfilePayload>;
    const current = PROFILES.get(auth.userId) ?? {
      username: auth.email ?? "user",
      email: auth.email ?? "",
      preferredFaction: "",
    };
    const updated: ProfilePayload = {
      username: String(body.username ?? current.username),
      email: String(body.email ?? current.email),
      preferredFaction: (body.preferredFaction ?? current.preferredFaction) as string,
    };
    PROFILES.set(auth.userId, updated);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = PROFILES.get(auth.userId) ?? null;
  return NextResponse.json({ profile: data });
}


