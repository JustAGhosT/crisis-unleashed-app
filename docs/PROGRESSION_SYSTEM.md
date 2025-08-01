# Progression & Upgrade System

## Overview

This document outlines the permanent progression system for Artifacts, Heroes, and NFT cards in Crisis Unleashed. The system allows players to invest resources to upgrade their cards, with NFT cards offering additional benefits and customization options.

## Core Concepts

### 1. Rarity Tiers

- **Common (Gray)**: Base stats, 5 upgrade levels
- **Uncommon (Green)**: +1 base stat, 6 upgrade levels
- **Rare (Blue)**: +2 base stats, 7 upgrade levels
- **Epic (Purple)**: +3 base stats, 8 upgrade levels
- **Legendary (Orange)**: +4 base stats, 10 upgrade levels
- **Mythic (Red)**: +5 base stats, 12 upgrade levels (Primarily NFT, with alternative paths)

### 2. Upgrade Resources

- **Etherium Shards**: Common resource for all upgrades
- **Soul Embers**: Rare resource for high-tier upgrades
- **Faction Cores**: Faction-specific resources
- **Time Crystals**: Time-gated resource for NFT upgrades
- **Fusion Catalyst**: Craftable item to boost fusion success rate

## Artifact Upgrades

### Upgrade Paths

**Solaris Crest** (Example)  
*Legendary Artifact*  
**Base Stats:**  

- Passive: +1 DEF to allies  
- Active: 1 Power - Grant Shield (1)  

**Upgrade Tracks:**

1. **Potency** (Increases effect strength)
   - Lv1: +1 DEF → Lv5: +3 DEF
   - Lv1: Shield (1) → Lv5: Shield (3)

2. **Efficiency** (Reduces costs)
   - Lv1: 1 Power → Lv3: 0 Power
   - Cooldown reduction for active abilities

3. **Synergy** (Enhances faction bonus)
   - Lv1: +1 ATK with Shield → Lv4: +2 ATK and Lifesteal with Shield

### NFT-Exclusive Upgrades

- **Custom Effects**: Add unique modifiers (e.g., "Shield also grants Spellshield")
- **Visual Customization**: Change artifact appearance
- **Signature Abilities**: Unlock powerful signature moves at max level

## Hero Progression

### Leveling System

- **XP Gain**: Earned through battles and challenges
- **Stat Growth**: Each level increases base stats
- **Talent Points**: Unlock at certain levels for customization

### Ascension (NFT Heroes Only)

1. **Ascension Tiers**: I-V (Mythic)
2. **Requirements**:
   - Duplicate hero cards
   - Rare resources
   - Faction-specific challenges
3. **Benefits**:
   - Increased level cap
   - Unlock alternate appearances
   - Special title and border

## Fusion System

### Core Mechanics

- Combine multiple copies of the same card to increase its tier.
- Higher tiers unlock additional upgrade paths.
- NFT cards have a baseline bonus to fusion success rates.
- All players can use a craftable **Fusion Catalyst** to guarantee the success of a fusion.

### Fusion Example

``` text
Common Sword (Lv5) + Common Sword (Lv5) + Fusion Core 
= Uncommon Sword (Lv1, higher base stats)
```

## NFT Integration

### Minting Benefits

1. **True Ownership**: Players own their upgraded cards as NFTs.
2. **Play-to-Earn**: Earn resources through ranked play.
3. **Marketplace**: Trade upgraded cards with other players.

### NFT Rarity Bonuses

- **Common NFT**: +5% resource gain
- **Rare NFT**: +10% resource gain, +1 upgrade slot
- **Legendary NFT**: +20% resource gain, +2 upgrade slots, exclusive effects
- **Mythic NFT**: +30% resource gain, +3 upgrade slots, custom effects

## Upgrade UI/UX

### Upgrade Interface

1. **Upgrade Panel**: Shows current stats and next upgrade
2. **Preview System**: See changes before committing resources
3. **Success Chance**: Visual indicator of upgrade success rate

### Visual Feedback

- **Glow Effects**: Indicates upgrade level
- **Particle Effects**: Special effects for NFT upgrades
- **Stat Comparison**: Side-by-side before/after stats

## Balance Considerations

### Competitive Balance & Accessibility

To address the compounding advantages of NFTs and maintain a fair playing field, we will implement several key systems:

- **Separate Competitive Formats**: We will host distinct ranked queues. The **"Arena"** queue will be for all players, while the **"Coliseum"** will be an NFT-only format with its own ladder and rewards, allowing for direct competition among collectors.
- **Power-Normalized Tournament Mode**: A recurring tournament mode where all cards are set to a baseline power level, making strategy and skill the deciding factor.
- **Gradual Unlocking for F2P**: High-tier content will be gradually unlocked for free players through consistent play and achievement. This includes paths to Mythic-tier cards via **Mythic Essence** and **Achievement Mythics**.
- **Time-Gated Premium Access**: Dedicated free players will be able to unlock select premium features or gain temporary access to NFT bonuses by completing difficult, time-gated challenges.

### Economy

- Careful resource sink design
- Anti-whale mechanics
- Robust free-to-play progression paths

## Example: Upgraded Artifact

### Base (Common)

```markdown
**Solaris Crest**  
*Common Artifact*  
**Effect:**  

- Passive: +1 DEF to allies  
- Active (1 Power): Grant Shield (1)  

```

### Upgraded (Legendary +5)

```markdown
**Solaris Crest of the Eternal Dawn**  
*Legendary Artifact (+5)*  
**Effect:**  

- Passive: +3 DEF and +1 ATK to allies  
- Active (0 Power): Grant Shield (3) and Lifesteal this turn  
- *Solaris Bonus:* Shielded units gain +2 ATK and Spellshield  

*NFT Bonus: "Dawn's Radiance" - At start of turn, heal all allies for 1*  
```

## Progression Tracks

### Free Track

- Standard upgrade materials and progression speed.
- Access to all core content, including paths to Mythic-tier cards.
- Dedicated players can unlock certain premium features through time-gated challenges.

### Premium Track (NFT)

- Bonus resources and faster progression.
- Access to exclusive cosmetic effects and customization.
- Participation in exclusive NFT-only competitive formats.

## Implementation Roadmap

### Phase 1: Core Systems

- Basic upgrade mechanics
- Resource economy
- Non-NFT progression

### Phase 2: NFT Integration

- Smart contract deployment
- Marketplace functionality
- Cross-game progression

### Phase 3: Advanced Features

- Guild upgrades
- Seasonal progression
- Cross-promotion events

---
*Document Version: 1.2.0*  
*Last Updated: 2025-08-01*