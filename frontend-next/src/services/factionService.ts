import { Faction, FactionId } from "../types/faction";
import { apiClient, apiRequest } from "./api";

// Rich Faction dataset for new UI
const factions: Faction[] = [
  {
    id: "solaris",
    name: "Solaris Nexus",
    tagline: "Masters of solar energy and light-based technology.",
    description: "Masters of solar energy and light-based technology, the Solaris Nexus harnesses the power of stars.",
    philosophy: "Radiate strength, illuminate the darkness.",
    strength: "Unmatched energy projection and renewal.",
    technology: "Solar condensers, photonic shields, and heliocentric craft.",
    mechanics: { energyManipulation: true },
    colors: { primary: "#FFB627", secondary: "#FCEABB", accent: "#B07B21" },
  },
  {
    id: "umbral",
    name: "Umbral Covenant",
    tagline: "Shadow dwellers who control darkness itself.",
    description: "The shadow dwellers who control darkness itself, moving unseen between realms through void passages.",
    philosophy: "In darkness, we find strength and freedom.",
    strength: "Invisibility, subterfuge, and fear tactics.",
    technology: "Void-step cloaking, phase blades, and blacklight drones.",
    mechanics: { stealth: true },
    colors: { primary: "#8A4FFF", secondary: "#2D1A5A", accent: "#B399FF" },
  },
  {
    id: "neuralis",
    name: "Neuralis Collective",
    tagline: "A hive mind of advanced AI and augmented humans.",
    description: "A hive mind of advanced AI and augmented humans who have transcended individual consciousness.",
    philosophy: "Individuality is illusion—progress through unity.",
    strength: "Instantaneous coordination, predictive processing.",
    technology: "Cerebral uplinks, neuro-clouds, assimilation nanites.",
    mechanics: { mindControl: true },
    colors: { primary: "#00C2FF", secondary: "#3AAFB9", accent: "#005D75" },
  },
  {
    id: "aeonic",
    name: "Aeonic Order",
    tagline: "Time manipulators who glimpse and alter futures.",
    description: "Time manipulators who can glimpse possible futures and alter the flow of causality itself.",
    philosophy: "Master the moment, master all outcomes.",
    strength: "Temporal prediction, causality induction.",
    technology: "Chrono lenses, timeshift engines, fate chronometers.",
    mechanics: { timeWarp: true },
    colors: { primary: "#14F195", secondary: "#D1FFF0", accent: "#16A673" },
  },
  {
    id: "infernal",
    name: "Infernal Dynasty",
    tagline: "Fire wielders descended from elemental beings.",
    description: "Fire wielders descended from ancient elemental beings who command the power of eternal flame.",
    philosophy: "Renewal by fire; strength through sacrifice.",
    strength: "Pyrokinesis, sacrifice-fueled rebirth.",
    technology: "Plasma blades, hellfire reactors, rebirth pods.",
    mechanics: { sacrifice: true },
    colors: { primary: "#FF3E41", secondary: "#330000", accent: "#FDB4B2" },
  },
  {
    id: "primordial",
    name: "Primordial Enclave",
    tagline: "Ancient nature spirits of earth, water, and wild.",
    description: "Ancient nature spirits who command the primal forces of earth, water, and the wild.",
    philosophy: "Survival by adaptation—abide in harmony.",
    strength: "Regeneration, adaptation, wild growth.",
    technology: "Living armor, bio-symbiotes, earthshaper staffs.",
    mechanics: { adaptation: true },
    colors: { primary: "#39A845", secondary: "#74E68C", accent: "#174F33" },
  },
  // Add synthetic here if/when available
];

// Returns all factions
export async function getFactions(): Promise<Faction[]> {
  return factions;
}

// Returns all faction ids
export async function getFactionIds(): Promise<FactionId[]> {
  return factions.map((f) => f.id);
}

// Returns a faction by id (or null if not found)
export async function getFaction(id: FactionId): Promise<Faction | null> {
  return factions.find((f) => f.id === id) || null;
}

// API: Returns stats for a faction (backend)
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

// Returns a canonical API-styled fetch result for a faction by id
export async function fetchFactionById(id: FactionId) {
  const faction = await getFaction(id);
  if (!faction) {
    return { success: false, data: null };
  }
  return { success: true, data: faction };
}