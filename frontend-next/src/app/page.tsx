"use client";

import Link from "next/link";
import type { Route } from "next";
import GameStatus from "@/components/game/GameStatus";
import { FactionGrid } from "@/components/factions/FactionGrid";
import { Sparkles } from "lucide-react";
import {
  FACTION_TOKENS,
  DEFAULT_TOKENS,
  type FactionKey,
} from "@/lib/theme/faction-theme";
import { FactionThemeProvider } from "@/lib/theme/theme-context";
import { useFactionKey } from "@/lib/theme/use-faction-key";

export default function HomePage() {
  const factionKey: FactionKey = useFactionKey();
  const palette = FACTION_TOKENS[factionKey] ?? DEFAULT_TOKENS;
  const routes = {
    game: "/game" as Route,
    deckBuilder: "/deck-builder" as Route,
    factions: "/factions" as Route,
  };

  return (
    <FactionThemeProvider initial={factionKey}>
      <main className={`relative w-full overflow-hidden ${palette.mainBg}`}>
      {/* Subtle animated gradient background layers (decorative) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Top glow (slower pulse) */}
        <div className={`absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-gradient-to-b ${palette.glowTop} to-transparent blur-3xl opacity-50 motion-safe:animate-[pulse_8s_ease-in-out_infinite] motion-reduce:opacity-25 motion-reduce:animate-none`} />
        {/* Bottom glow (slower pulse) */}
        <div className={`absolute -bottom-24 right-1/3 h-[30rem] w-[30rem] rounded-full bg-gradient-to-t ${palette.glowBottom} to-transparent blur-3xl opacity-40 motion-safe:animate-[pulse_9s_ease-in-out_infinite] motion-reduce:opacity-20 motion-reduce:animate-none`} />

        {/* Tiny particle layer using staggered pulses */}
        <div className="absolute inset-0">
          <div className="absolute left-[12%] top-[28%] h-1.5 w-1.5 rounded-full bg-white/20 motion-safe:animate-[pulse_5s_ease-in-out_infinite] motion-reduce:opacity-30 motion-reduce:animate-none" />
          <div className="absolute left-[72%] top-[18%] h-1 w-1 rounded-full bg-white/15 motion-safe:animate-[pulse_7s_ease-in-out_infinite] motion-reduce:opacity-30 motion-reduce:animate-none" />
          <div className="absolute left-[60%] top-[62%] h-1.5 w-1.5 rounded-full bg-white/10 motion-safe:animate-[pulse_9s_ease-in-out_infinite] motion-reduce:opacity-30 motion-reduce:animate-none" />
          <div className="absolute left-[34%] top-[70%] h-1 w-1 rounded-full bg-white/10 motion-safe:animate-[pulse_11s_ease-in-out_infinite] motion-reduce:opacity-30 motion-reduce:animate-none" />
        </div>
      </div>
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="container mx-auto max-w-6xl px-4 py-12 sm:py-16"
      >
        <div className="text-center">
          <div className={`mx-auto inline-flex items-center gap-2 rounded-full border ${palette.pillBorder} ${palette.pillBg} px-3 py-1 ${palette.pillText}`}>
            <Sparkles className="h-4 w-4" aria-hidden />
            <span className="text-xs font-medium tracking-wide">Enter the Nexus</span>
          </div>
          <h1 id="hero-heading" className="text-4xl font-bold tracking-tight sm:text-5xl">
            Crisis Unleashed
          </h1>
          {/* Small rotating SVG accent, color derived from faction */}
          <div className="mt-4 flex justify-center">
            <div className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-transform duration-500 motion-safe:group-hover:rotate-6">
              <svg viewBox="0 0 64 64" className={`${palette.svg.size} opacity-80`}>
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className="[stop-color:currentColor]" />
                    <stop offset="100%" className="[stop-color:currentColor] opacity-70" />
                  </linearGradient>
                </defs>
                <g className="text-white/80">
                  <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50" />
                  {palette.svg.variant === "triangle" && (
                    <path d="M32 10 L46 34 L18 34 Z" fill="currentColor" className="opacity-30" />
                  )}
                  {palette.svg.variant === "diamond" && (
                    <path d="M32 14 L46 32 L32 50 L18 32 Z" fill="currentColor" className="opacity-30" />
                  )}
                  {palette.svg.variant === "hex" && (
                    <path d="M24 18 L40 18 L48 32 L40 46 L24 46 L16 32 Z" fill="currentColor" className="opacity-30" />
                  )}
                  {palette.svg.variant === "leaf" && (
                    <path d="M32 16 C24 20,20 28,32 48 C44 28,40 20,32 16 Z" fill="currentColor" className="opacity-30" />
                  )}
                  {palette.svg.variant === "flame" && (
                    <path d="M32 16 C28 24,36 26,32 34 C28 38,26 44,32 48 C40 44,44 36,38 28 C36 24,36 20,32 16 Z" fill="currentColor" className="opacity-30" />
                  )}
                  {palette.svg.variant === "orb" && (
                    <circle cx="32" cy="32" r="8" fill="currentColor" className="opacity-30" />
                  )}
                  {palette.svg.variant === "gear" && (
                    <path d="M32 22 L36 22 L38 26 L42 28 L42 32 L38 34 L36 38 L32 38 L28 38 L26 34 L22 32 L22 28 L26 26 L28 22 Z" fill="currentColor" className="opacity-30" />
                  )}
                </g>
              </svg>
            </div>
          </div>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Strategic digital card combat across seven metaphysical factions.
          </p>

          {/* Primary CTAs */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={routes.game}
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            >
              Start Playing
            </Link>
            <Link
              href={routes.deckBuilder}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Build Deck
            </Link>
            <Link
              href={routes.factions}
              className="inline-flex items-center justify-center rounded-md bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-100 shadow hover:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              View Factions
            </Link>
          </div>
        </div>

        {/* Status */}
        <div className="mt-10 sm:mt-12">
          <GameStatus className="w-full max-w-3xl mx-auto" />
        </div>
      </section>

      {/* Factions preview */}
      <section
        aria-labelledby="factions-heading"
        className="container mx-auto max-w-6xl px-4 py-8"
      >
        <h2 id="factions-heading" className="sr-only">
          Faction preview
        </h2>
        <FactionGrid />
      </section>

      {/* Feature highlights */}
      <section
        aria-labelledby="features-heading"
        className="container mx-auto max-w-6xl px-4 pb-12"
      >
        <h2 id="features-heading" className="sr-only">
          Core features
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className={`rounded-lg border border-slate-800/60 bg-slate-900/40 p-5 ring-1 ${palette.ring} transition-shadow` }>
            <h3 className="text-base font-semibold">Strategic Combat</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Initiative, positioning, and abilities define every turn.
            </p>
          </div>
          <div className={`rounded-lg border border-slate-800/60 bg-slate-900/40 p-5 ring-1 ${palette.ring} transition-shadow` }>
            <h3 className="text-base font-semibold">Digital Ownership</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Own, trade, and showcase your collection on-chain.
            </p>
          </div>
          <div className={`rounded-lg border border-slate-800/60 bg-slate-900/40 p-5 ring-1 ${palette.ring} transition-shadow` }>
            <h3 className="text-base font-semibold">Rich Lore</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Seven factions with unique metaphysical mechanics.
            </p>
          </div>
        </div>
      </section>
      </main>
    </FactionThemeProvider>
  );
}
