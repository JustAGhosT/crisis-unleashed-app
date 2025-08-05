import { Faction } from "@/types/faction";

// Mock faction data
const factions: Faction[] = [
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
];

// Get all factions
export async function getFactions(): Promise<Faction[]> {
  // In a real app, this would fetch from an API
  return factions;
}

// Get faction IDs (for static generation)
export async function getFactionIds(): Promise<string[]> {
  const factions = await getFactions();
  return factions.map(faction => faction.id);
}

// Get a single faction by ID
export async function getFaction(id: string): Promise<Faction | null> {
  const factions = await getFactions();
  return factions.find(faction => faction.id === id) || null;
}