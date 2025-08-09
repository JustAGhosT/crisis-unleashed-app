// Strongly-typed feature flags
export const FLAG_KEYS = [
  "useNewFactionUI",
  "useNewDeckBuilder",
  "useNewCardDisplay",
  "useNewNavigation",
  "useNewTheme",
] as const;

export type FlagKey = typeof FLAG_KEYS[number];

export interface FeatureFlags {
  useNewFactionUI: boolean;
  useNewDeckBuilder: boolean;
  useNewCardDisplay: boolean;
  useNewNavigation: boolean;
  useNewTheme: boolean;
}

// Properly extend ProcessEnv using declaration merging
// This is the correct way to add custom environment variables in TypeScript
// We need to use namespace here despite the ESLint rule
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // Extend the existing ProcessEnv interface
    interface ProcessEnv {
      readonly ADMIN_TOKEN?: string;
      readonly ENABLE_NEW_FACTION_UI?: string;
      readonly ENABLE_NEW_DECK_BUILDER?: string;
      readonly ENABLE_NEW_CARD_DISPLAY?: string;
      readonly ENABLE_NEW_NAVIGATION?: string;
      readonly ENABLE_NEW_THEME?: string;
    }
  }
}