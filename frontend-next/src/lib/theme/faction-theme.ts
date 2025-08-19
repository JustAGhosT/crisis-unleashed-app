"use client";

export const FACTION_KEYS = [
  "solaris",
  "umbral",
  "aeonic",
  "primordial",
  "infernal",
  "neuralis",
  "synthetic",
] as const;

export type FactionKey = typeof FACTION_KEYS[number];
export type Variant = "triangle" | "diamond" | "hex" | "leaf" | "flame" | "orb" | "gear";

export type Tokens = {
  glowTop: string;
  glowBottom: string;
  mainBg: string;
  pillBorder: string;
  pillBg: string;
  pillText: string;
  ring: string;
  svg: { size: string; variant: Variant };
};

export const FACTION_TOKENS: Record<FactionKey, Tokens> = {
  solaris: {
    glowTop: "from-amber-400/20 via-amber-300/10",
    glowBottom: "from-amber-300/15 via-amber-200/10",
    mainBg: "bg-slate-950",
    pillBorder: "border-amber-500/30",
    pillBg: "bg-amber-500/10",
    pillText: "text-amber-200/90",
    ring: "ring-amber-400/20 hover:ring-amber-400/30",
    svg: { size: "h-8 w-8", variant: "triangle" },
  },
  umbral: {
    glowTop: "from-violet-400/20 via-purple-400/10",
    glowBottom: "from-fuchsia-400/15 via-violet-300/10",
    mainBg: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
    pillBorder: "border-violet-500/30",
    pillBg: "bg-violet-500/10",
    pillText: "text-violet-200/90",
    ring: "ring-violet-400/20 hover:ring-violet-400/30",
    svg: { size: "h-7 w-7", variant: "diamond" },
  },
  aeonic: {
    glowTop: "from-sky-400/20 via-indigo-400/10",
    glowBottom: "from-indigo-400/15 via-sky-300/10",
    mainBg: "bg-slate-950",
    pillBorder: "border-indigo-500/30",
    pillBg: "bg-indigo-500/10",
    pillText: "text-indigo-200/90",
    ring: "ring-indigo-400/20 hover:ring-indigo-400/30",
    svg: { size: "h-8 w-8", variant: "hex" },
  },
  primordial: {
    glowTop: "from-emerald-400/20 via-lime-400/10",
    glowBottom: "from-lime-400/15 via-emerald-300/10",
    mainBg: "bg-slate-950",
    pillBorder: "border-emerald-500/30",
    pillBg: "bg-emerald-500/10",
    pillText: "text-emerald-200/90",
    ring: "ring-emerald-400/20 hover:ring-emerald-400/30",
    svg: { size: "h-8 w-8", variant: "leaf" },
  },
  infernal: {
    glowTop: "from-red-500/20 via-orange-500/10",
    glowBottom: "from-orange-500/15 via-red-400/10",
    mainBg: "bg-slate-950",
    pillBorder: "border-red-500/30",
    pillBg: "bg-red-500/10",
    pillText: "text-red-200/90",
    ring: "ring-red-400/20 hover:ring-red-400/30",
    svg: { size: "h-9 w-9", variant: "flame" },
  },
  neuralis: {
    glowTop: "from-pink-400/20 via-rose-400/10",
    glowBottom: "from-rose-400/15 via-pink-300/10",
    mainBg: "bg-slate-950",
    pillBorder: "border-pink-500/30",
    pillBg: "bg-pink-500/10",
    pillText: "text-pink-200/90",
    ring: "ring-pink-400/20 hover:ring-pink-400/30",
    svg: { size: "h-7 w-7", variant: "orb" },
  },
  synthetic: {
    glowTop: "from-cyan-400/20 via-slate-400/10",
    glowBottom: "from-slate-400/15 via-cyan-300/10",
    mainBg: "bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950",
    pillBorder: "border-cyan-500/30",
    pillBg: "bg-cyan-500/10",
    pillText: "text-cyan-200/90",
    ring: "ring-cyan-400/20 hover:ring-cyan-400/30",
    svg: { size: "h-7 w-7", variant: "gear" },
  },
};

// Fallback tokens for non-specified or unknown faction contexts
export const DEFAULT_TOKENS: Tokens = {
  glowTop: "from-amber-400/15 via-amber-300/10",
  glowBottom: "from-sky-400/15 via-indigo-400/10",
  mainBg: "bg-slate-950",
  pillBorder: "border-amber-500/30",
  pillBg: "bg-amber-500/10",
  pillText: "text-amber-200/90",
  ring: "ring-amber-400/20 hover:ring-amber-400/30",
  svg: { size: "h-8 w-8", variant: "triangle" },
};
