# Echo Heroes: Activation Mechanics Guide

## Overview

Echo Heroes are a specialized hero type that exist in a liminal state between life and death. Unlike True Heroes who remain on the battlefield permanently or Dual Heroes who transform between forms, Echo Heroes can cycle between the battlefield, your hand, and various dormant states, representing their ephemeral nature.

This document details the core mechanics of Echo Heroes, their activation conditions, and strategic applications.

## Core Echo Mechanics

### Echo State Cycle

Echo Heroes follow a specific cycle:

``` text
Active (Battlefield) → Death Trigger → Echo Effect → Hand/Deck → Dormant → Ready → Active
```

1. **Active State**: Echo Hero is on the battlefield
2. **Death Trigger**: When the Echo Hero would normally die
3. **Echo Effect**: Special effect that triggers instead of death
4. **Return**: Hero returns to hand or deck (depending on hero)
5. **Dormant**: Hero cannot be played for X turns (specified on card)
6. **Ready**: Hero can be played again, usually with modified stats

### Echo Death Trigger

When an Echo Hero would die:

- The death is prevented
- The Hero's Echo effect activates
- The Hero gains a stat modification (usually +1/+1 or -1/-1)
- The Hero returns to your hand or deck with a "Dormant" status
- "Dormant" prevents the Hero from being played for X turns (varies by Hero)

## Echo Activation Requirements

Each Echo Hero has specific conditions that must be met to trigger their Echo effect:

### Standard Activation Types

| Activation Type | Trigger Condition | Example Heroes |
|-----------------|-------------------|----------------|
| Last Stand | First time the Hero would die each game | Aurex the Silent Star, Ashen Seraph |
| Cycle | Every time the Hero would die | The Anachronite, Druthar, Crown of Moss |
| Conditional | Only when specific conditions are met | Lady of the Veil, Nexus Prime |

### Advanced Activation

Some Echo Heroes have additional requirements:

- **Multiple Returns**: Can return X times before truly dying
- **Stat Degradation**: Return with -1/-1 each cycle
- **Stat Enhancement**: Return with +1/+1 each cycle
- **Specific Board State**: Only return if certain conditions are met
- **Eclipse Effect**: Special effect when returned during an Eclipse phase

## Dormant Status

The Dormant status represents the Echo Hero reconstituting their form after death:

- A Dormant hero cannot be played for the specified number of turns
- Dormant status cannot be removed by normal cleanse/dispel effects
- Dormant status is visible to both players
- Dormant countdown decreases at the start of your turn
- When Dormant reaches 0, the hero becomes playable again
- Dormant status appears as a greyed-out card with a countdown timer

## Strategic Applications

### Key Hero Examples

#### Aurex the Silent Star (Solaris Nexus)

- **Echo Type**: Last Stand
- **Trigger**: When Aurex would be defeated
- **Effect**: Return to deck with +2/+2
- **Special**: If triggered during an eclipse, return to play instead with +1/+1
- **Strategy**: Best saved for crucial game moments when immediate resurrection is needed

#### The Anachronite (Aeonic Dominion)

- **Echo Type**: Cycle
- **Trigger**: When The Anachronite would die
- **Effect**: Return to hand with -1/-1 and Dormant for 2 turns
- **Strategy**: Useful for repeating the Memory Echo ability, though gets weaker with each cycle

#### Lady of the Veil (Umbral Eclipse)

- **Echo Type**: Conditional
- **Trigger**: When the Lady would die
- **Effect**: Become Invisible and return to hand with +1/+1
- **Strategy**: Combines with Invisible mechanic to create a persistently elusive threat

### Building Around Echo Heroes

1. **Resurrection Synergies**: Cards that reduce Dormant status duration
2. **Protection Effects**: Shield/Immunity to preserve your Echo after returning
3. **Buff Enhancement**: Effects that amplify the stat bonuses gained from Echo returns
4. **Activation Acceleration**: Effects that allow you to trigger Echo effects manually

### Countering Echo Heroes

1. **Silence**: Prevents Echo effect from triggering if applied before death
2. **Transform**: Changing an Echo Hero into another unit bypasses Echo effect
3. **Banish**: Removing from game rather than killing bypasses Echo effect
4. **Deck Disruption**: Targeting Echo Heroes that return to deck
5. **Hand Disruption**: Forcing discard of Echo Heroes that return to hand

## Echo Interactions with Game Mechanics

### Death Effects

- Echo Heroes don't trigger "When a unit dies" effects (since they don't actually die)
- However, they do count as "leaving play"

### Buffs and Debuffs

- Buffs and debuffs are cleared when Echo Heroes return to hand/deck
- Stat modifications from the Echo effect (+1/+1, -1/-1, etc.) are maintained

### Card Counting

- Echo Heroes that return to deck shuffle themselves in
- This can disrupt deck tracking and counting strategies

### Hand Size Limits

- Echo Heroes that return to hand count toward your hand limit
- If your hand is full, the Echo Hero is discarded instead

## Advanced Echo Tactics

### Echo Chaining

By carefully timing multiple Echo Hero returns, you can create powerful swing turns where multiple Echo Heroes reappear simultaneously.

### Echo Stat Enhancement

Some card effects can enhance the stat modifications of Echo Heroes:

- "Double all stat changes" effects
- "Convert negative stats to positive" effects

### Echo Reset Effects

Specialized cards can reset an Echo Hero to their base state, removing negative stat modifications from multiple cycles.

### Dormant Manipulation

Advanced effects can manipulate the Dormant status:

- Decrease Dormant countdown
- Skip Dormant status entirely
- Apply Dormant to enemy units

---

## Reference Table: All Echo Heroes

| Hero | Faction | Echo Effect | Stat Change | Dormant Duration | Special Conditions |
|------|---------|-------------|-------------|------------------|---------------------|
| Aurex the Silent Star | Solaris Nexus | Return to deck | +2/+2 | None | During Eclipse: Return to play with +1/+1 |
| Lady of the Veil | Umbral Eclipse | Return to hand | +1/+1 | None | Requires becoming Visible first |
| The Anachronite | Aeonic Dominion | Return to hand | -1/-1 | 2 turns | None |
| Druthar, Crown of Moss | Primordial Genesis | Return to hand | -1/-1 | 2 turns | Requires Awakening first |
| Ashen Seraph | Infernal Core | Return to hand | No change | 1 turn | Once per game only |
| Nexus Prime | Neuralis Conclave | Return to hand | No change | 1 turn | Can't be destroyed while you control another unit |
| Glitch.Protocol | Synthetic Directive | Return to deck | +1/+1 | None | Gets corrupted after 3 returns |

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*
