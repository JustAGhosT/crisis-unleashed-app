import { CombatState, CombatTiming, StatusEffect } from '@/types/battlefield';
import { BattlefieldUnit } from '@/types/game';

/**
 * Combat resolver class that encapsulates combat state and prevents concurrency issues.
 * Each instance maintains its own pending deaths queue for proper isolation.
 */
export class CombatResolver {
  private pendingDeaths: BattlefieldUnit[] = [];
  
  /**
   * Mark a unit as dead for later processing.
   * Units are queued in FIFO order to ensure consistent death resolution.
   */
  markUnitAsDead(
    unitId: string, 
    units: Record<string, BattlefieldUnit>
  ): void {
    const unit = units[unitId];
    if (unit && !this.pendingDeaths.some(u => u.id === unitId)) {
      this.pendingDeaths.push(unit);
    }
  }
  
  // Process deaths in FIFO order
  processDeaths(
    units: Record<string, BattlefieldUnit>, 
    onDeathEffect?: (unit: BattlefieldUnit) => void, 
    onRemoveUnit: (unit: BattlefieldUnit) => void
  ): void {
    this.pendingDeaths.forEach(unit => {
      // Only call the death effect callback if it's provided
      if (onDeathEffect) {
        onDeathEffect(unit);
      }

      // Remove the unit from the game state
      onRemoveUnit(unit);
    });
    
    // Clear the queue after processing
    this.pendingDeaths = [];
  }
}

// Standalone version of markUnitAsDead for use outside the resolver
export function markUnitAsDead(
  unitId: string, 
  units: Record<string, BattlefieldUnit>
): void {
  const unit = units[unitId];
  if (unit) {
    unit.isPendingDeath = true;
  }
}

// Process deaths in FIFO order (standalone version)
export function processDeaths(
  units: Record<string, BattlefieldUnit>, 
  onDeathEffect?: (unit: BattlefieldUnit) => void, 
  onRemoveUnit: (unit: BattlefieldUnit) => void
): void {
  const pendingDeaths = Object.values(units).filter(unit => unit.isPendingDeath);

  pendingDeaths.forEach(unit => {
    // Only call the death effect callback if it's provided
    if (onDeathEffect) {
      onDeathEffect(unit);
    }

    // Remove the unit from the game state
    onRemoveUnit(unit);
  });
}

// Apply damage to a unit (reduce shields/guards first)
export function applyDamage(
  defender: BattlefieldUnit,
  damage: number
): number {
  let remainingDamage = damage;

  // Reduce shields first
  if (defender.shields && defender.shields > 0) {
    if (defender.shields >= remainingDamage) {
      defender.shields -= remainingDamage;
      return 0; // All damage absorbed by shields
    } else {
      remainingDamage -= defender.shields;
      defender.shields = 0;
    }
  }

  // Reduce guards next
  if (defender.guards && defender.guards > 0) {
    if (defender.guards >= remainingDamage) {
      defender.guards -= remainingDamage;
      return 0; // All damage absorbed by guards
    } else {
      remainingDamage -= defender.guards;
      defender.guards = 0;
    }
  }

  // Apply remaining damage to health
  defender.health -= remainingDamage;
  return remainingDamage;
}

// Trigger abilities for a specific combat timing window
export function triggerAbilities(
  timing: CombatTiming,
  combatState: CombatState,
  triggerFn: (unit: BattlefieldUnit, timing: CombatTiming, state: CombatState) => void
): void {
  // Trigger attacker abilities first
  triggerFn(combatState.attacker, timing, combatState);

  // If combat is not canceled, trigger defender abilities
  if (!combatState.canceled) {
    triggerFn(combatState.defender, timing, combatState);
  }
}

// Full combat resolution sequence
export function resolveCombat(
  attacker: BattlefieldUnit,
  defender: BattlefieldUnit,
  units: Record<string, BattlefieldUnit>,
  triggerFn: (unit: BattlefieldUnit, timing: CombatTiming, state: CombatState) => void,
  onRemoveUnit: (unitId: string) => void
): void {
  const combatState: CombatState = {
    attacker,
    defender,
    damage: attacker.attack,
    canceled: false,
    lethal: false
  };

  // 1. Pre-attack timing window
  triggerAbilities(CombatTiming.PRE_ATTACK, combatState, triggerFn);
  if (combatState.canceled) return;

  // 2. On-attack timing window
  triggerAbilities(CombatTiming.ON_ATTACK, combatState, triggerFn);
  if (combatState.canceled) return;

  // 3. On-hit timing window
  triggerAbilities(CombatTiming.ON_HIT, combatState, triggerFn);

  // 4. Apply damage (reduce shields first)
  const remainingDamage = applyDamage(defender, combatState.damage);

  // 5. Post-hit timing window
  combatState.lethal = defender.health <= 0;
  triggerAbilities(CombatTiming.POST_HIT, combatState, triggerFn);

  // 6. On-kill timing window (if applicable)
  if (combatState.lethal) {
    // Mark the unit as dead and trigger ON_KILL effects immediately
    markUnitAsDead(combatState.defender.id, units);
    triggerAbilities(CombatTiming.ON_KILL, combatState, triggerFn);
  }

  // 7. End-of-combat timing window
  triggerAbilities(CombatTiming.END_OF_COMBAT, combatState, triggerFn);

  // Process any pending deaths without re-triggering ON_KILL
  if (combatState.lethal) {
    processDeaths(
      units,
      () => {}, // No-op
      (unit) => onRemoveUnit(unit.id)
    );
  }
}

// Apply status effect with stacking rules
export function applyStatusEffect(
  target: BattlefieldUnit,
  effect: StatusEffect
): void {
  if (!target.statusEffects) {
    target.statusEffects = [];
  }

  const existingEffect = target.statusEffects.find(e => e.type === effect.type);

  if (existingEffect) {
    if (effect.exclusive) {
      // Replace existing effect
      const index = target.statusEffects.indexOf(existingEffect);
      target.statusEffects[index] = effect;
    } else {
      // Stack effect
      existingEffect.stacks = (existingEffect.stacks || 1) + (effect.stacks || 1);
      existingEffect.duration = Math.max(existingEffect.duration, effect.duration);
    }
  } else {
    target.statusEffects.push({ ...effect, stacks: effect.stacks || 1 });
  }
}

// Decrement status effect durations (for cleanup phase)
export function decrementStatusEffectDurations(units: Record<string, BattlefieldUnit>): void {
  Object.values(units).forEach(unit => {
    if (!unit.statusEffects) return;

    unit.statusEffects = unit.statusEffects
      .map(effect => ({ ...effect, duration: effect.duration - 1 }))
      .filter(effect => effect.duration > 0);
  });
}