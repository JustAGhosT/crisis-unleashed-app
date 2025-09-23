/**
 * Deck Building Constants
 *
 * Centralized constants for deck validation, composition, and game balance.
 */

// === DECK COMPOSITION CONSTRAINTS ===
export const DECK_CONSTRAINTS = {
  /** Maximum number of copies allowed for any single card in a deck */
  MAX_COPIES_PER_CARD: 3,

  /** Minimum total cards required in a valid deck */
  MIN_DECK_SIZE: 30,

  /** Maximum total cards allowed in a valid deck */
  MAX_DECK_SIZE: 50,

  /** Maximum number of different factions allowed in a single deck */
  MAX_FACTIONS: 2,

  /** Minimum quantity required for any card included in a deck */
  MIN_CARD_QUANTITY: 1,
} as const;

// === DECK BALANCE THRESHOLDS ===
export const BALANCE_THRESHOLDS = {
  /** Average cost threshold above which deck is considered "high cost" */
  HIGH_AVERAGE_COST: 4.5,

  /** Average cost threshold below which deck is considered "low cost" */
  LOW_AVERAGE_COST: 2.5,

  /** Minimum average cost for optimal energy curve balance */
  OPTIMAL_COST_MIN: 2.5,

  /** Maximum average cost for optimal energy curve balance */
  OPTIMAL_COST_MAX: 4.5,
} as const;

// === GAME MECHANICS CONSTANTS ===
export const GAME_MECHANICS = {
  /** Maximum energy cost for cards (cards above this may be difficult to play) */
  MAX_REASONABLE_CARD_COST: 12,

  /** Cost for cards that are considered "free" */
  FREE_CARD_COST: 0,
} as const;

// === CARD RARITY CONSTRAINTS ===
export const RARITY_CONSTRAINTS = {
  /** Maximum copies allowed for legendary cards */
  LEGENDARY_MAX_COPIES: 1,

  /** Maximum copies allowed for mythic cards */
  MYTHIC_MAX_COPIES: 1,
} as const;

// === VALIDATION MESSAGES ===
export const VALIDATION_MESSAGES = {
  // Deck constraints
  DECK_TOO_SMALL: `Deck must contain at least ${DECK_CONSTRAINTS.MIN_DECK_SIZE} cards`,
  DECK_TOO_LARGE: `Deck cannot exceed ${DECK_CONSTRAINTS.MAX_DECK_SIZE} cards`,
  TOO_MANY_FACTIONS: `Deck can only contain cards from up to ${DECK_CONSTRAINTS.MAX_FACTIONS} factions`,
  TOO_MANY_COPIES: `Maximum ${DECK_CONSTRAINTS.MAX_COPIES_PER_CARD} copies per deck`,
  TOO_FEW_COPIES: `Must have at least ${DECK_CONSTRAINTS.MIN_CARD_QUANTITY} copy`,

  // Balance warnings
  HIGH_COST_WARNING: 'High average cost - consider adding cheaper cards',
  LOW_COST_WARNING: 'Low average cost - consider adding more expensive cards',
  EXPENSIVE_CARD_WARNING: `Cards with cost > ${GAME_MECHANICS.MAX_REASONABLE_CARD_COST} may be difficult to play`,
  FREE_LEGENDARY_WARNING: 'Free legendary cards may cause balance issues',

  // Input validation
  INVALID_USER_ID: 'Invalid user ID provided',
  EMPTY_DECK_NAME: 'Deck name is required and must be non-empty',
  EMPTY_USER_ID: 'User ID is required and must be non-empty',
  MISSING_FACTION: 'Faction is required',
} as const;

// === DEFAULT VALUES ===
export const DEFAULTS = {
  /** Default user ID for simulation/testing */
  MOCK_USER_ID: 'user-1',

  /** Default deck name for creation */
  DEFAULT_DECK_NAME: 'New Deck',

  /** Default faction for new decks */
  DEFAULT_FACTION: 'solaris',
} as const;

// === TYPE EXPORTS FOR EXTERNAL USE ===
export type DeckConstraintKey = keyof typeof DECK_CONSTRAINTS;
export type BalanceThresholdKey = keyof typeof BALANCE_THRESHOLDS;
export type GameMechanicKey = keyof typeof GAME_MECHANICS;