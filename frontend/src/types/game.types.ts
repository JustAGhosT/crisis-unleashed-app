export type Faction = 'solaris' | 'umbral' | 'neuralis' | 'aeonic' | 'infernal' | 'primordial' | 'synthetic';

export interface GameState {
  currentTurn: number;
  activePlayer: 'player1' | 'player2';
  currentPhase: string;
  momentum: number;
  energy: number;
  health: number;
  enemyHealth: number;
}

export enum CardRarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}

export enum CardType {
  Character = 'character',
  Action = 'action',
  Upgrade = 'upgrade',
  Tactic = 'tactic',
}

export enum UnitType {
  Unit = 'unit',
  Commander = 'commander',
  Structure = 'structure',
}

export interface CardBase {
  id: string | number;
  name: string;
  description: string;
  cost: number;
  rarity: CardRarity;
  type: CardType;
  abilities?: string[];
  image?: string;
}

export interface CharacterCard extends CardBase {
  type: CardType.Character;
  attack: number;
  health: number;
  defense?: number;
  range?: number;
  movement?: number;
}

export interface ActionCard extends CardBase {
  type: CardType.Action;
  isInstant?: boolean;
  targetType?: 'unit' | 'player' | 'area' | 'self' | 'any';
  effect: (target: unknown) => void; // TODO: Define proper effect type
}

export type Card = CharacterCard | ActionCard | CardBase;

export type PlayerId = 'player1' | 'player2' | 'enemy';

export interface UnitBase {
  id: string;
  name: string;
  type: UnitType;
  health: number;
  attack: number;
  player: PlayerId;
  maxHealth?: number;
  abilities?: string[];
  position?: string; // Format: 'row-col'
  canAttack?: boolean;
  canMove?: boolean;
}

export interface Unit extends UnitBase {
  type: UnitType.Unit;
  // Unit-specific properties
  movement?: number;
  range?: number;
}

export interface Commander extends UnitBase {
  type: UnitType.Commander;
  // Commander-specific properties
  ability?: string;
  abilityCooldown?: number;
}

export interface Structure extends UnitBase {
    type: UnitType.Structure;
    // Structure-specific properties
    isInvulnerable?: boolean;
    isFlying?: boolean;
}

export type BattlefieldUnit = Unit | Commander | Structure;

export interface BattlefieldZone {
  position: string; // 'row-col'
  unit: BattlefieldUnit | null;
  isPlayerZone: boolean;
  isEnemyZone: boolean;
  isNeutralZone: boolean;
  isFrontline: boolean;
  isBackline: boolean;
}

export interface Player {
  id: PlayerId;
  name: string;
  health: number;
  energy: number;
  maxEnergy: number;
  hand: Card[];
  deck: Card[];
  discardPile: Card[];
  battlefield: BattlefieldUnit[];
  commander: Commander;
  resources: {
    mana?: number;
    influence?: number;
    [key: string]: number | undefined;
  };
}
