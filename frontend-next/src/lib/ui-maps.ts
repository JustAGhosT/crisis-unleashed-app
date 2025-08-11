// Shared UI mapping utilities
// Centralizes mapping of domain values to Tailwind classes for consistent styling

export const rarityBadgeClass = (rarity: string): string => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300';
    case 'uncommon':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'rare':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'epic':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'legendary':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    default:
      return '';
  }
};
