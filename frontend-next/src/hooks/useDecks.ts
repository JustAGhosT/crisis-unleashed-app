import { DeckService, createDeck as createDeckService } from '@/services/deckService';
import { Deck, DeckCard, Card } from '@/types/card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';

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
 * Uses toast notifications for errors and success.
 */
export function useCreateDeck() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    Deck,
    Error,
    Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>
  >({
    mutationFn: createDeckService,
    onSuccess: (newDeck) => {
      toast({
        title: 'Deck created!',
        description: `Deck "${newDeck.name}" was created successfully.`,
      });
      // Invalidate user decks to refetch the list
      queryClient.invalidateQueries({
        queryKey: deckQueryKeys.userDecks(newDeck.userId),
      });
      // Add the new deck to the cache
      queryClient.setQueryData(deckQueryKeys.deck(newDeck.id), newDeck);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating deck',
        description: error.message,
        variant: 'destructive',
      });
      // Optionally add additional logging here
      // console.error('Failed to create deck:', error);
    },
  });
}

/**
 * Mutation hook for updating a deck
 */
export function useUpdateDeck() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ deckId, updates }: { deckId: string; updates: Partial<Deck> }) =>
      DeckService.updateDeck(deckId, updates),
    onMutate: async ({ deckId, updates }) => {
      await queryClient.cancelQueries({ queryKey: deckQueryKeys.deck(deckId) });
      const previousDeck = queryClient.getQueryData(deckQueryKeys.deck(deckId));
      queryClient.setQueryData(deckQueryKeys.deck(deckId), (old: Deck | undefined) =>
        old ? { ...old, ...updates, updatedAt: new Date().toISOString() } : old
      );
      return { previousDeck, deckId };
    },
    onError: (error: any, variables, context) => {
      if (context?.previousDeck) {
        queryClient.setQueryData(
          deckQueryKeys.deck(context.deckId),
          context.previousDeck
        );
      }
      toast({
        title: 'Error updating deck',
        description: error?.message || 'Failed to update deck.',
        variant: 'destructive',
      });
      // console.error('Failed to update deck:', error);
    },
    onSettled: (data, error, { deckId }) => {
      queryClient.invalidateQueries({ queryKey: deckQueryKeys.deck(deckId) });
    },
  });
}

/**
 * Mutation hook for deleting a deck
 */
export function useDeleteDeck() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: DeckService.deleteDeck,
    onMutate: async (deckId: string) => {
      const deck = queryClient.getQueryData(deckQueryKeys.deck(deckId)) as Deck | undefined;
      if (deck) {
        queryClient.setQueryData(
          deckQueryKeys.userDecks(deck.userId),
          (old: Deck[] | undefined) =>
            old?.filter(d => d.id !== deckId) || []
        );
        queryClient.removeQueries({ queryKey: deckQueryKeys.deck(deckId) });
      }
      return { deck };
    },
    onError: (error, deckId: string, context) => {
      if (context?.deck) {
        queryClient.setQueryData(deckQueryKeys.deck(deckId), context.deck);
        queryClient.setQueryData(
          deckQueryKeys.userDecks(context.deck.userId),
          (old: Deck[] | undefined) => {
            const existing = old || [];
            const deckExists = existing.some(d => d.id === context.deck!.id);
            return deckExists ? existing : [...existing, context.deck!];
          }
        );
      }
      toast({
        title: 'Error deleting deck',
        description: error?.message || 'Failed to delete deck.',
        variant: 'destructive',
      });
      // console.error('Failed to delete deck:', error);
    },
    onSettled: (data, error, deckId, context) => {
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
 */
export function useDeckValidation(cards: Card[], deckCards: DeckCard[]) {
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