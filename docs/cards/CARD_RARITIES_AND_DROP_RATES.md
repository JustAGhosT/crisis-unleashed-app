# Card Rarities and Drop Rates

This document details the card rarity system, distribution rates across different acquisition methods, and the philosophy behind card availability in the game.

## Table of Contents

1. [Rarity Overview](#rarity-overview)
2. [Rarity Distribution](#rarity-distribution)
3. [Pack Opening Mechanics](#pack-opening-mechanics)
4. [Acquisition Methods](#acquisition-methods)
5. [Pity Systems](#pity-systems)
6. [Seasonal and Limited Cards](#seasonal-and-limited-cards)
7. [Upgrade and Downgrade Systems](#upgrade-and-downgrade-systems)
8. [Collection Analysis](#collection-analysis)

## Rarity Overview

### Rarity Tiers

Cards in the game are divided into the following rarity tiers, each with distinct visual treatments and distribution rates:

| Rarity | Visual Treatment | Gameplay Impact |
|--------|-----------------|-----------------|
| Common | Standard frame, no special effects | Fundamental game mechanics, widely available |
| Uncommon | Silver frame, subtle animations | Specialized tactics, moderately available |
| Rare | Gold frame, enhanced animations | Strategic options, less common availability |
| Epic | Purple frame, premium animations | Powerful effects with specific conditions |
| Legendary | Red frame, full animated treatment | Game-changing abilities, highly limited |
| Mythic | Unique animated frame with cosmic effects | Transformative powers, extremely rare |
| WORM | Reality-warping animated frame | Universe-altering abilities, exceptionally scarce |

### Rarity Philosophy

The rarity system is designed with several core principles:

1. **Accessibility**: Lower-rarity cards provide all essential game mechanics
2. **Specialization**: Higher-rarity cards offer alternative strategies, not strictly superior power
3. **Collection Value**: Rarer cards have distinct visual treatments for collectability
4. **Progression Feel**: Rarity distribution creates meaningful collection milestones
5. **Balance Independence**: Competitive viability is not strictly tied to rarity

## Rarity Distribution

### Set Distribution Targets

Each standard card set follows these distribution guidelines:

| Rarity | Percentage of Set | Cards per Set (150-card base) |
|--------|------------------|------------------------------|
| Common | 40% | 60 cards |
| Uncommon | 30% | 45 cards |
| Rare | 20% | 30 cards |
| Epic | 7% | 10-11 cards |
| Legendary | 2.5% | 3-4 cards |
| Mythic | 0.5% | 1 card |
| WORM | 0% (special releases) | 0-1 per special event |

### Faction Distribution Balance

Each faction receives roughly equal distribution across rarities:

- Each faction gets approximately the same number of cards per rarity tier
- Cross-faction cards are distributed based on thematic relationships
- Neutral cards comprise approximately 10% of each rarity tier

## Pack Opening Mechanics

### Standard Pack Contents

Standard card packs contain 8 cards with the following distribution guarantee:

| Contents | Probability |
|----------|------------|
| 5 Commons | 100% |
| 2 Uncommons | 90% |
| 1 Rare+ | 100% |
| Epic replacement for any slot | 10% |
| Legendary replacement for any slot | 3% |
| Mythic replacement for any slot | 0.5% |
| WORM replacement for any slot | 0.1% (during special events) |

### Drop Rate Modifiers

These base rates are modified by several factors:

| Factor | Effect |
|--------|--------|
| Premium Packs | +50% chance for higher rarities |
| Faction-Specific Packs | Limited to single faction but +25% for higher rarities |
| Event Packs | Themed content with +20% for featured cards |
| Season Finale Packs | Guaranteed Legendary+ card |
| Duplicate Protection | Reduced chance for owned Legendaries/Mythics |

### Transparency Requirements

All pack contents and drop rates are:

- Clearly displayed in the shop
- Updated in real-time with changes
- Available via API for third-party tracking
- Compliant with regional disclosure requirements

## Acquisition Methods

### Primary Acquisition Methods

Players can acquire cards through multiple systems, each with different rarity distributions:

| Method | Common % | Uncommon % | Rare % | Epic % | Legendary % | Mythic % |
|--------|----------|------------|--------|--------|-------------|----------|
| Standard Packs | 62.5% | 25% | 9% | 3% | 0.45% | 0.05% |
| Premium Packs | 50% | 30% | 12% | 6% | 1.8% | 0.2% |
| Faction Packs | 60% | 25% | 10% | 4% | 0.9% | 0.1% |
| Draft Rewards | 70% | 20% | 7% | 2.5% | 0.45% | 0.05% |
| Achievement Rewards | 40% | 30% | 20% | 8% | 1.8% | 0.2% |
| Crafting | User-selected | User-selected | User-selected | User-selected | User-selected | User-selected |
| Battle Pass | 50% | 25% | 15% | 7% | 2.5% | 0.5% |

### Special Acquisition Methods

Certain acquisition methods have modified distributions:

| Method | Distribution Pattern | Notes |
|--------|---------------------|-------|
| New Player Bundles | Curated selection with guaranteed Rare+ | Designed for strategic introduction |
| Tournament Rewards | Higher Legendary/Mythic rates (+200%) | Competitive incentives |
| Seasonal Achievements | Guaranteed rarity progression | Reward for sustained play |
| Faction Quests | Faction-specific with guaranteed rarities | Faction identity reinforcement |
| Master Challenges | Contains Mythic cards not available elsewhere | Ultimate achievement rewards |

## Pity Systems

### Standard Pity Mechanics

To prevent extreme cases of bad luck, several pity systems are implemented:

| Pity Type | Trigger | Effect |
|-----------|---------|--------|
| Epic Pity | 10 packs without Epic | Next pack guarantees Epic+ |
| Legendary Pity | 30 packs without Legendary | Next pack guarantees Legendary |
| Mythic Pity | 90 packs without Mythic | Increased Mythic chance (+1% per pack) |
| WORM Pity | Special event dependent | Event-specific guarantees |

### Pity Counters

Pity counters function as follows:

- Separate counters for each rarity tier
- Counters reset when the guaranteed rarity is acquired
- Counter progress is viewable to players
- Different pack types share pity counters

## Seasonal and Limited Cards

### Seasonal Availability

Cards may have limited availability patterns:

| Availability Type | Duration | Return Cycle | Acquisition Methods |
|-------------------|----------|--------------|---------------------|
| Standard | Permanent | Always available | All methods |
| Seasonal | 3 months | Annual return | Season-specific methods |
| Limited | 1 month | Biannual return | Event-specific methods |
| Exclusive | 2 weeks | No scheduled return | Special promotions only |
| Legacy | No longer available | Potential reissue | Archive collections only |

### Card Rotation Schedule

The general availability timeline follows this pattern:

- New set release every 3 months
- Sets remain in standard format for 18 months
- Rotated sets move to Legacy format
- Select cards may be reissued in Core sets

## Upgrade and Downgrade Systems

### Card Transformation

Players can modify their collection through several systems:

| System | Input | Output | Cost | Limitations |
|--------|-------|--------|------|------------|
| Crafting | Resources | Specific card | Varies by rarity | Cannot craft WORM cards |
| Disenchanting | Card | Resources | 25% of crafting cost | Cannot disenchant quest rewards |
| Upgrading | Card + Resources | Higher rarity version | Varies by target rarity | Cannot upgrade to Mythic/WORM |
| Downgrading | Higher rarity card | Lower rarity + Resources | 50% of difference | Not available for all cards |
| Transmutation | Multiple cards | Random card of higher rarity | 3 cards of same rarity | Limited uses per day |

### Visual Upgrade System

Independent from rarity upgrades, visual treatments can be applied:

| Treatment | Effect | Acquisition | Transfer |
|-----------|--------|-------------|----------|
| Foil | Holographic finish | Random (10% chance) or crafting | Transferrable |
| Animated | Full art animation | Premium packs or special events | Account bound |
| Alternate Art | Different artwork | Special events or promotions | Varies by card |
| Golden | Gold-infused frame and effects | Achievement rewards | Account bound |
| Corrupted | Void-influenced visual effects | Umbral Eclipse-related events | Transferrable |
| Transcendent | Reality-warping visual treatment | Highest competitive rewards | Account bound |

## Collection Analysis

### Collection Targets

Based on distribution rates, the expected collection progress is:

| Play Period | Commons | Uncommons | Rares | Epics | Legendaries | Mythics |
|-------------|---------|-----------|-------|-------|-------------|---------|
| 1 Week | 30% | 15% | 5% | 2% | 0.5% | 0% |
| 1 Month | 90% | 60% | 30% | 15% | 5% | 0.5% |
| 3 Months | 100% | 95% | 75% | 45% | 20% | 5% |
| 6 Months | 100% | 100% | 95% | 70% | 40% | 15% |
| 1 Year | 100% | 100% | 100% | 95% | 80% | 40% |

### Free-to-Play Acquisition Rate

Free players can expect the following acquisition rate from gameplay alone:

- 1-2 packs per day through daily quests
- 5-10 additional packs per week through achievements
- 1 guaranteed Epic+ card weekly through challenges
- 1 guaranteed Legendary per month through login rewards
- Approximately 60% of all available cards per set without spending
- 90%+ of all Commons, Uncommons, and Rares per set

### Drop Rate Testing and Verification

To ensure integrity of the stated drop rates:

- Internal systems monitor actual drop rates across all accounts
- Statistical anomalies trigger automatic reviews
- Quarterly public reports show aggregated drop statistics
- Third-party verification available for compliance requirements
- Rate adjustments are announced at least 7 days before implementation

---

The card rarity and drop rate systems are designed to create a satisfying collection experience while ensuring competitive viability does not require obtaining the rarest cards. Players should feel meaningful progression regardless of spending patterns.

Last Updated: 2025-08-01
