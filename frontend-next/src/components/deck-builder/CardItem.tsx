"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card as CardType } from '@/types/deck';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CardItemProps {
  card: CardType;
  onAdd: () => void;
  canAdd: boolean;
  copiesInDeck: number;
}

export default function CardItem({ card, onAdd, canAdd, copiesInDeck }: CardItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get color class based on card rarity
  const getRarityColorClass = (rarity: string = 'common') => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'epic':
        return 'border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'rare':
        return 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'uncommon':
        return 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'common':
      default:
        return 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800';
    }
  };
  
  // Get the reason why a card can't be added
  const getAddDisabledReason = () => {
    if (copiesInDeck >= (card.isUnique ? 1 : 3)) {
      return `Maximum copies (${card.isUnique ? 1 : 3}) already in deck`;
    }
    if (card.faction && card.faction !== 'Neutral') {
      return `Card belongs to a different faction`;
    }
    return 'Deck is full';
  };

  return (
    <div 
      className={cn(
        "relative rounded-lg border overflow-hidden transition-all",
        getRarityColorClass(card.rarity),
        isHovered && "shadow-md"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card image */}
      <div className="relative h-40 w-full bg-gray-200 dark:bg-gray-700">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center">
            <svg className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {card.name}
            </span>
          </div>
        )}
        
        {/* Card stats overlay */}
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          {/* Faction badge */}
          {card.faction && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-black/60 text-white">
              {card.faction}
            </span>
          )}
          
          {/* Cost/Power badges */}
          <div className="flex space-x-1">
            {card.cost !== undefined && (
              <span className="inline-flex items-center justify-center bg-blue-600 text-white rounded-full w-6 h-6 text-xs font-bold">
                {card.cost}
              </span>
            )}
            {card.power !== undefined && (
              <span className="inline-flex items-center justify-center bg-red-600 text-white rounded-full w-6 h-6 text-xs font-bold">
                {card.power}
              </span>
            )}
          </div>
        </div>
        
        {/* Rarity badge */}
        {card.rarity && (
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-black/60 text-white">
              {card.rarity}
            </span>
          </div>
        )}
        
        {/* Unique badge */}
        {card.isUnique && (
          <div className="absolute bottom-2 right-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-600 text-white">
              Unique
            </span>
          </div>
        )}
      </div>
      
      {/* Card info */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {card.name}
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {card.type} {card.subtype && `- ${card.subtype}`}
        </p>
        
        {/* Card text - truncated */}
        {card.text && (
          <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
            {card.text}
          </p>
        )}
      </div>
      
      {/* Add button */}
      <div className="p-3 pt-0 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {copiesInDeck} / {card.isUnique ? 1 : 3}
        </span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  size="sm"
                  onClick={onAdd}
                  disabled={!canAdd}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </span>
            </TooltipTrigger>
            {!canAdd && (
              <TooltipContent>
                <p>{getAddDisabledReason()}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}