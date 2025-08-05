import { Deck } from '@/types/card';

export const mockUserDecks: Omit<Deck, 'userId'>[] = [
  {
    id: 'deck-1',
    name: 'Solar Domination',
    faction: 'solaris',
    isActive: true,
    cards: [
      { cardId: 'card-solaris-1', quantity: 2 },
      { cardId: 'card-solaris-2', quantity: 3 },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'deck-2',
    name: 'Shadow Strike',
    faction: 'umbral',
    isActive: false,
    cards: [
      { cardId: 'card-umbral-1', quantity: 3 },
      { cardId: 'card-umbral-2', quantity: 2 },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export function getMockDeckData(deckId: string): Deck {
  return {
    id: deckId,
    userId: 'user-1',
    name: 'Mock Deck',
    faction: 'solaris',
    isActive: false,
    cards: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };
}