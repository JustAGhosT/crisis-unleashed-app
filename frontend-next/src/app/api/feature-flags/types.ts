// Strongly-typed feature flags
export const FLAG_KEYS = [
  "useNewFactionUI",
  "useNewDeckBuilder",
  "useNewCardDisplay",
  "useNewNavigation",
  "useNewTheme",
] as const;

export type FlagKey = (typeof FLAG_KEYS)[number];

export interface FeatureFlags {
  useNewFactionUI: boolean;
  useNewDeckBuilder: boolean;
  useNewCardDisplay: boolean;
  useNewNavigation: boolean;
  useNewTheme: boolean;
}
