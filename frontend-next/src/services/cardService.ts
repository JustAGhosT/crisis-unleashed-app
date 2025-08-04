import { apiClient, ApiException } from './api';
import { Card, CardFilters, CardSearchResult, UserCard } from '@/types/card';
import { FactionId } from '@/types/faction';

/**
 * Card Service - Handles all card-related API calls
 * Following the Single Responsibility Principle
 */
export class CardService {
  /**
   * Search cards with filters and pagination
   */
  static async searchCards(
    filters: CardFilters = {},
    page = 1,
    pageSize = 20
  ): Promise<CardSearchResult> {
    try {
      const response = await apiClient.get('/cards/search', {
        params: {
          ...filters,
          page,
          pageSize,
        },
      });
      return response.data;
    } catch (error: any) {
      // Fallback to mock data for development
      console.warn('Using mock card data');
      return this.getMockCardSearchResult(filters, page, pageSize);
    }
  }

  /**
   * Get user's card collection
   */
  static async getUserCards(userId: string): Promise<UserCard[]> {
    try {
      const response = await apiClient.get(`/users/${userId}/cards`);
      return response.data;
    } catch (error: any) {
      console.warn('Using mock user cards');
      return this.getMockUserCards(userId);
    }
  }

  /**
   * Get card details by ID
   */
  static async getCardById(cardId: string): Promise<Card> {
    try {
      const response = await apiClient.get(`/cards/${cardId}`);
      return response.data;
    } catch (error: any) {
      throw new ApiException(
        `Failed to fetch card ${cardId}`,
        error.response?.status || 500
      );
    }
  }

  /**
   * Get cards by faction
   */
  static async getCardsByFaction(faction: FactionId): Promise<Card[]> {
    const result = await this.searchCards({ faction }, 1, 1000);
    return result.cards;
  }

  /**
   * Mock data for development - replace with real API calls
   */
  private static getMockCardSearchResult(
    filters: CardFilters,
    page: number,
    pageSize: number
  ): CardSearchResult {
    const mockCards: Card[] = [
      // Solaris Nexus Cards
      {
        id: 'card-solaris-1',
        name: 'Radiant Guardian',
        description: 'A divine protector wielding solar energy to shield allies.',
        type: 'character',
        faction: 'solaris',
        rarity: 'rare',
        cost: 4,
        attack: 3,
        health: 5,
        abilities: ['Shield', 'Divine Light'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'card-solaris-2',
        name: 'Solar Flare',
        description: 'Unleash the power of the sun to damage all enemies.',
        type: 'action',
        faction: 'solaris',
        rarity: 'common',
        cost: 2,
        abilities: ['Area Damage', 'Energy Boost'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'card-solaris-3',
        name: 'Celestial Harmony',
        description: 'Draw cards and restore health to all friendly units.',
        type: 'action',
        faction: 'solaris',
        rarity: 'epic',
        cost: 3,
        abilities: ['Card Draw', 'Heal'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      // Umbral Eclipse Cards
      {
        id: 'card-umbral-1',
        name: 'Shadow Assassin',
        description: 'A deadly operative that strikes from the shadows.',
        type: 'character',
        faction: 'umbral',
        rarity: 'uncommon',
        cost: 3,
        attack: 4,
        health: 2,
        abilities: ['Stealth', 'First Strike'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'card-umbral-2',
        name: 'Data Corruption',
        description: 'Corrupt enemy data streams to disable their abilities.',
        type: 'action',
        faction: 'umbral',
        rarity: 'rare',
        cost: 1,
        abilities: ['Disable', 'Information Warfare'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      // Aeonic Dominion Cards
      {
        id: 'card-aeonic-1',
        name: 'Temporal Sage',
        description: 'Master of time who can manipulate turn order.',
        type: 'character',
        faction: 'aeonic',
        rarity: 'legendary',
        cost: 6,
        attack: 4,
        health: 6,
        abilities: ['Time Control', 'Extra Turn'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'card-aeonic-2',
        name: 'Chrono Shift',
        description: 'Rewind time to undo the last action.',
        type: 'action',
        faction: 'aeonic',
        rarity: 'epic',
        cost: 4,
        abilities: ['Undo', 'Time Manipulation'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      // More cards for other factions...
      {
        id: 'card-primordial-1',
        name: 'Ancient Treant',
        description: 'A massive tree creature that grows stronger over time.',
        type: 'character',
        faction: 'primordial',
        rarity: 'rare',
        cost: 5,
        attack: 3,
        health: 8,
        abilities: ['Growth', 'Regeneration'],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    // Apply filters
    let filteredCards = mockCards;
    
    if (filters.faction) {
      filteredCards = filteredCards.filter(card => card.faction === filters.faction);
    }
    if (filters.type) {
      filteredCards = filteredCards.filter(card => card.type === filters.type);
    }
    if (filters.rarity) {
      filteredCards = filteredCards.filter(card => card.rarity === filters.rarity);
    }
    if (filters.costMin !== undefined) {
      filteredCards = filteredCards.filter(card => card.cost >= filters.costMin!);
    }
    if (filters.costMax !== undefined) {
      filteredCards = filteredCards.filter(card => card.cost <= filters.costMax!);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCards = filteredCards.filter(card => 
        card.name.toLowerCase().includes(searchLower) ||
        card.description.toLowerCase().includes(searchLower) ||
        card.abilities.some(ability => ability.toLowerCase().includes(searchLower))
      );
    }

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCards = filteredCards.slice(startIndex, endIndex);

    return {
      cards: paginatedCards,
      total: filteredCards.length,
      page,
      pageSize,
    };
  }

  /**
   * Mock user cards for development
   */
  private static getMockUserCards(userId: string): UserCard[] {
    return [
      {
        id: 'user-card-1',
        userId,
        cardId: 'card-solaris-1',
        quantity: 2,
        isFavorite: true,
        acquiredAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'user-card-2',
        userId,
        cardId: 'card-solaris-2',
        quantity: 3,
        isFavorite: false,
        acquiredAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'user-card-3',
        userId,
        cardId: 'card-umbral-1',
        quantity: 1,
        isFavorite: false,
        acquiredAt: '2024-01-01T00:00:00Z',
      },
      // Add more owned cards...
    ];
  }
}