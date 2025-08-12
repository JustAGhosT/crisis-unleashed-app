import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardFilters as CardFiltersType } from '@/types/card';
import { getFactionOptions } from '@/data/factions';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FactionId } from '@/types/faction';

// Zod schema for card filter validation
const cardFiltersSchema = z.object({
  search: z.string().optional(),
  faction: z.enum(['', 'solaris', 'umbral', 'aeonic', 'primordial', 'infernal', 'neuralis', 'synthetic']).optional(),
  // Allow any string for type to accommodate domain variations (e.g., Unit/Tactic/Support/Resource)
  type: z.string().optional(),
  rarity: z.enum(['', 'common', 'uncommon', 'rare', 'epic', 'legendary']).optional(),
  costMin: z.number().min(0).max(20).optional(),
  costMax: z.number().min(0).max(20).optional(),
  owned: z.boolean().optional(),
});

type CardFiltersFormData = z.infer<typeof cardFiltersSchema>;

interface CardFiltersProps {
  initialFilters?: CardFiltersType;
  onFiltersChange: (filters: CardFiltersType) => void;
  showOwnedFilter?: boolean;
  className?: string;
}

/**
 * CardFilters component - Provides filtering interface for card search
 * Uses React Hook Form + Zod for form validation
 * Following SOLID principles with clear separation of concerns
 */
export const CardFilters: React.FC<CardFiltersProps> = ({
  initialFilters = {},
  onFiltersChange,
  showOwnedFilter = true,
  className,
}) => {
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<CardFiltersFormData>({
    resolver: zodResolver(cardFiltersSchema),
    defaultValues: {
      search: initialFilters.search || '',
      faction: initialFilters.faction || '',
      type: initialFilters.type || '',
      rarity: initialFilters.rarity || '',
      costMin: initialFilters.costMin,
      costMax: initialFilters.costMax,
      owned: initialFilters.owned || false,
    },
  });

  const factionOptions = getFactionOptions();

  // Watch form values for real-time filtering
  const watchedValues = watch();

  React.useEffect(() => {
    // Apply filters whenever form values change
    const filters: CardFiltersType = {};
    
    if (watchedValues.search?.trim()) {
      filters.search = watchedValues.search.trim();
    }
    if (watchedValues.faction) {
      filters.faction = watchedValues.faction as FactionId;
    }
    if (watchedValues.type) {
      filters.type = watchedValues.type as CardFiltersType['type'];
    }
    if (watchedValues.rarity) {
      filters.rarity = watchedValues.rarity as CardFiltersType['rarity'];
    }
    if (watchedValues.costMin !== undefined && watchedValues.costMin >= 0) {
      filters.costMin = watchedValues.costMin;
    }
    if (watchedValues.costMax !== undefined && watchedValues.costMax >= 0) {
      filters.costMax = watchedValues.costMax;
    }
    if (showOwnedFilter && watchedValues.owned) {
      filters.owned = watchedValues.owned;
    }

    onFiltersChange(filters);
  }, [watchedValues, onFiltersChange, showOwnedFilter]);

  const handleClearFilters = () => {
    reset({
      search: '',
      faction: '',
      type: '',
      rarity: '',
      costMin: undefined,
      costMax: undefined,
      owned: false,
    });
  };

  return (
    <Card className={cn('p-4 bg-slate-800/50 border-slate-600', className)}>
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            {...register('search')}
            placeholder="Search cards by name, description, or abilities..."
            className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
          />
        </div>

        {/* Filter Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Faction Filter */}
          <div>
            <label htmlFor="filter-faction" className="block text-sm font-medium text-gray-300 mb-1">
              Faction
            </label>
            <select
              id="filter-faction"
              title="Faction"
              {...register('faction')}
              className="w-full rounded-md border px-3 py-2 bg-slate-700 border-slate-600 text-white"
            >
              <option value="">All Factions</option>
              {factionOptions.map((faction) => (
                <option key={faction.value} value={faction.value}>
                  {faction.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label htmlFor="filter-type" className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <select
              id="filter-type"
              title="Type"
              {...register('type')}
              className="w-full rounded-md border px-3 py-2 bg-slate-700 border-slate-600 text-white"
            >
              <option value="">All Types</option>
              <option value="character">Character</option>
              <option value="action">Action</option>
              <option value="artifact">Artifact</option>
              <option value="hero">Hero</option>
            </select>
          </div>

          {/* Rarity Filter */}
          <div>
            <label htmlFor="filter-rarity" className="block text-sm font-medium text-gray-300 mb-1">
              Rarity
            </label>
            <select
              id="filter-rarity"
              title="Rarity"
              {...register('rarity')}
              className="w-full rounded-md border px-3 py-2 bg-slate-700 border-slate-600 text-white"
            >
              <option value="">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </div>

        {/* Filter Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Cost Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Min Cost
            </label>
            <Input
              {...register('costMin', { valueAsNumber: true })}
              type="number"
              min="0"
              max="20"
              placeholder="0"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Max Cost
            </label>
            <Input
              {...register('costMax', { valueAsNumber: true })}
              type="number"
              min="0"
              max="20"
              placeholder="20"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Owned Filter */}
          {showOwnedFilter && (
            <div>
              <label className="flex items-center space-x-2">
                <input
                  {...register('owned')}
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 rounded border-gray-600 bg-slate-700 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Owned Only</span>
              </label>
            </div>
          )}

          {/* Clear Filters Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleClearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        </div>

        {/* Error Display */}
        {Object.keys(errors).length > 0 && (
          <div className="text-red-400 text-sm space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <div key={field}>{error?.message}</div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

CardFilters.displayName = 'CardFilters';