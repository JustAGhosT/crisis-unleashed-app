import { Card, CardType, UnitType, ActionType, StructureType } from "@/types/card";

/**
 * Valid card rarity types that match Badge component variants
 */
export type CardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

/**
 * Valid faction types
 */
export const VALID_FACTIONS = [
  "solaris", "umbral", "aeonic", "primordial", "infernal", "neuralis", "synthetic"
] as const;

export type FactionType = typeof VALID_FACTIONS[number];

/**
 * Checks if a rarity value is valid for use with Badge variants
 */
export function isValidRarity(rarity: string): rarity is CardRarity {
  return ["common", "uncommon", "rare", "epic", "legendary", "mythic"].includes(
    rarity.toLowerCase(),
  );
}

/**
 * Type guard to check if a value is a valid faction
 */
export function isValidFaction(faction: unknown): faction is FactionType {
  return typeof faction === 'string' && VALID_FACTIONS.includes(faction as FactionType);
}

/**
 * Type guard to check if a value is a valid card type
 */
export function isValidCardType(type: unknown): type is CardType {
  return typeof type === 'string' && ['hero', 'unit', 'action', 'structure'].includes(type);
}

/**
 * Comprehensive card validation with detailed error reporting
 */
export interface CardValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateCard(card: unknown): CardValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!card || typeof card !== 'object') {
    return { isValid: false, errors: ['Card must be an object'], warnings: [] };
  }

  const cardObj = card as Record<string, unknown>;

  // Required field validations
  if (!cardObj.id || typeof cardObj.id !== 'string') {
    errors.push('Card must have a valid string ID');
  }

  if (!cardObj.name || typeof cardObj.name !== 'string' || cardObj.name.trim().length === 0) {
    errors.push('Card must have a non-empty name');
  }

  if (!isValidCardType(cardObj.type)) {
    errors.push('Card must have a valid type (hero, unit, action, structure)');
  }

  if (!isValidFaction(cardObj.faction)) {
    errors.push('Card must have a valid faction');
  }

  if (typeof cardObj.cost !== 'number' || cardObj.cost < 0) {
    errors.push('Card cost must be a non-negative number');
  }

  if (!isValidRarity(cardObj.rarity as string)) {
    errors.push('Card must have a valid rarity');
  }

  // Type-specific validations
  if (cardObj.type === 'unit' && !cardObj.unitType) {
    warnings.push('Unit cards should have a unit type specified');
  }

  if (cardObj.type === 'action' && !cardObj.actionType) {
    warnings.push('Action cards should have an action type specified');
  }

  if (cardObj.type === 'structure' && !cardObj.structureType) {
    warnings.push('Structure cards should have a structure type specified');
  }

  // Cost validation warnings
  if (typeof cardObj.cost === 'number') {
    if (cardObj.cost > 12) {
      warnings.push('Cards with cost > 12 may be difficult to play');
    }
    if (cardObj.cost === 0 && cardObj.rarity === 'legendary') {
      warnings.push('Free legendary cards may cause balance issues');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Maps rarity values to appropriate Badge variant values
 * Returns a fallback if the rarity is invalid
 */
export function getRarityVariant(rarity: string): string {
  if (isValidRarity(rarity)) {
    // The badge component already has variants that match our rarity names
    return rarity.toLowerCase() as CardRarity;
  }

  // Fallback for invalid values
  return "default";
}

/**
 * Safe card property accessor with fallbacks
 */
export function getCardProperty<T>(card: Partial<Card>, property: keyof Card, fallback: T): T {
  const value = card[property];
  return value !== undefined && value !== null ? (value as T) : fallback;
}

/**
 * Calculate relative card power level based on cost and rarity
 */
export function calculateCardPowerLevel(card: Card): number {
  const rarityMultipliers: Record<CardRarity, number> = {
    common: 1.0,
    uncommon: 1.2,
    rare: 1.5,
    epic: 2.0,
    legendary: 3.0,
    mythic: 4.0
  };

  const basePower = card.cost || 0;
  const rarityMultiplier = rarityMultipliers[card.rarity as CardRarity] || 1.0;

  return Math.round(basePower * rarityMultiplier * 100) / 100;
}