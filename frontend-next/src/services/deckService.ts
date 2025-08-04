import { apiClient } from './api';
import { Deck, DeckCard, DeckValidationResult, DeckStats, Card } from '@/types/card';
import { FactionId } from '@/types/faction';

/**
 * Deck Service - Handles all deck-related operations
 * Following the Single Responsibility Principle
 */
export class DeckService {
  /**
   * Get user's decks
   */
  static async getUserDecks(userId: string): Promise<Deck[]> {
    try {
      const response = await apiClient.get(`/users/${userId}/decks`);
      return response.data;
    } catch (error) {
      console.warn('Using mock deck data');
      return this.getMockUserDecks(userId);
    }
  }

  /**
   * Get deck by ID
   */
  static async getDeckById(deckId: string): Promise<Deck> {
    try {
      const response = await apiClient.get(`/decks/${deckId}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock deck');
      return this.getMockDeck(deckId);
    }
  }

  /**
   * Create a new deck
   */
  static async createDeck(deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deck> {
    try {
      const response = await apiClient.post('/decks', deckData);
      return response.data;
    } catch (error) {
      console.warn('Simulating deck creation');
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
      console.warn('Simulating deck update');
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
      console.warn('Simulating deck deletion');
    }
  }

  /**
   * Validate deck composition
   */
  static validateDeck(cards: Card[], deckCards: DeckCard[]): DeckValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Create card lookup map
    const cardMap = new Map(cards.map(card => [card.id, card]));
    
    // Calculate total cards and validate quantities
    let totalCards = 0;
    const cardCounts = new Map<string, number>();
    
    for (const deckCard of deckCards) {
      totalCards += deckCard.quantity;
      cardCounts.set(deckCard.cardId, deckCard.quantity);
      
      // Validate card exists
      const card = cardMap.get(deckCard.cardId);
      if (!card) {
        errors.push(`Card with ID ${deckCard.cardId} not found`);
        continue;
      }
      
      // Validate quantity limits
      if (deckCard.quantity > 3) {
        errors.push(`${card.name}: Maximum 3 copies per deck`);
      }
      if (deckCard.quantity < 1) {
        errors.push(`${card.name}: Must have at least 1 copy`);
      }
    }

    // Validate deck size
    const MIN_DECK_SIZE = 30;
    const MAX_DECK_SIZE = 50;
    
    if (totalCards < MIN_DECK_SIZE) {
      errors.push(`Deck must contain at least ${MIN_DECK_SIZE} cards (currently ${totalCards})`);
    }
    if (totalCards > MAX_DECK_SIZE) {
      errors.push(`Deck cannot exceed ${MAX_DECK_SIZE} cards (currently ${totalCards})`);
    }

    // Validate faction consistency
    const factions = new Set(
      deckCards
        .map(dc => cardMap.get(dc.cardId)?.faction)
        .filter(Boolean)
    );
    
    if (factions.size > 2) {
      errors.push('Deck can only contain cards from up to 2 factions');
    }

    // Generate cost curve
    const costCurve: { [cost: number]: number } = {};
    for (const deckCard of deckCards) {
      const card = cardMap.get(deckCard.cardId);
      if (card) {
        costCurve[card.cost] = (costCurve[card.cost] || 0) + deckCard.quantity;
      }
    }

    // Warnings for deck composition
    if (totalCards >= MIN_DECK_SIZE) {
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
   * Calculate deck statistics
   */
  static calculateDeckStats(cards: Card[], deckCards: DeckCard[]): DeckStats {
    const cardMap = new Map(cards.map(card => [card.id, card]));
    
    let totalCards = 0;
    let totalCost = 0;
    const typeDistribution: Record<string, number> = {};
    const rarityDistribution: Record<string, number> = {};
    const costCurve: { [cost: number]: number } = {};

    for (const deckCard of deckCards) {
      const card = cardMap.get(deckCard.cardId);
      if (!card) continue;

      totalCards += deckCard.quantity;
      totalCost += card.cost * deckCard.quantity;
      
      // Type distribution
      typeDistribution[card.type] = (typeDistribution[card.type] || 0) + deckCard.quantity;
      
      // Rarity distribution
      rarityDistribution[card.rarity] = (rarityDistribution[card.rarity] || 0) + deckCard.quantity;
      
      // Cost curve
      costCurve[card.cost] = (costCurve[card.cost] || 0) + deckCard.quantity;
    }

    return {
      totalCards,
      averageCost: totalCards > 0 ? totalCost / totalCards : 0,
      typeDistribution: typeDistribution as any,
      rarityDistribution: rarityDistribution as any,
      costCurve,
    };
  }

  /**
   * Calculate average mana cost
   */
  private static calculateAverageCost(cards: Card[], deckCards: DeckCard[]): number {
    const cardMap = new Map(cards.map(card => [card.id, card]));
    let totalCost = 0;
    let totalCards = 0;

    for (const deckCard of deckCards) {
      const card = cardMap.get(deckCard.cardId);
      if (card) {
        totalCost += card.cost * deckCard.quantity;
        totalCards += deckCard.quantity;
      }
    }

    return totalCards > 0 ? totalCost / totalCards : 0;
  }

  /**
   * Mock data methods for development
   */
  private static getMockUserDecks(userId: string): Deck[] {
    return [
      {
        id: 'deck-1',
        userId,
        name: 'Solar Domination',
        faction: 'solaris',
        isActive: true,
        cards: [
          { cardId: 'card-solaris-1', quantity: 2 },
          { cardId: 'card-solaris-2', quantity: 3 },
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'deck-2',
        userId,
        name: 'Shadow Strike',
        faction: 'umbral',
        isActive: false,
        cards: [
          { cardId: 'card-umbral-1', quantity: 3 },
          { cardId: 'card-umbral-2', quantity: 2 },
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];
  }

  private static getMockDeck(deckId: string): Deck {
    return {
      id: deckId,
      userId: 'user-1',
      name: 'Mock Deck',
      faction: 'solaris',
      isActive: false,
      cards: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
  }

  private static simulateCreateDeck(deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>): Deck {
    return {
      ...deckData,
      id: `deck-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

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