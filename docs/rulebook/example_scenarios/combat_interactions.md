# Combat Interactions

## Overview

Combat is a central mechanic in Crisis Unleashed, and understanding how different abilities interact during the combat phase is crucial for successful play. This document provides detailed examples of various combat scenarios, highlighting key mechanics and strategic considerations.

## Basic Combat Example

### Setup

- **Player A**: Controls a Solar Guardian (2/3) with no special abilities
- **Player B**: Controls a Shadow Stalker (3/2) with no special abilities
- Both units are in the same lane

### Combat Sequence

1. **Combat Declaration**:
   - Player A (active player) declares Solar Guardian is attacking
   - Valid targets are Player B's Shadow Stalker or Player B's hero

2. **Target Selection**:
   - Player A chooses to attack Shadow Stalker

3. **Combat Resolution**:
   - Solar Guardian (2/3) deals 2 damage to Shadow Stalker (3/2)
   - Shadow Stalker (3/2) deals 3 damage to Solar Guardian (2/3) simultaneously
   - After damage: Solar Guardian is at (2/0) and Shadow Stalker is at (3/0)
   - Both units are destroyed and moved to their owners' discard piles

**Key Takeaway**: In basic combat, units deal damage to each other simultaneously, regardless of which unit is attacking.

## Combat with Abilities Example

### Setup, Abilities

- **Player A**: Controls Flame Sentinel (2/2) with "First Strike: This unit deals combat damage before the defending unit"
- **Player B**: Controls Void Drifter (3/3) with "Deathtouch: When this unit deals damage to another unit, destroy that unit"

### Combat Sequence, Abilities

1. **Combat Declaration**:
   - Player A declares Flame Sentinel is attacking

2. **Target Selection**:
   - Player A chooses to attack Void Drifter

3. **Pre-Combat Effects**:
   - No "before combat" effects trigger

