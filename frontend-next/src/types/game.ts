// Shared game types for frontend-next game UI
export type PlayerId = 'player1' | 'enemy' | string;

export type UnitType = 'normal' | 'ranged' | 'tank' | 'assassin' | string;

export interface BattlefieldUnit {
  id: string;
  name: string;
  player: PlayerId;
  attack: number;
  health: number;
  type?: UnitType;
  abilities?: string[];
  // Movement allowance in hexes (per turn/phase). If omitted, default to 0 (immobile).
  moveSpeed?: number;
  // Combat configuration
  // If meleeOnly is true, unit can only attack at distance 1.
  meleeOnly?: boolean;
  // Inclusive range bounds for ranged units. If provided and max > 1, unit is considered ranged.
  rangeMin?: number; // default 1 for melee
  rangeMax?: number; // default 1 for melee, typical 3 for archer
  // If true, can attack allied units (friendly fire).
  friendlyFire?: boolean;
  // If true, moving away from adjacency to an enemy costs extra (simple ZOC rule).
  zoc?: boolean;
}

export type ZoneType = 'player' | 'enemy' | 'neutral';
export type ZonePosition = 'frontline' | 'backline' | 'middle';

export interface BattlefieldZone {
  position: string; // `${row}-${col}`
  unit: BattlefieldUnit | null;
  zoneType: ZoneType;
  zonePosition: ZonePosition;
  // Axial hex coordinates (pointy-top). Enables true hex adjacency and movement.
  axial?: { q: number; r: number };
  // Optional convenience flags used by UI components for styling/logic.
  // These mirror zoneType/zonePosition but are derived during grid construction.
  isPlayerZone?: boolean;
  isEnemyZone?: boolean;
  isNeutralZone?: boolean;
  isFrontline?: boolean;
  isBackline?: boolean;
  // Lane information for tactical positioning
  lane?: "L" | "C" | "R";
}

export interface Card {
  id: string;
  name: string;
  cost?: number;
  attack?: number;
  health?: number;
  type?: UnitType;
  abilities?: string[];
}
