import { NextRequest } from "next/server";
import { FeatureFlags, FLAG_KEYS, FlagKey } from "./types";

export function isFeatureFlags(obj: unknown): obj is FeatureFlags {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return FLAG_KEYS.every((k) => typeof o[k] === "boolean");
}

export function parseEnvBool(value: string | undefined, key: string): boolean {
  if (value === undefined) return false;
  if (value === "true" || value === "false") return value === "true";
  // Invalid values are ignored; log for visibility
  console.warn(`Invalid env value for ${key}: "${value}". Expected "true" or "false". Defaulting to false.`);
  return false;
}

export function readEnvFlags(env: NodeJS.ProcessEnv): FeatureFlags {
  return {
    useNewFactionUI: parseEnvBool(env.ENABLE_NEW_FACTION_UI, "ENABLE_NEW_FACTION_UI"),
    useNewDeckBuilder: parseEnvBool(env.ENABLE_NEW_DECK_BUILDER, "ENABLE_NEW_DECK_BUILDER"),
    useNewCardDisplay: parseEnvBool(env.ENABLE_NEW_CARD_DISPLAY, "ENABLE_NEW_CARD_DISPLAY"),
    useNewNavigation: parseEnvBool(env.ENABLE_NEW_NAVIGATION, "ENABLE_NEW_NAVIGATION"),
    useNewTheme: parseEnvBool(env.ENABLE_NEW_THEME, "ENABLE_NEW_THEME"),
  };
}

export function sanitizeFlags(input: Partial<Record<FlagKey, unknown>>): FeatureFlags {
  const base = readEnvFlags(process.env);
  const out: FeatureFlags = { ...base };
  for (const k of FLAG_KEYS) {
    const v = input[k];
    if (typeof v === "boolean") out[k] = v;
  }
  return out;
}

export function parseCookieFlags(raw: string | undefined): FeatureFlags | null {
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
export function isAuthorized(req: NextRequest): boolean {
  const headerToken = req.headers.get("x-admin-token");
  // Use optional chaining to safely access ADMIN_TOKEN
  if (headerToken && process.env.ADMIN_TOKEN && headerToken === process.env.ADMIN_TOKEN) {
    return true;
  }
  const adminCookie = req.cookies.get("isAdmin");
  return adminCookie?.value === "true";
}