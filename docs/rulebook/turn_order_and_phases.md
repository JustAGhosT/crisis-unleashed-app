# Turn Order and Phases

## Overview

Crisis Unleashed uses a structured turn sequence that gives players clear opportunities to deploy cards, activate abilities, and engage in combat. Understanding the turn order and phases is essential for planning your strategy and maximizing your plays.

This document outlines the complete turn structure, special actions that can be taken during each phase, and timing rules for resolving complex interactions.

## Basic Turn Structure

Each player's turn consists of six distinct phases:

1. **Startup Phase**
2. **Draw Phase**
3. **Energy Phase**
4. **Main Phase**
5. **Combat Phase**
6. **End Phase**

Players complete their entire turn sequence before passing to the opponent. A full game round consists of both players taking one complete turn.

## Detailed Phase Breakdown

### 1. Startup Phase

The Startup Phase handles all effects that trigger "at the start of turn" and prepares your board for the upcoming turn.

**Sequence:**

1. **Countdown Reduction**: Reduce all countdown effects by 1 (Dormant status, Delay counters, etc.)
2. **Start of Turn Triggers**: Resolve all "at the start of your turn" effects in order of play
3. **Status Effect Updates**: Update any recurring status effects
4. **Eclipse Check**: Check if an Eclipse is beginning or ending this turn
5. **Quantum Flux Update**: Increment or update Quantum Flux counters if relevant

**Special Rules:**

- If multiple "start of turn" effects trigger simultaneously, the active player chooses the order
- Any unit that becomes unfrozen during this phase can still act during the current turn
- Dormant heroes that reach 0 counters become available for play this turn

### 2. Draw Phase

The Draw Phase refreshes your hand with new options for the turn.

**Sequence:**

1. **Standard Draw**: Draw 1 card from your deck
2. **Bonus Draw**: Resolve any "draw additional cards" effects
3. **Hand Size Check**: If you have more than 7 cards, discard down to 7
4. **Deck Check**: If your deck is empty, take 2 damage per card you would draw

**Special Rules:**

- First player draws only 1 card on their first turn, instead of the usual draw
- Some Card Abilities with the "Insight" keyword can be activated during the Draw Phase
- Eclipse effects may modify draw amounts (Dark Eclipse: +1 card, Solar Eclipse: -1 card)

### 3. Energy Phase

The Energy Phase provides resources for playing cards and activating abilities.

**Sequence:**

1. **Base Energy Gain**: Gain Energy Crystals based on the current turn number:
   - Turn 1: 1 Energy
   - Turn 2: 2 Energy
   - Turn 3: 3 Energy
   - Turn 4+: 4 Energy
2. **Bonus Energy**: Add any additional Energy from effects or abilities
3. **Energy Cap**: Energy can't exceed 10 (excess is lost)
4. **Momentum Generation**: Heroes generate 1 Momentum (used for Hero abilities)

**Special Rules:**

- Unspent Energy does not carry over between turns
- Certain Crisis Events may modify energy gain
- Quantum flux can provide bonus energy at specific thresholds
- Corrupted zones provide reduced energy (-1) when active

### 4. Main Phase

The Main Phase is the primary action phase where you deploy units, play action cards, and activate most abilities.

**Sequence:**
No fixed sequence in this phase. You may perform any of these actions in any order:

- **Play Cards** from your hand (Units, Actions, Conditions)
- **Activate Abilities** on cards in play
- **Use Hero Powers** by spending Momentum
- **Activate Field Effects** that you control
- **Trigger Quantum Events** if requirements are met

**Playing Limitations:**

- You can only play cards you have sufficient Energy for
- Units can only be placed in valid zones
- Hero Powers require sufficient Momentum to activate
- Some abilities can only activate once per turn

**Special Timing Rules:**

- After each card is played or ability activated, both players get a chance to respond with Quick Effects
- The opponent's Quick Effects resolve first, then the active player's
- A new action can't begin until all responses to the previous action are resolved

### 5. Combat Phase

The Combat Phase is where units attack each other and the opposing hero.

**Sequence:**

1. **Combat Declaration**: Active player declares which units will attack
2. **Target Selection**: For each attacking unit, select a valid target
3. **Pre-Combat Effects**: Resolve effects that trigger "before combat"
4. **Combat Resolution**: Resolve each attack one at a time in the order chosen
   - Attacking unit deals damage equal to its Attack value
   - Defending unit deals damage equal to its Attack value simultaneously (if blocking)
   - Apply any combat-related effects
5. **Post-Combat Effects**: Resolve effects that trigger "after combat"
6. **Death Resolution**: Remove any units with 0 or less Health

**Special Rules:**

- Units can only attack once per turn unless they have Swiftness
- Units with Defender must be attacked first if in the same lane
- Units can't attack the turn they are played unless they have Rush
- Some abilities can trigger during combat (marked with the Combat icon)

### 6. End Phase

The End Phase resolves final effects and prepares for the opponent's turn.

**Sequence:**

