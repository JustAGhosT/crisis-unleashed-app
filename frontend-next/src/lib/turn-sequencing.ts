import { BattlefieldUnit } from '@/types/game';
import { Phase } from '@/types/battlefield';
import { isInLane } from '@/lib/hex-advanced';

// Calculate resource gain based on turn and faction
export function calculateResourceGain(turn: number, factionBonus: number = 0): number {
  const baseTurnGain = Math.floor(turn / 2);
  return baseTurnGain + factionBonus;
}

// Order units by initiative, breaking ties as specified
export function orderUnitsByInitiative(units: BattlefieldUnit[]): BattlefieldUnit[] {
  return [...units].sort((a, b) => {
    // Primary sort: initiative (higher first)
    if (a.initiative !== b.initiative) {
      return (b.initiative || 0) - (a.initiative || 0); 
    }
    
    // Secondary sort: lane (L < C < R)
    if (a.zone?.axial && b.zone?.axial) {
      const aLane = isInLane(a.zone.axial);
      const bLane = isInLane(b.zone.axial);
      if (aLane !== bLane) {
        // Convert lane to numeric value for comparison
        const laneValue = { 'L': 0, 'C': 1, 'R': 2 };
        return laneValue[aLane] - laneValue[bLane];
      }
    }
    
    // Tertiary sort: position (lowest q, then r)
    if (a.zone?.axial && b.zone?.axial) {
      if (a.zone.axial.q !== b.zone.axial.q) {
        return a.zone.axial.q - b.zone.axial.q;
      }
      return a.zone.axial.r - b.zone.axial.r;
    }
    
    return 0;
  });
}

// Evaluate crises during End phase
export function evaluateCrises(
  crises: any[], // Replace with proper Crisis type
  gameState: any, // Replace with proper GameState type
  onCrisisTriggered: (crisis: any) => void
): void {
  // Only run once per turn
  if (gameState.crisisEvaluatedThisTurn) return;
  
  crises.forEach(crisis => {
    if (meetsCrisisTrigger(crisis, gameState)) {
      onCrisisTriggered(crisis);
    }
  });
  
  gameState.crisisEvaluatedThisTurn = true;
}

// Helper to check if a crisis meets its trigger conditions
function meetsCrisisTrigger(crisis: any, gameState: any): boolean {
  // Implement crisis trigger logic based on game state
  // This is a placeholder - implement the actual logic
  return false;
}

// Phase transition function
export function handlePhaseTransition(
  currentPhase: Phase,
  nextPhase: Phase,
  gameState: any,
  handlers: {
    onStartOfTurn?: () => void;
    onResourceGain?: (gain: number) => void;
    onCleanup?: () => void;
    onEvaluateCrises?: () => void;
  }
): Phase {
  switch (nextPhase) {
    case Phase.START_OF_TURN:
      handlers.onStartOfTurn?.();
      break;
    case Phase.RESOURCE_GAIN:
      const gain = calculateResourceGain(gameState.currentTurn, gameState.factionBonus);
      handlers.onResourceGain?.(gain);
      
      // Cap momentum at 10
      if (gameState.momentum > 10) {
        gameState.momentum = 10;
      }
      break;
    case Phase.END:
      handlers.onEvaluateCrises?.();
      break;
    case Phase.CLEANUP:
      gameState.crisisEvaluatedThisTurn = false;
      handlers.onCleanup?.();
      break;
  }
  
  return nextPhase;
}