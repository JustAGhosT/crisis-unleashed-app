import React from 'react';
import { FactionCard } from './FactionCard';
import { FactionGridProps } from '@/types/faction';
import { factions as defaultFactions } from '@/data/factions';
import { cn } from '@/lib/utils';

/**
 * FactionGrid component following SOLID principles
 * 
 * Single Responsibility: Displays a grid of faction cards
 * Open/Closed: Extensible through props and composition
 * Liskov Substitution: Can be used anywhere a grid component is expected
 * Interface Segregation: Clean props interface with optional parameters
 * Dependency Inversion: Depends on faction data abstraction
 */
export const FactionGrid: React.FC<FactionGridProps> = ({
  factions = defaultFactions,
  onFactionClick,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="h-96 bg-slate-800/30 border border-slate-600 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!factions.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No factions available</p>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "grid gap-6",
        "grid-cols-1",
        "sm:grid-cols-2",
        "lg:grid-cols-3",
        "xl:grid-cols-4",
        "place-items-center"
      )}
    >
      {factions.map((faction) => (
        <FactionCard
          key={faction.id}
          faction={faction}
          onClick={onFactionClick}
          interactive={!!onFactionClick}
        />
      ))}
    </div>
  );
};

FactionGrid.displayName = 'FactionGrid';