1. **End of Turn Triggers**: Resolve all "at the end of your turn" effects in order of play
2. **Condition Duration**: Reduce duration counters on temporary Condition cards by 1
3. **Status Clearing**: Remove temporary status effects that expire at end of turn
4. **Buff/Debuff Updates**: Reduce duration of temporary buffs/debuffs by 1
5. **Final Death Resolution**: Remove any units with 0 or less Health
6. **Cleanup**: Resolve any final cleanup effects

**Special Rules:**

- If multiple "end of turn" effects trigger simultaneously, the active player chooses the order
- Glitch effects have a chance to trigger during the End Phase (based on Corruption level)
- Some effects specifically trigger "after the End Phase" (these resolve after all End Phase steps)

## Special Turn Conditions

### First Turn Rules

The player who goes first has these restrictions:

- Cannot attack with units on the first turn
- Draws only 1 card during their first Draw Phase
- Cannot play Heroic cards (this restriction is part of card balancing)

### Eclipse Turn Rules

During Solar or Dark Eclipse turns:

- Energy gain is affected (+1 or -1)
- Certain faction-specific abilities are enhanced
- Eclipse-specific cards can be played
- Some Heroes may transform or gain special powers

### Crisis Event Turns

When a Crisis Event card activates:

- Special rules apply for that turn as specified on the Crisis Event card
- Turn order may be temporarily altered
- Additional phases may be added
- Certain actions may be restricted

### Quantum Flux Turns

When Quantum Flux reaches critical levels:

- Reality-altering effects occur at the start of the turn
- The game board may be reconfigured
- Heroic abilities may transform
- New win conditions may become available

## Passing Priority and Responses

Crisis Unleashed uses a priority system to determine when players can respond to actions:

1. **Active Player Priority**: The active player can take an action
2. **Response Window**: The non-active player can respond with Quick Effects
3. **Active Player Response**: The active player can respond with their own Quick Effects
4. **Resolution**: All effects resolve in reverse order (last played, first resolved)
5. **Priority Returns**: Priority returns to the active player to take a new action

### Quick Effect Timing

Quick Effects are cards or abilities that can be played outside the normal timing restrictions. They are indicated by the ⚡ symbol and include:

- **Counters**: Cancel an opponent's card or ability
- **Guards**: Prevent an attack or effect
- **Instants**: Immediate effects that can be played reactively
- **Interrupts**: Change the target or nature of an ability

## Advanced Timing Rules

### Chain Resolution

When multiple effects trigger at once, they form a Chain:

1. All trigger effects go on the Chain in the order they would resolve
2. Players can add Quick Effects to the Chain in priority order
3. The Chain resolves from last added to first added (LIFO - Last In, First Out)

### Simultaneous Effects

If multiple effects would happen simultaneously:

- The active player's effects go on the Chain first
- Within each player's effects, the player chooses the order
- Status effects resolve before other effects

### Replacement Effects

Some effects replace one event with another:

- Only one replacement effect can apply to any single event
- If multiple could apply, the controller of the affected card chooses which applies
- Replacement effects use the text "instead" or "rather than"

## Special Turn Types

### Nexus Turn

A rare special turn that occurs when certain cosmic conditions are met:

- Both players take actions simultaneously
- Energy cost for all cards is reduced by 1
- All Heroes gain +1 Momentum
- Quantum effects are doubled

### Void Turn

A special turn that occurs when reality becomes unstable:

- No cards can be played
- Only Hero Powers can be activated
- All units take 1 damage at the start of the turn
- Glitch effects trigger at double rate

## Turn Order Quick Reference

| Phase | Key Actions | Timing Notes |
|-------|------------|--------------|
| Startup | Reduce countdowns, "Start of turn" effects | Consistent order of operations is important |
| Draw | Draw cards, check hand size | First player draws only 1 card on first turn |
| Energy | Gain Energy, generate Momentum | Energy values scale with turn number |
| Main | Play cards, activate abilities | Most of your actions happen here |
| Combat | Attack with units | Units can't attack on the turn they're played (unless Rush) |
| End | "End of turn" effects, cleanup | Final chance for actions before turn passes |

## Example Turn Sequence

**Player A - Turn 1:**

1. **Startup Phase**: No effects yet (first turn)
2. **Draw Phase**: Draw 1 card (first turn rule)
3. **Energy Phase**: Gain 1 Energy
4. **Main Phase**: Play a 1-cost unit
5. **Combat Phase**: No combat (first turn rule)
6. **End Phase**: No end-of-turn effects yet

**Player B - Turn 1:**

1. **Startup Phase**: No effects yet
2. **Draw Phase**: Draw 1 card
3. **Energy Phase**: Gain 1 Energy
4. **Main Phase**: Play a 1-cost unit
5. **Combat Phase**: No combat (unit has summoning sickness)
6. **End Phase**: No end-of-turn effects

**Player A - Turn 2:**

1. **Startup Phase**: Resolve any start-of-turn triggers
2. **Draw Phase**: Draw 1 card
3. **Energy Phase**: Gain 2 Energy
4. **Main Phase**: Play a 2-cost action, activate Hero ability
5. **Combat Phase**: Attack with first-turn unit
6. **End Phase**: Resolve any end-of-turn effects

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*
