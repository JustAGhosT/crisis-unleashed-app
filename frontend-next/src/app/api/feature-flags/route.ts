import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { 
  isAuthorized, 
  parseCookieFlags, 
  readEnvFlags, 
  sanitizeFlags 
} from "./utils";
import { FeatureFlags } from "./types";

// Ensure environment variable access and fresh responses for flag changes
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Avoid unused parameter warning by using underscore prefix
export async function GET(_req: NextRequest) {
  try {
    // Prefer cookie (client or admin UI may have set it). Fallback to env defaults.
    const jar = cookies();
    const featureCookie = jar.get("featureFlags");

    let flags: FeatureFlags | null = parseCookieFlags(featureCookie?.value);
    if (!flags) {
      flags = readEnvFlags(process.env);
    }

    const res = NextResponse.json(flags);
    // Ensure cookie exists/updated with current flags
    res.cookies.set("featureFlags", JSON.stringify(flags), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  } catch (e) {
    console.error("GET /api/feature-flags failed", e);
    return NextResponse.json({ error: "Failed to load feature flags" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const incoming = sanitizeFlags(body);

    const res = NextResponse.json({ ok: true, flags: incoming });
    res.cookies.set("featureFlags", JSON.stringify(incoming), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  } catch (e) {
    console.error("POST /api/feature-flags failed", e);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}