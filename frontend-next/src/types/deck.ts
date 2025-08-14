/**
 * Types for the deck builder system
 */

export interface Card {
  id: string;
  instanceId?: string; // Unique ID for each instance of a card in a deck
  name: string;
  cost?: number;
  power?: number;
  type?: string;
  subtype?: string;
  faction?: string;
  rarity?: string;
  text?: string;
  imageUrl?: string;
  isUnique?: boolean;
  keywords?: string[];
}

export interface Deck {
  id?: string;
  name: string;
  description?: string;
  faction?: string;
  cards: Card[];
  maxCards?: number;
  minCards?: number;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
}

export interface DeckValidationError {
  code: string;
  message: string;
}

export interface DeckStats {
  cardCount: number;
  uniqueCardCount: number;
  averageCost: number;
  averagePower: number;
  typeDistribution: Record<string, number>;
  costDistribution: Record<number, number>;
  rarityDistribution: Record<string, number>;
}

export interface DeckFilters {
  name?: string;
  faction?: string;
  author?: string;
  sortBy?: "name" | "created" | "updated" | "popularity";
  sortOrder?: "asc" | "desc";
}

export interface CardFilters {
  name?: string;
  type?: string;
  subtype?: string;
  faction?: string;
  cost?: number | [number, number]; // Either exact cost or range
  rarity?: string;
  keyword?: string;
}

// --- Deck Builder UI additions ---
export interface DeckRowVM {
  cardId: string;
  quantity: number;
  name: string;
  cost?: number;
  type?: string;
  faction?: string;
  rarity?: string;
  attack?: number;
  health?: number;
}

export const CARD_ID_MIME = "text/card-id";
export const DECK_CARD_ID_MIME = "text/deck-card-id";
export const CARD_JSON_MIME = "application/json";
