import { GameCard } from '@/components/cards/GameCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isValidRarity } from '@/lib/card-utils';
import { cn } from '@/lib/utils';
import { DeckCard, Card as GameCardData } from '@/types/card';
import { Grid, List, Save, Trash2 } from 'lucide-react';
import React from 'react';

interface DeckListProps {
  deckCards: DeckCard[];
  cards: GameCardData[];
  onRemoveCard: (card: GameCardData) => void;
  onAddCard: (card: GameCardData) => void;
  onSaveDeck: () => void;
  onClearDeck: () => void;
  isLoading?: boolean;
  viewMode?: 'list' | 'grid';
  onViewModeChange?: (mode: 'list' | 'grid') => void;
  className?: string;
}

/**
 * DeckList component - Displays and manages the current deck composition
 * Supports both list and grid view modes with drag-and-drop
 */
export const DeckList: React.FC<DeckListProps> = ({
  deckCards,
  cards,
  onRemoveCard,
  onAddCard,
  onSaveDeck,
  onClearDeck,
  isLoading = false,
  viewMode = 'list',
  onViewModeChange,
  className,
}) => {
  // Create card lookup map for efficiency
  const cardMap = React.useMemo(() =>
    new Map(cards.map(card => [card.id, card])),
    [cards]
  );

  // Calculate total cards in deck
  const totalCards = React.useMemo(() =>
    deckCards.reduce((sum, dc) => sum + dc.quantity, 0),
    [deckCards]
  );

  // Sort deck cards by cost, then by name
  const sortedDeckCards = React.useMemo(() => {
    return [...deckCards].sort((a, b) => {
      const cardA = cardMap.get(a.cardId);
      const cardB = cardMap.get(b.cardId);
      if (!cardA || !cardB) return 0;

      if (cardA.cost !== cardB.cost) {
        return cardA.cost - cardB.cost;
      }
      return cardA.name.localeCompare(cardB.name);
    });
  }, [deckCards, cardMap]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const cardData = JSON.parse(e.dataTransfer.getData('application/json'));
      const card = cardMap.get(cardData.id);
      if (card) {
        onAddCard(card);
      }
    } catch (error) {
      console.error('Failed to parse dropped card data:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <Card
      className={cn('bg-slate-800/50 border-slate-600', className)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            Current Deck
            <Badge variant="outline" className="ml-2">
              {totalCards} cards
            </Badge>
          </CardTitle>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            {onViewModeChange && (
              <div className="flex rounded border border-slate-600 overflow-hidden">
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => onViewModeChange('list')}
                  className="rounded-none px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => onViewModeChange('grid')}
                  className="rounded-none px-3"
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <Button
              size="sm"
              variant="outline"
              onClick={onSaveDeck}
              disabled={isLoading || totalCards === 0}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onClearDeck}
              disabled={isLoading || totalCards === 0}
              className="text-red-400 border-red-400/50 hover:bg-red-400/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {totalCards === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-4">🃏</div>
            <p>No cards in deck</p>
            <p className="text-sm mt-1">Drag cards here or use the + button to add cards</p>
          </div>
        ) : (
          <>
            {viewMode === 'list' ? (
              <div className="space-y-2">
                {sortedDeckCards.map((deckCard) => {
                  const card = cardMap.get(deckCard.cardId);
                  if (!card) return null;

                  return (
                    <div
                      key={deckCard.cardId}
                      className="flex items-center gap-3 p-2 bg-slate-700/30 rounded border border-slate-600 hover:border-slate-500 transition-colors"
                    >
                      {/* Quantity */}
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRemoveCard(card)}
                          disabled={isLoading}
                          className="h-6 w-6 p-0"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {deckCard.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAddCard(card)}
                          disabled={isLoading || deckCard.quantity >= 3}
                          className="h-6 w-6 p-0"
                        >
                          +
                        </Button>
                      </div>

                      {/* Cost */}
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                        {card.cost}
                      </div>

                      {/* Card Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{card.name}</span>
                          <Badge
                            variant={isValidRarity(card.rarity) ? card.rarity : "default"}
                            className="text-xs"
                          >
                            {card.rarity}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400">
                          {card.type} • {card.faction}
                          {card.attack !== undefined && card.health !== undefined && (
                            <span> • {card.attack}/{card.health}</span>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveCard(card)}
                        disabled={isLoading}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {sortedDeckCards.map((deckCard) => {
                  const card = cardMap.get(deckCard.cardId);
                  if (!card) return null;

                  return (
                    <GameCard
                      key={deckCard.cardId}
                      card={card}
                      quantity={deckCard.quantity}
                      size="sm"
                      onAdd={onAddCard}
                      onRemove={onRemoveCard}
                      disabled={isLoading}
                    />
                  );
                })}
              </div>
            )}

            {/* Deck Summary */}
            <div className="mt-4 pt-4 border-t border-slate-600">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-purple-400">
                    {sortedDeckCards.length}
                  </div>
                  <div className="text-xs text-gray-400">Unique Cards</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-400">
                    {totalCards}
                  </div>
                  <div className="text-xs text-gray-400">Total Cards</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-400">
                    {totalCards > 0 ? (
                      (deckCards.reduce((sum, dc) => {
                        const card = cardMap.get(dc.cardId);
                        return sum + (card ? card.cost * dc.quantity : 0);
                      }, 0) / totalCards).toFixed(1)
                    ) : '0.0'}
                  </div>
                  <div className="text-xs text-gray-400">Avg Cost</div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

DeckList.displayName = 'DeckList';