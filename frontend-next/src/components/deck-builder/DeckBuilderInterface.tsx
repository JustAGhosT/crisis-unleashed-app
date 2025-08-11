"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDeckBuilder } from '@/lib/deck-builder/deck-builder-context';
// Legacy deck-builder context types
import type { Card as LegacyCard, Deck as LegacyDeck } from '@/types/deck';
// UI components (CardGrid, DeckList) expect the newer card types
import type { Card as GameCard, DeckCard as GameDeckCard, CardType, CardRarity } from '@/types/card';
import { FACTION_IDS, type FactionId } from '@/types/faction';
import { CardGrid } from './CardGrid';
import { DeckList } from './DeckList';
import { Save, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeckBuilderInterfaceProps {
  isLoading?: boolean;
  className?: string;
}

export default function DeckBuilderInterface({ isLoading = false, className }: DeckBuilderInterfaceProps) {
  // Simple fallback toast implementation (replace with real toast when available)
  const toast = ({ title, description }: { title: string; description?: string }) => {
    if (typeof window !== 'undefined') {
      window.alert(description ? `${title}: ${description}` : title);
    }
  };
  const [deckName, setDeckName] = useState('New Deck');
  const [activeTab, setActiveTab] = useState('cards');
  
  const { 
    deck, 
    cards, 
    addCardToDeck, 
    removeCardFromDeck, 
    clearDeck,
    saveDeck,
    isValid,
    validationErrors
  } = useDeckBuilder();

  // Narrowing helpers to coerce legacy string values into strict enums
  const coerceCardType = (t: LegacyCard['type']): CardType => {
    const allowed: readonly CardType[] = ['hero', 'unit', 'action', 'structure'] as const;
    return allowed.includes(t as CardType) ? (t as CardType) : 'unit';
  };

  const coerceFactionId = (f: LegacyCard['faction']): FactionId => {
    return (f && (FACTION_IDS as readonly string[]).includes(f)) ? (f as FactionId) : 'solaris';
  };

  const coerceCardRarity = (r: LegacyCard['rarity']): CardRarity => {
    const allowed: readonly CardRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
    return allowed.includes(r as CardRarity) ? (r as CardRarity) : 'common';
  };

  // Adapter: legacy -> game card
  const toGameCard = useCallback((c: LegacyCard): GameCard => ({
    id: c.id,
    name: c.name,
    description: c.text ?? '',
    type: coerceCardType(c.type),
    unitType: undefined,
    actionType: undefined,
    structureType: undefined,
    faction: coerceFactionId(c.faction),
    rarity: coerceCardRarity(c.rarity),
    cost: c.cost ?? 0,
    attack: c.power,
    health: undefined,
    initiative: undefined,
    range: undefined,
    movementSpeed: undefined,
    keywords: c.keywords ?? [],
    abilities: [],
    playConditions: [],
    energyCost: c.cost ?? 0,
    momentumCost: undefined,
    zoneRestrictions: [],
    persistsOnBattlefield: undefined,
    imageUrl: c.imageUrl,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }), []);

  // Adapter: game -> legacy card (best-effort)
  const toLegacyCard = useCallback((c: GameCard): LegacyCard => ({
    id: c.id,
    name: c.name,
    cost: c.cost,
    power: c.attack,
    type: c.type,
    subtype: undefined,
    faction: c.faction,
    rarity: c.rarity,
    text: c.description,
    imageUrl: c.imageUrl,
    isUnique: undefined,
    keywords: c.keywords,
  }), []);

  // Map available cards for UI components
  const gameCards: GameCard[] = useMemo(() => cards.map(toGameCard), [cards, toGameCard]);

  // Prepare deck cards for the DeckList in DeckCard[] format
  const deckCardsForList: GameDeckCard[] = useMemo(() => {
    const counts = new Map<string, number>();
    deck.cards.forEach((c) => counts.set(c.id, (counts.get(c.id) ?? 0) + 1));
    return Array.from(counts.entries()).map(([cardId, quantity]) => ({ cardId, quantity }));
  }, [deck.cards]);

  // Handle adding a card to the deck
  const handleAddCard = (card: GameCard) => {
    addCardToDeck(toLegacyCard(card));
  };

  // Handle removing a card from the deck
  const handleRemoveCard = (card: GameCard) => {
    removeCardFromDeck(toLegacyCard(card));
  };

  // Handle saving the deck
  const handleSaveDeck = () => {
    if (!deckName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a deck name.",
      });
      return;
    }
    
    // Use context save signature (name, description)
    saveDeck(deckName, (deck as LegacyDeck).description ?? '');
    
    toast({
      title: "Deck Saved",
      description: `Your deck "${deckName}" has been saved successfully.`,
    });
  };

  // Handle clearing the deck
  const handleClearDeck = () => {
    clearDeck();
    toast({
      title: "Deck Cleared",
      description: "Your deck has been cleared.",
    });
  };

  // Handle exporting the deck
  const handleExportDeck = () => {
    const deckData = JSON.stringify(deck, null, 2);
    const blob = new Blob([deckData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.name || 'deck'}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Deck Exported",
      description: "Your deck has been exported as a JSON file.",
    });
  };

  if (isLoading) {
    return <DeckBuilderSkeleton />;
  }

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}>
      {/* Main Card Grid */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold">Card Library</h2>
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search cards..."
              className="w-full"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="cards">All Cards</TabsTrigger>
            <TabsTrigger value="faction">By Faction</TabsTrigger>
            <TabsTrigger value="type">By Type</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="mt-4">
            <CardGrid 
              cards={gameCards}
              onAddCard={handleAddCard}
            />
          </TabsContent>

          <TabsContent value="faction" className="mt-4">
            <div className="space-y-6">
              {/* Faction tabs would go here */}
              <div className="text-muted-foreground text-center py-8">
                Faction view coming soon
              </div>
            </div>
          </TabsContent>

          <TabsContent value="type" className="mt-4">
            <div className="space-y-6">
              {/* Type tabs would go here */}
              <div className="text-muted-foreground text-center py-8">
                Type view coming soon
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Deck Panel */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Deck</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleClearDeck}
              disabled={deck.cards.length === 0}
              title="Clear Deck"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleExportDeck}
              disabled={deck.cards.length === 0}
              title="Export Deck"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="h-[calc(100vh-200px)] overflow-hidden">
          <CardHeader className="border-b">
            <div className="space-y-2">
              <Input 
                placeholder="Deck Name" 
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="text-lg font-bold"
              />
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{deck.cards.length} / {deck.maxCards} cards</span>
                <span>{deck.faction || 'No faction selected'}</span>
              </div>
            </div>
          </CardHeader>
          
          <ScrollArea className="h-[calc(100%-150px)]">
            <CardContent className="p-4">
              {deck.cards.length > 0 ? (
                <DeckList 
                  deckCards={deckCardsForList}
                  cards={gameCards}
                  onAddCard={handleAddCard}
                  onRemoveCard={handleRemoveCard}
                  viewMode="list"
                  onSaveDeck={handleSaveDeck}
                  onClearDeck={handleClearDeck}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                  <p className="mb-4">Your deck is empty</p>
                  <p className="text-sm">Add cards from the library to get started</p>
                </div>
              )}
            </CardContent>
          </ScrollArea>
          
          <CardFooter className="border-t p-4">
            <Button 
              className="w-full" 
              onClick={handleSaveDeck}
              disabled={!isValid || deck.cards.length === 0}
            >
              Save Deck
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Validation Errors Toast */}
      {validationErrors.length > 0 && (
        <div className="fixed bottom-4 right-4 max-w-md">
          <div className="bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg">
            <h3 className="font-bold mb-2">Deck Validation Errors</h3>
            <ul className="text-sm space-y-1">
              {validationErrors.map((error, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading skeleton for the deck builder
function DeckBuilderSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-10 w-64 bg-muted rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="h-60 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-24 bg-muted rounded" />
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-muted rounded" />
            <div className="h-10 w-10 bg-muted rounded" />
          </div>
        </div>
        <div className="h-[calc(100vh-200px)] bg-muted/50 rounded-lg" />
      </div>
    </div>
  );
}