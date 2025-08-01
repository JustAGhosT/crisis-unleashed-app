# Keyword Interactions

## Overview

Keywords in Crisis Unleashed represent standardized game mechanics that appear on multiple cards. Understanding how these keywords interact with each other and with status effects is crucial for mastering gameplay. This document details the rules governing these interactions.

## Core Keyword Types

Keywords in Crisis Unleashed fall into the following categories:

1. **Abilities**: Keywords that grant specific capabilities to units (Rush, Defender, Elusive)
2. **Triggers**: Keywords that activate under specific conditions (Spawn, Delay, Sacrifice)
3. **States**: Keywords that define ongoing properties (Bless, Corrupt, Transcend)
4. **Actions**: Keywords that define specific play patterns (Mindlink, Psychic Field)

## Keyword-Keyword Interactions

### Combat Keywords

| Keyword 1     | Keyword 2    | Interaction Result                                    |
|---------------|--------------|------------------------------------------------------|
| Rush          | Defender     | Unit with Rush can attack a Defender immediately     |
| First Strike  | Swiftness    | Both apply; unit strikes first and can attack twice  |
| Overwhelm     | Defender     | Overwhelm damage affects hero even against Defender  |
| Elusive       | Detector     | Detector negates Elusive, allowing normal targeting  |
| Ranged        | Intercept    | Intercept can block Ranged attacks against hero      |
| Guard         | Overwhelm    | Guard blocks all damage, including Overwhelm         |
| Ambush        | Vigilant     | Vigilant units can counter-attack Ambush units       |
| First Strike  | Counter      | First Strike unit deals damage before Counter activates |

``` text
┌─────────────────────────────────────────────────────┐
│                COMBAT KEYWORD DIAGRAM                │
│                                                     │
│  ┌──────────┐     counters     ┌──────────────┐     │
│  │ Elusive  │◄─────────────────┤  Detector    │     │
│  └──────────┘                  └──────────────┘     │
│                                                     │
│  ┌──────────┐     strengthens  ┌──────────────┐     │
│  │First Strike│◄────────────────┤  Swiftness   │     │
│  └──────────┘                  └──────────────┘     │
│                                                     │
│  ┌──────────┐     counters     ┌──────────────┐     │
│  │ Defender │◄─────────────────┤  Overwhelm   │     │
│  └──────────┘                  └──────────────┘     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Trigger Keywords

| Keyword 1     | Keyword 2    | Interaction Result                                    |
|---------------|--------------|------------------------------------------------------|
| Spawn         | Delay        | Both trigger in order: Spawn then Delay               |
| Sacrifice     | Enduring     | Enduring prevents the first Sacrifice from destroying the unit |
| Spawn         | Counterspell | Counterspell can negate Spawn effects if cast in response |
| Reactive      | Trigger      | Reactive effects can trigger during Trigger resolution |
| Delay         | Accelerate   | Accelerate reduces Delay countdown by the specified amount |
| Chain         | Replicate    | Chain effects can be Replicated, creating multiple chains |
| Evolve        | Devolve      | Effects cancel each other out in a one-to-one ratio   |
| Last Stand    | Silence      | Silence prevents Last Stand from triggering           |

``` text
┌─────────────────────────────────────────────────────┐
│               TRIGGER KEYWORD DIAGRAM                │
│                                                     │
│      ┌────────┐                  ┌────────┐         │
│      │ Spawn  │                  │ Delay  │         │
│      └───┬────┘                  └────┬───┘         │
│          │                            │             │
│          │         ┌────────┐         │             │
│          └────────►│Sequence├◄────────┘             │
│                    └────────┘                       │
│                                                     │
│      ┌────────┐      cancels     ┌────────┐         │
│      │ Evolve │◄────────────────►│ Devolve│         │
│      └────────┘                  └────────┘         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### State Keywords

| Keyword 1     | Keyword 2    | Interaction Result                                    |
|---------------|--------------|------------------------------------------------------|
| Blessed       | Corrupted    | Both states remain active with their separate effects |
| Transcend     | Devolve      | Transcend is paused while Devolve is active          |
| Armored       | Penetrate    | Penetrate ignores Armored protection                 |
| Unstable      | Stabilize    | Stabilize removes Unstable state                     |
| Charged       | Discharged   | States cancel each other; the most recent applies    |
| Phasing       | Anchored     | Anchored prevents Phasing from activating            |
| Enraged       | Pacify       | Pacify removes Enraged state and prevents its application |
| Ethereal      | Magnetize    | Ethereal units can still be pulled by Magnetize      |

