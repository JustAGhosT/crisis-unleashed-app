import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CardGrid } from './CardGrid';
import { CardFilters } from './CardFilters';
import { CardDetail } from './CardDetail';
// Fix import paths based on where components were installed
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card as GameCardData, CardFilters as CardFiltersType, UserCard } from '@/types/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Filter, Star } from 'lucide-react';
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
import { CardTab, CardType, type CardTypeValue } from '@/constants/card-types';

interface CardCollectionProps {
  cards: GameCardData[];
  userCards?: UserCard[];
  loading?: boolean;
  onCardClick?: (card: GameCardData) => void;
  onToggleFavorite?: (card: GameCardData, isFavorite: boolean) => void;
  onAddToDeck?: (card: GameCardData) => void;
  onApplyFilters?: (filters: CardFiltersType) => void;
  filters?: CardFiltersType;
  // Keep this as it might be used by parent components
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

/**
 * CardCollection component - Displays a user's card collection with filtering and detail view
 * Following SOLID principles with clear separation of concerns
 */
export const CardCollection: React.FC<CardCollectionProps> = ({
  cards,
  userCards = [],
  loading = false,
  onCardClick,
  onToggleFavorite,
  onAddToDeck,
  onApplyFilters,
  filters = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  totalCount = 0, // Added eslint disable comment for unused variable
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
}) => {
  const [selectedCard, setSelectedCard] = useState<GameCardData | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Create a map of user cards for easy lookup
  const userCardMap = useMemo(() => {
    const m = new Map<string, UserCard>();
    userCards.forEach(u => m.set(u.cardId, u));
    return m;
  }, [userCards]);

  // Get quantity of a card in user's collection
  const getCardQuantity = (cardId: string): number => {
    const userCard = userCardMap.get(cardId);
    return userCard ? userCard.quantity : 0;
  };

  // Check if a card is favorited
  const isCardFavorite = (cardId: string): boolean => {
    const userCard = userCardMap.get(cardId);
    return userCard ? userCard.isFavorite : false;
  };

  // Handle card click to show detail view
  const handleCardClick = (card: GameCardData) => {
    setSelectedCard(card);
    if (onCardClick) {
      onCardClick(card);
    }
  };

  // Collection statistics
  const totalCollectedCards = userCards.length;
  const totalUniqueCards = cards.length;
  const collectionCompletionPercentage = totalUniqueCards > 0 
    ? Math.round((totalCollectedCards / totalUniqueCards) * 100) 
    : 0;

  // Filter by card type (centralized constants)
  const getCardsByType = (type: CardTypeValue): GameCardData[] => {
    if (type === CardType.All) return cards;
    return cards.filter(card => card.type === type);
  };

  // Filter by favorite status
  const getFavoriteCards = (): GameCardData[] => {
    return cards.filter(card => {
      const userCard = userCardMap.get(card.id);
      return userCard && userCard.isFavorite;
    });
  };

  return (
    <div className={cx('space-y-6', className)}>
      {/* Collection Header */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-xl text-white">Card Collection</CardTitle>
              <CardDescription>
                {loading 
                  ? 'Loading collection...' 
                  : `${totalCollectedCards} unique cards collected out of ${totalUniqueCards} total cards`
                }
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Collection Completion</span>
              <span>{collectionCompletionPercentage}%</span>
            </div>
            <Progress value={collectionCompletionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      {/* Filters Section */}
      {showFilters && (
        <CardFilters
          initialFilters={filters}
          onFiltersChange={onApplyFilters || (() => {})}
          showOwnedFilter={true}
          className="animate-in fade-in-50 slide-in-from-top-5 duration-300 ease-out"
        />
      )}
      
      {/* Card Collection Tabs */}
      <Tabs defaultValue={CardTab.All} className="w-full">
        <TabsList className="bg-slate-800/50 border border-slate-700 mb-6">
          <TabsTrigger value={CardTab.All} className="data-[state=active]:bg-slate-700">All Cards</TabsTrigger>
          <TabsTrigger value={CardTab.Heroes} className="data-[state=active]:bg-slate-700">Heroes</TabsTrigger>
          <TabsTrigger value={CardTab.Units} className="data-[state=active]:bg-slate-700">Units</TabsTrigger>
          <TabsTrigger value={CardTab.Actions} className="data-[state=active]:bg-slate-700">Actions</TabsTrigger>
          <TabsTrigger value={CardTab.Structures} className="data-[state=active]:bg-slate-700">Structures</TabsTrigger>
          <TabsTrigger value={CardTab.Favorites} className="data-[state=active]:bg-slate-700">
            <Star className="w-4 h-4 mr-1" />
            Favorites
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={CardTab.All}>
          <CardGrid
            cards={cards}
            loading={loading}
            onCardClick={handleCardClick}
            getQuantity={getCardQuantity}
            emptyMessage="No cards found with the current filters."
            columnCount={5}
          />
        </TabsContent>
        
        <TabsContent value={CardTab.Heroes}>
          <CardGrid
            cards={getCardsByType(CardType.Hero)}
            loading={loading}
            onCardClick={handleCardClick}
            getQuantity={getCardQuantity}
            emptyMessage="No hero cards found with the current filters."
            columnCount={5}
          />
        </TabsContent>
        
        <TabsContent value={CardTab.Units}>
          <CardGrid
            cards={getCardsByType(CardType.Unit)}
            loading={loading}
            onCardClick={handleCardClick}
            getQuantity={getCardQuantity}
            emptyMessage="No unit cards found with the current filters."
            columnCount={5}
          />
        </TabsContent>
        
        <TabsContent value={CardTab.Actions}>
          <CardGrid
            cards={getCardsByType(CardType.Action)}
            loading={loading}
            onCardClick={handleCardClick}
            getQuantity={getCardQuantity}
            emptyMessage="No action cards found with the current filters."
            columnCount={5}
          />
        </TabsContent>
        
        <TabsContent value={CardTab.Structures}>
          <CardGrid
            cards={getCardsByType(CardType.Structure)}
            loading={loading}
            onCardClick={handleCardClick}
            getQuantity={getCardQuantity}
            emptyMessage="No structure cards found with the current filters."
            columnCount={5}
          />
        </TabsContent>
        
        <TabsContent value={CardTab.Favorites}>
          <CardGrid
            cards={getFavoriteCards()}
            loading={loading}
            onCardClick={handleCardClick}
            getQuantity={getCardQuantity}
            emptyMessage="You haven't favorited any cards yet."
            columnCount={5}
          />
        </TabsContent>
      </Tabs>
      
      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
      
      {/* Card Detail Dialog */}
      {selectedCard && (
        <Dialog open={!!selectedCard} onOpenChange={(open: boolean) => !open && setSelectedCard(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <CardDetail
              card={selectedCard}
              onAddToDeck={onAddToDeck}
              onToggleFavorite={onToggleFavorite}
              ownedQuantity={getCardQuantity(selectedCard.id)}
              isFavorite={isCardFavorite(selectedCard.id)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

CardCollection.displayName = 'CardCollection';