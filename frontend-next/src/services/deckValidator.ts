/**
 * Dedicated deck validation service with improved separation of concerns
 * Extracted from DeckService to follow Single Responsibility Principle
 */

import {
  Card,
  DeckCard,
  DeckValidationResult,
  DeckStats,
  CardType,
  UnitType,
  ActionType,
  StructureType,
  CardRarity,
} from "@/types/card";
import {
  DECK_CONSTRAINTS,
  BALANCE_THRESHOLDS,
  GAME_MECHANICS,
  VALIDATION_MESSAGES,
} from "@/constants/deck";

/**
 * Validation context for comprehensive deck analysis
 */
interface ValidationContext {
  cards: Card[];
  deckCards: DeckCard[];
  cardMap: Map<string, Card>;
  totalCards: number;
  validCardCount: number;
  factionCount: number;
  averageCost: number;
  cardCounts: Map<string, number>;
}

/**
 * Enhanced deck validator with improved error reporting and type safety
 */
export class DeckValidator {
  /**
   * Create validation context from deck data
   */
  private static createValidationContext(
    cards: Card[],
    deckCards: DeckCard[]
  ): ValidationContext {
    const cardMap = new Map(cards.map((card) => [card.id, card]));
    let totalCards = 0;
    let validCardCount = 0;
    const cardCounts = new Map<string, number>();
    const factions = new Set<string>();

    // Analyze deck composition
    for (const deckCard of deckCards) {
      totalCards += deckCard.quantity;
      cardCounts.set(deckCard.cardId, deckCard.quantity);

      const card = cardMap.get(deckCard.cardId);
      if (card) {
        validCardCount += deckCard.quantity;
        if (card.faction) {
          factions.add(card.faction);
        }
      }
    }

    // Calculate average cost
    const averageCost = this.calculateAverageCost(cardMap, deckCards);

    return {
      cards,
      deckCards,
      cardMap,
      totalCards,
      validCardCount,
      factionCount: factions.size,
      averageCost,
      cardCounts,
    };
  }

  /**
   * Calculate average mana/energy cost with null safety
   */
  private static calculateAverageCost(
    cardMap: Map<string, Card>,
    deckCards: DeckCard[]
  ): number {
    let totalCards = 0;
    let totalCost = 0;

    for (const deckCard of deckCards) {
      const card = cardMap.get(deckCard.cardId);
      if (card) {
        totalCards += deckCard.quantity;
        totalCost += (card.cost || 0) * deckCard.quantity;
      }
    }

    return totalCards > 0 ? totalCost / totalCards : 0;
  }

