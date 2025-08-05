/**
 * Valid card rarity types that match Badge component variants
 */
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

/**
 * Checks if a rarity value is valid for use with Badge variants
 */
export function isValidRarity(rarity: string): rarity is CardRarity {
  return ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'].includes(rarity.toLowerCase());
}

/**
 * Maps rarity values to appropriate Badge variant values
 * Returns a fallback if the rarity is invalid
 */
export function getRarityVariant(rarity: string): string {
  if (isValidRarity(rarity)) {
    // Return the appropriate variant based on rarity
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'secondary';
      case 'uncommon':
        return 'outline';
      case 'rare':
        return 'default';
      case 'epic':
        return 'destructive';
      case 'legendary':
        return 'purple'; // Requires custom Badge variant
      case 'mythic':
        return 'amber'; // Requires custom Badge variant
      default:
        return 'default';
    }
  }
  
  // Fallback for invalid values
  return 'default';
}