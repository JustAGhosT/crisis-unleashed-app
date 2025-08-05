import { Card, CardFilters, CardSearchResult, UserCard } from '@/types/card';
import { FactionId } from '@/types/faction';
import { apiClient, ApiException } from './api';
import { CardMockData } from '../lib/CardMockData';

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
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new ApiException('Authentication required', error.response.status);
      }
      // Fallback to mock data in development only
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock card data');
        return CardMockData.getMockCardSearchResult(filters, page, pageSize);
      }
      throw new ApiException('Failed to search cards', error.response?.status || 500);
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
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new ApiException('Authentication required', error.response.status);
      }
      console.warn('Using mock user cards');
      return CardMockData.getMockUserCards(userId);
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
   * Get all cards for a faction, paginated fetch with reasonable page limit
   */
  static async getCardsByFaction(faction: FactionId, pageSize: number = 100): Promise<Card[]> {
    const allCards: Card[] = [];
    let page = 1;
    let hasMore = true;
    const SAFE_LIMIT = 250; // reasonable upper bound to avoid perf issues
    while (hasMore && (page - 1) * pageSize < SAFE_LIMIT) {
      const result = await this.searchCards({ faction }, page, pageSize);
      allCards.push(...result.cards);
      hasMore = result.cards.length === pageSize;
      page++;
    }
    return allCards;
  }
}