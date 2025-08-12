import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardGrid } from '../CardGrid';
import { Card as GameCardData } from '@/types/card';

// Mock the GameCard component to simplify testing
jest.mock('../GameCard', () => ({
  GameCard: ({ 
    card, 
    onClick, 
    onAdd, 
    onRemove, 
    quantity, 
    maxQuantity, 
    disabled 
  }: any) => (
    <div 
      data-testid={`game-card-${card.id}`}
      data-card-id={card.id}
      data-quantity={quantity}
      data-max-quantity={maxQuantity}
      data-disabled={disabled}
    >
      <div>{card.name}</div>
      <button onClick={() => onClick?.(card)} data-testid={`card-click-${card.id}`}>
        Click Card
      </button>
      <button onClick={(e) => onAdd?.(card)} data-testid={`card-add-${card.id}`}>
        Add Card
      </button>
      <button onClick={(e) => onRemove?.(card)} data-testid={`card-remove-${card.id}`}>
        Remove Card
      </button>
    </div>
  )
}));

// Sample cards for testing
const mockCards: GameCardData[] = [
  {
    id: 'card-1',
    name: 'Test Card 1',
    description: 'Test description 1',
    type: 'unit',
    faction: 'synthetic',
    rarity: 'common',
    cost: 2,
    attack: 2,
    health: 3,
    abilities: ['First Strike'],
    energyCost: 1,
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: 'card-2',
    name: 'Test Card 2',
    description: 'Test description 2',
    type: 'action',
    actionType: 'instant',
    faction: 'aeonic',
    rarity: 'rare',
    cost: 3,
    abilities: ['Draw a card'],
    energyCost: 2,
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: 'card-3',
    name: 'Test Card 3',
    description: 'Test description 3',
    type: 'hero',
    faction: 'umbral',
    rarity: 'legendary',
    cost: 5,
    attack: 4,
    health: 5,
    abilities: ['Stealth', 'Backstab'],
    energyCost: 3,
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
];

describe('CardGrid Component', () => {
  // Test rendering cards
  test('renders cards correctly', () => {
    render(<CardGrid cards={mockCards} />);
    
    // Check if all cards are rendered
    expect(screen.getByTestId('game-card-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('game-card-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('game-card-card-3')).toBeInTheDocument();
    
    // Check card names
    expect(screen.getByText('Test Card 1')).toBeInTheDocument();
    expect(screen.getByText('Test Card 2')).toBeInTheDocument();
    expect(screen.getByText('Test Card 3')).toBeInTheDocument();
  });

  // Test loading state
  test('renders loading skeletons when loading is true', () => {
    const { container } = render(<CardGrid cards={[]} loading={true} />);
    
    // Check if skeletons are rendered
    const skeletons = container.querySelectorAll('.bg-slate-800\\/50');
    expect(skeletons.length).toBe(12); // Default number of skeletons
  });

  // Test empty state
  test('renders empty message when no cards are available', () => {
    render(<CardGrid cards={[]} emptyMessage="Custom empty message" />);
    
    // Check if empty message is displayed
    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  // Test card click handler
  test('calls onCardClick when a card is clicked', () => {
    const handleCardClick = jest.fn();
    render(<CardGrid cards={mockCards} onCardClick={handleCardClick} />);
    
    // Click on a card
    fireEvent.click(screen.getByTestId('card-click-card-1'));
    
    // Check if handler was called with the correct card
    expect(handleCardClick).toHaveBeenCalledTimes(1);
    expect(handleCardClick).toHaveBeenCalledWith(mockCards[0]);
  });

  // Test card add handler
  test('calls onCardAdd when add button is clicked', () => {
    const handleCardAdd = jest.fn();
    render(<CardGrid cards={mockCards} onCardAdd={handleCardAdd} />);
    
    // Click add button on a card
    fireEvent.click(screen.getByTestId('card-add-card-2'));
    
    // Check if handler was called with the correct card
    expect(handleCardAdd).toHaveBeenCalledTimes(1);
    expect(handleCardAdd).toHaveBeenCalledWith(mockCards[1]);
  });

  // Test card remove handler
  test('calls onCardRemove when remove button is clicked', () => {
    const handleCardRemove = jest.fn();
    render(<CardGrid cards={mockCards} onCardRemove={handleCardRemove} />);
    
    // Click remove button on a card
    fireEvent.click(screen.getByTestId('card-remove-card-3'));
    
    // Check if handler was called with the correct card
    expect(handleCardRemove).toHaveBeenCalledTimes(1);
    expect(handleCardRemove).toHaveBeenCalledWith(mockCards[2]);
  });

  // Test quantity props
  test('passes quantity values to GameCard components', () => {
    const getQuantity = (cardId: string) => {
      if (cardId === 'card-1') return 2;
      if (cardId === 'card-2') return 1;
      return 0;
    };
    
    const getMaxQuantity = (card: GameCardData) => {
      if (card.rarity === 'legendary') return 1;
      return 3;
    };
    
    render(
      <CardGrid 
        cards={mockCards} 
        getQuantity={getQuantity}
        getMaxQuantity={getMaxQuantity}
      />
    );
    
    // Check if quantity values are passed correctly
    expect(screen.getByTestId('game-card-card-1')).toHaveAttribute('data-quantity', '2');
    expect(screen.getByTestId('game-card-card-2')).toHaveAttribute('data-quantity', '1');
    expect(screen.getByTestId('game-card-card-3')).toHaveAttribute('data-quantity', '0');
    
    // Check if max quantity values are passed correctly
    expect(screen.getByTestId('game-card-card-1')).toHaveAttribute('data-max-quantity', '3');
    expect(screen.getByTestId('game-card-card-2')).toHaveAttribute('data-max-quantity', '3');
    expect(screen.getByTestId('game-card-card-3')).toHaveAttribute('data-max-quantity', '1');
  });

  // Test disabled cards
  test('passes disabled state to GameCard components', () => {
    render(
      <CardGrid 
        cards={mockCards} 
        disabledCardIds={['card-1', 'card-3']}
      />
    );
    
    // Check if disabled state is passed correctly
    expect(screen.getByTestId('game-card-card-1')).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByTestId('game-card-card-2')).toHaveAttribute('data-disabled', 'false');
    expect(screen.getByTestId('game-card-card-3')).toHaveAttribute('data-disabled', 'true');
  });

  // Test column count
  test('applies correct grid column classes based on columnCount prop', () => {
    const { container, rerender } = render(<CardGrid cards={mockCards} columnCount={2} />);
    
    // Check if the correct grid class is applied for columnCount=2
    expect(container.firstChild).toHaveClass('grid-cols-1');
    expect(container.firstChild).toHaveClass('sm:grid-cols-2');
    
    // Re-render with different column count
    rerender(<CardGrid cards={mockCards} columnCount={4} />);
    
    // Check if the correct grid class is applied for columnCount=4
    expect(container.firstChild).toHaveClass('grid-cols-1');
    expect(container.firstChild).toHaveClass('sm:grid-cols-2');
    expect(container.firstChild).toHaveClass('md:grid-cols-3');
    expect(container.firstChild).toHaveClass('lg:grid-cols-4');
  });

  // Test custom class name
  test('applies custom className', () => {
    const { container } = render(<CardGrid cards={mockCards} className="custom-class" />);
    
    // Check if the custom class is applied
    expect(container.firstChild).toHaveClass('custom-class');
  });
});