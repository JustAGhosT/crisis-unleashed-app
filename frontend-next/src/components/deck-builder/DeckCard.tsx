"use client";

import React from 'react';
import Image from 'next/image';
import { Card as CardType } from '@/types/deck';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeckCardProps {
  card: CardType;
  onRemove: () => void;
}

export default function DeckCard({ card, onRemove }: DeckCardProps) {
  // Get color class based on card rarity
  const getRarityColorClass = (rarity: string = 'common') => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'border-amber-400 dark:border-amber-500';
      case 'epic':
        return 'border-purple-400 dark:border-purple-500';
      case 'rare':
        return 'border-blue-400 dark:border-blue-500';
      case 'uncommon':
        return 'border-green-400 dark:border-green-500';
      case 'common':
      default:
        return 'border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div 
      className={cn(
        "flex items-center p-2 rounded-md border bg-white dark:bg-gray-800",
        getRarityColorClass(card.rarity)
      )}
    >
      {/* Card image */}
      <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Card info */}
      <div className="ml-3 flex-grow min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {card.name}
          </h4>
          <div className="flex items-center space-x-1">
            {card.cost !== undefined && (
              <span className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full w-5 h-5 text-xs font-medium">
                {card.cost}
              </span>
            )}
            {card.power !== undefined && (
              <span className="inline-flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full w-5 h-5 text-xs font-medium">
                {card.power}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
            {card.type} {card.subtype && `- ${card.subtype}`}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove {card.name}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}