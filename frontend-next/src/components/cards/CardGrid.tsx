import React from 'react';
import { Card as GameCardData } from '@/types/card';
import { GameCard } from './GameCard';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CardGridProps {
  cards: GameCardData[];
  loading?: boolean;
  onCardClick?: (card: GameCardData) => void;
  onCardAdd?: (card: GameCardData) => void;
  onCardRemove?: (card: GameCardData) => void;
  getQuantity?: (cardId: string) => number;
  getMaxQuantity?: (card: GameCardData) => number;
  emptyMessage?: string;
  showQuantity?: boolean;
  cardSize?: 'sm' | 'md' | 'lg';
  className?: string;
  columnCount?: 2 | 3 | 4 | 5 | 6;
  draggable?: boolean;
  disabledCardIds?: string[];
}

/**
 * CardGrid component - Displays a grid of cards with various interaction options
 * Following SOLID principles with clear separation of concerns
 */
export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  loading = false,
  onCardClick,
  onCardAdd,
  onCardRemove,
  getQuantity = () => 0,
  getMaxQuantity = () => 3,
  emptyMessage = 'No cards found',
  showQuantity = true,
  cardSize = 'md',
  className,
  columnCount = 4,
  draggable = false,
  disabledCardIds = [],
}) => {
  // Grid column configuration based on columnCount prop
  const gridColumns = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  // Render loading skeletons when in loading state
  if (loading) {
    return (
      <div className={cn(
        'grid gap-4',
        gridColumns[columnCount],
        className
      )}>
        {Array.from({ length: 12 }).map((_, index) => (
          <Card key={index} />
        ))}
      </div>
    );
  }

  // Render empty message when no cards available
  if (!cards.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      'grid gap-4',
      gridColumns[columnCount],
      className
    )}>
      {cards.map((card) => (
        <GameCard
          key={card.id}
          card={card}
          quantity={getQuantity(card.id)}
          maxQuantity={getMaxQuantity(card)}
          onAdd={onCardAdd}
          onRemove={onCardRemove}
          onClick={onCardClick}
          size={cardSize}
          showQuantity={showQuantity}
          draggable={draggable}
          disabled={disabledCardIds.includes(card.id)}
        />
      ))}
    </div>
  );
};

// Loading skeleton for card
const Card = () => {
  return (
    <div className="relative aspect-[3/4] w-full bg-slate-800/50 rounded-md overflow-hidden">
      <div className="p-3 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-5 w-14" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  );
};

CardGrid.displayName = 'CardGrid';