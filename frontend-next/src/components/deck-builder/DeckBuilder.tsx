import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GameCard } from '@/components/cards/GameCard';
import { CardFilters } from '@/components/cards/CardFilters';
import { DeckList } from './DeckList';
import { DeckStats } from './DeckStats';
import { useCardSearch } from '@/hooks/useCardSearch';
import { useUserCards } from '@/hooks/useUserCards';
import { useCreateDeck, useDeckValidation } from '@/hooks/useDecks';
import { CardFilters as CardFiltersType, DeckCard, Card as GameCardData } from '@/types/card';
import { FactionId, FACTION_IDS } from '@/types/faction';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

// Local helper: faction labels and options
const FACTION_LABELS: Record<FactionId, string> = {
  solaris: 'Solaris Nexus',
  umbral: 'Umbral Eclipse',
  aeonic: 'Aeonic Dominion',
  primordial: 'Primordial Genesis',
  infernal: 'Infernal Core',
  neuralis: 'Neuralis Conclave',
  synthetic: 'Synthetic Directive',
};

function getFactionOptions(): Array<{ value: FactionId; label: string }> {
  return FACTION_IDS.map((id) => ({ value: id, label: FACTION_LABELS[id] }));
}

// Zod schema for deck creation form
const deckCreationSchema = z.object({
  name: z
    .string()
    .min(1, 'Deck name is required')
    .max(50, 'Deck name must be less than 50 characters'),
  faction: z.enum(FACTION_IDS).optional(),
});

type DeckCreationData = z.infer<typeof deckCreationSchema>;

interface DeckBuilderProps {
  userId: string;
  className?: string;
}

/**
 * DeckBuilder - Main deck building interface
 * Demonstrates the complete modern React stack:
 * - TanStack Query for data fetching
 * - React Hook Form + Zod for form validation
 * - Drag and drop functionality
 * - Real-time deck validation
 * - Optimistic updates
 */
