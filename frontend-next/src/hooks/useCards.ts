import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CardService } from '@/services/cardService';
import { CardFilters, CardSearchResult, UserCard } from '@/types/card';

/**
 * Custom hooks for card-related data fetching using TanStack Query
 * Following the Single Responsibility Principle - each hook handles one specific data concern
 */

// Query keys for consistent cache management
export const cardQueryKeys = {
  all: ['cards'] as const,
  search: (filters: CardFilters, page: number, pageSize: number) => 
    [...cardQueryKeys.all, 'search', filters, page, pageSize] as const,
  userCards: (userId: string) => 
    [...cardQueryKeys.all, 'user', userId] as const,
  card: (cardId: string) => 
    [...cardQueryKeys.all, 'detail', cardId] as const,
  faction: (faction: string) => 
    [...cardQueryKeys.all, 'faction', faction] as const,
};

/**
 * Hook for searching cards with filters and pagination
 */
export function useCardSearch(
  filters: CardFilters = {},
  page = 1,
  pageSize = 20,
  enabled = true
) {
  return useQuery({
    queryKey: cardQueryKeys.search(filters, page, pageSize),
    queryFn: () => CardService.searchCards(filters, page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
}

/**
 * Hook for getting user's card collection
 */
export function useUserCards(userId: string, enabled = true) {
  return useQuery({
    queryKey: cardQueryKeys.userCards(userId),
    queryFn: () => CardService.getUserCards(userId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: enabled && !!userId,
  });
}

/**
 * Hook for getting a specific card by ID
 */
export function useCard(cardId: string, enabled = true) {
  return useQuery({
    queryKey: cardQueryKeys.card(cardId),
    queryFn: () => CardService.getCardById(cardId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: enabled && !!cardId,
  });
}

/**
 * Hook for getting cards by faction
 */
export function useCardsByFaction(faction: string, enabled = true) {
  return useQuery({
    queryKey: cardQueryKeys.faction(faction),
    queryFn: () => CardService.getCardsByFaction(faction as any),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: enabled && !!faction,
  });
}

/**
 * Custom hook for card search with debouncing
 */
export function useDebouncedCardSearch(
  filters: CardFilters,
  page = 1,
  pageSize = 20,
  debounceMs = 300
) {
  // Note: In a real implementation, you'd use a debouncing library
  // For now, this is a simplified version
  return useCardSearch(filters, page, pageSize);
}

/**
 * Hook for invalidating card-related queries
 */
export function useInvalidateCards() {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: cardQueryKeys.all }),
    invalidateSearch: () => queryClient.invalidateQueries({ 
      queryKey: [...cardQueryKeys.all, 'search'] 
    }),
    invalidateUserCards: (userId: string) => queryClient.invalidateQueries({ 
      queryKey: cardQueryKeys.userCards(userId) 
    }),
  };
}