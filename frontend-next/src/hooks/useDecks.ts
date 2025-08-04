import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeckService } from '@/services/deckService';
import { Deck, DeckCard } from '@/types/card';

/**
 * Custom hooks for deck-related operations using TanStack Query
 * Demonstrates proper mutation patterns with optimistic updates
 */

// Query keys for deck operations
export const deckQueryKeys = {
  all: ['decks'] as const,
  userDecks: (userId: string) => [...deckQueryKeys.all, 'user', userId] as const,
  deck: (deckId: string) => [...deckQueryKeys.all, 'detail', deckId] as const,
};

/**
 * Hook for getting user's decks
 */
export function useUserDecks(userId: string, enabled = true) {
  return useQuery({
    queryKey: deckQueryKeys.userDecks(userId),
    queryFn: () => DeckService.getUserDecks(userId),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: enabled && !!userId,
  });
}

/**
 * Hook for getting a specific deck
 */
export function useDeck(deckId: string, enabled = true) {
  return useQuery({
    queryKey: deckQueryKeys.deck(deckId),
    queryFn: () => DeckService.getDeckById(deckId),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: enabled && !!deckId,
  });
}

/**
 * Mutation hook for creating a new deck
 */
export function useCreateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) =>
      DeckService.createDeck(deckData),
    onSuccess: (newDeck) => {
      // Invalidate user decks to refetch the list
      queryClient.invalidateQueries({
        queryKey: deckQueryKeys.userDecks(newDeck.userId),
      });
      
      // Add the new deck to the cache
      queryClient.setQueryData(deckQueryKeys.deck(newDeck.id), newDeck);
    },
    onError: (error) => {
      console.error('Failed to create deck:', error);
    },
  });
}

/**
 * Mutation hook for updating a deck
 */
export function useUpdateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deckId, updates }: { deckId: string; updates: Partial<Deck> }) =>
      DeckService.updateDeck(deckId, updates),
    onMutate: async ({ deckId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: deckQueryKeys.deck(deckId) });

      // Snapshot the previous value
      const previousDeck = queryClient.getQueryData(deckQueryKeys.deck(deckId));

      // Optimistically update the cache
      queryClient.setQueryData(deckQueryKeys.deck(deckId), (old: Deck | undefined) => 
        old ? { ...old, ...updates, updatedAt: new Date().toISOString() } : old
      );

      return { previousDeck, deckId };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousDeck) {
        queryClient.setQueryData(
          deckQueryKeys.deck(context.deckId),
          context.previousDeck
        );
      }
      console.error('Failed to update deck:', error);
    },
    onSettled: (data, error, { deckId }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: deckQueryKeys.deck(deckId) });
    },
  });
}

/**
 * Mutation hook for deleting a deck
 */
export function useDeleteDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DeckService.deleteDeck,
    onMutate: async (deckId) => {
      // Get the deck data before deletion for rollback
      const deck = queryClient.getQueryData(deckQueryKeys.deck(deckId)) as Deck | undefined;
      
      if (deck) {
        // Optimistically remove from user decks list
        queryClient.setQueryData(
          deckQueryKeys.userDecks(deck.userId),
          (old: Deck[] | undefined) => 
            old?.filter(d => d.id !== deckId) || []
        );

        // Remove deck from cache
        queryClient.removeQueries({ queryKey: deckQueryKeys.deck(deckId) });
      }

      return { deck };
    },
    onError: (error, deckId, context) => {
      // Rollback deletion
      if (context?.deck) {
        queryClient.setQueryData(deckQueryKeys.deck(deckId), context.deck);
        queryClient.setQueryData(
          deckQueryKeys.userDecks(context.deck.userId),
          (old: Deck[] | undefined) => [...(old || []), context.deck!]
        );
      }
      console.error('Failed to delete deck:', error);
    },
    onSettled: (data, error, deckId, context) => {
      // Refetch user decks to ensure consistency
      if (context?.deck) {
        queryClient.invalidateQueries({
          queryKey: deckQueryKeys.userDecks(context.deck.userId),
        });
      }
    },
  });
}

/**
 * Hook for deck validation and statistics
 * This doesn't use TanStack Query as it's purely computational
 */
export function useDeckValidation(cards: any[], deckCards: DeckCard[]) {
  const validation = DeckService.validateDeck(cards, deckCards);
  const stats = DeckService.calculateDeckStats(cards, deckCards);
  
  return { validation, stats };
}

/**
 * Utility hook for invalidating deck-related queries
 */
export function useInvalidateDecks() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: deckQueryKeys.all }),
    invalidateUserDecks: (userId: string) =>
      queryClient.invalidateQueries({ queryKey: deckQueryKeys.userDecks(userId) }),
    invalidateDeck: (deckId: string) =>
      queryClient.invalidateQueries({ queryKey: deckQueryKeys.deck(deckId) }),
  };
}