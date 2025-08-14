import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/types/card";
import { CardService } from "@/services/cardService";
import { useToast } from "@/components/ui/toast";

interface UseCardDetailProps {
  cardId: string;
  userId?: string;
}

/**
 * Custom hook for handling single card detail view
 * Fetches card data and handles user interactions
 */
export function useCardDetail({ cardId, userId }: UseCardDetailProps) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ownedQuantity, setOwnedQuantity] = useState(0);
  const { toast } = useToast();
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);

  // Fetch card data
  const fetchCard = useCallback(async () => {
    const reqId = ++requestIdRef.current;
    // Abort any in-flight request and create a new controller
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      // If no cardId, reset state and exit gracefully without leaving loading true
      if (!cardId) {
        if (mountedRef.current && reqId === requestIdRef.current) {
          setCard(null);
          setIsFavorite(false);
          setOwnedQuantity(0);
        }
        return;
      }
      const result = await CardService.getCardById(cardId, controller.signal);
      if (!mountedRef.current || reqId !== requestIdRef.current) return;
      setCard(result);

      // If userId is provided, fetch user's card data
      if (userId) {
        const userCards = await CardService.getUserCards(
          userId,
          controller.signal,
        );
        if (!mountedRef.current || reqId !== requestIdRef.current) return;
        const userCard = userCards.find((uc) => uc.cardId === cardId);

        if (userCard) {
          setIsFavorite(userCard.isFavorite);
          setOwnedQuantity(userCard.quantity);
        } else {
          setIsFavorite(false);
          setOwnedQuantity(0);
        }
      }
    } catch (err) {
      // Ignore aborts
      if (controller.signal.aborted) return;
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load card details";
      if (!mountedRef.current || reqId !== requestIdRef.current) return;
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      if (mountedRef.current && reqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [cardId, userId, toast]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async () => {
    if (!card || !userId) return;

    try {
      const newFavoriteStatus = !isFavorite;

      // Call API to update favorite status
      // This would be a real API call in production
      console.log(
        `Toggling favorite status for card ${cardId} to ${newFavoriteStatus}`,
      );

      // Update local state
      if (!mountedRef.current) return;
      setIsFavorite(newFavoriteStatus);

      toast({
        title: newFavoriteStatus
          ? "Added to favorites"
          : "Removed from favorites",
        description: `${card.name} has been ${newFavoriteStatus ? "added to" : "removed from"} your favorites.`,
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  }, [card, cardId, isFavorite, userId, toast]);

  // Add card to deck
  const addToDeck = useCallback(
    async (deckId: string) => {
      if (!card) return;

      try {
        // Call API to add card to deck
        // This would be a real API call in production
        console.log(`Adding card ${cardId} to deck ${deckId}`);

        if (!mountedRef.current) return;
        toast({
          title: "Card added",
          description: `${card.name} has been added to your deck.`,
          variant: "success",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to add card to deck",
          variant: "destructive",
        });
      }
    },
    [card, cardId, toast],
  );

  // Fetch data on initial load
  useEffect(() => {
    fetchCard();
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
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
