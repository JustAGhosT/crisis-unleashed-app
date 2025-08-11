import { Card } from '@/types/deck';

/**
 * Sample cards for demonstration purposes
 * In a real app, these would come from an API
 */
export const sampleCards: Card[] = [
  // Solaris Nexus Cards
  {
    id: 'sol-001',
    name: 'Solar Vanguard',
    cost: 3,
    power: 3,
    type: 'Unit',
    subtype: 'Soldier',
    faction: 'Solaris Nexus',
    rarity: 'Common',
    text: 'When Solar Vanguard enters play, gain 1 energy.',
    imageUrl: '/images/cards/solar-vanguard.jpg',
    keywords: ['Energy']
  },
  {
    id: 'sol-002',
    name: 'Photon Cannon',
    cost: 4,
    power: 5,
    type: 'Support',
    faction: 'Solaris Nexus',
    rarity: 'Uncommon',
    text: 'Spend 1 energy: Deal 2 damage to a unit.',
    imageUrl: '/images/cards/photon-cannon.jpg',
    keywords: ['Energy']
  },
  {
    id: 'sol-003',
    name: 'Solar Flare',
    cost: 2,
    type: 'Tactic',
    faction: 'Solaris Nexus',
    rarity: 'Rare',
    text: 'Deal 3 damage to all enemy units. Gain 1 energy for each unit destroyed this way.',
    imageUrl: '/images/cards/solar-flare.jpg',
    keywords: ['Energy', 'AoE']
  },
  {
    id: 'sol-004',
    name: 'Helios, Sun Commander',
    cost: 6,
    power: 6,
    type: 'Unit',
    subtype: 'Commander',
    faction: 'Solaris Nexus',
    rarity: 'Legendary',
    text: 'When Helios enters play, gain 3 energy. Your energy doesn\'t deplete at the end of your turn.',
    imageUrl: '/images/cards/helios.jpg',
    isUnique: true,
    keywords: ['Energy', 'Commander']
  },
  {
    id: 'sol-005',
    name: 'Energy Reactor',
    cost: 1,
    type: 'Resource',
    faction: 'Solaris Nexus',
    rarity: 'Common',
    text: 'Gain 2 energy.',
    imageUrl: '/images/cards/energy-reactor.jpg',
    keywords: ['Energy']
  },

  // Umbral Eclipse Cards
  {
    id: 'umb-001',
    name: 'Shadow Assassin',
    cost: 2,
    power: 2,
    type: 'Unit',
    subtype: 'Assassin',
    faction: 'Umbral Eclipse',
    rarity: 'Common',
    text: 'Shadow Assassin can\'t be blocked by units with power 4 or greater.',
    imageUrl: '/images/cards/shadow-assassin.jpg',
    keywords: ['Stealth']
  },
  {
    id: 'umb-002',
    name: 'Cloak of Darkness',
    cost: 3,
    type: 'Support',
    faction: 'Umbral Eclipse',
    rarity: 'Uncommon',
    text: 'Attached unit gains Stealth. (It can\'t be targeted by enemy abilities.)',
    imageUrl: '/images/cards/cloak-of-darkness.jpg',
    keywords: ['Stealth', 'Attachment']
  },
  {
    id: 'umb-003',
    name: 'Midnight Strike',
    cost: 4,
    type: 'Tactic',
    faction: 'Umbral Eclipse',
    rarity: 'Rare',
    text: 'Destroy an enemy unit. If you control a Stealth unit, draw a card.',
    imageUrl: '/images/cards/midnight-strike.jpg',
    keywords: ['Stealth', 'Removal']
  },
  {
    id: 'umb-004',
    name: 'Nightshade, Shadow Queen',
    cost: 5,
    power: 4,
    type: 'Unit',
    subtype: 'Commander',
    faction: 'Umbral Eclipse',
    rarity: 'Legendary',
    text: 'Stealth. When Nightshade deals damage to an opponent, you may destroy a support card they control.',
    imageUrl: '/images/cards/nightshade.jpg',
    isUnique: true,
    keywords: ['Stealth', 'Commander']
  },
  {
    id: 'umb-005',
    name: 'Shadow Network',
    cost: 2,
    type: 'Resource',
    faction: 'Umbral Eclipse',
    rarity: 'Common',
    text: 'Draw a card. If you control a Stealth unit, draw another card.',
    imageUrl: '/images/cards/shadow-network.jpg',
    keywords: ['Stealth', 'Card Draw']
  },

  // Aeonic Dominion Cards
  {
    id: 'aeo-001',
    name: 'Temporal Mage',
    cost: 3,
    power: 2,
    type: 'Unit',
    subtype: 'Mage',
    faction: 'Aeonic Dominion',
    rarity: 'Common',
    text: 'When Temporal Mage enters play, you may return a tactic from your discard pile to your hand.',
    imageUrl: '/images/cards/temporal-mage.jpg',
    keywords: ['Time Warp']
  },
  {
    id: 'aeo-002',
    name: 'Chrono Disruptor',
    cost: 4,
    type: 'Support',
    faction: 'Aeonic Dominion',
    rarity: 'Uncommon',
    text: 'At the start of your turn, look at the top card of your deck. You may play it this turn.',
    imageUrl: '/images/cards/chrono-disruptor.jpg',
    keywords: ['Time Warp', 'Scry']
  },
  {
    id: 'aeo-003',
    name: 'Time Reversal',
    cost: 5,
    type: 'Tactic',
    faction: 'Aeonic Dominion',
    rarity: 'Rare',
    text: 'Return all units that entered play this turn to their owners\' hands.',
    imageUrl: '/images/cards/time-reversal.jpg',
    keywords: ['Time Warp', 'Bounce']
  },
  {
    id: 'aeo-004',
    name: 'Chronos, Time Lord',
    cost: 7,
    power: 5,
    type: 'Unit',
    subtype: 'Commander',
    faction: 'Aeonic Dominion',
    rarity: 'Legendary',
    text: 'When Chronos enters play, take an extra turn after this one.',
    imageUrl: '/images/cards/chronos.jpg',
    isUnique: true,
    keywords: ['Time Warp', 'Commander']
  },
  {
    id: 'aeo-005',
    name: 'Time Flux',
    cost: 2,
    type: 'Resource',
    faction: 'Aeonic Dominion',
    rarity: 'Common',
    text: 'Draw a card, then put a card from your hand on top of your deck.',
    imageUrl: '/images/cards/time-flux.jpg',
    keywords: ['Time Warp', 'Card Draw']
  },

  // Neutral Cards
  {
    id: 'neu-001',
    name: 'Mercenary Scout',
    cost: 1,
    power: 1,
    type: 'Unit',
    subtype: 'Mercenary',
    faction: 'Neutral',
    rarity: 'Common',
    text: 'When Mercenary Scout enters play, look at the top card of your deck.',
    imageUrl: '/images/cards/mercenary-scout.jpg',
    keywords: ['Scout']
  },
  {
    id: 'neu-002',
    name: 'Supply Cache',
    cost: 2,
    type: 'Support',
    faction: 'Neutral',
    rarity: 'Common',
    text: 'Sacrifice Supply Cache: Draw a card.',
    imageUrl: '/images/cards/supply-cache.jpg',
    keywords: ['Card Draw']
  },
  {
    id: 'neu-003',
    name: 'Strategic Planning',
    cost: 3,
    type: 'Tactic',
    faction: 'Neutral',
    rarity: 'Uncommon',
    text: 'Draw two cards, then discard a card.',
    imageUrl: '/images/cards/strategic-planning.jpg',
    keywords: ['Card Draw']
  },
  {
    id: 'neu-004',
    name: 'Veteran Commander',
    cost: 4,
    power: 3,
    type: 'Unit',
    subtype: 'Commander',
    faction: 'Neutral',
    rarity: 'Rare',
    text: 'When Veteran Commander enters play, all your other units get +1 power until end of turn.',
    imageUrl: '/images/cards/veteran-commander.jpg',
    keywords: ['Buff', 'Commander']
  },
  {
    id: 'neu-005',
    name: 'Emergency Supplies',
    cost: 1,
    type: 'Resource',
    faction: 'Neutral',
    rarity: 'Common',
    text: 'You gain 3 life.',
    imageUrl: '/images/cards/emergency-supplies.jpg',
    keywords: ['Healing']
  }
];

