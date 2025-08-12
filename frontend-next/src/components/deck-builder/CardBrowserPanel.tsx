"use client";

import React, { useState, useMemo } from 'react';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TextInput, SelectInput } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Deck } from '@/types/deck';
import { Card as CardType } from '@/types/card';
import { CardItem } from './CardItem';
import { Search, Filter, X } from 'lucide-react';

interface CardBrowserPanelProps {
  cards: CardType[];
  onAddCard: (card: CardType) => void;
  deck: Deck;
}

export default function CardBrowserPanel({
  cards,
  onAddCard,
  deck
}: CardBrowserPanelProps) {
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [costFilter, setCostFilter] = useState('');
  const [rarityFilter, setRarityFilter] = useState('');
  const [factionFilter, setFactionFilter] = useState(deck.faction || '');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values for filter options
  const types = useMemo(() => {
    const uniqueTypes = new Set<string>();
    cards.forEach(card => {
      if (card.type) uniqueTypes.add(card.type);
    });
    return Array.from(uniqueTypes).sort();
  }, [cards]);

  const costs = useMemo(() => {
    const uniqueCosts = new Set<number>();
    cards.forEach(card => {
      if (card.cost !== undefined) uniqueCosts.add(card.cost);
    });
    return Array.from(uniqueCosts).sort((a, b) => a - b);
  }, [cards]);

  const rarities = useMemo(() => {
    const uniqueRarities = new Set<string>();
    cards.forEach(card => {
      if (card.rarity) uniqueRarities.add(card.rarity);
    });
    return Array.from(uniqueRarities).sort();
  }, [cards]);

  const factions = useMemo(() => {
    const uniqueFactions = new Set<string>();
    cards.forEach(card => {
      if (card.faction) uniqueFactions.add(card.faction);
    });
    return Array.from(uniqueFactions).sort();
  }, [cards]);

  // Filter cards based on current filters
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // Text search
      const matchesSearch = 
        !searchQuery || 
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.description && card.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Type filter
      const matchesType = !typeFilter || card.type === typeFilter;
      
      // Cost filter
      const matchesCost = !costFilter || (card.cost !== undefined && card.cost.toString() === costFilter);
      
      // Rarity filter
      const matchesRarity = !rarityFilter || card.rarity === rarityFilter;
      
      // Faction filter
      const matchesFaction = !factionFilter || card.faction === factionFilter;
      
      return matchesSearch && matchesType && matchesCost && matchesRarity && matchesFaction;
    });
  }, [cards, searchQuery, typeFilter, costFilter, rarityFilter, factionFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('');
    setCostFilter('');
    setRarityFilter('');
    // Don't clear faction filter if it's set from the deck
    if (!deck.faction) {
      setFactionFilter('');
    }
  };

  // Note: deck capacity, faction constraints, and copy limits are enforced in deck operations

  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="dark:text-white">Card Browser</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Browse and add cards to your deck
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 dark:border-gray-600 dark:text-gray-200"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Search bar */}
        <div className="mb-4">
          <TextInput
            id="card-search"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-5 w-5" />}
            rightIcon={
              searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              ) : undefined
            }
          />
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <SelectInput
              id="type-filter"
              label="Card Type"
              options={types.map(type => ({ value: type, label: type }))}
              value={typeFilter}
              onChange={setTypeFilter}
              placeholder="All Types"
            />
            
            <SelectInput
              id="cost-filter"
              label="Cost"
              options={costs.map(cost => ({ value: cost.toString(), label: cost.toString() }))}
              value={costFilter}
              onChange={setCostFilter}
              placeholder="Any Cost"
            />
            
            <SelectInput
              id="rarity-filter"
              label="Rarity"
              options={rarities.map(rarity => ({ value: rarity, label: rarity }))}
              value={rarityFilter}
              onChange={setRarityFilter}
              placeholder="Any Rarity"
            />
            
            <SelectInput
              id="faction-filter"
              label="Faction"
              options={factions.map(faction => ({ value: faction, label: faction }))}
              value={factionFilter}
              onChange={setFactionFilter}
              placeholder="Any Faction"
              disabled={!!deck.faction} // Disable if deck has a faction set
            />
            
            <div className="sm:col-span-2 md:col-span-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Results count */}
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredCards.length} of {cards.length} cards
        </div>
        
        {/* Card grid */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No cards found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-450px)] min-h-[400px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {filteredCards.map(card => {
                const copies = deck.cards.filter(c => c.id === card.id).length;
                const maxCopies = card.rarity?.toLowerCase() === 'legendary' ? 1 : 3;
                return (
                  <CardItem
                    key={card.id}
                    card={card}
                    onAdd={() => onAddCard(card)}
                    copiesInDeck={copies}
                    maxCopies={maxCopies}
                    showAddButton
                  />
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </>
  );
}