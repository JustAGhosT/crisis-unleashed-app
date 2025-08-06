import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CardGrid } from './CardGrid';
import { CardFilters } from './CardFilters';
import { CardDetail } from './CardDetail';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card as GameCardData, CardFilters as CardFiltersType, UserCard } from '@/types/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Filter, Star, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardCollectionProps {
  cards: GameCardData[];
  userCards?: UserCard[];
  loading?: boolean;
  onCardClick?: (card: GameCardData) => void;
  onToggleFavorite?: (card: GameCardData, isFavorite: boolean) => void;
  onAddToDeck?: (card: GameCardData) => void;
  onApplyFilters?: (filters: CardFiltersType) => void;
  filters?: CardFiltersType;
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
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
}) => {
  const [selectedCard, setSelectedCard] = useState<GameCardData | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Create a map of user cards for easy lookup
  const userCardMap = new Map<string, UserCard>();
  userCards.forEach(userCard => {
    userCardMap.set(userCard.cardId, userCard);
  });

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

  // Filter by card type
  const getCardsByType = (type: string): GameCardData[] => {
    if (type === 'all') return cards;
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
    <div className={cn('space-y-6', className)}>
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
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-800/50 border border-slate-700 mb-6">
          <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">All Cards</TabsTrigger>
          <TabsTrigger value="heroes" className="data-[state=active]:bg-slate-700">Heroes</TabsTrigger>
          <TabsTrigger value="units" className="data-[state=active]:bg-slate-700">Units</TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-slate-700">Actions</TabsTrigger>
          <TabsTrigger value="structures" className="data-[state=active]:bg-slate-700">Structures</TabsTrigger>
          <TabsTrigger value="favorites" className="data-[state=active]:bg-slate-700">
            <Star className="w-4 h-4 mr-1" />
            Favorites
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <CardGrid
            cards={cards}
            loading={loading}
            onCardClick={handleCardClick}
            getQuantity={getCardQuantity}
            emptyMessage="No cards found with the current filters."
            columnCount={5}
          />
        </TabsContent>
        
        <TabsContent value="heroes">
          <CardGrid
            cards={getCardsByType('hero')}
            loading={loading}
            onCardClick={handleCardClick}
            getQuantity={getCardQuantity}
            emptyMessage="No hero cards found with the current filters."
            columnCount={5}
          />
        </TabsContent>
        
        <TabsContent value="units">
          <CardGrid
            cards={getCardsByType('unit')}
            loading={loading}
            onCardClick={handleCardClick}
            getQuantity={getCardQuantity}
            emptyMessage="No unit cards found with the current filters."
            columnCount={5}
          />
        </TabsContent>
        
        <TabsContent value="actions">
          <CardGrid
            cards={getCardsByType('action')}
            loading={loading}
            onCardClick={handleCardClick}
            getQuantity={getCardQuantity}
            emptyMessage="No action cards found with the current filters."
            columnCount={5}
          />
        </TabsContent>
        
        <TabsContent value="structures">
          <CardGrid
            cards={getCardsByType('structure')}
            loading={loading}
            onCardClick={handleCardClick}
            getQuantity={getCardQuantity}
            emptyMessage="No structure cards found with the current filters."
            columnCount={5}
          />
        </TabsContent>
        
        <TabsContent value="favorites">
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
        <Dialog open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
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