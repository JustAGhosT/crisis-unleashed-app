// Faction type definitions following the existing game schema

export type FactionId = 
  | 'solaris' 
  | 'umbral' 
  | 'aeonic' 
  | 'primordial' 
  | 'infernal' 
  | 'neuralis' 
  | 'synthetic';

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