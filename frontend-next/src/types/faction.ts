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