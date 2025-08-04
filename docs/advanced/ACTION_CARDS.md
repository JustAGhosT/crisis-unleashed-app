# Action Card System

## Overview

Action Cards are powerful, one-time effects that can change the course of battle. They provide tactical flexibility and combo potential.

## Card Types

### 1. Instant Spells

- **Timing**: Can be played during any phase
- **Effect**: Immediate one-time effect
- **Example**: "Deal 2 damage to a unit"

### 2. Equipment

- **Attach** to a unit to modify its stats/abilities
- **Destroyed** when the unit dies
- **Example**: "Give a unit +2 Attack and Lifesteal"

### 3. Field Effects

- **Duration**: Lasts until end of turn/round
- **Affects**: All units in specified lanes
- **Example**: "All units in the Front Lane gain +1 Attack"

## Card Anatomy

```text
[Card Name] (Cost)
[Type Icon] [Faction]

[Effect Text]
[Flavor Text]
```

## Design Guidelines

### Cost Balance

- **Basic Effect**: 1 Power per 2 stat points or equivalent effect
- **Additional Effects**: +1 Power per significant modifier
- **Drawbacks**: Reduce cost for negative effects

### Keywords

- **Quick**: Can be played outside your turn
- **Echo**: Returns to hand after resolving (costs 1 more)
- **Overload**: Can't play another Action next turn

## Example Cards

### Common

```text
Fireball (2)
[Fire Icon] [Mage]
Deal 3 damage to a unit.
"Watch it burn!"
```

### Rare

```text
Time Warp (4)
[Time Icon] [Celestial]
Take another turn after this one.
Overload
"The sands of time bend to my will."
```

## Integration with Other Systems

### Synergy with Hero Abilities

- Some Heroes reduce Action card costs
- Certain ultimates interact with played Actions

### Crisis Card Interactions

- Some Crisis Cards modify Action effects
- Example: During "Mana Surge," all Actions cost 1 less
