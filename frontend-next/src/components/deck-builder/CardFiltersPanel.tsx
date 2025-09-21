"use client";

import { Button } from "@/components/ui/button";

interface CardFiltersPanelProps {
  types: string[];
  costs: number[];
  selectedTypes: string[];
  selectedCosts: number[];
  onToggleType: (type: string) => void;
  onToggleCost: (cost: number) => void;
  onClearFilters: () => void;
}

export default function CardFiltersPanel({
  types,
  costs,
  selectedTypes,
  selectedCosts,
  onToggleType,
  onToggleCost,
  onClearFilters,
}: CardFiltersPanelProps) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground"
        >
          Clear all
        </Button>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Card Types</h4>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Button
              key={type}
              variant={selectedTypes.includes(type) ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleType(type)}
              className="text-xs"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Energy Cost</h4>
        <div className="flex flex-wrap gap-2">
          {costs.map((cost) => (
            <Button
              key={cost}
              variant={selectedCosts.includes(cost) ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleCost(cost)}
              className="text-xs w-10 h-10 flex items-center justify-center"
            >
              {cost}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}


