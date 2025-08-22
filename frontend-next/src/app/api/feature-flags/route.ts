import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Keep this in sync with src/lib/feature-flags/feature-flag-provider.tsx
export type FeatureFlags = {
  useNewFactionUI: boolean;
  useNewDeckBuilder: boolean;
  useNewCardDisplay: boolean;
  useNewNavigation: boolean;
  useNewTheme: boolean;
  enableAdvancedDeckAnalytics: boolean;
  enableCardAnimations: boolean;
  enableMultiplayerChat: boolean;
  enableTournamentMode: boolean;
  enableAIOpponent: boolean;
  enableRealtime: boolean;
};

const FLAG_KEYS: Array<keyof FeatureFlags> = [
  "useNewFactionUI",
  "useNewDeckBuilder",
  "useNewCardDisplay",
  "useNewNavigation",
  "useNewTheme",
  "enableAdvancedDeckAnalytics",
  "enableCardAnimations",
  "enableMultiplayerChat",
  "enableTournamentMode",
  "enableAIOpponent",
  "enableRealtime",
];

const defaultFlags: FeatureFlags = {
  // Align defaults with provider
  useNewFactionUI: true,
  useNewDeckBuilder: true,
  useNewCardDisplay: true,
  useNewNavigation: true,
  useNewTheme: true,
  enableAdvancedDeckAnalytics: false,
  enableCardAnimations: true,
  enableMultiplayerChat: false,
  enableTournamentMode: false,
  enableAIOpponent: false,
  enableRealtime: false,
};

function parseEnvBool(v: string | undefined): boolean | undefined {
  if (v === undefined) return undefined;
  if (v === "true") return true;
  if (v === "false") return false;
  return undefined;
}

function readEnvFlags(): Partial<FeatureFlags> {
  // Optional: allow env overrides; default to undefined (ignored) when invalid
  return {
    useNewFactionUI: parseEnvBool(process.env.ENABLE_NEW_FACTION_UI),
    useNewDeckBuilder: parseEnvBool(process.env.ENABLE_NEW_DECK_BUILDER),
    useNewCardDisplay: parseEnvBool(process.env.ENABLE_NEW_CARD_DISPLAY),
    useNewNavigation: parseEnvBool(process.env.ENABLE_NEW_NAVIGATION),
    useNewTheme: parseEnvBool(process.env.ENABLE_NEW_THEME),
    // new flags can be added here if we decide to control via env
  } as Partial<FeatureFlags>;
}

function isFeatureFlags(obj: unknown): obj is FeatureFlags {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return FLAG_KEYS.every((k) => typeof o[k] === "boolean");
}

function mergeFlags(parts: Array<Partial<FeatureFlags> | null | undefined>): FeatureFlags {
  const out: FeatureFlags = { ...defaultFlags };
  for (const p of parts) {
    if (!p) continue;
    for (const k of FLAG_KEYS) {
      const v = p[k];
      if (typeof v === "boolean") out[k] = v;
    }
  }
  return out;
}

async function readCookieFlags(): Promise<FeatureFlags | null> {
  const store = await cookies();
  const raw = store.get("featureFlags")?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (isFeatureFlags(parsed)) return parsed;
  } catch {
    // ignore
  }
  return null;
}

// Back-compat: read legacy per-flag cookies like flag_useNewFactionUI
async function readLegacyFlagCookies(): Promise<Partial<FeatureFlags> | null> {
  const store = await cookies();
  let found = false;
  const out: Partial<FeatureFlags> = {};
  for (const k of FLAG_KEYS) {
    const c = store.get(`flag_${k as string}`)?.value;
    if (c === "true" || c === "false") {
      out[k] = c === "true";
      found = true;
    }
  }
  return found ? out : null;
}

export async function GET() {
  try {
    const env = readEnvFlags();
    const cookie = await readCookieFlags();
    const legacy = await readLegacyFlagCookies();
    const flags = mergeFlags([defaultFlags, env, legacy, cookie]);
    return NextResponse.json(flags, { status: 200 });
  } catch (err) {
    console.error("/api/feature-flags GET error", err);
    return NextResponse.json({ error: "Failed to load feature flags" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => ({}));

    // Legacy shape: { key: string, value: boolean }
    if (
      typeof json?.key === "string" &&
      FLAG_KEYS.includes(json.key) &&
      typeof json?.value === "boolean"
    ) {
      const current = (await readCookieFlags()) ?? mergeFlags([readEnvFlags()]);
      const updated: FeatureFlags = { ...current, [json.key]: json.value } as FeatureFlags;
      const res = NextResponse.json({ success: true }, { status: 200 });
      res.cookies.set("featureFlags", encodeURIComponent(JSON.stringify(updated)), {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
      return res;
    }

    // Preferred shape: full flags object
    if (isFeatureFlags(json)) {
      const updated = mergeFlags([json]);
      const res = NextResponse.json({ success: true }, { status: 200 });
      res.cookies.set("featureFlags", encodeURIComponent(JSON.stringify(updated)), {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365,
      });
      return res;
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (err) {
    console.error("/api/feature-flags POST error", err);
    return NextResponse.json({ error: "Failed to update feature flags" }, { status: 500 });
  }
}
