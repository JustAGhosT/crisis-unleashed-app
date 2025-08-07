import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, getFactionColorClass, getFactionGradientClass } from '@/lib/utils';
import { FactionCardProps } from '@/types/faction';
import React from 'react';

/**
 * FactionCard component following SOLID principles
 * 
 * Single Responsibility: Displays a single faction's information
 * Open/Closed: Extensible through props without modification
 * Liskov Substitution: Can be used anywhere a React component is expected
 * Interface Segregation: Props interface only includes what's needed
 * Dependency Inversion: Depends on abstractions (types) not concrete implementations
 */
export const FactionCard: React.FC<FactionCardProps> = ({
  faction,
  size = 'md',
  interactive = true,
  onClick
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  const handleClick = () => {
    if (interactive && onClick) {
      onClick(faction);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (interactive && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(faction);
    }
  };

  return (
    <Card
      className={cn(
        'transition-all duration-300 border-2 backdrop-blur-sm',
        sizeClasses[size],
        interactive && 'card-hover cursor-pointer hover:border-current',
        getFactionColorClass(faction.id),
        'bg-slate-800/30 border-slate-600'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? `Select ${faction.name} faction` : undefined}
    >
      {/* Faction header with gradient background */}
      <CardHeader className={cn('relative overflow-hidden', getFactionGradientClass(faction.id))}>
        <div className="relative z-10">
          <CardTitle className="text-white text-shadow-sm">
            {faction.name}
          </CardTitle>
          <CardDescription className="text-white/90 font-medium">
            {faction.tagline}
          </CardDescription>
        </div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-black/10" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {faction.description}
          </p>
        </div>

        {/* Key attributes */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-sm font-semibold text-gray-400 min-w-fit">Philosophy:</span>
            <span className="text-sm text-gray-300">{faction.philosophy}</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-sm font-semibold text-gray-400 min-w-fit">Strength:</span>
            <span className="text-sm text-gray-300">{faction.strength}</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-sm font-semibold text-gray-400 min-w-fit">Technology:</span>
            <span className="text-sm text-gray-300">{faction.technology}</span>
          </div>
        </div>

        {/* Action button */}
        {interactive && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'w-full border-current hover:bg-current/10',
                getFactionColorClass(faction.id)
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Select {faction.name}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

FactionCard.displayName = 'FactionCard';