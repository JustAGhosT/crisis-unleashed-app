import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn, getFactionColorClass } from '@/lib/utils';
import { Card as GameCardData, CardRarity } from '@/types/card';
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
  showDetails?: boolean;
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
  showDetails = false,
}) => {
  const sizeClasses = {
    sm: 'card-size-sm h-40',
    md: 'card-size-md h-64',
    lg: 'card-size-lg h-80',
  } as const;

  const factionColorClass = getFactionColorClass(card.faction);
  
  // Map rarity to badge style tokens
  const rarityBadgeClass: Record<CardRarity, string> = {
    common: 'bg-gray-600 text-white border-transparent',
    uncommon: 'bg-green-600 text-white border-transparent',
    rare: 'bg-blue-600 text-white border-transparent',
    epic: 'bg-purple-600 text-white border-transparent',
    legendary: 'bg-amber-500 text-black border-transparent',
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
        'relative overflow-hidden transition-all duration-300 cursor-pointer group',
        sizeClasses[size],
        'bg-slate-800/90 border-slate-600',
        disabled && 'opacity-50 cursor-not-allowed',
        onClick && 'hover:scale-105 hover:shadow-lg',
        draggable && !disabled && 'cursor-grab active:cursor-grabbing',
        `border-2 ${factionColorClass}`
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
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
            'bg-gray-800 text-white'
          )}>
            {card.cost}
          </div>

          {/* Rarity Badge */}
          <Badge
            variant="default"
            className={cn('text-xs', rarityBadgeClass[card.rarity as CardRarity] || '')}
          >
            {card.rarity}
          </Badge>
        </div>

        {/* Card Name */}
        <h3 className={cn(
          'font-bold text-sm mb-1 truncate',
          'text-white group-hover:text-current'
        )}>
          {card.name}
        </h3>
        
        {/* Card Type */}
        <div className="flex items-center text-xs text-gray-400">
          <span>{card.type}</span>
          {card.unitType && <span className="ml-1">- {card.unitType}</span>}
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-1 flex flex-col h-full">
        {/* Card Image */}
        <div className="w-full h-1/3 bg-gray-700/50 rounded mb-2 relative overflow-hidden flex items-center justify-center">
          {card.imageUrl ? (
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              className="object-cover rounded"
            />
          ) : (
            <div className={cn(
              'text-sm opacity-70 w-full h-full flex items-center justify-center',
              getFactionColorClass(card.faction)
            )}>
              <span className="font-bold">{card.name.substring(0, 2)}</span>
            </div>
          )}
        </div>

        {/* Attack/Health for Units and Heroes */}
        {(card.type === 'hero' || card.type === 'unit') && card.attack !== undefined && card.health !== undefined && (
          <div className="flex justify-between mb-2">
            <div className="flex items-center gap-1 text-xs text-red-500">
              <Swords className="w-3 h-3" />
              <span className="font-bold">{card.attack}</span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">ATK</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <Heart className="w-3 h-3" />
              <span className="font-bold">{card.health}</span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">HP</span>
            </div>
          </div>
        )}

        {/* Card Description */}
        <p className="text-xs text-gray-400 flex-1 overflow-hidden text-ellipsis">
          {showDetails ? card.description : 
            (card.description.length > 100 
              ? `${card.description.substring(0, 100)}...` 
              : card.description)}
        </p>

        {/* Abilities */}
        {card.abilities && card.abilities.length > 0 && (
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
            {showQuantity && (
              <Badge variant="outline" className="text-xs dark:text-white">
                {quantity} in deck
              </Badge>
            )}
            
            <div className="flex space-x-1 ml-auto">
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

              {showQuantity && quantity > 0 && (
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

export default GameCard;