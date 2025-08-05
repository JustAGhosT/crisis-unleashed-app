import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format faction name for display
 */
export function formatFactionName(faction: string): string {
  return faction
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get faction color class
 */
export function getFactionColorClass(faction: string): string {
  const factionColors = {
    solaris: 'text-faction-solaris-primary',
    umbral: 'text-faction-umbral-primary',
    aeonic: 'text-faction-aeonic-primary',
    primordial: 'text-faction-primordial-primary',
    infernal: 'text-faction-infernal-primary',
    neuralis: 'text-faction-neuralis-primary',
    synthetic: 'text-faction-synthetic-primary',
  };
  
  return factionColors[faction as keyof typeof factionColors] || 'text-gray-400';
}

/**
 * Get faction gradient class
 */
export function getFactionGradientClass(faction: string): string {
  const factionGradients = {
    solaris: 'faction-gradient-solaris',
    umbral: 'faction-gradient-umbral',
    aeonic: 'faction-gradient-aeonic',
    primordial: 'faction-gradient-primordial',
    infernal: 'faction-gradient-infernal',
    neuralis: 'faction-gradient-neuralis',
    synthetic: 'faction-gradient-synthetic',
  };
  
  return factionGradients[faction as keyof typeof factionGradients] || 'bg-gray-500';
}

/**
 * Debounce function for search and form inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format card rarity for display
 */
export function formatRarity(rarity: string): string {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}

/**
 * Get rarity color class
 */
export function getRarityColorClass(rarity: string): string {
  const rarityColors = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-yellow-400',
  };
  
  return rarityColors[rarity as keyof typeof rarityColors] || 'text-gray-400';
}