"use client";

import React, { useState, useEffect, Suspense } from "react";
import { CardCollection } from "@/components/cards/CardCollection";
import { Card, CardFilters as CardFiltersType } from "@/types/card";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { generateMockCards } from "@/services/__mocks__/cardService";
import { FactionId } from "@/types/faction";
import FactionsThemeShell from "../factions/FactionsThemeShell";

// In a real implementation, these would come from a hook or API call
// For this demo, we'll simulate it
const useCards = (page: number, filters: CardFiltersType) => {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        // Simulate API request with timeout
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Use extracted mock service for generation + filtering
        const filteredCards = generateMockCards(page, filters);

        setCards(filteredCards);
        setTotalCount(100); // Mock total
        setTotalPages(5); // Mock pages
      } catch (err) {
        setError("Failed to load cards. Please try again later.");
        console.error("Error fetching cards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [page, filters]);

  return { cards, loading, error, totalCount, totalPages };
};

// Mock user cards - in real app this would come from user state or API
const mockUserCards = [
  {
    id: "user-card-1",
    userId: "user1",
    cardId: "card-1-0",
    quantity: 3,
    isFavorite: true,
    acquiredAt: new Date().toISOString(),
  },
  {
    id: "user-card-2",
    userId: "user1",
    cardId: "card-1-1",
    quantity: 2,
    isFavorite: false,
    acquiredAt: new Date().toISOString(),
  },
  {
    id: "user-card-3",
    userId: "user1",
    cardId: "card-1-2",
    quantity: 1,
    isFavorite: true,
    acquiredAt: new Date().toISOString(),
  },
];

function CardsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract page number from URL or default to 1
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Extract filters from URL
  const getFiltersFromParams = (): CardFiltersType => {
    const filters: CardFiltersType = {};

    const getStr = (key: string) => {
      const v = searchParams.get(key)?.trim();
      return v ? v : undefined;
    };

    const getInt = (key: string) => {
      const v = searchParams.get(key);
      if (v == null || v.trim() === "") return undefined;
      const n = Number.parseInt(v, 10);
      return Number.isNaN(n) ? undefined : n;
    };

    const faction = getStr("faction");
    const type = getStr("type");
    const rarity = getStr("rarity");
    const search = getStr("search");
    const costMin = getInt("costMin");
    const costMax = getInt("costMax");

    if (faction) filters.faction = faction as FactionId;
    if (type) filters.type = type as CardFiltersType["type"];
    if (rarity) filters.rarity = rarity as CardFiltersType["rarity"];
    if (search) filters.search = search;
    if (costMin !== undefined) filters.costMin = costMin;
    if (costMax !== undefined) filters.costMax = costMax;

    return filters;
  };

  const [filters, setFilters] = useState<CardFiltersType>(
    getFiltersFromParams(),
  );

  // Fetch cards data
  const { cards, loading, error, totalCount, totalPages } = useCards(
    page,
    filters,
  );

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/cards?${params.toString()}`);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: CardFiltersType) => {
    setFilters(newFilters);

    // Update URL with new filters
    const params = new URLSearchParams();
    if (newFilters.faction) params.set("faction", newFilters.faction);
    if (newFilters.type) params.set("type", newFilters.type);
    if (newFilters.rarity) params.set("rarity", newFilters.rarity);
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.costMin !== undefined)
      params.set("costMin", newFilters.costMin.toString());
    if (newFilters.costMax !== undefined)
      params.set("costMax", newFilters.costMax.toString());
    params.set("page", "1"); // Reset to page 1 when filters change

    router.push(`/cards?${params.toString()}`);
  };

  // Mock handlers for card interactions
  const handleCardClick = (card: Card) => {
    console.log("Card clicked:", card);
  };

  const handleToggleFavorite = (card: Card, isFavorite: boolean) => {
    console.log("Toggle favorite:", card, isFavorite);
  };

  const handleAddToDeck = (card: Card) => {
    console.log("Add to deck:", card);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Card Browser</h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && cards.length === 0 ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading cards...</span>
        </div>
      ) : (
        <CardCollection
          cards={cards}
          userCards={mockUserCards}
          loading={loading}
          onCardClick={handleCardClick}
          onToggleFavorite={handleToggleFavorite}
          onAddToDeck={handleAddToDeck}
          onApplyFilters={handleFilterChange}
          filters={filters}
          totalCount={totalCount}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default function CardsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <FactionsThemeShell>
        <CardsContent />
      </FactionsThemeShell>
    </Suspense>
  );
}
