# Card Interaction Rules and Timing

## Priority and Timing Fundamentals

### Action Speed

Cards and abilities resolve according to their speed classification:

1. **Instant** - Resolves immediately, can interrupt other actions
2. **Standard** - Resolves in sequence following normal turn order
3. **Delayed** - Resolves after a specified delay (turns, triggers, etc.)

### Turn Phases

Each turn consists of the following phases, and timing rules apply within each:

1. **Preparation Phase**
   - Energy crystals refresh
   - Card draw occurs
   - Start-of-turn effects trigger

2. **Action Phase**
   - Units can be deployed
   - Actions can be played
   - Unit abilities can be activated

3. **Combat Phase**
   - Attack declarations
   - Defense declarations
   - Combat damage resolution

4. **Resolution Phase**
   - End-of-turn effects trigger
   - Delayed effects advance their timers
   - Cleanup of temporary effects

## Priority Rules

### The Stack System

Crisis Unleashed uses a stack system for resolving actions:

1. Actions and abilities go on the stack when played/activated
2. Players can respond with Instant-speed cards or abilities
3. The stack resolves in last-in, first-out (LIFO) order
4. Once both players pass priority without adding to the stack, resolution begins

### Priority Sequence
 
1. Active player receives priority first in each phase
2. After each action resolves, active player regains priority
3. Priority passes to opponent when active player passes
4. Phase advances when both players pass in succession with empty stack

## Special Interactions

### Simultaneous Effects

When multiple effects would occur simultaneously:

1. Active player's effects resolve first
2. If all effects belong to the same player, that player chooses the order
3. Mandatory effects resolve before optional effects
4. "When" effects resolve before "Whenever" effects

### Replacement Effects

Effects that replace one event with another:

1. Only one replacement effect can apply to any single event
2. Card controller chooses which replacement effect to apply if multiple are applicable
3. Replacement effects do not use the stack and cannot be responded to

### Prevention Effects

Effects that prevent an event from occurring:

1. Prevention shields last until used or until their duration expires
2. Multiple prevention effects apply in the order they were created
3. Partial prevention is possible (e.g., prevent 3 damage from a 5-damage attack)

## Faction-Specific Timing Rules

### Aeonic Dominion
Time manipulation abilities have special priority and can modify the normal timing rules. These always resolve before standard timing mechanisms.

### Synthetic Directive
Networked abilities can chain together in a single priority window, counting as a single action for response purposes.

### Solaris Nexus
Divine Algorithm cards can preemptively counter actions before they fully resolve, bypassing normal stack resolution.

## Keywords and Timing

### Trigger Windows

- **Bless** effects apply immediately and cannot be responded to
- **Corrupt** effects apply immediately but can be cleansed before damage occurs
- **Spawn** creates units that are treated as having been in play since the turn began
- **Delay** creates a countdown that advances at the end of each turn

### State-Based Effects

The game continuously checks for these conditions and applies them automatically:

1. Units with 0 health are destroyed
2. Players with 0 health lose the game
3. Card limits (hand size, board presence) are enforced
4. Status effects with expired duration are removed

## Conflict Resolution

When card texts directly contradict each other:

1. Card text always overrides basic game rules
2. More specific effects take precedence over general effects
3. Newer effects (played later) override contradictory older effects
4. If still unresolved, the higher rarity card takes precedence

*For detailed examples of complex interactions, see the Advanced Rulings Compendium.*