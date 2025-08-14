/**
 * Valid card rarity types that match Badge component variants
 */
export type CardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

/**
 * Checks if a rarity value is valid for use with Badge variants
 */
export function isValidRarity(rarity: string): rarity is CardRarity {
  return ["common", "uncommon", "rare", "epic", "legendary", "mythic"].includes(
    rarity.toLowerCase(),
  );
}

/**
 * Maps rarity values to appropriate Badge variant values
 * Returns a fallback if the rarity is invalid
 */
export function getRarityVariant(rarity: string): string {
  if (isValidRarity(rarity)) {
    // The badge component already has variants that match our rarity names
    return rarity.toLowerCase() as CardRarity;
  }

  // Fallback for invalid values
  return "default";
}
