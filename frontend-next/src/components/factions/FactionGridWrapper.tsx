"use client";

import { useFeatureFlags } from "@/lib/feature-flags/feature-flag-provider";
import { Faction } from "frontend-next/src/types/faction";
import { FactionGrid } from "frontend-next/src/components/factions/FactionGrid";
import { LegacyFactionGrid } from "frontend-next/src/components/legacy/LegacyFactionGrid";

// Define the old faction structure for proper typing
interface OldFaction {
  id: string;
  name: string;
  description: string;
  color: string;
  logo: string;
  bannerImage?: string;
  mechanics?: string[];
}

interface FactionGridWrapperProps {
  factions: OldFaction[];
}

/**
 * This component conditionally renders either the new or legacy FactionGrid
 * based on a feature flag.
 */
export function FactionGridWrapper({ factions }: FactionGridWrapperProps) {
  const { flags } = useFeatureFlags();

  // Map the old faction structure to the new one
  const adaptedFactions = factions.map(faction => ({
    id: faction.id as any,
    name: faction.name,
    tagline: faction.description.split('.')[0] || '',
    description: faction.description,
    philosophy: 'Default philosophy',
    strength: 'Default strength',
    technology: 'Default technology',
    mechanics: Array.isArray(faction.mechanics)
      ? faction.mechanics.reduce((acc, mechanic) => ({ ...acc, [mechanic]: true }), {})
      : {},
    colors: {
      primary: faction.color,
      secondary: faction.color,
      accent: faction.color
    }
  }));

  // Use the new implementation if the feature flag is enabled
  if (flags.useNewFactionUI) {
    return <FactionGrid factions={adaptedFactions as any} />;
  }

  // Use the legacy implementation 
  return <LegacyFactionGrid factions={adaptedFactions as any} />;
}