// Add more cards for each faction to have a reasonable pool
for (let i = 6; i <= 15; i++) {
  // Solaris Nexus additional cards
  sampleCards.push({
    id: `sol-${i.toString().padStart(3, '0')}`,
    name: `Solaris Trooper ${i-5}`,
    cost: i % 3 + 1,
    power: i % 4 + 1,
    type: 'Unit',
    subtype: 'Soldier',
    faction: 'Solaris Nexus',
    rarity: i % 10 === 0 ? 'Rare' : i % 5 === 0 ? 'Uncommon' : 'Common',
    text: `When this unit enters play, gain ${i % 2 + 1} energy.`,
    keywords: ['Energy']
  });

  // Umbral Eclipse additional cards
  sampleCards.push({
    id: `umb-${i.toString().padStart(3, '0')}`,
    name: `Shadow Agent ${i-5}`,
    cost: i % 3 + 2,
    power: i % 3 + 1,
    type: 'Unit',
    subtype: 'Agent',
    faction: 'Umbral Eclipse',
    rarity: i % 10 === 0 ? 'Rare' : i % 5 === 0 ? 'Uncommon' : 'Common',
    text: i % 2 === 0 ? 'Stealth' : 'When this unit enters play, an enemy unit gets -1 power until end of turn.',
    keywords: ['Stealth']
  });

  // Aeonic Dominion additional cards
  sampleCards.push({
    id: `aeo-${i.toString().padStart(3, '0')}`,
    name: `Time Weaver ${i-5}`,
    cost: i % 4 + 2,
    power: i % 3 + 2,
    type: 'Unit',
    subtype: 'Mage',
    faction: 'Aeonic Dominion',
    rarity: i % 10 === 0 ? 'Rare' : i % 5 === 0 ? 'Uncommon' : 'Common',
    text: `When this unit enters play, look at the top ${i % 3 + 1} cards of your deck. Put one into your hand and the rest on the bottom.`,
    keywords: ['Time Warp', 'Scry']
  });
}