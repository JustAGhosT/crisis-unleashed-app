# Feature Flag Implementation Guide

This guide explains the feature flag system used during migration from the Vite frontend to Next.js 14.

## Implementation Locations

- **Provider**: [`frontend-next/src/lib/feature-flags/feature-flag-provider.tsx`](frontend-next/src/lib/feature-flags/feature-flag-provider.tsx)
  - Exports: `FeatureFlags`, `FeatureFlagProvider`, `useFeatureFlags`
  - Persists flags to localStorage and the featureFlags cookie (Path=/, SameSite=Lax, Max-Age=31536000; Secure on HTTPS)
  - Security note: Client-set cookies cannot be HttpOnly; only store non-sensitive data and consider signing the value

- **API Route**: [`frontend-next/src/app/api/feature-flags/route.ts`](frontend-next/src/app/api/feature-flags/route.ts)
  - Provides environment-driven initial flag values

- **Layout Integration**: 
  - [`frontend-next/src/app/layout.tsx`](frontend-next/src/app/layout.tsx)
  - [`frontend-next/src/components/providers.tsx`](frontend-next/src/components/providers.tsx)
  - Implements the Providers pattern for client components in server contexts

- **Admin UI**: [`frontend-next/src/app/admin/feature-flags/page.tsx`](frontend-next/src/app/admin/feature-flags/page.tsx)
  - Provides UI for toggling flags

- **Middleware**: [`frontend-next/src/middleware.ts`](frontend-next/src/middleware.ts)
  - Reads featureFlags cookie to handle routing decisions

- **Example Usage**: [`frontend-next/src/components/factions/FactionGridWrapper.tsx`](frontend-next/src/components/factions/FactionGridWrapper.tsx)
  - Demonstrates switching between new and legacy components based on flags

## Provider Wiring in Next.js App Router

Next.js App Router uses Server Components by default, but React context providers require Client Components:

1. Create a dedicated Client Component for providers (see [`providers.tsx`](frontend-next/src/components/providers.tsx))
2. Use this component in your root layout (see [`layout.tsx`](frontend-next/src/app/layout.tsx))

This pattern allows you to:
- Keep the layout as a Server Component
- Isolate client-side code to specific components
- Properly provide context to the entire application
- Add additional providers in a single location

## Cookie Management

### Size and Encoding
- Keep the cookie under 4KB (recommended max is 2KB for broad compatibility)
- Use compact encoding (e.g., base64 encoded JSON with minimal property names)
- See [`feature-flag-provider.tsx`](frontend-next/src/lib/feature-flags/feature-flag-provider.tsx) for implementation

### Schema Versioning
- Include a schema version in the cookie structure
- Handle version migrations gracefully
- See [`cookie-migration.ts`](frontend-next/src/lib/feature-flags/cookie-migration.ts) for implementation

### Security
- Sign the cookie to prevent tampering
- See [`cookie-security.ts`](frontend-next/src/lib/feature-flags/cookie-security.ts) for implementation

## Middleware Strategy

### Server as Source of Truth
- Verify flags on the server side
- Fall back to environment defaults when verification fails
- See [`middleware.ts`](frontend-next/src/middleware.ts) for implementation

### Preventing Rewrite Issues
- Exclude static assets and API routes from rewrites
- See path exclusion patterns in [`middleware.ts`](frontend-next/src/middleware.ts)

### Preventing Rewrite Loops
- Check if the path is already pointing to legacy
- See rewrite logic in [`middleware.ts`](frontend-next/src/middleware.ts)

### Edge Performance Considerations
- Keep middleware logic minimal for optimal performance
- Consider caching implications for middleware responses

## Usage

- **In Client Components**:
  ```typescript
  import { useFeatureFlags } from "@/lib/feature-flags/feature-flag-provider";
  const { flags, setFlag } = useFeatureFlags();
  ```
  - Must be used within Client Components (marked with 'use client')

- **In Server Components**:
  - Read from cookies directly
  - Pass flag values as props to Client Components
  - Use middleware for routing decisions

## Persistence

- Flags are persisted to:
  - localStorage for client usage
  - featureFlags cookie for server-side middleware access

## Rollout Sequence (recommended)

1. useNewTheme
2. useNewNavigation
3. useNewFactionUI
4. useNewCardDisplay
5. useNewDeckBuilder

## Migration Status

### Completed Components

- **Faction Components**:
  - ✅ FactionCard component
  - ✅ FactionGrid component
  - ✅ FactionDetail component
  - ✅ FactionSelector component

- **Card Components**:
  - ✅ GameCard component
  - ✅ CardGrid component
  - ✅ CardFilters component
  - ✅ CardDetail component
  - ✅ CardCollection component
  - ✅ Pagination component

### Pending Gameplay Mechanics

While the UI components have been migrated, several gameplay mechanics are still pending implementation:

1. **Energy Cost Validation**:
   - Verification of player energy resources against card costs
   - Energy cost curve analysis for deck building
   - Faction-specific energy modifiers

2. **Play Condition Verification**:
   - Zone placement restrictions
   - Prerequisite card checks
   - Turn phase validation
   - Target validity checks

3. **Synergy Detection**:
   - Card combo identification
   - Faction synergy bonuses
   - Cross-faction interaction rules
   - Keyword interaction handling

4. **Other Outstanding Items**:
   - Battlefield positioning logic
   - Line of sight calculations for ranged abilities
   - Status effect application and tracking
   - Action history for animation and undo functionality

**Note**: Consumers should not assume parity with legacy systems for these gameplay mechanics until explicitly documented as complete.

### Additional Items to Address

1. **API Integration**: Replace mock data with real API calls when available
2. **Image Optimization**: Ensure all images use proper Next.js Image component
3. **SEO Improvements**: Enhance metadata for better search engine visibility
4. **Analytics**: Add tracking for user interactions with faction components

## Notes for Developers

When working with faction data:
1. Import types from `@/types/faction`
2. Use the service functions from `@/services/factionService`
3. For UI components, use components from `@/components/factions/`
4. When needed, check feature flags using `useFeatureFlags()` hook

## Final Cleanup

The following files are now deprecated and can be safely deleted once all teams have migrated:
- `src/components/factions/*`
- `src/app/factions/*`
- Faction-related code in `src/lib/data.ts`
- Faction-related code in `src/types/faction.ts` (already deleted)