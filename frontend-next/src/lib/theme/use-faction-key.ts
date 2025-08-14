"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useFeatureFlag } from "@/lib/feature-flags/useFeatureFlag";
import { FACTION_KEYS, type FactionKey } from "./faction-theme";

function parseCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

export function useFactionKey(): FactionKey {
  const searchParams = useSearchParams();
  const factionParam = (searchParams.get("faction") || "").toLowerCase();
  const isFactionKey = (v: string): v is FactionKey =>
    (FACTION_KEYS as readonly string[]).includes(v);

  // Consolidated single flag (string) e.g. theme:active=umbral
  const activeThemeFlag = useFeatureFlag("theme:active");

  return useMemo<FactionKey>(() => {
    // 1) Query param
    if (isFactionKey(factionParam)) return factionParam as FactionKey;

    // 2) Cookie
    const cookieVal = parseCookie("theme:active");
    if (cookieVal && isFactionKey(cookieVal)) return cookieVal as FactionKey;

    // 3) Single feature flag value (string)
    if (typeof activeThemeFlag === "string" && isFactionKey(activeThemeFlag)) {
      return activeThemeFlag as FactionKey;
    }

    // 4) Default
    return "default";
  }, [activeThemeFlag, factionParam]);
}
