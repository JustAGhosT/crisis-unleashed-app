// Faction type definitions following the existing game schema

export const FACTION_IDS = [
  'solaris',
  'umbral',
  'aeonic',
  'primordial',
  'infernal',
  'neuralis',
  'synthetic',
] as const;

export type FactionId = typeof FACTION_IDS[number];

export interface Faction {
  id: FactionId;
  name: string;
  tagline: string;
  description: string;
  philosophy: string;
  strength: string;
  technology: string;

  /** Mechanical knobs consumed by rules engine */
  mechanics: {
    energyManipulation?: boolean; // Solaris
    stealth?: boolean; // Umbral
    mindControl?: boolean; // Neuralis
    timeWarp?: boolean; // Aeonic
    adaptation?: boolean; // Primordial
    sacrifice?: boolean; // Infernal
    selfReplication?: boolean; // Synthetic
    // Add structured numeric configs if/when available
  };

  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface FactionCardProps {
  faction: Faction;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: (faction: Faction) => void;
}

export interface FactionGridProps {
  factions?: Faction[];
  onFactionClick?: (faction: Faction) => void;
  loading?: boolean;
}