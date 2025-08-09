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
    pageSize = 20,
    signal?: AbortSignal
  ): Promise<CardSearchResult> {
    try {
      const response = await apiClient.get('/cards/search', {
        params: {
          ...filters,
          page,
          pageSize,
        },
        signal,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new ApiException('Authentication required', error.response.status);
      }
      // Fallback to mock data for development only!
      console.warn('Using mock card data');
      return CardMockData.getMockCardSearchResult(filters, page, pageSize);
    }
  }

  /**
   * Get user's card collection
   */
  static async getUserCards(userId: string, signal?: AbortSignal): Promise<UserCard[]> {
    try {
      const response = await apiClient.get(`/users/${userId}/cards`, { signal });
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
  static async getCardById(cardId: string, signal?: AbortSignal): Promise<Card> {
    try {
      const response = await apiClient.get(`/cards/${cardId}`, { signal });
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
  static async getCardsByFaction(
    faction: FactionId,
    pageSize: number = 100,
    signal?: AbortSignal
  ): Promise<Card[]> {
    const allCards: Card[] = [];
    let page = 1;
    let hasMore = true;
    const SAFE_LIMIT = 250; // reasonable upper bound to avoid perf issues
    while (hasMore && (page - 1) * pageSize < SAFE_LIMIT) {
      const result = await this.searchCards({ faction }, page, pageSize, signal);
      allCards.push(...result.cards);
      hasMore = result.cards.length === pageSize;
      page++;
    }
    return allCards;
  }
}