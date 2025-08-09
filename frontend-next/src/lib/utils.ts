import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce utility: returns a debounced version of fn that fires after `wait` ms
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  wait: number
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: TArgs) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}

// Format faction key (snake_case or single token) to Title Case with spaces
export function formatFactionName(key: string): string {
  if (!key) return "";
  return key
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

// Map faction to text color utility classes
export function getFactionColorClass(faction: string): string {
  switch (faction.toLowerCase()) {
    case "solaris":
      return "text-faction-solaris-primary";
    case "umbral":
      return "text-faction-umbral-primary";
    case "synthetic":
      return "text-faction-synthetic-primary";
    case "neuralis":
      return "text-faction-neuralis-primary";
    case "aeonic":
      return "text-faction-aeonic-primary";
    case "infernal":
      return "text-faction-infernal-primary";
    case "primordial":
      return "text-faction-primordial-primary";
    default:
      return "text-gray-400";
  }
}

// Map faction to gradient background classes
export function getFactionGradientClass(faction: string): string {
  switch (faction.toLowerCase()) {
    case "solaris":
      return "faction-gradient-solaris";
    case "umbral":
      return "faction-gradient-umbral";
    case "neuralis":
      return "faction-gradient-neuralis";
    case "synthetic":
      return "faction-gradient-synthetic";
    case "aeonic":
      return "faction-gradient-aeonic";
    case "infernal":
      return "faction-gradient-infernal";
    case "primordial":
      return "faction-gradient-primordial";
    default:
      return "bg-gray-500";
  }
}

// Capitalize rarity label
export function formatRarity(rarity: string): string {
  if (!rarity) return "";
  return rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase();
}

// Map rarity to text color classes
export function getRarityColorClass(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case "common":
      return "text-gray-400";
    case "uncommon":
      return "text-green-400";
    case "rare":
      return "text-blue-400";
    case "epic":
      return "text-purple-400";
    case "legendary":
      return "text-yellow-400";
    default:
      return "text-gray-400";
  }
}