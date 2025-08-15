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
}

export interface BattlefieldZone {
  position: string; // `${row}-${col}`
  unit: BattlefieldUnit | null;
  isPlayerZone: boolean;
  isEnemyZone: boolean;
  isNeutralZone: boolean;
  isFrontline: boolean;
  isBackline: boolean;
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
