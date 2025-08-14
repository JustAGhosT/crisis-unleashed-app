"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
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

  return useMemo<FactionKey>(() => {
    // 1) Query param
    if (isFactionKey(factionParam)) return factionParam as FactionKey;

    // 2) Cookie
    const cookieVal = parseCookie("theme:active");
    if (cookieVal && isFactionKey(cookieVal)) return cookieVal as FactionKey;

    // 3) Default
    return "default";
  }, [factionParam]);
}

