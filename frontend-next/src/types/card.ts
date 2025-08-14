import { FactionId } from "./faction";

export type CardType = "hero" | "unit" | "action" | "structure";
export type UnitType = "melee" | "ranged" | "siege" | "flying";
export type ActionType = "instant" | "ongoing" | "equipment";
export type StructureType = "building" | "trap" | "aura";
export type CardRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface Card {
  id: string;
  name: string;
  description: string;
  type: CardType;
  unitType?: UnitType; // Required for unit cards
  actionType?: ActionType; // Required for action cards
  structureType?: StructureType; // Required for structure cards
  faction: FactionId;
  rarity: CardRarity;
  cost: number;
  attack?: number; // Required for unit/hero cards
  health?: number; // Required for unit/hero cards
  initiative?: number; // For combat sequencing
  range?: number; // For ranged units and line of sight
  movementSpeed?: number; // For battlefield positioning
  keywords?: string[]; // Combat keywords: Quick Attack, Overwhelm, etc.
  abilities: string[];
  playConditions?: string[]; // Play condition verification
  energyCost: number; // Energy system integration
  momentumCost?: number; // Momentum system integration
  zoneRestrictions?: string[]; // Zone-based battlefield rules
  persistsOnBattlefield?: boolean; // For structure cards
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
  heroCardCount: number;
  unitCardCount: number;
  actionCardCount: number;
  structureCardCount: number;
  factionConsistency: boolean;
  energyCurveBalance: boolean;
  costCurve: { [cost: number]: number };
  factionSpecificRules: { [rule: string]: boolean };
}

export interface DeckStats {
  totalCards: number;
  averageCost: number;
  averageInitiative: number;
  frontlineUnitCount: number;
  backlineUnitCount: number;
  rangedUnitCount: number;
  flyingUnitCount: number;
  typeDistribution: Record<CardType, number>;
  unitTypeDistribution: Record<UnitType, number>;
  actionTypeDistribution: Record<ActionType, number>;
  structureTypeDistribution: Record<StructureType, number>;
  rarityDistribution: Record<CardRarity, number>;
  costCurve: { [cost: number]: number };
  energyCurve: { [cost: number]: number };
  momentumRequirements: { [cost: number]: number };
}
