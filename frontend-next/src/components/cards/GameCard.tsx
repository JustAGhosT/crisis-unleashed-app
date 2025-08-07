import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { isValidRarity } from '@/lib/card-utils';
import { cn, getFactionColorClass } from '@/lib/utils';
import { Card as GameCardData } from '@/types/card';
import { Heart, Minus, Plus, Swords } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface GameCardProps {
  card: GameCardData;
  quantity?: number;
  maxQuantity?: number;
  onAdd?: (card: GameCardData) => void;
  onRemove?: (card: GameCardData) => void;
  onClick?: (card: GameCardData) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showQuantity?: boolean;
  draggable?: boolean;
}

/**
 * GameCard component - Displays individual card information
 * Following SOLID principles with clear separation of concerns
 */
export const GameCard: React.FC<GameCardProps> = ({
  card,
  quantity = 0,
  maxQuantity = 3,
  onAdd,
  onRemove,
  onClick,
  size = 'md',
  disabled = false,
  showQuantity = true,
  draggable = false,
}) => {
  const sizeClasses = {
    sm: 'w-32 h-44',
    md: 'w-40 h-56',
    lg: 'w-48 h-68',
  };

  const handleCardClick = () => {
    if (onClick && !disabled) {
      onClick(card);
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAdd && !disabled && quantity < maxQuantity) {
      onAdd(card);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove && !disabled && quantity > 0) {
      onRemove(card);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (draggable) {
      e.dataTransfer.setData('application/json', JSON.stringify(card));
      e.dataTransfer.effectAllowed = 'copy';
    }
  };

  return (
    <Card
      className={cn(
        'relative transition-all duration-300 cursor-pointer group',
        sizeClasses[size],
        'bg-slate-800/90 border-slate-600 hover:border-current',
        disabled && 'opacity-50 cursor-not-allowed',
        onClick && 'hover:scale-105 hover:shadow-lg',
        getFactionColorClass(card.faction)
      )}
      onClick={handleCardClick}
      draggable={draggable && !disabled}
      onDragStart={handleDragStart}
    >
      {/* Card Header with Cost and Rarity */}
      <CardHeader className="p-2 pb-1">
        <div className="flex justify-between items-start">
          {/* Cost */}
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
            'bg-blue-600 text-white'
          )}>
            {card.cost}
          </div>

          {/* Rarity Badge */}
          <Badge
            variant={isValidRarity(card.rarity) ? card.rarity : "default"}
            className="text-xs"
          >
            {card.rarity}
          </Badge>
        </div>

        {/* Card Name */}
        <h3 className={cn(
          'text-sm font-semibold truncate',
          'text-white group-hover:text-current'
        )}>
          {card.name}
        </h3>
      </CardHeader>

      <CardContent className="p-2 pt-1 flex flex-col h-full">
        {/* Card Image Placeholder */}
        <div className="w-full h-20 bg-slate-700/50 rounded mb-2 flex items-center justify-center">
          {card.imageUrl ? (
            <Image
              src={card.imageUrl}
              alt={card.name}
              className="w-full h-full object-cover rounded"
              width={100}
              height={100}
            />
          ) : (
            <div className={cn(
              'text-xs opacity-50',
              getFactionColorClass(card.faction)
            )}>
              {card.faction.toUpperCase()}
            </div>
          )}
        </div>

        {/* Attack/Health for Units and Heroes */}
        {(card.type === 'hero' || card.type === 'unit') && card.attack !== undefined && card.health !== undefined && (
          <div className="flex justify-between mb-2">
            <div className="flex items-center gap-1 text-xs text-orange-300">
              <Swords className="w-3 h-3" />
              {card.attack}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-300">
              <Heart className="w-3 h-3" />
              {card.health}
            </div>
          </div>
        )}

        {/* Card Description */}
        <p className="text-xs text-gray-400 flex-1 overflow-hidden text-ellipsis">
          {card.description}
        </p>

        {/* Abilities */}
        {card.abilities.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {card.abilities.slice(0, 2).map((ability, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {ability}
                </Badge>
              ))}
              {card.abilities.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{card.abilities.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Quantity Controls */}
        {(onAdd || onRemove) && (
          <div className="mt-2 flex items-center justify-between">
            {onRemove && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemove}
                disabled={disabled || quantity <= 0}
                className="h-6 w-6 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
            )}

            {showQuantity && (
              <span className="text-xs font-medium text-white bg-slate-700 px-2 py-1 rounded">
                {quantity}/{maxQuantity}
              </span>
            )}

            {onAdd && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAdd}
                disabled={disabled || quantity >= maxQuantity}
                className="h-6 w-6 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </CardContent>

      {/* Faction Indicator */}
      <div className={cn(
        'absolute top-1 right-1 w-2 h-2 rounded-full',
        'bg-current opacity-60'
      )} />
    </Card>
  );
};

GameCard.displayName = 'GameCard';