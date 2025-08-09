# Feature Flag Implementation Guide

This guide explains where the feature-flag implementation lives and how to use it during migration from the Vite frontend to Next.js 14.

## Implementation Locations

- Provider: frontend-next/src/lib/feature-flags/feature-flag-provider.tsx
  - Exports: FeatureFlags, FeatureFlagProvider, useFeatureFlags
  - Persists flags to localStorage and the featureFlags cookie (Path=/, SameSite=Lax, Max-Age=1y; Secure on HTTPS)
- API route: frontend-next/src/app/api/feature-flags/route.ts
  - Env-driven example for initial flag values
- Layout wiring: frontend-next/src/app/layout.tsx
  - Wraps app with <FeatureFlagProvider>
- Admin UI: frontend-next/src/app/admin/feature-flags/page.tsx
  - Toggle flags via UI using the provider
- Middleware: frontend-next/src/middleware.ts
  - Reads featureFlags cookie to decide rewrites to legacy when disabled
- Example wrapper usage: frontend-next/src/components/factions/FactionGridWrapper.tsx
  - Switches between new and legacy components based on flags

## Usage

- Access flags in client components:
  - import { useFeatureFlags } from "@/lib/feature-flags/feature-flag-provider"
  - const { flags, setFlag } = useFeatureFlags()

- Ensure the root layout wraps children with FeatureFlagProvider (see layout.tsx).

- Middleware automatically rewrites non-enabled routes to legacy using the cookie.

## Persistence

- Flags are persisted to:
  - localStorage for client usage
  - featureFlags cookie for server-side middleware access during request-time rewrites

## Rollout Sequence (recommended)

1. useNewTheme
2. useNewNavigation
3. useNewFactionUI
4. useNewCardDisplay
5. useNewDeckBuilder
