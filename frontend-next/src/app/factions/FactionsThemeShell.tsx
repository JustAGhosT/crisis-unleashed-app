"use client";

import React from "react";
import { FACTION_TOKENS, type FactionKey } from "@/lib/theme/faction-theme";
import { FactionThemeProvider } from "@/lib/theme/theme-context";
import { useFactionKey } from "@/lib/theme/use-faction-key";

export default function FactionsThemeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const factionKey: FactionKey = useFactionKey();
  const palette = FACTION_TOKENS[factionKey];

  return (
    <FactionThemeProvider initial={factionKey}>
      <main className={`relative w-full overflow-hidden ${palette.mainBg}`}>
        {/* Decorative background glows (motion-safe) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className={`absolute -top-32 left-1/3 h-[28rem] w-[28rem] rounded-full bg-gradient-to-b ${palette.glowTop} to-transparent blur-3xl opacity-50 motion-safe:animate-[pulse_7s_ease-in-out_infinite] motion-reduce:opacity-25 motion-reduce:animate-none`}
          />
          <div
            className={`absolute -bottom-24 right-1/4 h-[26rem] w-[26rem] rounded-full bg-gradient-to-t ${palette.glowBottom} to-transparent blur-3xl opacity-40 motion-safe:animate-[pulse_8s_ease-in-out_infinite] motion-reduce:opacity-20 motion-reduce:animate-none`}
          />
        </div>

        <div className="container mx-auto px-4 py-10 sm:py-12">{children}</div>
      </main>
    </FactionThemeProvider>
  );
}
