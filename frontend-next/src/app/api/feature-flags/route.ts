import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

// Ensure environment variable access and fresh responses for flag changes
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Strongly-typed feature flags
const FLAG_KEYS = [
  "useNewFactionUI",
  "useNewDeckBuilder",
  "useNewCardDisplay",
  "useNewNavigation",
  "useNewTheme",
] as const;
type FlagKey = typeof FLAG_KEYS[number];

export interface FeatureFlags {
  useNewFactionUI: boolean;
  useNewDeckBuilder: boolean;
  useNewCardDisplay: boolean;
  useNewNavigation: boolean;
  useNewTheme: boolean;
}

function isFeatureFlags(obj: unknown): obj is FeatureFlags {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return FLAG_KEYS.every((k) => typeof o[k] === "boolean");
}

function parseEnvBool(value: string | undefined, key: string): boolean {
  if (value === undefined) return false;
  if (value === "true" || value === "false") return value === "true";
  // Invalid values are ignored; log for visibility
  console.warn(`Invalid env value for ${key}: "${value}". Expected "true" or "false". Defaulting to false.`);
  return false;
}

function readEnvFlags(env: Record<string, string | undefined>): FeatureFlags {
  return {
    useNewFactionUI: parseEnvBool(env.ENABLE_NEW_FACTION_UI, "ENABLE_NEW_FACTION_UI"),
    useNewDeckBuilder: parseEnvBool(env.ENABLE_NEW_DECK_BUILDER, "ENABLE_NEW_DECK_BUILDER"),
    useNewCardDisplay: parseEnvBool(env.ENABLE_NEW_CARD_DISPLAY, "ENABLE_NEW_CARD_DISPLAY"),
    useNewNavigation: parseEnvBool(env.ENABLE_NEW_NAVIGATION, "ENABLE_NEW_NAVIGATION"),
    useNewTheme: parseEnvBool(env.ENABLE_NEW_THEME, "ENABLE_NEW_THEME"),
  };
}

function sanitizeFlags(input: Partial<Record<FlagKey, unknown>>): FeatureFlags {
  const base = readEnvFlags(process.env as Record<string, string | undefined>);
  const out: FeatureFlags = { ...base };
  for (const k of FLAG_KEYS) {
    const v = input[k];
    if (typeof v === "boolean") out[k] = v;
  }
  return out;
}

function parseCookieFlags(raw: string | undefined): FeatureFlags | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (isFeatureFlags(parsed)) return parsed;
  } catch {
    // ignore parse errors
  }
  return null;
}

// Simple authorization: protect mutations with either:
// - Header 'x-admin-token' matching process.env.ADMIN_TOKEN, or
// - Cookie 'isAdmin' === 'true'
function isAuthorized(req: NextRequest): boolean {
  const headerToken = req.headers.get("x-admin-token");
  if (headerToken && process.env.ADMIN_TOKEN && headerToken === process.env.ADMIN_TOKEN) {
    return true;
  }
  const adminCookie = req.cookies.get("isAdmin");
  return adminCookie?.value === "true";
}

export async function GET(_req?: NextRequest) {
  try {
    // Prefer cookie (client or admin UI may have set it). Fallback to env defaults.
    const jar = cookies();
    const featureCookie = jar.get("featureFlags");

    let flags: FeatureFlags | null = parseCookieFlags(featureCookie?.value);
    if (!flags) {
      flags = readEnvFlags(process.env as Record<string, string | undefined>);
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

    const body = (await req.json()) as Partial<Record<FlagKey, unknown>>;
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