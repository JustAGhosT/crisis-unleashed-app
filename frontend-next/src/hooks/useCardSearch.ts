import { useEffect, useRef, useState } from "react";
import { CardService } from "@/services/cardService";
import { Card, CardFilters } from "@/types/card";
import { useMemo } from "react";

export interface CardSearchResult {
  cards: Card[];
  total: number;
}

export function useCardSearch(
  filters: CardFilters = {},
  page = 1,
  pageSize = 20,
) {
  const [data, setData] = useState<CardSearchResult | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const controllerRef = useRef<AbortController | null>(null);
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    let cancelled = false;
    async function run() {
      setIsLoading(true);
      setError(undefined);
      try {
        const result = await CardService.searchCards(
          filters,
          page,
          pageSize,
          controller.signal,
        );
        if (!cancelled) setData({ cards: result.cards, total: result.total });
      } catch (e) {
        if (!cancelled && !controller.signal.aborted) {
          setError(e instanceof Error ? e.message : "Failed to search cards");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [filters, filtersKey, page, pageSize]);

  return { data, isLoading, error };
}
