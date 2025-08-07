"use client";

import React, { useState, useEffect } from 'react';
import { CardCollection } from '@/components/cards/CardCollection';
import { Card, CardFilters as CardFiltersType } from '@/types/card';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Filter, Loader2 } from 'lucide-react';

// In a real implementation, these would come from a hook or API call
// For this demo, we'll simulate it
const useCards = (
  page: number, 
  filters: CardFiltersType
) => {
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock cards - in real app this would come from API
        const mockCards: Card[] = Array.from({ length: 20 }).map((_, i) => ({
          id: `card-${page}-${i}`,
          name: `Example Card ${page * 20 + i + 1}`,
          description: 'This is a sample card description with some gameplay text.',
          type: ['hero', 'unit', 'action', 'structure'][Math.floor(Math.random() * 4)] as any,
          faction: ['solaris', 'umbral', 'aeonic', 'primordial', 'infernal', 'neuralis'][Math.floor(Math.random() * 6)] as any,
          rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'][Math.floor(Math.random() * 5)] as any,
          cost: Math.floor(Math.random() * 10),
          attack: Math.floor(Math.random() * 10),
          health: Math.floor(Math.random() * 10),
          abilities: ['First Strike', 'Overwhelm', 'Shield', 'Flying'].slice(0, Math.floor(Math.random() * 3)),
          energyCost: Math.floor(Math.random() * 5),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        
        // Filter cards based on provided filters
        let filteredCards = mockCards;
        if (filters.faction) {
          filteredCards = filteredCards.filter(card => card.faction === filters.faction);
        }
        if (filters.type) {
          filteredCards = filteredCards.filter(card => card.type === filters.type);
        }
        if (filters.rarity) {
          filteredCards = filteredCards.filter(card => card.rarity === filters.rarity);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredCards = filteredCards.filter(card => 
            card.name.toLowerCase().includes(searchLower) || 
            card.description.toLowerCase().includes(searchLower)
          );
        }
        
        setCards(filteredCards);
        setTotalCount(100); // Mock total
        setTotalPages(5); // Mock pages
      } catch (err) {
        setError('Failed to load cards. Please try again later.');
        console.error('Error fetching cards:', err);
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
  { id: 'user-card-1', userId: 'user1', cardId: 'card-1-0', quantity: 3, isFavorite: true, acquiredAt: new Date().toISOString() },
  { id: 'user-card-2', userId: 'user1', cardId: 'card-1-1', quantity: 2, isFavorite: false, acquiredAt: new Date().toISOString() },
  { id: 'user-card-3', userId: 'user1', cardId: 'card-1-2', quantity: 1, isFavorite: true, acquiredAt: new Date().toISOString() },
];

export default function CardsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Extract page number from URL or default to 1
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  // Extract filters from URL
  const getFiltersFromParams = (): CardFiltersType => {
    const filters: CardFiltersType = {};
    if (searchParams.has('faction')) filters.faction = searchParams.get('faction') as any;
    if (searchParams.has('type')) filters.type = searchParams.get('type') as any;
    if (searchParams.has('rarity')) filters.rarity = searchParams.get('rarity') as any;
    if (searchParams.has('search')) filters.search = searchParams.get('search') as string;
    if (searchParams.has('costMin')) filters.costMin = parseInt(searchParams.get('costMin') as string, 10);
    if (searchParams.has('costMax')) filters.costMax = parseInt(searchParams.get('costMax') as string, 10);
    return filters;
  };
  
  const [filters, setFilters] = useState<CardFiltersType>(getFiltersFromParams());
  
  // Fetch cards data
  const { cards, loading, error, totalCount, totalPages } = useCards(page, filters);
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/cards?${params.toString()}`);
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters: CardFiltersType) => {
    setFilters(newFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    if (newFilters.faction) params.set('faction', newFilters.faction);
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.rarity) params.set('rarity', newFilters.rarity);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.costMin !== undefined) params.set('costMin', newFilters.costMin.toString());
    if (newFilters.costMax !== undefined) params.set('costMax', newFilters.costMax.toString());
    params.set('page', '1'); // Reset to page 1 when filters change
    
    router.push(`/cards?${params.toString()}`);
  };
  
  // Mock handlers for card interactions
  const handleCardClick = (card: Card) => {
    console.log('Card clicked:', card);
  };
  
  const handleToggleFavorite = (card: Card, isFavorite: boolean) => {
    console.log('Toggle favorite:', card, isFavorite);
  };
  
  const handleAddToDeck = (card: Card) => {
    console.log('Add to deck:', card);
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