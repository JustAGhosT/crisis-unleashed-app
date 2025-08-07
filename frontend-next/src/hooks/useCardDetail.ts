import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/types/card';
import { CardService } from '@/services/cardService';
import { useToast } from '@/components/ui/toast';

interface UseCardDetailProps {
  cardId: string;
  userId?: string;
}

/**
 * Custom hook for handling single card detail view
 * Fetches card data and handles user interactions
 */
export function useCardDetail({
  cardId,
  userId,
}: UseCardDetailProps) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ownedQuantity, setOwnedQuantity] = useState(0);
  const { toast } = useToast();

  // Fetch card data
  const fetchCard = useCallback(async () => {
    if (!cardId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await CardService.getCardById(cardId);
      setCard(result);
      
      // If userId is provided, fetch user's card data
      if (userId) {
        const userCards = await CardService.getUserCards(userId);
        const userCard = userCards.find(uc => uc.cardId === cardId);
        
        if (userCard) {
          setIsFavorite(userCard.isFavorite);
          setOwnedQuantity(userCard.quantity);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load card details';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [cardId, userId, toast]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async () => {
    if (!card || !userId) return;
    
    try {
      const newFavoriteStatus = !isFavorite;
      
      // Call API to update favorite status
      // This would be a real API call in production
      console.log(`Toggling favorite status for card ${cardId} to ${newFavoriteStatus}`);
      
      // Update local state
      setIsFavorite(newFavoriteStatus);
      
      toast({
        title: newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites',
        description: `${card.name} has been ${newFavoriteStatus ? 'added to' : 'removed from'} your favorites.`,
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update favorite status',
        variant: 'destructive',
      });
    }
  }, [card, cardId, isFavorite, userId, toast]);

  // Add card to deck
  const addToDeck = useCallback(async (deckId: string) => {
    if (!card) return;
    
    try {
      // Call API to add card to deck
      // This would be a real API call in production
      console.log(`Adding card ${cardId} to deck ${deckId}`);
      
      toast({
        title: 'Card added',
        description: `${card.name} has been added to your deck.`,
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add card to deck',
        variant: 'destructive',
      });
    }
  }, [card, cardId, toast]);

  // Fetch data on initial load
  useEffect(() => {
    fetchCard();
  }, [fetchCard]);

  return {
    card,
    loading,
    error,
    isFavorite,
    ownedQuantity,
    toggleFavorite,
    addToDeck,
    refreshCard: fetchCard,
  };
}