import { Axial } from '@/lib/hex';
import { BattlefieldUnit, BattlefieldZone } from '@/types/game';

export type MovementCostFn = (
  unit: BattlefieldUnit, 
  src: BattlefieldZone, 
  dst: BattlefieldZone, 
  dist: number
) => number;

// Extend BattlefieldUnit with required properties from game-algorithms.md
export interface EnhancedBattlefieldUnit extends BattlefieldUnit {
  initiative?: number;
  ethereal?: boolean;
  zocCostModifier?: number;
  abilities?: string[];
  shields?: number;
  guards?: number;
  statusEffects?: StatusEffect[];
}

export interface StatusEffect {
  type: string;
  duration: number;
  stacks?: number;
  exclusive?: boolean;
}

export enum CombatTiming {
  PRE_ATTACK = "pre-attack",
  ON_ATTACK = "on-attack", 
  ON_HIT = "on-hit",
  POST_HIT = "post-hit",
  ON_KILL = "on-kill",
  END_OF_COMBAT = "end-of-combat"
}

export interface CombatState {
  attacker: BattlefieldUnit;
  defender: BattlefieldUnit;
  damage: number;
  canceled: boolean;
  lethal: boolean;
}

export enum Phase {
  START_OF_TURN = "start-of-turn",
  RESOURCE_GAIN = "resource-gain",
  DEPLOY = "deploy",
  ACTION = "action",
  END = "end",
  CLEANUP = "cleanup"
}