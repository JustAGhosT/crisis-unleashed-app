import { Card, CardFilters as CardFiltersType, CardType, CardRarity } from "@/types/card";
import { FactionId } from "@/types/faction";

// Helper function for type-safe random selection from a readonly array
function pickRandom<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Define type-safe constants
const CARD_TYPES: readonly CardType[] = ["hero", "unit", "action", "structure"];
const FACTIONS: readonly FactionId[] = ["solaris", "umbral", "aeonic", "primordial", "infernal", "neuralis", "synthetic"];
const RARITIES: readonly CardRarity[] = ["common", "uncommon", "rare", "epic", "legendary"];
const ABILITIES: readonly string[] = ["First Strike", "Overwhelm", "Shield", "Flying", "Stealth", "Lifesteal", "Drain"];

export function generateMockCards(page: number, filters: CardFiltersType): Card[] {
    const mockCards: Card[] = Array.from({ length: 20 }).map((_, i) => ({
        id: `card-${page}-${i}`,
        name: `Example Card ${page * 20 + i + 1}`,
        description: "This is a sample card description with some gameplay text.",
        type: pickRandom(CARD_TYPES),
        faction: pickRandom(FACTIONS),
        rarity: pickRandom(RARITIES),
        cost: Math.floor(Math.random() * 10),
        attack: Math.floor(Math.random() * 10),
        health: Math.floor(Math.random() * 10),
        abilities: ABILITIES.slice(
            0,
            Math.floor(Math.random() * 3)
        ),
        energyCost: Math.floor(Math.random() * 5),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }));

    let filteredCards = mockCards;
    if (filters.faction) {
        filteredCards = filteredCards.filter((card) => card.faction === filters.faction);
    }
    if (filters.type) {
        filteredCards = filteredCards.filter((card) => card.type === filters.type);
    }
    if (filters.rarity) {
        filteredCards = filteredCards.filter((card) => card.rarity === filters.rarity);
    }
    if (filters.costMin !== undefined) {
        filteredCards = filteredCards.filter((card) => card.cost >= filters.costMin!);
    }
    if (filters.costMax !== undefined) {
        filteredCards = filteredCards.filter((card) => card.cost <= filters.costMax!);
    }
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCards = filteredCards.filter(
            (card) =>
                card.name.toLowerCase().includes(searchLower) ||
                card.description.toLowerCase().includes(searchLower)
        );
    }

    return filteredCards;
}