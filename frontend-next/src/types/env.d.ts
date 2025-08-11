// Ambient type declarations for environment variables used in the app
// Ensures process.env access is type-safe and unified across the codebase

export {};

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      // Allow arbitrary environment variables while keeping explicit ones typed
      readonly [key: string]: string | undefined;
      readonly ADMIN_TOKEN?: string;
      readonly NEXT_PUBLIC_API_URL?: string;
      // Feature flag envs (server-evaluated booleans as strings)
      readonly ENABLE_NEW_FACTION_UI?: string;
      readonly ENABLE_NEW_DECK_BUILDER?: string;
      readonly ENABLE_NEW_CARD_DISPLAY?: string;
      readonly ENABLE_NEW_NAVIGATION?: string;
      readonly ENABLE_NEW_THEME?: string;
    }
  }
}
