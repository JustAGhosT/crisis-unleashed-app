"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import DeckEditorPanel from './DeckEditorPanel';
import CardBrowserPanel from './CardBrowserPanel';
import DeckStatsPanel from './DeckStatsPanel';
import SaveDeckDialog from './SaveDeckDialog';
import { useDeckBuilder } from '@/lib/deck-builder/deck-builder-context';
import { Card as CardType, Deck } from '@/types/deck';

interface DeckBuilderInterfaceProps {
  isLoading: boolean;
}

export default function DeckBuilderInterface({ isLoading }: DeckBuilderInterfaceProps) {
  const { toast } = useToast();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { 
    deck, 
    cards, 
    addCardToDeck, 
    removeCardFromDeck, 
    clearDeck,
    saveDeck,
    loadDeck,
    isValid,
    validationErrors
  } = useDeckBuilder();

  // Handle save deck
  const handleSaveDeck = (deckName: string, description: string) => {
    saveDeck(deckName, description);
    setIsSaveDialogOpen(false);
    
    toast({
      title: "Deck Saved",
      description: `Your deck "${deckName}" has been saved successfully.`,
    });
  };

  // Handle export deck
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Deck Editor */}
      <div className="lg:col-span-1">
        <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
          <DeckEditorPanel 
            deck={deck}
            onRemoveCard={removeCardFromDeck}
            onClearDeck={clearDeck}
            onSaveDeck={() => setIsSaveDialogOpen(true)}
            onExportDeck={handleExportDeck}
            isValid={isValid}
            validationErrors={validationErrors}
          />
        </Card>
      </div>
      
      {/* Right Panel - Card Browser and Stats */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="w-full justify-start mb-6 dark:bg-gray-800">
            <TabsTrigger value="browse" className="dark:data-[state=active]:bg-gray-700">Browse Cards</TabsTrigger>
            <TabsTrigger value="stats" className="dark:data-[state=active]:bg-gray-700">Deck Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardBrowserPanel 
                cards={cards} 
                onAddCard={addCardToDeck}
                deck={deck}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <DeckStatsPanel deck={deck} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Save Deck Dialog */}
      <SaveDeckDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={handleSaveDeck}
        initialName={deck.name}
        initialDescription={deck.description}
      />
    </div>
  );
}

// Loading skeleton
function DeckBuilderSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-8 w-1/4" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}