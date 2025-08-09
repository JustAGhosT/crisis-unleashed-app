"use client";

import { useMemo } from "react";
import { useFeatureFlags } from "@/lib/feature-flags/feature-flag-provider";
import { Faction, FactionId } from "@/types/faction";
import { FactionGrid } from "@/components/factions/FactionGrid";
import { LegacyFactionGrid } from "@/components/legacy/LegacyFactionGrid";

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

  // Map legacy mechanic strings to typed mechanic keys
  const mechanicsKeyMap: Record<string, keyof Faction["mechanics"]> = {
    energyManipulation: "energyManipulation",
    stealth: "stealth",
    mindControl: "mindControl",
    timeWarp: "timeWarp",
    adaptation: "adaptation",
    sacrifice: "sacrifice",
  };

  // Map the old faction structure to the new one (memoized and typed)
  const adaptedFactions = useMemo(() =>
    factions.map<Faction>((faction) => ({
      id: faction.id as FactionId,
      name: faction.name,
      tagline: faction.description.split('.')[0] || '',
      description: faction.description,
      philosophy: 'Default philosophy',
      strength: 'Default strength',
      technology: 'Default technology',
      mechanics: Array.isArray(faction.mechanics)
        ? faction.mechanics.reduce<Partial<Faction["mechanics"]>>((acc, m) => {
            const key = mechanicsKeyMap[m];
            if (key) acc[key] = true;
            return acc;
          }, {}) as Faction["mechanics"]
        : {},
      colors: {
        primary: faction.color,
        secondary: faction.color,
        accent: faction.color,
      },
    })),
    [factions]
  );

  // Use the new implementation if the feature flag is enabled
  if (flags?.useNewFactionUI) {
    return <FactionGrid factions={adaptedFactions} />;
  }

  // Use the legacy implementation 
  return <LegacyFactionGrid factions={adaptedFactions} />;
}