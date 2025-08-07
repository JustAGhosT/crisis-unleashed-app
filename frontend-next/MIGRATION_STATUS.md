# Migration Status

## Completed

The following components and functionality have been migrated from `src/` to `frontend-next/src/`:

### Faction Components
- ✅ Faction Card components
- ✅ Faction Grid components
- ✅ Legacy components (for backward compatibility)

### Card Components
- ✅ GameCard component
- ✅ CardGrid component
- ✅ CardFilters component
- ✅ CardDetail component
- ✅ CardCollection component
- ✅ Pagination component

### Pages
- ✅ Factions list page (`/factions`)
- ✅ Faction detail page (`/factions/[id]`)
- ✅ Cards browsing page (`/cards`)

### Services
- ✅ Faction data service with mock data
- ✅ Card service with mock data
- ✅ Feature flag provider for progressive rollout

### Types
- ✅ Faction types and interfaces
- ✅ Card types and interfaces

### Custom Hooks
- ✅ useFeatureFlags hook
- ✅ useCards hook
- ✅ usePagination hook

## Implementation Details

### Data Flow
The new implementation uses a more structured approach:

1. Data is fetched through the `factionService.ts`
2. Pages consume the data and adapt it to the expected format
3. Components receive properly typed data

### Feature Flags
We've implemented feature flags to allow progressive rollout:

- The feature flag `useNewFactionUI` controls whether to use new or legacy components
- An admin UI at `/admin/feature-flags` allows toggling features
- Default is set to `true` in frontend-next (use new components)

### Type Changes
The Faction type has been enhanced:

- Added more specific fields like `tagline`, `philosophy`, `strength`, `technology`
- Converted `mechanics` from array to object with boolean flags
- Added `colors` object with primary/secondary/accent colors
- Made `id` a strongly-typed union type

## Testing

To test the migrated components:

1. Visit `/factions` to see the faction list
2. Click on a faction to see its detail page
3. Visit `/admin/feature-flags` to toggle between new and legacy views

## Next Steps

While the faction components have been migrated, there are still some items to address:

1. **API Integration**: Replace mock data with real API calls when available
2. **Image Optimization**: Ensure all images use proper Next.js Image component with optimization
3. **SEO Improvements**: Enhance metadata for better search engine visibility
4. **Analytics**: Add tracking for user interactions with faction components

## Notes for Developers

When working with faction data:

1. Import types from `@/types/faction`
2. Use the service functions from `@/services/factionService`
3. For UI components, use components from `@/components/factions/`
4. When needed, check feature flags using `useFeatureFlags()` hook

## Final Cleanup

The following files in the `src/` directory are now deprecated and can be safely deleted once all teams have migrated to the frontend-next implementation:

- `src/components/factions/*`
- `src/app/factions/*`
- Faction-related code in `src/lib/data.ts`
- Faction-related code in `src/types/faction.ts` (already deleted)