import { apiClient, apiRequest } from './api';

// Legacy faction interface for compatibility
export interface Faction {
  id: string;
  name: string;
  description: string;
  color: string;
  logo: string;
  bannerImage?: string;
  mechanics?: string[];
  lore?: string;
  playstyle?: string;
  difficulty?: number;
}

// Mock faction data to be used when API is not available
const mockFactions: Faction[] = [
  {
    id: "solaris",
    name: "Solaris Nexus",
    description: "Masters of solar energy and light-based technology, the Solaris Nexus harnesses the power of stars.",
    color: "#FFB627",
    logo: "/images/factions/solaris-logo.svg",
    bannerImage: "/images/factions/solaris-banner.jpg",
    mechanics: ["Light Manipulation", "Solar Charging", "Blinding Strike"]
  },
  {
    id: "umbral",
    name: "Umbral Covenant",
    description: "The shadow dwellers who control darkness itself, moving unseen between realms through void passages.",
    color: "#8A4FFF",
    logo: "/images/factions/umbral-logo.svg",
    bannerImage: "/images/factions/umbral-banner.jpg",
    mechanics: ["Shadow Step", "Void Manipulation", "Fear Tactics"]
  },
  {
    id: "neuralis",
    name: "Neuralis Collective",
    description: "A hive mind of advanced AI and augmented humans who have transcended individual consciousness.",
    color: "#00C2FF",
    logo: "/images/factions/neuralis-logo.svg",
    bannerImage: "/images/factions/neuralis-banner.jpg",
    mechanics: ["Mind Link", "Neural Override", "Collective Intelligence"]
  },
  {
    id: "aeonic",
    name: "Aeonic Order",
    description: "Time manipulators who can glimpse possible futures and alter the flow of causality itself.",
    color: "#14F195",
    logo: "/images/factions/aeonic-logo.svg",
    bannerImage: "/images/factions/aeonic-banner.jpg",
    mechanics: ["Temporal Shift", "Future Sight", "Causal Loop"]
  },
  {
    id: "infernal",
    name: "Infernal Dynasty",
    description: "Fire wielders descended from ancient elemental beings who command the power of eternal flame.",
    color: "#FF3E41",
    logo: "/images/factions/infernal-logo.svg",
    bannerImage: "/images/factions/infernal-banner.jpg",
    mechanics: ["Burn", "Fire Shield", "Phoenix Revival"]
  },
  {
    id: "primordial",
    name: "Primordial Enclave",
    description: "Ancient nature spirits who command the primal forces of earth, water, and the wild.",
    color: "#39A845",
    logo: "/images/factions/primordial-logo.svg",
    bannerImage: "/images/factions/primordial-banner.jpg",
    mechanics: ["Regeneration", "Nature's Wrath", "Wild Growth"]
  },
  {
    id: "synthetic",
    name: "Synthetic Directive",
    description: "Artificial intelligence constructs that have evolved beyond their programming to form a digital society.",
    color: "#7F8C8D",
    logo: "/images/factions/synthetic-logo.svg",
    bannerImage: "/images/factions/synthetic-banner.jpg",
    mechanics: ["Self-Repair", "Data Manipulation", "Evolving Code"]
  }
];/**
 * Fetches all factions
 * Uses mock data with a delay to simulate API call
 */
export function fetchFactions() {
  return new Promise(resolve => {
    // Simulate API delay
    setTimeout(() => {
      resolve({
        success: true,
        data: mockFactions
      });
    }, 200);
  }) as Promise<{ success: boolean; data: Faction[] }>;
}

/**
 * Fetches a faction by its ID
 * Uses mock data with a delay to simulate API call
 */
export function fetchFactionById(id: string) {
  return new Promise(resolve => {
    // Simulate API delay
    setTimeout(() => {
      const faction = mockFactions.find(f => f.id === id);
      resolve({
        success: !!faction,
        data: faction || null
      });
    }, 200);
  }) as Promise<{ success: boolean; data: Faction | null }>;
}

/**
 * Get all faction IDs (for static generation)
 */
export function getFactionIds(): Promise<string[]> {
  return fetchFactions().then(response => 
    response.success ? response.data.map(faction => faction.id) : []
  );
}

/**
 * Fetches faction statistics
 */
export function fetchFactionStats(factionId: string) {
  return apiRequest<{
    winRate: number;
    pickRate: number;
    popularCards: string[];
    matchups: Record<string, number>;
  }>(() =>
    apiClient.get(`/factions/${factionId}/stats`)
  );
}