// Centralized game balance constants. Keep UI components render-only and depend on these.
// Extend cautiously and prefer a single source of truth for gameplay limits.

export const DEFAULT_MAX_HEALTH = 100 as const;

// Optional per-mode maximum health map. Consumers can select by mode when available.
export const MODE_MAX_HEALTH = {
  classic: 100,
  blitz: 50,
  hardcore: 30,
} as const;

export type GameMode = keyof typeof MODE_MAX_HEALTH;

export function getMaxHealthForMode(mode?: GameMode): number {
  if (!mode) return DEFAULT_MAX_HEALTH;
  return MODE_MAX_HEALTH[mode] ?? DEFAULT_MAX_HEALTH;
}
