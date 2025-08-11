import { useToast } from '@/hooks/useToast';
import { CardService } from '@/services/cardService';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardFilters, UserCard } from '@/types/card';

// Definition of pagination state interface
interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  setTotal: (total: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Simple pagination hook implementation
function usePagination({
  initialPage = 1,
  pageSize = 20,
  total = 0,
}: {
  initialPage?: number;
  pageSize?: number;
  total?: number;
}) {
  const [page, setPage] = useState(initialPage);
  const [totalItems, setTotalItems] = useState(total);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure page is within bounds
  const setPageSafe = useCallback((newPage: number) => {
    const boundedPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(boundedPage);
  }, [totalPages]);

  // Set total with bounds check
  const setTotalSafe = useCallback((newTotal: number) => {
    setTotalItems(newTotal);
    const maxPage = Math.max(1, Math.ceil(newTotal / pageSize));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, pageSize]);

  return {
    page,
    pageSize,
    total: totalItems,
    totalPages,
    setPage: setPageSafe,
    setTotal: setTotalSafe,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

interface UseCardsProps {
  initialFilters?: CardFilters;
  initialPage?: number;
  pageSize?: number;
  userId?: string;
}

/**
 * Custom hook for working with card data
 * Handles fetching, filtering, and pagination of cards
 */
export function useCards({
  initialFilters = {},
  initialPage = 1,
  pageSize = 20,
  userId,
}: UseCardsProps = {}) {
  const [cards, setCards] = useState<Card[]>([]);
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [filters, setFilters] = useState<CardFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const userControllerRef = useRef<AbortController | null>(null);

  // Initialize pagination hook
  const pagination = usePagination({
    initialPage,
    pageSize,
    total: totalCount,
  });

  // Fetch cards based on current filters and pagination
  const fetchCards = useCallback(async () => {
    const reqId = ++requestIdRef.current;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await CardService.searchCards(
        filters,
        pagination.page,
        pagination.pageSize,
        controller.signal
      );

      if (!mountedRef.current || reqId !== requestIdRef.current) return;
      setCards(result.cards);
      setTotalCount(result.total);
      pagination.setTotal(result.total);
    } catch (err: any) {
      // Ignore aborts
      if (controller.signal.aborted) return;
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cards';
      if (!mountedRef.current || reqId !== requestIdRef.current) return;
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      if (mountedRef.current && reqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [filters, pagination.page, pagination.pageSize, toast]);

  // Fetch user cards if userId is provided
  const fetchUserCards = useCallback(async () => {
    if (!userId) return;

    // Abort previous user-cards request
    userControllerRef.current?.abort();
    const controller = new AbortController();
    userControllerRef.current = controller;

    try {
      const userCardData = await CardService.getUserCards(userId, controller.signal);
      if (!mountedRef.current) return;
      setUserCards(userCardData);
    } catch (err: any) {
      if (controller.signal.aborted) return;
      const errorMessage = err instanceof Error ? err.message : 'Failed to load your card collection';
      toast({
        title: 'Warning',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [userId, toast]);

  // Apply new filters and reset to page 1
  const applyFilters = useCallback((newFilters: CardFilters) => {
    setFilters(newFilters);
    pagination.setPage(1);
  }, [pagination]);

  // Get quantity of a card in user's collection
  const getCardQuantity = useCallback((cardId: string): number => {
    const userCard = userCards.find(uc => uc.cardId === cardId);
    return userCard ? userCard.quantity : 0;
  }, [userCards]);

  // Check if a card is favorite
  const isCardFavorite = useCallback((cardId: string): boolean => {
    const userCard = userCards.find(uc => uc.cardId === cardId);
    return userCard ? userCard.isFavorite : false;
  }, [userCards]);

  // Toggle favorite status of a card
  const toggleFavorite = useCallback(async (card: Card, isFavorite: boolean) => {
    try {
      // This would call an API to update the favorite status
      toast({
        title: isFavorite ? 'Added to favorites' : 'Removed from favorites',
        description: `${card.name} has been ${isFavorite ? 'added to' : 'removed from'} your favorites.`,
      });

      // Update local state optimistically
      setUserCards(prev => prev.map(uc =>
        uc.cardId === card.id
          ? { ...uc, isFavorite }
          : uc
      ));
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update favorite status.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Fetch data on initial load and when dependencies change
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    if (userId) {
      fetchUserCards();
    }
  }, [userId, fetchUserCards]);

  // Cleanup on unmount: mark unmounted and abort in-flight requests
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
      userControllerRef.current?.abort();
    };
  }, []);

  return {
    cards,
    userCards,
    loading,
    error,
    filters,
    totalCount,
    pagination,
    applyFilters,
    getCardQuantity,
    isCardFavorite,
    toggleFavorite,
    refreshCards: fetchCards,
  };
}