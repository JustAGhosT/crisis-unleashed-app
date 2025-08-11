import { Card, CardFilters, CardSearchResult, UserCard } from '@/types/card';
import { FactionId } from '@/types/faction';
import { apiClient, ApiException } from './api';
import { CardMockData } from '../lib/CardMockData';

// Helper to check if error is a cancellation
const isAbortError = (error: any): boolean => {
  return error instanceof DOMException && error.name === 'AbortError' || 
         error.code === 'ECONNABORTED' || 
         error.message === 'canceled';
};

// Helper to check if we're in development mode
const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

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
      // Rethrow abort errors to properly handle cancellations
      if (isAbortError(error)) {
        throw error;
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new ApiException('Authentication required', error.response.status);
      }
      
      // Fallback to mock data for development only!
      if (isDevelopment()) {
        console.warn('Using mock card data');
        return CardMockData.getMockCardSearchResult(filters, page, pageSize);
      }
      
      throw new ApiException(
        'Failed to fetch cards',
        error.response?.status || 500
      );
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
      // Rethrow abort errors to properly handle cancellations
      if (isAbortError(error)) {
        throw error;
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new ApiException('Authentication required', error.response.status);
      }
      
      // Fallback to mock data for development only!
      if (isDevelopment()) {
        console.warn('Using mock user cards');
        return CardMockData.getMockUserCards(userId);
      }
      
      throw new ApiException(
        `Failed to fetch cards for user ${userId}`,
        error.response?.status || 500
      );
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
      // Rethrow abort errors to properly handle cancellations
      if (isAbortError(error)) {
        throw error;
      }
      
      // Fallback to mock data for development only!
      if (isDevelopment() && error.response?.status === 404) {
        console.warn(`Using mock data for card ${cardId}`);
        const mockCard = CardMockData.getMockCardById(cardId);
        if (mockCard) return mockCard;
      }
      
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
    
    while (hasMore) {
      // Calculate how many items we'll have after this fetch
      const projectedTotal = allCards.length + pageSize;
      
      // If we'd exceed the safe limit, adjust the pageSize for the final fetch
      if (projectedTotal > SAFE_LIMIT) {
        const remainingAllowed = SAFE_LIMIT - allCards.length;
        if (remainingAllowed <= 0) break; // Already at or over limit
        
        // Final fetch with adjusted page size
        const result = await this.searchCards(
          { faction }, 
          page, 
          remainingAllowed, 
          signal
        );
        allCards.push(...result.cards);
        break; // Exit after final fetch
      }
      
      // Normal fetch
      const result = await this.searchCards({ faction }, page, pageSize, signal);
      allCards.push(...result.cards);
      hasMore = result.cards.length === pageSize;
      page++;
    }
    
    return allCards;
  }
}