"use client";

import { useFeatureFlags } from "@/lib/feature-flags/feature-flag-provider";
import { Faction } from "@/types/faction";

// Import both implementations
import { FactionGrid as NewFactionGrid } from "@/components/factions/FactionGrid";
import { FactionGrid as LegacyFactionGrid } from "@/components/legacy/FactionGrid";

interface FactionGridWrapperProps {
  factions: Faction[];
}

export function FactionGridWrapper({ factions }: FactionGridWrapperProps) {
  const { flags } = useFeatureFlags();
  
  // Use the new implementation if the feature flag is enabled
  if (flags.useNewFactionUI) {
    return <NewFactionGrid factions={factions} />;
  }
  
  // Otherwise, use the legacy implementation
  return <LegacyFactionGrid factions={factions} />;
}