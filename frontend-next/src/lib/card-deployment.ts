import { Axial } from '@/lib/hex';
import { Card } from '@/types/game';
import { axialNeighbors, axialToKey } from '@/lib/hex-advanced';

// Validate card deployment based on various rules
export function validateCardDeployment(
  card: Card,
  position: string,
  gameState: any,
  getZoneByPosition: (pos: string) => any
): boolean {
  // 1. Check resource cost
  if (!hasEnoughResources(card, gameState)) {
    return false;
  }
  
  // 2. Position validation based on card type
  const zone = getZoneByPosition(position);
  if (!zone || !isValidPositionForCardType(card, zone)) {
    return false;
  }
  
  // 3. Faction-specific deployment rules
  if (!meetsDeploymentRequirementsForFaction(card, zone, gameState)) {
    return false;
  }
  
  // 4. Unit type placement restrictions
  if (!isValidPlacementForUnitType(card, zone, gameState)) {
    return false;
  }
  
  return true;
}

// Check if player has enough resources to play card
function hasEnoughResources(card: Card, gameState: any): boolean {
  if (card.energyCost && gameState.energy < card.energyCost) {
    return false;
  }
  
  if (card.momentumCost && gameState.momentum < card.momentumCost) {
    return false;
  }
  
  return true;
}

// Check if the position is valid for card type
export function isValidPositionForCardType(card: Card, zone: any): boolean {
  switch (card.type) {
    case "Unit":
      // Units must be placed in controlled territory
      return zone.isPlayerZone;
    case "Building":
      // Buildings have stricter placement rules
      return zone.isPlayerZone && zone.isBackline;
    case "Trap":
      // Traps can be placed in neutral or player territory
      return zone.isPlayerZone || zone.isNeutralZone;
    default:
      return true;
  }
}

// Check faction-specific deployment requirements
function meetsDeploymentRequirementsForFaction(card: Card, zone: any, gameState: any): boolean {
  // Implement faction-specific logic
  if (card.faction === "SyntheticDirective") {
    // Example: Synthetic units might require adjacency to other synthetic units
    return true;
  }
  
  // Default: no special requirements
  return true;
}

// Check unit type placement restrictions
function isValidPlacementForUnitType(card: Card, zone: any, gameState: any): boolean {
  // Example: Flying units might have different placement rules
  if (card.unitType === "Flying") {
    return true; // No restrictions
  }
  
  // Example: Heavy units might not be placeable in certain terrain
  if (card.unitType === "Heavy" && zone.terrain === "Marsh") {
    return false;
  }
  
  return true;
}

// Calculate synergy bonus with adjacent units
export function calculateSynergyBonus(
  card: Card,
  position: string,
  units: Record<string, any>,
  getZoneByPosition: (pos: string) => any
): number {
  let synergyScore = 0;
  const zone = getZoneByPosition(position);
  if (!zone || !zone.axial) return 0;
  
  // Check adjacent units for synergies
  for (const neighbor of axialNeighbors(zone.axial)) {
    const pos = axialToKey(neighbor);
    const adjacentUnit = units[pos];
    if (!adjacentUnit) continue;
    
    // Check faction synergy
    if (adjacentUnit.faction === card.faction) {
      synergyScore += 1;
    }
    
    // Check keyword synergies
    const sharedKeywords = card.keywords?.filter(k => 
      adjacentUnit.keywords?.includes(k)
    ) || [];
    
    synergyScore += sharedKeywords.length;
  }
  
  return synergyScore;
}