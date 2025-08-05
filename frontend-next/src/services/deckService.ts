import { apiClient } from './api';
import {
  Deck,
  DeckCard,
  DeckValidationResult,
  DeckStats,
  Card,
  CardType,
  CardRarity,
} from '@/types/card';
import { FactionId } from '@/types/faction';
import { mockUserDecks, getMockDeckData } from '@/lib/DeckMockData';

// Helper function to check if we're in production server environment
const isProductionServer = (): boolean => {
  return typeof window === 'undefined' && process?.env?.NODE_ENV === 'production';
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
      console.error('Failed to fetch user decks:', error);
      if (isProductionServer()) {
        throw new Error('Failed to fetch user decks');
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
      console.error('Failed to fetch deck:', error);
      if (isProductionServer()) {
        throw new Error('Failed to fetch deck');
      }
      return this.getMockDeck(deckId);
    }
  }

  /**
   * Create a deck
   */
  static async createDeck(
    deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Deck> {
    try {
      const response = await apiClient.post('/decks', deckData);
      return response.data;
    } catch (error) {
      console.error('Simulating deck creation due to error:', error);
      if (isProductionServer()) {
        throw new Error('Failed to create deck');
      }
      return this.simulateCreateDeck(deckData);
    }
  }

  /**
   * Update a deck
   */
  static async updateDeck(deckId: string, updates: Partial<Deck>): Promise<Deck> {
    try {
      const response = await apiClient.put(`/decks/${deckId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Simulating deck update due to error:', error);
      if (isProductionServer()) {
        throw new Error('Failed to update deck');
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
      console.error('Simulating deck deletion due to error:', error);
      if (isProductionServer()) {
        throw new Error('Failed to delete deck');
      }
    }
  }

  /**
   * Validate deck composition and constraints
   */
  static validateDeck(cards: Card[], deckCards: DeckCard[]): DeckValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const cardMap = new Map(cards.map(card => [card.id, card]));
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
        errors.push(`${card.name}: Maximum ${this.MAX_COPIES_PER_CARD} copies per deck`);
      }
      if (deckCard.quantity < 1) {
        errors.push(`${card.name}: Must have at least 1 copy`);
      }
    }

    if (totalCards < this.MIN_DECK_SIZE) {
      errors.push(
        `Deck must contain at least ${this.MIN_DECK_SIZE} cards (currently ${totalCards})`
      );
    }
    if (totalCards > this.MAX_DECK_SIZE) {
      errors.push(
        `Deck cannot exceed ${this.MAX_DECK_SIZE} cards (currently ${totalCards})`
      );
    }

    // Validate faction count
    const factions = new Set(
      deckCards
        .map(dc => cardMap.get(dc.cardId)?.faction)
        .filter(Boolean)
    );
    if (factions.size > this.MAX_FACTIONS) {
      errors.push(
        `Deck can only contain cards from up to ${this.MAX_FACTIONS} factions`
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

    if (totalCards >= this.MIN_DECK_SIZE) {
      const avgCost = this.calculateAverageCost(cards, deckCards);
      if (avgCost > 4.5) {
        warnings.push('High average cost - consider adding cheaper cards');
      }
      if (avgCost < 2.5) {
        warnings.push('Low average cost - consider adding more expensive cards');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      cardCount: totalCards,
      costCurve,
    };
  }

  /**
   * Calculate overall deck statistics, returns full stats breakdown for analytics/inspection
   */
  static calculateDeckStats(cards: Card[], deckCards: DeckCard[]): DeckStats {
    const cardMap = new Map(cards.map(card => [card.id, card]));
    let totalCards = 0;
    let totalCost = 0;
    const typeDistribution: { [type in CardType]?: number } = {};
    const rarityDistribution: { [rarity in CardRarity]?: number } = {};
    const costCurve: { [cost: number]: number } = {};

    for (const deckCard of deckCards) {
      const card = cardMap.get(deckCard.cardId);
      if (!card) continue;
      totalCards += deckCard.quantity;
      totalCost += card.cost * deckCard.quantity;
      typeDistribution[card.type] =
        (typeDistribution[card.type] || 0) + deckCard.quantity;
      rarityDistribution[card.rarity] =
        (rarityDistribution[card.rarity] || 0) + deckCard.quantity;
      costCurve[card.cost] = (costCurve[card.cost] || 0) + deckCard.quantity;
    }
    return {
      totalCards,
      averageCost: totalCards > 0 ? totalCost / totalCards : 0,
      typeDistribution,
      rarityDistribution,
      costCurve,
    };
  }

  /**
   * Helper: Calculate average mana/energy cost
   */
  private static calculateAverageCost(cards: Card[], deckCards: DeckCard[]): number {
    const cardMap = new Map(cards.map(card => [card.id, card]));
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
    return mockUserDecks.map(deck => ({
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
    deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>
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
  private static simulateUpdateDeck(deckId: string, updates: Partial<Deck>): Deck {
    return {
      id: deckId,
      userId: 'user-1',
      name: 'Updated Deck',
      faction: 'solaris',
      isActive: false,
      cards: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
      ...updates,
    };
  }
}