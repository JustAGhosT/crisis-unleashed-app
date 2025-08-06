# Faction Migration Plan

This document outlines the remaining steps to complete the migration of faction-related functionality from `src/` to `frontend-next/src/`.

## Completed Steps

- ✅ Deleted outdated faction components from `src/components/legacy/`
- ✅ Deleted `src/types/faction.ts` in favor of `frontend-next/src/types/faction.ts`
- ✅ Updated `FactionGridWrapper.tsx` to use types and components from frontend-next
- ✅ Updated import paths to reference frontend-next components

## Remaining Steps

### 1. Data Service Migration

The faction data service in `src/lib/data.ts` needs to be migrated to frontend-next:

1. Create or update `frontend-next/src/services/factionService.ts` to include:
   - `getFactions()`
   - `getFactionIds()`
   - `getFaction(id)`

2. Ensure the faction data in frontend-next includes all the information from `src/lib/data.ts`

3. Delete or deprecate the faction-related functions in `src/lib/data.ts`

### 2. Page Migration

Migrate the faction pages to frontend-next:

1. Create `frontend-next/src/app/factions/page.tsx` based on `src/app/factions/page.tsx`
2. Create `frontend-next/src/app/factions/[id]/page.tsx` based on `src/app/factions/[id]/page.tsx`
3. Update the pages to use the frontend-next data services and components
4. Delete or update the old pages in `src/app/factions/`

### 3. Feature Flag Provider

Update the feature flag provider in frontend-next to include the faction UI flag:

1. Ensure `frontend-next/src/lib/feature-flags/feature-flag-provider.tsx` includes `useNewFactionUI`
2. Update the feature flag admin UI if it exists

### 4. Cleanup

After all migration is complete:

1. Delete `src/components/factions/` directory
2. Remove faction-related code from `src/lib/data.ts`
3. Update any remaining references to old faction components or types

## Migration Timeline

- Data Service Migration: [DATE]
- Page Migration: [DATE]
- Feature Flag Provider Update: [DATE]
- Final Cleanup: [DATE]

## Testing Plan

1. Verify that the faction list page displays correctly with both the new and legacy implementations
2. Verify that the faction detail pages load correctly and display all information
3. Test the feature flag to switch between new and legacy implementations
4. Ensure all links and navigation between faction pages works correctly