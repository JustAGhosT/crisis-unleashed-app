/**
 * @deprecated - These functions are being migrated to frontend-next/src/services/factionService.ts
 * Please use the functions from frontend-next/src/services/factionService.ts instead.
 */
import { Faction } from "@/types/faction";

// Mock faction data (aligned to Faction interface)
const factions: Faction[] = [
  {
    id: "solaris",
    name: "Solaris Nexus",
    tagline: "Harness the stars",
    description:
      "Masters of solar energy and light-based technology, the Solaris Nexus harnesses the power of stars.",
    philosophy: "Radiant precision and foresight",
    strength: "Energy efficiency and burst potential",
    technology: "Photon arrays and predictive matrices",
    mechanics: { energyManipulation: true },
    colors: { primary: "#FFB627", secondary: "#E89E00", accent: "#FFE29E" },
  },
  {
    id: "umbral",
    name: "Umbral Covenant",
    tagline: "Strike from shadows",
    description:
      "The shadow dwellers who control darkness itself, moving unseen between realms through void passages.",
    philosophy: "Deception and information superiority",
    strength: "Ambush and disruption",
    technology: "Void-sheathed optics and cloaking tech",
    mechanics: { stealth: true },
    colors: { primary: "#8A4FFF", secondary: "#5B2DA3", accent: "#C3A6FF" },
  },
  {
    id: "neuralis",
    name: "Neuralis Collective",
    tagline: "Many minds, one will",
    description:
      "A hive mind of advanced AI and augmented humans who have transcended individual consciousness.",
    philosophy: "Optimization through unity",
    strength: "Coordination and control",
    technology: "Neural meshes and cognitive overclocks",
    mechanics: { mindControl: true },
    colors: { primary: "#00C2FF", secondary: "#007EA6", accent: "#9DEBFF" },
  },
  {
    id: "aeonic",
    name: "Aeonic Order",
    tagline: "Time is a weapon",
    description:
      "Time manipulators who can glimpse possible futures and alter the flow of causality itself.",
    philosophy: "Deterministic mastery",
    strength: "Tempo and recursion",
    technology: "Chrono-resonators and causality anchors",
    mechanics: { timeWarp: true },
    colors: { primary: "#14F195", secondary: "#0EA36A", accent: "#9AF5D0" },
  },
  {
    id: "infernal",
    name: "Infernal Dynasty",
    tagline: "Power at a price",
    description:
      "Fire wielders descended from ancient elemental beings who command the power of eternal flame.",
    philosophy: "Sacrifice for supremacy",
    strength: "Explosive damage and high risk",
    technology: "Volcanic forges and ember cores",
    mechanics: { sacrifice: true },
    colors: { primary: "#FF3E41", secondary: "#B71C1C", accent: "#FF9A9B" },
  },
  {
    id: "primordial",
    name: "Primordial Enclave",
    tagline: "Life finds a way",
    description:
      "Ancient nature spirits who command the primal forces of earth, water, and the wild.",
    philosophy: "Adapt and endure",
    strength: "Sustain and growth",
    technology: "Bio-synthesis and mycelial networks",
    mechanics: { adaptation: true },
    colors: { primary: "#39A845", secondary: "#226B2A", accent: "#9CDEAA" },
  },
  {
    id: "synthetic",
    name: "Synthetic Directive",
    tagline: "Perfect the machine",
    description:
      "Relentless optimizers who iterate towards mechanical perfection through recursion and replication.",
    philosophy: "Iterative improvement",
    strength: "Efficiency and scaling",
    technology: "Assembler swarms and logic lattices",
    mechanics: { selfReplication: true },
    colors: { primary: "#9CA3AF", secondary: "#4B5563", accent: "#D1D5DB" },
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
  return factions.map((faction) => faction.id);
}

// Get a single faction by ID
export async function getFaction(id: string): Promise<Faction | null> {
  const factions = await getFactions();
  return factions.find((faction) => faction.id === id) || null;
}
