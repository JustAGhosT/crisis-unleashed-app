import { FactionId } from './faction';

export type CardType = 'character' | 'action' | 'artifact' | 'hero';
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Card {
  id: string;
  name: string;
  description: string;
  type: CardType;
  faction: FactionId;
  rarity: CardRarity;
  cost: number;
  attack?: number;
  health?: number;
  abilities: string[];
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeckCard {
  cardId: string;
  quantity: number;
}

export interface Deck {
  id: string;
  userId: string;
  name: string;
  faction: FactionId;
  isActive: boolean;
  cards: DeckCard[];
  createdAt: string;
  updatedAt: string;
}

export interface UserCard {
  id: string;
  userId: string;
  cardId: string;
  quantity: number;
  isFavorite: boolean;
  acquiredAt: string;
  nftId?: string;
}

// Card filtering and search
export interface CardFilters {
  faction?: FactionId;
  type?: CardType;
  rarity?: CardRarity;
  costMin?: number;
  costMax?: number;
  search?: string;
  abilities?: string[];
  owned?: boolean;
}

export interface CardSearchResult {
  cards: Card[];
  total: number;
  page: number;
  pageSize: number;
}

// Deck validation
export interface DeckValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  cardCount: number;
  costCurve: { [cost: number]: number };
}

export interface DeckStats {
  totalCards: number;
  averageCost: number;
  typeDistribution: Record<CardType, number>;
  rarityDistribution: Record<CardRarity, number>;
  costCurve: { [cost: number]: number };
}