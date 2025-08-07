# Migration to frontend-next

This document tracks the progress of migrating from `src` to `frontend-next/src`.

## Completed Migrations

- Legacy faction components → `frontend-next/src/components/legacy/`
- Faction type → `frontend-next/src/types/faction.ts`
- Faction grid components → `frontend-next/src/components/factions/`

## Remaining Migrations

- `src/app/factions/page.tsx` → `frontend-next/src/app/factions/page.tsx`
- `src/app/factions/[id]/page.tsx` → `frontend-next/src/app/factions/[id]/page.tsx`
- `src/lib/data.ts` (faction functions) → `frontend-next/src/services/factionService.ts`

## Migration Strategy

1. Delete old files from `src`
2. Use components directly from `frontend-next/src`
3. Update imports to point to frontend-next

## Next Steps

1. Migrate faction pages to frontend-next
2. Move data service functions to frontend-next
3. Delete remaining faction-related files from src