  /**
   * Validate individual card constraints
   */
  private static validateCardConstraints(
    context: ValidationContext
  ): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const deckCard of context.deckCards) {
      const card = context.cardMap.get(deckCard.cardId);

      if (!card) {
        errors.push(`Card with ID ${deckCard.cardId} not found`);
        continue;
      }

      // Validate copy limits
      const maxCopies = card.rarity === "legendary" ? 1 : DECK_CONSTRAINTS.MAX_COPIES_PER_CARD;
      if (deckCard.quantity > maxCopies) {
        errors.push(
          `${card.name}: Maximum ${maxCopies} copies allowed for ${card.rarity} cards`
        );
      }

      if (deckCard.quantity < DECK_CONSTRAINTS.MIN_CARD_QUANTITY) {
        errors.push(`${card.name}: ${VALIDATION_MESSAGES.TOO_FEW_COPIES}`);
      }

      // Cost-based warnings
      if (card.cost > GAME_MECHANICS.MAX_REASONABLE_CARD_COST) {
        warnings.push(`${card.name}: ${VALIDATION_MESSAGES.EXPENSIVE_CARD_WARNING}`);
      }

      if (card.cost === 0 && card.rarity === "legendary") {
        warnings.push(`${card.name}: ${VALIDATION_MESSAGES.FREE_LEGENDARY_WARNING}`);
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate deck composition rules
   */
  private static validateDeckComposition(
    context: ValidationContext
  ): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Size validation
    if (context.totalCards < DECK_CONSTRAINTS.MIN_DECK_SIZE) {
      errors.push(`${VALIDATION_MESSAGES.DECK_TOO_SMALL} (currently ${context.totalCards})`);
    }

    if (context.totalCards > DECK_CONSTRAINTS.MAX_DECK_SIZE) {
      errors.push(`${VALIDATION_MESSAGES.DECK_TOO_LARGE} (currently ${context.totalCards})`);
    }

    // Faction validation
    if (context.factionCount > DECK_CONSTRAINTS.MAX_FACTIONS) {
      errors.push(VALIDATION_MESSAGES.TOO_MANY_FACTIONS);
    }

    // Cost curve analysis
    if (context.validCardCount >= DECK_CONSTRAINTS.MIN_DECK_SIZE && context.averageCost > 0) {
      if (context.averageCost > BALANCE_THRESHOLDS.HIGH_AVERAGE_COST) {
        warnings.push(VALIDATION_MESSAGES.HIGH_COST_WARNING);
      }
      if (context.averageCost < BALANCE_THRESHOLDS.LOW_AVERAGE_COST) {
        warnings.push(VALIDATION_MESSAGES.LOW_COST_WARNING);
      }
    }

    // Data consistency warnings
    if (context.validCardCount !== context.totalCards && context.validCardCount > 0) {
      warnings.push("Some cards in the deck were not found in the card database");
    }

    return { errors, warnings };
  }

  /**
   * Generate detailed deck statistics
   */
  private static generateDeckStats(context: ValidationContext): {
    heroCardCount: number;
    unitCardCount: number;
    actionCardCount: number;
    structureCardCount: number;
    factionConsistency: boolean;
    energyCurveBalance: boolean;
    costCurve: { [cost: number]: number };
    factionSpecificRules: { [rule: string]: boolean };
  } {
    let heroCardCount = 0;
    let unitCardCount = 0;
    let actionCardCount = 0;
    let structureCardCount = 0;
    const costCurve: { [cost: number]: number } = {};

    for (const deckCard of context.deckCards) {
      const card = context.cardMap.get(deckCard.cardId);
      if (!card) continue;

      // Count by type
      switch (card.type) {
        case "hero":
          heroCardCount += deckCard.quantity;
          break;
        case "unit":
          unitCardCount += deckCard.quantity;
          break;
        case "action":
          actionCardCount += deckCard.quantity;
          break;
        case "structure":
          structureCardCount += deckCard.quantity;
          break;
      }

      // Build cost curve
      const cost = card.cost || 0;
      costCurve[cost] = (costCurve[cost] || 0) + deckCard.quantity;
    }

    return {
      heroCardCount,
      unitCardCount,
      actionCardCount,
      structureCardCount,
      factionConsistency: context.factionCount <= DECK_CONSTRAINTS.MAX_FACTIONS,
      energyCurveBalance:
        context.averageCost >= BALANCE_THRESHOLDS.OPTIMAL_COST_MIN &&
        context.averageCost <= BALANCE_THRESHOLDS.OPTIMAL_COST_MAX,
      costCurve,
      factionSpecificRules: {}, // Placeholder for future faction-specific validation
    };
  }

  /**
   * Comprehensive deck validation with detailed reporting
   */
  public static validateDeck(cards: Card[], deckCards: DeckCard[]): DeckValidationResult {
    const context = this.createValidationContext(cards, deckCards);

    // Validate individual cards
    const cardConstraints = this.validateCardConstraints(context);

    // Validate deck composition
    const deckComposition = this.validateDeckComposition(context);

    // Generate deck statistics
    const deckStats = this.generateDeckStats(context);

    // Combine all errors and warnings
    const errors = [...cardConstraints.errors, ...deckComposition.errors];
    const warnings = [...cardConstraints.warnings, ...deckComposition.warnings];

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      cardCount: context.totalCards,
      ...deckStats,
    };
  }

  /**
   * Calculate comprehensive deck statistics
   */
  public static calculateDeckStats(cards: Card[], deckCards: DeckCard[]): DeckStats {
    const context = this.createValidationContext(cards, deckCards);

    // Initialize type distributions
    const typeDistribution: Record<CardType, number> = {
      hero: 0,
      unit: 0,
      action: 0,
      structure: 0,
    };

    const unitTypeDistribution: Record<UnitType, number> = {
      melee: 0,
      ranged: 0,
      siege: 0,
      flying: 0,
    };

    const actionTypeDistribution: Record<ActionType, number> = {
      instant: 0,
      ongoing: 0,
      equipment: 0,
    };

    const structureTypeDistribution: Record<StructureType, number> = {
      building: 0,
      trap: 0,
      aura: 0,
    };

    const rarityDistribution: Record<CardRarity, number> = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };

    const costCurve: { [cost: number]: number } = {};
    let totalCost = 0;

    // Analyze deck composition
    for (const deckCard of context.deckCards) {
      const card = context.cardMap.get(deckCard.cardId);
      if (!card) continue;

      const quantity = deckCard.quantity;
      totalCost += (card.cost || 0) * quantity;

      // Update type distributions
      typeDistribution[card.type] += quantity;

      if (card.type === "unit" && card.unitType) {
        unitTypeDistribution[card.unitType] += quantity;
      }
      if (card.type === "action" && card.actionType) {
        actionTypeDistribution[card.actionType] += quantity;
      }
      if (card.type === "structure" && card.structureType) {
        structureTypeDistribution[card.structureType] += quantity;
      }

      rarityDistribution[card.rarity] += quantity;

      const cost = card.cost || 0;
      costCurve[cost] = (costCurve[cost] || 0) + quantity;
    }

    return {
      totalCards: context.validCardCount,
      averageCost: context.averageCost,
      averageInitiative: 0, // Placeholder
      frontlineUnitCount: 0, // Placeholder
      backlineUnitCount: 0, // Placeholder
      rangedUnitCount: unitTypeDistribution.ranged,
      flyingUnitCount: unitTypeDistribution.flying,
      typeDistribution,
      unitTypeDistribution,
      actionTypeDistribution,
      structureTypeDistribution,
      rarityDistribution,
      costCurve,
      energyCurve: {}, // Placeholder
      momentumRequirements: {}, // Placeholder
    };
  }
}