export const DeckBuilder: React.FC<DeckBuilderProps> = ({
  userId,
  className,
}) => {
  // State management
  const [currentDeckCards, setCurrentDeckCards] = React.useState<DeckCard[]>([]);
  const [cardFilters, setCardFilters] = React.useState<CardFiltersType>({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('grid');

  const { toast } = useToast();

  // Form handling for deck creation
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<DeckCreationData>({
    resolver: zodResolver(deckCreationSchema),
    defaultValues: {
      name: '',
      faction: undefined,
    },
    mode: 'onChange',
  });


  // Data fetching hooks
  const {
    data: cardSearchResult,
    isLoading: isLoadingCards,
    error: cardError,
  } = useCardSearch(cardFilters, currentPage, 20);

  const {
    data: userCards,
    isLoading: isLoadingUserCards,
  } = useUserCards(userId);

  // Mutation hooks
  const createDeckMutation = useCreateDeck();

  // Create card ownership map for filtering
  const ownedCardIds = React.useMemo(() =>
    new Set(userCards?.map(uc => uc.cardId) || []),
    [userCards]
  );

  // Filter available cards based on ownership
  const availableCards = React.useMemo(() => {
    if (!cardSearchResult?.cards) return [];

    if (cardFilters.owned) {
      return cardSearchResult.cards.filter(card => ownedCardIds.has(card.id));
    }

    return cardSearchResult.cards;
  }, [cardSearchResult?.cards, cardFilters.owned, ownedCardIds]);

  // Create deck card quantity map
  const deckCardMap = React.useMemo(() =>
    new Map(currentDeckCards.map(dc => [dc.cardId, dc.quantity])),
    [currentDeckCards]
  );

  // Deck validation and stats
  const { validation, stats } = useDeckValidation(availableCards, currentDeckCards);

  // Card management functions
  const handleAddCard = React.useCallback((card: GameCardData) => {
    setCurrentDeckCards(previous => {
      const existingCardIndex = previous.findIndex(dc => dc.cardId === card.id);

      if (existingCardIndex >= 0) {
        // Increase quantity if less than 3
        if (previous[existingCardIndex].quantity < 3) {
          const updated = [...previous];
          updated[existingCardIndex] = {
            ...updated[existingCardIndex],
            quantity: updated[existingCardIndex].quantity + 1,
          };
          return updated;
        }
        return previous;
      } else {
        // Add new card
        return [...previous, { cardId: card.id, quantity: 1 }];
      }
    });
  }, []);

  const handleRemoveCard = React.useCallback((card: GameCardData) => {
    setCurrentDeckCards(previous => {
      const existingCardIndex = previous.findIndex(dc => dc.cardId === card.id);

      if (existingCardIndex >= 0) {
        const existing = previous[existingCardIndex];
        if (existing.quantity > 1) {
          // Decrease quantity
          const updated = [...previous];
          updated[existingCardIndex] = {
            ...updated[existingCardIndex],
            quantity: existing.quantity - 1,
          };
          return updated;
        } else {
          // Remove card entirely
          return previous.filter((_, index) => index !== existingCardIndex);
        }
      }

      return previous;
    });
  }, []);

  const handleClearDeck = React.useCallback(() => {
    setCurrentDeckCards([]);
  }, []);

  // Deck saving
  const onSubmit = React.useCallback(
    async (data: DeckCreationData) => {
      if (!validation.isValid) {
        toast({
          title: 'Validation Error',
          description: 'Please fix deck validation errors before saving',
          variant: 'destructive',
        });
        return;
      }

      try {
        await createDeckMutation.mutateAsync({
          userId,
          name: data.name,
          faction: (data.faction ?? 'solaris') as FactionId,
          isActive: false,
          cards: currentDeckCards,
        });

        // Reset form and deck on successful save
        reset();
        setCurrentDeckCards([]);
        toast({
          title: 'Deck Saved',
          description: 'Your deck has been saved successfully!',
          variant: 'default',
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to save deck:', error);
        toast({
          title: 'Save Failed',
          description: 'Failed to save deck. Please try again.',
          variant: 'destructive',
        });
      }
    },
    [validation.isValid, createDeckMutation, userId, currentDeckCards, reset, toast]
  );

  const handleSaveDeck = React.useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit]);

  // Filter change handler
  const handleFiltersChange = React.useCallback((filters: CardFiltersType) => {
    setCardFilters(filters);
    setCurrentPage(1); // Reset pagination when filters change
  }, []);

  // Loading state
  if (isLoadingCards || isLoadingUserCards) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <span className="ml-2 text-gray-400">Loading deck builder...</span>
      </div>
    );
  }

  // Error state
  if (cardError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        <AlertCircle className="w-8 h-8 mr-2" />
        <span>Failed to load cards. Please refresh the page.</span>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen bg-slate-900', className)}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Card Collection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Deck Creation Form */}
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle>Create New Deck</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveDeck} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="deck-name" className="block text-sm font-medium text-gray-300 mb-1">
                        Deck Name *
                      </label>
                      <Input
                        id="deck-name"
                        {...register('name')}
                        placeholder="My Awesome Deck"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="primary-faction" className="block text-sm font-medium text-gray-300 mb-1">Primary Faction</label>
                      <Controller
                        name="faction"
                        control={control}
                        render={({ field }) => (
                          <select
                            id="primary-faction"
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const value = e.target.value as FactionId | '';
                              field.onChange(value === '' ? undefined : (value as FactionId));
                            }}
                            className="w-full rounded-md border px-3 py-2 bg-slate-700 border-slate-600 text-white"
                            title="Primary Faction"
                          >
                            <option value="">Auto-detect</option>
                            {getFactionOptions().map((faction) => (
                              <option key={faction.value} value={faction.value}>
                                {faction.label}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!isValid || validation.cardCount === 0 || createDeckMutation.isPending}
                    className="w-full"
                  >
                    {createDeckMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Deck
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Card Filters */}
            <CardFilters
              onFiltersChange={handleFiltersChange}
              showOwnedFilter={true}
            />

            {/* Card Grid */}
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle>
                  Available Cards
                  {cardSearchResult && (
                    <span className="text-base font-normal text-gray-400 ml-2">
                      ({cardSearchResult.total} total)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availableCards.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p>No cards found matching your filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableCards.map((card) => (
                      <GameCard
                        key={card.id}
                        card={card}
                        quantity={deckCardMap.get(card.id) || 0}
                        onAdd={handleAddCard}
                        size="md"
                        disabled={!ownedCardIds.has(card.id) && cardFilters.owned}
                        draggable={true}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {cardSearchResult && cardSearchResult.total > 20 && (
                  <div className="mt-6 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-gray-400">
                      Page {currentPage} of {Math.ceil(cardSearchResult.total / 20)}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage >= Math.ceil(cardSearchResult.total / 20)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Deck and Stats */}
          <div className="lg:col-span-2 space-y-4">
            {/* Current Deck */}
            <DeckList
              deckCards={currentDeckCards}
              cards={availableCards}
              onAddCard={handleAddCard}
              onRemoveCard={handleRemoveCard}
              onSaveDeck={handleSaveDeck}
              onClearDeck={handleClearDeck}
              isLoading={createDeckMutation.isPending}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Deck Statistics */}
            <DeckStats
              stats={stats}
              validation={validation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

DeckBuilder.displayName = 'DeckBuilder';