import { Card, CardFilters, CardSearchResult, UserCard } from '@/types/card';

export class CardMockData {
  /** Mock card pool (expanded to use current hierarchical spec for demo purposes) */
  private static readonly mockCards: Card[] = [
    // HERO example
    {
      id: 'card-hero-1',
      name: 'Aurion, the Sunlord',
      description: 'Legendary Solaris hero who channels stellar power.',
      type: 'hero',
      faction: 'solaris',
      rarity: 'legendary',
      cost: 7,
      attack: 6,
      health: 8,
      abilities: ['Radiant Avatar', 'Solar Nova'],
      unitType: undefined,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      initiative: 2,
      range: 1,
      energyCost: 4,
      keywords: ['Unique', 'Leader'],
    },
    // UNIT examples
    {
      id: 'card-solaris-melee-1',
      name: 'Solar Paladin',
      description: 'Frontline melee fighter of the Solaris.',
      type: 'unit',
      faction: 'solaris',
      rarity: 'rare',
      cost: 3,
      attack: 4,
      health: 4,
      abilities: ['First Strike'],
      unitType: 'melee',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      initiative: 1,
      energyCost: 1,
    },
    {
      id: 'card-umbral-ranged-1',
      name: 'Umbral Sniper',
      description: 'Stealthy ranged assassin.',
      type: 'unit',
      faction: 'umbral',
      rarity: 'uncommon',
      cost: 2,
      attack: 2,
      health: 2,
      abilities: ['Stealth'],
      unitType: 'ranged',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      initiative: 2,
      range: 3,
      energyCost: 1,
    },
    {
      id: 'card-aeonic-flying-1',
      name: 'Chrono Wyrm',
      description: 'Aeonic flying reptile with time-bending breath.',
      type: 'unit',
      faction: 'aeonic',
      rarity: 'epic',
      cost: 5,
      attack: 6,
      health: 5,
      abilities: ['Flying', 'Time Warp'],
      unitType: 'flying',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      range: 1,
      initiative: 3,
      energyCost: 2,
    },
    // ACTION (with subtypes)
    {
      id: 'card-solaris-action-1',
      name: 'Solar Flare',
      description: 'Deal 3 damage to all enemy units.',
      type: 'action',
      actionType: 'instant',
      faction: 'solaris',
      rarity: 'common',
      cost: 2,
      abilities: ['Area Damage'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      energyCost: 1,
    },
    {
      id: 'card-umbral-equipment-1',
      name: 'Nightblade',
      description: 'Equip a unit with deadly shadow-infused blade.',
      type: 'action',
      actionType: 'equipment',
      faction: 'umbral',
      rarity: 'rare',
      cost: 3,
      abilities: ['Equip', 'Stealth Bonus'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      energyCost: 2,
    },
    // STRUCTURE examples
    {
      id: 'card-primordial-building-1',
      name: 'Root Fortress',
      description: 'Primordial defensive structure.',
      type: 'structure',
      structureType: 'building',
      faction: 'primordial',
      rarity: 'rare',
      cost: 5,
      abilities: ['Defender', 'Regeneration'],
      health: 12,
      persistsOnBattlefield: true,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      energyCost: 3,
    },
    {
      id: 'card-infernal-trap-1',
      name: 'Hellfire Trap',
      description: 'Explodes when triggered, damaging attackers.',
      type: 'structure',
      structureType: 'trap',
      faction: 'infernal',
      rarity: 'epic',
      cost: 4,
      abilities: ['Trap', 'Destructive'],
      health: 2,
      persistsOnBattlefield: true,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      energyCost: 2,
    },
    {
      id: 'card-aeonic-aura-1',
      name: 'Stasis Field',
      description: 'Aura that slows down all enemy actions.',
      type: 'structure',
      structureType: 'aura',
      faction: 'aeonic',
      rarity: 'legendary',
      cost: 6,
      abilities: ['Slow', 'Area Control'],
      health: 6,
      persistsOnBattlefield: true,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      energyCost: 4,
    },
    // ...add more as desired for demo realism
  ];

  static getMockCardSearchResult(
    filters: CardFilters,
    page: number,
    pageSize: number
  ): CardSearchResult {
    let filteredCards = this.mockCards;
    if (filters.faction) {
      filteredCards = filteredCards.filter(card => card.faction === filters.faction);
    }
    if (filters.type) {
      filteredCards = filteredCards.filter(card => card.type === filters.type);
    }
    if (filters.rarity) {
      filteredCards = filteredCards.filter(card => card.rarity === filters.rarity);
    }
    if (filters.costMin !== undefined) {
      filteredCards = filteredCards.filter(card => card.cost >= filters.costMin!);
    }
    if (filters.costMax !== undefined) {
      filteredCards = filteredCards.filter(card => card.cost <= filters.costMax!);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCards = filteredCards.filter(card =>
        card.name.toLowerCase().includes(searchLower) ||
        card.description.toLowerCase().includes(searchLower) ||
        (card.abilities &&
          card.abilities.some(ability => ability.toLowerCase().includes(searchLower)))
      );
    }
    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCards = filteredCards.slice(startIndex, endIndex);
    return {
      cards: paginatedCards,
      total: filteredCards.length,
      page,
      pageSize,
    };
  }

  static getMockUserCards(userId: string): UserCard[] {
    return [
      {
        id: 'user-card-hero-1',
        userId,
        cardId: 'card-hero-1',
        quantity: 1,
        isFavorite: true,
        acquiredAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'user-card-solaris-melee-1',
        userId,
        cardId: 'card-solaris-melee-1',
        quantity: 2,
        isFavorite: false,
        acquiredAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'user-card-umbral-ranged-1',
        userId,
        cardId: 'card-umbral-ranged-1',
        quantity: 1,
        isFavorite: false,
        acquiredAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'user-card-primordial-building-1',
        userId,
        cardId: 'card-primordial-building-1',
        quantity: 1,
        isFavorite: false,
        acquiredAt: '2024-01-01T00:00:00Z',
      },
      // ...add more for strong test coverage
    ];
  }
}