4. **Combat Resolution with First Strike**:
   - First Strike allows Flame Sentinel to deal damage first
   - Flame Sentinel deals 2 damage to Void Drifter (now 3/1)
   - Void Drifter's Deathtouch doesn't trigger yet (as it hasn't dealt damage)
   - Void Drifter now deals 3 damage to Flame Sentinel (now 2/-1)
   - Void Drifter's Deathtouch would trigger, but Flame Sentinel is already destroyed by damage
   - Flame Sentinel is destroyed and moved to Player A's discard pile
   - Void Drifter remains in play with 1 Health remaining

**Key Takeaway**: First Strike fundamentally changes combat by making damage sequential rather than simultaneous, which can neutralize abilities like Deathtouch if the First Strike unit deals lethal damage.

## Multiple Attackers Example

### Setup, Multiple

- **Player A**: Controls two units in different lanes - Stellar Ranger (2/2, Rush) and Cosmic Voyager (1/3)
- **Player B**: Controls one unit - Temporal Guardian (2/4, Defender) in the same lane as Stellar Ranger

### Combat Sequence, Multiple

1. **Combat Declaration**:
   - Player A declares both Stellar Ranger and Cosmic Voyager are attacking

2. **Target Selection**:
   - For Stellar Ranger: Player A must attack Temporal Guardian (due to Defender)
   - For Cosmic Voyager: Player A chooses to attack Player B's hero directly (different lane)

3. **Combat Resolution**:
   - Stellar Ranger (2/2) and Temporal Guardian (2/4) exchange damage
   - Stellar Ranger is now (2/0) and Temporal Guardian is (2/2)
   - Stellar Ranger is destroyed
   - Cosmic Voyager (1/3) deals 1 damage to Player B's hero
   - Cosmic Voyager receives no damage (not blocked)

**Key Takeaway**: Units in different lanes attack independently, and Defender only affects attackers in the same lane.

## Combat with Lane Effects Example

### Setup, Effects

- **Player A**: Controls Solar Centurion (3/3)
- **Player B**: Controls Shadow Weaver (2/2)
- The lane they're in has an active effect: "Corrupted Zone: All units in this lane deal -1 damage"

### Combat Sequence, Effects

1. **Combat Declaration**:
   - Player A declares Solar Centurion is attacking

2. **Target Selection**:
   - Player A chooses to attack Shadow Weaver

3. **Combat Resolution with Zone Effect**:
   - Lane effect modifies damage: Both units deal -1 damage
   - Solar Centurion deals 2 damage (3-1) to Shadow Weaver
   - Shadow Weaver deals 1 damage (2-1) to Solar Centurion
   - After damage: Solar Centurion is at (3/2) and Shadow Weaver is at (2/0)
   - Shadow Weaver is destroyed, Solar Centurion survives

**Key Takeaway**: Lane effects modify the fundamental combat math and should be factored into attack decisions.

## Combat with Quick Effects Example

### Setup, Quick

- **Player A**: Controls Flame Adept (2/2) and has Combat Trick (Action: "Give target unit +2/+0 until end of turn") in hand
- **Player B**: Controls Ice Behemoth (4/4) and has Frost Shield (Quick Effect: "Prevent the next 2 damage that would be dealt to target unit") in hand

### Combat Sequence, Quick

1. **Combat Declaration**:
   - Player A declares Flame Adept is attacking

2. **Target Selection**:
   - Player A chooses to attack Ice Behemoth

3. **Pre-Combat Window**:
   - Player A casts Combat Trick targeting Flame Adept
   - Flame Adept becomes 4/2 temporarily

4. **Response Window**:
   - Player B responds with Frost Shield targeting Ice Behemoth
   - A prevention shield is created that will prevent the next 2 damage

5. **Combat Resolution**:
   - Flame Adept (4/2) attacks Ice Behemoth (4/4)
   - Frost Shield prevents 2 of the 4 damage, so Ice Behemoth takes only 2 damage
   - Ice Behemoth is now (4/2)
   - Ice Behemoth deals 4 damage to Flame Adept
   - Flame Adept is now (4/-2) and is destroyed

**Key Takeaway**: Combat provides multiple windows for Quick Effects, and timing these correctly can dramatically change outcomes.

## Evasion Abilities Example

### Setup, Evasion

- **Player A**: Controls Ethereal Scout (2/1, "Elusive: This unit can only be blocked by units with Elusive or Detector")
- **Player B**: Controls Stone Guardian (3/4) and Void Sensor (1/2, "Detector: This unit can block units with Elusive")

### Combat Sequence, Evasion

1. **Combat Declaration**:
   - Player A declares Ethereal Scout is attacking

2. **Target Selection**:
   - Player A chooses to attack Player B's hero

3. **Blocking Decision**:
   - Player B can only block with Void Sensor (due to Detector)
   - Player B chooses to block with Void Sensor

4. **Combat Resolution**:
   - Ethereal Scout (2/1) deals 2 damage to Void Sensor (1/2)
   - Void Sensor deals 1 damage to Ethereal Scout
   - After damage: Ethereal Scout is at (2/0) and Void Sensor is at (1/0)
   - Both units are destroyed

**Key Takeaway**: Evasion abilities restrict blocking options, but counter-abilities like Detector provide counterplay.

## Special Attack Abilities Example

### Setup, Special

- **Player A**: Controls Supernova Dragon (4/4, "Massive: This unit deals excess combat damage to the enemy hero")
- **Player B**: Controls Crystal Shield (1/3, "When this unit is destroyed, prevent the next 2 damage that would be dealt to your hero")

### Combat Sequence, Special

1. **Combat Declaration**:
   - Player A declares Supernova Dragon is attacking

2. **Target Selection**:
   - Player A chooses to attack Crystal Shield

3. **Combat Resolution**:
   - Supernova Dragon (4/4) deals 4 damage to Crystal Shield (1/3)
   - Crystal Shield is destroyed (taking 3 damage)
   - Massive ability causes 1 excess damage to be dealt to Player B's hero
   - Crystal Shield's death trigger creates a shield that prevents the next 2 damage to Player B's hero
   - The 1 excess damage is prevented by the shield (1 of 2 prevention remains)
   - Crystal Shield deals 1 damage to Supernova Dragon (now 4/3)

**Key Takeaway**: Death triggers can resolve fast enough to affect the outcome of the same combat that caused the death.

## Multi-Stage Combat Example

### Setup, Multi-Stage

- **Player A**: Controls Quantum Shifter (2/3, "After this unit attacks, it may attack again")
- **Player B**: Controls two units: Temporal Fragment (1/1) and Reality Shard (2/2)

### Combat Sequence, Multi-Stage

1. **First Attack Declaration**:
   - Player A declares Quantum Shifter is attacking

2. **First Target Selection**:
   - Player A chooses to attack Temporal Fragment

3. **First Combat Resolution**:
   - Quantum Shifter (2/3) deals 2 damage to Temporal Fragment (1/1)
   - Temporal Fragment is destroyed
   - Temporal Fragment deals 1 damage to Quantum Shifter (now 2/2)
   - Quantum Shifter's ability triggers, allowing it to attack again

4. **Second Attack Declaration**:
   - Player A declares Quantum Shifter's second attack

5. **Second Target Selection**:
   - Player A chooses to attack Reality Shard

6. **Second Combat Resolution**:
   - Quantum Shifter (2/2) deals 2 damage to Reality Shard (2/2)
   - Reality Shard deals 2 damage to Quantum Shifter (2/0)
   - Both units are destroyed

**Key Takeaway**: Some abilities allow for sequential attacks within a single combat phase, enabling multiple combats with the same unit.

## Combat Phase Strategy Tips

### Sequencing Attacks

When attacking with multiple units, sequence matters:

- Attack with units that have on-attack triggers first
- Use expendable units to clear the way for your more valuable attackers
- Force the opponent to make blocking decisions with incomplete information

### Baiting Responses

Creating combat situations that force the opponent to use Quick Effects suboptimally:

- Attack with a less valuable unit first to bait out defensive effects
- Hold back your combat tricks until the opponent has committed their responses
- Create "no-win" scenarios where any blocking configuration is disadvantageous

### Combat Math

Always calculate potential outcomes before attacking:

- Consider not just the immediate combat, but the post-combat board state
- Factor in potential Quick Effects from both players
- Remember that sometimes not attacking is the correct play

### Lane Management

Strategic positioning can create advantageous combat scenarios:

- Place units with Defender in lanes you want to protect
- Position evasive units in lanes without blockers
- Use lane effects to your advantage in combat decisions

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*