``` text
┌─────────────────────────────────────────────────────┐
│                STATE KEYWORD DIAGRAM                 │
│                                                     │
│  ┌──────────┐                  ┌──────────────┐     │
│  │ Blessed  │─ ─ ─ ─ ─ ─ ─ ─ ─ ┤  Corrupted   │     │
│  └──────────┘   coexist        └──────────────┘     │
│                                                     │
│  ┌──────────┐     cancels      ┌──────────────┐     │
│  │ Charged  │◄────────────────►│  Discharged  │     │
│  └──────────┘                  └──────────────┘     │
│                                                     │
│  ┌──────────┐     prevents     ┌──────────────┐     │
│  │ Anchored │─────────────────►│  Phasing     │     │
│  └──────────┘                  └──────────────┘     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Action Keywords

| Keyword 1     | Keyword 2    | Interaction Result                                    |
|---------------|--------------|------------------------------------------------------|
| Mindlink      | Psychic Field| Mindlinked units in a Psychic Field gain double effects |
| Forge         | Recycle      | Forge can use Recycled components as inputs           |
| Transmute     | Crystallize  | Units can be Transmuted after Crystallization         |
| Replicate     | Unique       | Unique keyword prevents Replication                   |
| Splice        | Purify       | Purify removes all Spliced genetic modifications      |
| Terraform     | Corrupt      | Corrupted areas cannot be Terraformed                 |
| Network       | Isolate      | Isolated units are removed from the Network           |
| Quantum Shift | Stabilize    | Stabilize prevents random elements of Quantum Shift   |

## Keyword and Status Effect Interactions

### Ability Keywords vs. Status Effects

| Keyword       | Status Effect | Interaction Result                                 |
|---------------|---------------|----------------------------------------------------|
| Rush          | Stunned       | Stunned negates Rush until removed                 |
| Defender      | Weakened      | Unit remains a Defender even when Weakened         |
| First Strike  | Frozen        | Frozen prevents First Strike from functioning      |
| Elusive       | Mindlinked    | Mindlinked units share Elusive property            |
| Overwhelm     | Protected     | Protected blocks first instance of Overwhelm damage |
| Regenerate    | Decaying      | Regeneration and Decay cancel each other out       |
| Venomous      | Empowered     | Empowered increases Venom damage by +1             |
| Lifesteal     | Corrupted     | Corrupted units still provide Lifesteal healing    |

### Trigger Keywords vs. Status Effects

| Keyword       | Status Effect | Interaction Result                                 |
|---------------|---------------|----------------------------------------------------|
| Spawn         | Silenced      | Silenced prevents Spawn effects from triggering    |
| Sacrifice     | Transcending  | Transcending units can still be Sacrificed         |
| Reactive      | Stunned       | Stunned prevents Reactive abilities                |
| Delay         | Quantum Flux  | Quantum Flux can randomly change Delay countdown   |
| Evolve        | Corrupted     | Corrupted units can still Evolve, but take damage  |
| Chain         | Glitched      | Glitched units have a 50% chance to break chains   |
| Resurrect     | Decaying      | Resurrected units can return with Decay            |
| Last Stand    | Weakened      | Last Stand can trigger even when unit is Weakened  |

### State Keywords vs. Status Effects

| Keyword       | Status Effect | Interaction Result                                 |
|---------------|---------------|----------------------------------------------------|
| Blessed       | Blessed       | Keywords and status effects stack additively       |
| Armored       | Vulnerable    | Armored and Vulnerable offset each other           |
| Unstable      | Phased        | Phased unstable units cannot explode               |
| Charged       | Charged       | Effects combine for additional energy reduction    |
| Enraged       | Empowered     | Effects combine for greater stat bonuses           |
| Ethereal      | Stunned       | Stunned ethereal units still cannot be targeted    |
| Transcend     | Corrupted     | Corruption slows Transcendence progress            |
| Toxic         | Protected     | Protected blocks the first Toxic damage instance   |

### Action Keywords vs. Status Effects

| Keyword       | Status Effect | Interaction Result                                 |
|---------------|---------------|----------------------------------------------------|
| Mindlink      | Protected     | Protection is shared between Mindlinked units      |
| Forge         | Glitched      | Glitched units create unpredictable Forge results  |
| Transmute     | Frozen        | Frozen units cannot be Transmuted                  |
| Replicate     | Empowered     | Empowered status is included in Replication        |
| Splice        | Evolved       | Evolved units gain enhanced Splice results         |
| Terraform     | Quantum Flux  | Terraformed areas can be altered by Quantum Flux   |
| Network       | Corrupted     | Corrupted units spread corruption through Network  |
| Quantum Shift | Mindlinked    | Mindlinked units shift to the same random state    |

## Keyword Timing and Priority

When multiple keywords would trigger simultaneously, follow this resolution order:

1. **Prevention Keywords**: Keywords that prevent effects (Counterspell, Negate)
2. **Replacement Keywords**: Keywords that replace one effect with another (Redirect, Transform)
3. **Reaction Keywords**: Keywords that react to events (Reactive, Vengeful)
4. **Trigger Keywords**: Keywords with standard triggers (Spawn, Delay)

If multiple keywords are in the same category, the active player's effects resolve first, then the opponent's.

## Faction-Specific Keyword Interactions

Each faction has unique keyword interactions that define their gameplay style:

### Solaris Nexus

- **Bless + Radiance**: Blessed units with Radiance affect adjacent units
- **Solar Flare + Burn**: Creates persistent burning effects that spread

### Umbral Eclipse

- **Shadow Step + Elusive**: Can move through occupied lanes while Elusive
- **Corrupt + Drain**: Corrupted units with Drain steal both health and energy

### Aeonic Dominion

- **Time Shift + Delay**: Can manipulate Delay countdowns precisely
- **Paradox + Quantum Flux**: Can choose the outcome of Quantum Flux effects

### Primordial Genesis

- **Evolve + Adapt**: Evolution paths can change based on game state
- **Terraform + Nurture**: Creates exponentially growing Nurture effects

### Infernal Core

- **Sacrifice + Vengeance**: Sacrificed units trigger powerful Vengeance effects
- **Immolate + Charged**: Charged units release energy when Immolated

### Neuralis Conclave

- **Mindlink + Psychic Field**: Creates compounding mental synergy effects
- **Telepathy + Implant**: Can place Implants remotely through Telepathy

### Synthetic Directive

- **Assemble + Recycle**: Can rebuild Recycled components with improved attributes
- **Replicate + Upgrade**: Each Replication can be progressively Upgraded

## Keyword Stack Limits

Different keywords have different stacking limits:

### Non-Stacking Keywords

- Defender, Rush, First Strike, Elusive, etc. (unit either has it or doesn't)

### Limited Stacking Keywords

- Evolve, Upgrade, Forge (typically limited to 3 instances)

### Unlimited Stacking Keywords

- Empower, Drain, Burn (can accumulate without limit)

## Educational Examples

### Complex Multi-Keyword Interaction Example

**Scenario**: A Mindlinked unit with First Strike and Regenerate is Frozen while connected to a Phased unit.

**Resolution**:

1. The Frozen status prevents the use of First Strike
2. Regenerate still functions at the end of turn
3. The Mindlink remains active to the Phased unit
4. The Phased unit still benefits from Mindlink
5. When the Frozen status expires, First Strike becomes active again

### Priority Resolution Example

**Scenario**: A unit with Last Stand and Spawn is destroyed while affected by Silence.

**Resolution**:

1. Silence prevents both Last Stand and Spawn from triggering
2. If Silence is removed in response, the keywords will resolve in this order:
   - Last Stand (if it would keep the unit alive)
   - Spawn (whether the unit survived or not)

## Digital Implementation Notes

The digital version employs these visual aids to clarify keyword interactions:

1. **Connection Lines**: Visible links between interacting keywords
2. **Timing Bars**: Displays showing resolution sequence
3. **Conflict Indicators**: Visual warnings when keywords conflict
4. **Effect Preview**: Hover-over preview of combined keyword effects

## Physical Play Guidelines

For tabletop play, use these methods to track complex interactions:

1. **Keyword Tokens**: Physical tokens for each keyword
2. **Connection Cards**: Small cards that show how keywords interact
3. **Resolution Steps**: A sequence card for resolving multiple triggers
4. **Reference Sheet**: Quick-reference chart for common interactions

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*
