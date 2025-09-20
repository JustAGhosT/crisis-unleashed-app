import { getMockDeckData, mockUserDecks } from "@/lib/DeckMockData";
import {
    ActionType,
    Card,
    CardRarity,
    CardType,
    Deck,
    DeckCard,
    DeckStats,
    DeckValidationResult,
    StructureType,
    UnitType,
} from "@/types/card";
import { apiClient } from "./api";

// Helper function to check if we're in production server environment
const isProductionServer = (): boolean => {
  return (
    typeof window === "undefined" && process?.env?.NODE_ENV === "production"
  );
};

// DeckService handles all deck-related operations. Single Responsibility Principle is maintained.
export class DeckService {
  // Deck composition constraints
  private static readonly MAX_COPIES_PER_CARD = 3;
  private static readonly MIN_DECK_SIZE = 30;
  private static readonly MAX_DECK_SIZE = 50;
  private static readonly MAX_FACTIONS = 2;

  /**
   * Get decks for a user
   */
  static async getUserDecks(userId: string): Promise<Deck[]> {
    try {
      const response = await apiClient.get(`/users/${userId}/decks`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user decks:", error);
      if (isProductionServer()) {
        throw new Error("Failed to fetch user decks");
      }
      return this.getMockUserDecks(userId);
    }
  }

  /**
   * Get a specific deck by ID
   */
  static async getDeckById(deckId: string): Promise<Deck> {
    try {
      const response = await apiClient.get(`/decks/${deckId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch deck:", error);
      if (isProductionServer()) {
        throw new Error("Failed to fetch deck");
      }
      return this.getMockDeck(deckId);
    }
  }

  /**
   * Create a deck
   */
  static async createDeck(
    deckData: Omit<Deck, "id" | "createdAt" | "updatedAt">,
  ): Promise<Deck> {
    try {
      const response = await apiClient.post("/decks", deckData);
      return response.data;
    } catch (error) {
      console.error("Simulating deck creation due to error:", error);
      if (isProductionServer()) {
        throw new Error("Failed to create deck");
      }
      return this.simulateCreateDeck(deckData);
    }
  }

  /**
   * Update a deck
   */
  static async updateDeck(
    deckId: string,
    updates: Partial<Deck>,
  ): Promise<Deck> {
    try {
      const response = await apiClient.put(`/decks/${deckId}`, updates);
      return response.data;
    } catch (error) {
      console.error("Simulating deck update due to error:", error);
      if (isProductionServer()) {
        throw new Error("Failed to update deck");
      }
      return this.simulateUpdateDeck(deckId, updates);
    }
  }

  /**
   * Delete a deck
   */
  static async deleteDeck(deckId: string): Promise<void> {
    try {
      await apiClient.delete(`/decks/${deckId}`);
    } catch (error) {
      console.error("Simulating deck deletion due to error:", error);
      if (isProductionServer()) {
        throw new Error("Failed to delete deck");
      }
    }
  }

  /**
   * Validate deck composition and constraints
   */
  static validateDeck(
    cards: Card[],
    deckCards: DeckCard[],
  ): DeckValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const cardMap = new Map(cards.map((card) => [card.id, card]));
    let totalCards = 0;
    const cardCounts = new Map<string, number>();

    for (const deckCard of deckCards) {
      totalCards += deckCard.quantity;
      cardCounts.set(deckCard.cardId, deckCard.quantity);
      const card = cardMap.get(deckCard.cardId);
      if (!card) {
        errors.push(`Card with ID ${deckCard.cardId} not found`);
        continue;
      }
      if (deckCard.quantity > this.MAX_COPIES_PER_CARD) {
        errors.push(
          `${card.name}: Maximum ${this.MAX_COPIES_PER_CARD} copies per deck`,
        );
      }
      if (deckCard.quantity < 1) {
        errors.push(`${card.name}: Must have at least 1 copy`);
      }
    }

    if (totalCards < this.MIN_DECK_SIZE) {
      errors.push(
        `Deck must contain at least ${this.MIN_DECK_SIZE} cards (currently ${totalCards})`,
      );
    }
    if (totalCards > this.MAX_DECK_SIZE) {
      errors.push(
        `Deck cannot exceed ${this.MAX_DECK_SIZE} cards (currently ${totalCards})`,
      );
    }

    // Validate faction count
    const factions = new Set(
      deckCards.map((dc) => cardMap.get(dc.cardId)?.faction).filter(Boolean),
    );
    if (factions.size > this.MAX_FACTIONS) {
      errors.push(
        `Deck can only contain cards from up to ${this.MAX_FACTIONS} factions`,
      );
    }

    // Build cost curve
    const costCurve: { [cost: number]: number } = {};
    for (const deckCard of deckCards) {
      const card = cardMap.get(deckCard.cardId);
      if (card) {
        costCurve[card.cost] = (costCurve[card.cost] || 0) + deckCard.quantity;
      }
    }

    let avgCost = 0;
    if (totalCards >= this.MIN_DECK_SIZE) {
      avgCost = this.calculateAverageCost(cards, deckCards);
      if (avgCost > 4.5) {
        warnings.push("High average cost - consider adding cheaper cards");
      }
      if (avgCost < 2.5) {
        warnings.push(
          "Low average cost - consider adding more expensive cards",
        );
      }
    }

    // Derive type counts
    let heroCardCount = 0;
    let unitCardCount = 0;
    let actionCardCount = 0;
    let structureCardCount = 0;
    for (const dc of deckCards) {
      const c = cardMap.get(dc.cardId);
      if (!c) continue;
      switch (c.type) {
        case "hero":
          heroCardCount += dc.quantity;
          break;
        case "unit":
          unitCardCount += dc.quantity;
          break;
        case "action":
          actionCardCount += dc.quantity;
          break;
        case "structure":
          structureCardCount += dc.quantity;
          break;
      }
    }

    // Reuse factions set for consistency check (declared above in validation)
    const factionConsistency = factions.size <= this.MAX_FACTIONS;

    // Simple energy curve balance heuristic based on average cost range
    const energyCurveBalance = avgCost >= 2.5 && avgCost <= 4.5;

    const factionSpecificRules: { [rule: string]: boolean } = {};

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      cardCount: totalCards,
      heroCardCount,
      unitCardCount,
      actionCardCount,
      structureCardCount,
      factionConsistency,
      energyCurveBalance,
      costCurve,
      factionSpecificRules,
    };
  }

  /**
   * Calculate overall deck statistics, returns full stats breakdown for analytics/inspection
   */
  static calculateDeckStats(cards: Card[], deckCards: DeckCard[]): DeckStats {
    const cardMap = new Map(cards.map((card) => [card.id, card]));
    let totalCards = 0;
    let totalCost = 0;
    // Initialize distributions to satisfy strict Record typings
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

    for (const deckCard of deckCards) {
      const card = cardMap.get(deckCard.cardId);
      if (!card) continue;
      totalCards += deckCard.quantity;
      totalCost += card.cost * deckCard.quantity;
      typeDistribution[card.type] =
        typeDistribution[card.type] + deckCard.quantity;
      // Track sub-type distributions where applicable
      if (card.type === "unit" && card.unitType) {
        unitTypeDistribution[card.unitType] =
          unitTypeDistribution[card.unitType] + deckCard.quantity;
      }
      if (card.type === "action" && card.actionType) {
        actionTypeDistribution[card.actionType] =
          actionTypeDistribution[card.actionType] + deckCard.quantity;
      }
      if (card.type === "structure" && card.structureType) {
        structureTypeDistribution[card.structureType] =
          structureTypeDistribution[card.structureType] + deckCard.quantity;
      }
      rarityDistribution[card.rarity] =
        rarityDistribution[card.rarity] + deckCard.quantity;
      costCurve[card.cost] = (costCurve[card.cost] || 0) + deckCard.quantity;
    }
    // Basic derived stats with defaults when not computable
    const averageCost = totalCards > 0 ? totalCost / totalCards : 0;
    const averageInitiative = 0;
    const frontlineUnitCount = 0;
    const backlineUnitCount = 0;
    const rangedUnitCount = unitTypeDistribution.ranged;
    const flyingUnitCount = unitTypeDistribution.flying;
    const energyCurve: { [cost: number]: number } = {};
    const momentumRequirements: { [cost: number]: number } = {};

    return {
      totalCards,
      averageCost,
      averageInitiative,
      frontlineUnitCount,
      backlineUnitCount,
      rangedUnitCount,
      flyingUnitCount,
      typeDistribution,
      unitTypeDistribution,
      actionTypeDistribution,
      structureTypeDistribution,
      rarityDistribution,
      costCurve,
      energyCurve,
      momentumRequirements,
    };
  }

  /**
   * Helper: Calculate average mana/energy cost
   */
  private static calculateAverageCost(
    cards: Card[],
    deckCards: DeckCard[],
  ): number {
    const cardMap = new Map(cards.map((card) => [card.id, card]));
    let totalCards = 0;
    let totalCost = 0;
    for (const deckCard of deckCards) {
      const card = cardMap.get(deckCard.cardId);
      if (!card) continue;
      totalCards += deckCard.quantity;
      totalCost += card.cost * deckCard.quantity;
    }
    return totalCards > 0 ? totalCost / totalCards : 0;
  }

  /**
   * Mock: Get test user decks
   */
  private static getMockUserDecks(userId: string): Deck[] {
    // Re-attach userId for SRP-compliant separation, since mockUserDecks omits it
    return mockUserDecks.map((deck) => ({
      ...deck,
      userId,
    }));
  }

  /**
   * Mock: Get single deck by id
   */
  private static getMockDeck(deckId: string): Deck {
    return getMockDeckData(deckId);
  }

  /**
   * Mock: Simulate deck creation
   */
  private static simulateCreateDeck(
    deckData: Omit<Deck, "id" | "createdAt" | "updatedAt">,
  ): Deck {
    return {
      ...deckData,
      id: `deck-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Mock: Simulate deck update
   */
  private static simulateUpdateDeck(
    deckId: string,
    updates: Partial<Deck>,
  ): Deck {
    return {
      id: deckId,
      userId: "user-1",
      name: "Updated Deck",
      faction: "solaris",
      isActive: false,
      cards: [],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
      ...updates,
    };
  }
}
