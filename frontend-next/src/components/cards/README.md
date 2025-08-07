# Card Components

This directory contains components for displaying, filtering, and interacting with game cards.

## Components

### GameCard

Displays an individual card with all its gameplay information.

```tsx
import { GameCard } from '@/components/cards';

<GameCard
  card={cardData}
  quantity={2}
  maxQuantity={3}
  onAdd={(card) => addCardToDeck(card)}
  onRemove={(card) => removeCardFromDeck(card)}
  onClick={(card) => viewCardDetails(card)}
  size="md"
  disabled={false}
  showQuantity={true}
  draggable={true}
/>
```

### CardGrid

Displays a grid of cards with various interaction options.

```tsx
import { CardGrid } from '@/components/cards';

<CardGrid
  cards={cardsArray}
  loading={isLoading}
  onCardClick={handleCardClick}
  onCardAdd={handleCardAdd}
  onCardRemove={handleCardRemove}
  getQuantity={(cardId) => getCardQuantity(cardId)}
  getMaxQuantity={(card) => getMaxAllowedQuantity(card)}
  emptyMessage="No cards found"
  showQuantity={true}
  cardSize="md"
  columnCount={4}
  draggable={true}
  disabledCardIds={['card-1', 'card-2']}
/>
```

### CardFilters

Provides filtering interface for card search.

```tsx
import { CardFilters } from '@/components/cards';

<CardFilters
  initialFilters={currentFilters}
  onFiltersChange={handleFiltersChange}
  showOwnedFilter={true}
/>
```

### CardDetail

Displays detailed information about a card.

```tsx
import { CardDetail } from '@/components/cards';

<CardDetail
  card={selectedCard}
  onAddToDeck={handleAddToDeck}
  onToggleFavorite={handleToggleFavorite}
  ownedQuantity={3}
  isFavorite={true}
/>
```

### CardCollection

Displays a user's card collection with filtering and detail view.

```tsx
import { CardCollection } from '@/components/cards';

<CardCollection
  cards={allCards}
  userCards={userCardsArray}
  loading={isLoading}
  onCardClick={handleCardClick}
  onToggleFavorite={handleToggleFavorite}
  onAddToDeck={handleAddToDeck}
  onApplyFilters={handleFiltersChange}
  filters={currentFilters}
  totalCount={totalCardCount}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```

## Usage Examples

### Card Browser Page

```tsx
import { CardCollection } from '@/components/cards';
import { useCards } from '@/hooks/useCards';

export default function CardBrowserPage() {
  const { cards, loading, filters, setFilters, pagination } = useCards();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Card Browser</h1>
      
      <CardCollection
        cards={cards}
        loading={loading}
        onApplyFilters={setFilters}
        filters={filters}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={pagination.setPage}
      />
    </div>
  );
}
```

### Deck Builder

```tsx
import { CardGrid } from '@/components/cards';
import { useDeck } from '@/hooks/useDeck';

export default function DeckBuilderPage() {
  const { availableCards, deckCards, addCard, removeCard } = useDeck();
  
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2>Available Cards</h2>
        <CardGrid
          cards={availableCards}
          onCardAdd={addCard}
          getQuantity={(cardId) => getDeckCardQuantity(cardId)}
        />
      </div>
      
      <div>
        <h2>Your Deck</h2>
        <CardGrid
          cards={deckCards.map(dc => dc.card)}
          onCardRemove={removeCard}
          getQuantity={(cardId) => getDeckCardQuantity(cardId)}
        />
      </div>
    </div>
  );
}
```

## Props API

See TypeScript interface definitions in each component file for detailed prop documentation.

## Styling

These components use a combination of:
- Tailwind CSS for layout and basic styling
- ShadCN UI components for common UI elements
- Custom styling for card-specific elements

## Accessibility

All components are designed with accessibility in mind:
- Proper keyboard navigation
- ARIA attributes for interactive elements
- Responsive design for all screen sizes
- Color contrast meeting WCAG standards

## Known Issues

- Card images don't have fallback UI for failed loads
- Mobile optimization could be improved for CardDetail component
- Performance optimization needed for large card collections