import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardGrid } from '@/components/cards/CardGrid';
import { Card as GameCardData } from '@/types/card';

// Mock card data for testing
const mockCards: GameCardData[] = [
  {
    id: 'card-1',
    name: 'Test Card 1',
    description: 'This is a test card',
    type: 'unit',
    faction: 'solaris',
    rarity: 'common',
    cost: 2,
    attack: 2,
    health: 2,
    abilities: ['Test Ability'],
    energyCost: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'card-2',
    name: 'Test Card 2',
    description: 'This is another test card',
    type: 'action',
    faction: 'umbral',
    rarity: 'rare',
    cost: 3,
    abilities: ['Another Test Ability'],
    energyCost: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock component functions
const mockCardClick = jest.fn();
const mockCardAdd = jest.fn();
const mockCardRemove = jest.fn();
const mockGetQuantity = jest.fn().mockImplementation(() => 1);
const mockGetMaxQuantity = jest.fn().mockImplementation(() => 3);

describe('CardGrid Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cards correctly', () => {
    render(
      <CardGrid
        cards={mockCards}
        onCardClick={mockCardClick}
        onCardAdd={mockCardAdd}
        onCardRemove={mockCardRemove}
        getQuantity={mockGetQuantity}
        getMaxQuantity={mockGetMaxQuantity}
      />
    );

    // Check if card names are rendered
    expect(screen.getByText('Test Card 1')).toBeInTheDocument();
    expect(screen.getByText('Test Card 2')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <CardGrid
        cards={[]}
        loading={true}
        onCardClick={mockCardClick}
      />
    );

    // Since skeletons don't have specific test IDs or text, we check for grid structure
    const gridElement = screen.getByRole('list');
    expect(gridElement).toBeInTheDocument();
  });

  it('renders empty state with custom message', () => {
    const emptyMessage = 'No cards found with these filters';
    render(
      <CardGrid
        cards={[]}
        emptyMessage={emptyMessage}
        onCardClick={mockCardClick}
      />
    );

    expect(screen.getByText(emptyMessage)).toBeInTheDocument();
  });

  it('calls click handler when card is clicked', () => {
    render(
      <CardGrid
        cards={mockCards}
        onCardClick={mockCardClick}
      />
    );

    // Find and click the first card
    const firstCard = screen.getByText('Test Card 1').closest('div[role="button"]');
    fireEvent.click(firstCard!);

    expect(mockCardClick).toHaveBeenCalledWith(mockCards[0]);
  });

  it('calls add handler when add button is clicked', () => {
    render(
      <CardGrid
        cards={mockCards}
        onCardAdd={mockCardAdd}
        getQuantity={mockGetQuantity}
        getMaxQuantity={mockGetMaxQuantity}
      />
    );

    // Find and click the add button on the first card
    const addButtons = screen.getAllByLabelText('Add card');
    fireEvent.click(addButtons[0]);

    expect(mockCardAdd).toHaveBeenCalledWith(mockCards[0]);
  });

  it('calls remove handler when remove button is clicked', () => {
    render(
      <CardGrid
        cards={mockCards}
        onCardRemove={mockCardRemove}
        getQuantity={mockGetQuantity}
        getMaxQuantity={mockGetMaxQuantity}
      />
    );

    // Find and click the remove button on the first card
    const removeButtons = screen.getAllByLabelText('Remove card');
    fireEvent.click(removeButtons[0]);

    expect(mockCardRemove).toHaveBeenCalledWith(mockCards[0]);
  });

  it('disables cards correctly', () => {
    render(
      <CardGrid
        cards={mockCards}
        onCardClick={mockCardClick}
        disabledCardIds={['card-1']}
      />
    );

    // The first card should be disabled
    const cards = screen.getAllByRole('button');
    expect(cards[0]).toHaveClass('opacity-50');
    expect(cards[1]).not.toHaveClass('opacity-50');

    // Click the disabled card
    fireEvent.click(cards[0]);
    expect(mockCardClick).not.toHaveBeenCalled();

    // Click the enabled card
    fireEvent.click(cards[1]);
    expect(mockCardClick).toHaveBeenCalledWith(mockCards[1]);
  });

  it('renders with different column counts', () => {
    const { rerender } = render(
      <CardGrid
        cards={mockCards}
        columnCount={2}
      />
    );

    let gridElement = screen.getByRole('list');
    expect(gridElement).toHaveClass('grid-cols-1 sm:grid-cols-2');

    // Rerender with different column count
    rerender(
      <CardGrid
        cards={mockCards}
        columnCount={4}
      />
    );

    gridElement = screen.getByRole('list');
    expect(gridElement).toHaveClass('grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4');
  });
});