# Zone Interactions and Rules

## Overview

In Crisis Unleashed, the different zones on the gameboard don't exist in isolation. They interact with each other in dynamic ways, creating strategic depth and enabling complex card interactions. This document explores how zones interact with each other and the rules governing these interactions.

## Core Zone Relationship Map

The following diagram illustrates the primary relationships and interactions between gameboard zones:

``` text
┌───────────────────┐
│    Hero Zone      │◄─────────┐
│                   │          │
│ ┌───────────────┐ │          │
│ │  Hero Powers  │ │          │
│ └───────────────┘ │          │
└────────┬──────────┘          │
         │                     │
         ▼                     │
┌────────────────┐      ┌──────────────┐
│  Combat Zones  │◄────►│ Condition    │
│                │      │ Field        │
│ ┌────┐ ┌────┐  │      │              │
│ │Units│ │Units│  │      │ ┌──────────┐ │
│ └────┘ └────┘  │      │ │Conditions │ │
└────────┬───────┘      │ └──────────┘ │
         │              └──────┬───────┘
         ▼                     │
┌────────────────┐             │
│ Resource/Deck  │◄────────────┘
│ Zones          │
│                │
│ ┌────┐ ┌─────┐ │
│ │Deck │ │Discard│
│ └────┘ └─────┘ │
└────────────────┘
```

## Zone Interaction Rules

### Hero Zone to Combat Zones

1. **Command Authority**: Hero abilities directly affect units in Combat Zones.
   - Example: "Commander Eva's Tactical Insight" allows you to reposition a unit in a Combat Zone.

2. **Zone Restrictions**: Some hero abilities can only target specific lanes.
   - Example: "The Herald's Radiant Beam" can only target units in the Front Lane.

3. **Activation Requirements**: Some hero abilities require specific configurations in Combat Zones.
   - Example: "Apex's Protocol Override" requires control of at least one unit in each lane.

4. **Hero Movement**: Some heroes can enter Combat Zones directly under specific conditions.
   - Example: "Inferno's Embodiment of Flame" transforms the hero into a unit that enters a Combat Zone.

### Combat Zones to Hero Zone

1. **Feedback Effects**: Events in Combat Zones can trigger effects in the Hero Zone.
   - Example: When your unit defeats an enemy unit, "Shade's Shadow Harvest" gains 1 Momentum.

2. **Protection Radius**: Units can protect heroes from direct attacks or effects.
   - Example: Units with "Guardian" can intercept attacks targeting your hero.

3. **Energy Generation**: Actions in Combat Zones can generate resources in the Hero Zone.
   - Example: Units with "Energy Conduit" provide Energy to the hero when they attack.

### Condition Field to All Zones

1. **Global Effects**: Conditions in the Condition Field affect all other zones simultaneously.
   - Example: "Solar Eclipse" reduces the cost of all Shadow cards in players' hands by 1.

2. **Zone-Specific Modifiers**: Some conditions modify rules for specific zones only.
   - Example: "Corrupted Realm" makes all units in Combat Zones take 1 damage at the end of each turn.

3. **Zone Restrictions**: Some conditions lock or restrict certain zones.
   - Example: "Temporal Stasis" prevents cards from moving to or from the Discard Pile.

4. **Stack Priority**: When multiple conditions affect the same zone, they apply in order of play.
   - Example: If "Solar Empowerment" gives units +1/+1 and later "Umbral Influence" gives units -1/-0, the net effect is +0/+1.

### Resource/Deck Zones to Other Zones

1. **Card Flow Control**: These zones regulate the movement of cards to other zones.
   - Example: Drawing cards moves them from Deck to Hand, playing cards moves them from Hand to a Combat Zone.

2. **Zone Transfer Rules**

   - Cards can only move from Hand to Combat Zones or Condition Field if played legally.
   - Cards move from Combat Zones to Discard Pile when destroyed.
   - Banished cards move to the Banish Pile from any zone.

3. **Information State Transitions**: Cards change information states when moving between zones.
   - Example: Cards in Deck are hidden information, but become public when moved to Discard Pile.

4. **Recursion Limits**: Rules govern how cards can move back from "terminal" zones like Discard.
   - Example: Cards can be returned from Discard to Hand through effects, but are typically limited to prevent infinite loops.

## Cross-Zone Card Effects

Many cards have effects that interact with multiple zones simultaneously. Understanding these interactions is key to advanced play.

### Examples of Cross-Zone Effects

1. **Surveillance Drone** (Unit):
   - Primary Zone: Combat Zone
   - Effect: "Look at the top 3 cards of your deck. You may reveal a unit card from among them and put it into your hand."
   - Zones Affected: Combat Zone, Deck, Hand

2. **Quantum Entanglement** (Condition):
   - Primary Zone: Condition Field
   - Effect: "Whenever a unit enters a Combat Zone, you may swap it with another unit you control in a different lane."
   - Zones Affected: Condition Field, Multiple Combat Zones

3. **Soul Collector** (Hero Ability):
   - Primary Zone: Hero Zone
   - Effect: "When an enemy unit is destroyed, gain 1 Momentum and place a Soul counter on your hero. When you have 5 Soul counters, draw 2 cards."
   - Zones Affected: Hero Zone, Combat Zones, Deck

## Advanced Zone Interaction Concepts

### Zone Identity Preservation

When cards move between zones, they typically retain their identity but may lose specific properties:

- A card that moves from Combat Zone to Discard Pile keeps its identity for effects that track it.
- Counters, attachments, and temporary modifications are usually lost when a card changes zones.
- Some effects can "follow" a card between certain zones but not others.

### Zone Position Priority

When effects trigger in multiple zones simultaneously, they resolve in this order:

1. Hero Zone effects
2. Combat Zone effects
3. Condition Field effects
4. Resource/Deck Zone effects

If multiple effects trigger within the same zone type, the active player decides the order.

### Chaining Zone Interactions

Complex strategies often involve chaining zone interactions together:

1. Play a condition card to the Condition Field that triggers when units are destroyed
2. Play units to Combat Zones that have "on death" effects
3. Use a hero ability from the Hero Zone to destroy your own units
4. This activates both the condition card and the units' death effects
5. These effects might draw cards from your Deck to your Hand
6. Then play new cards from Hand to continue the chain

## Zone Locking and Restrictions

Certain effects can temporarily or permanently restrict interactions between zones:

1. **Zone Lock**: Prevents cards from entering or leaving a specific zone.
   - Example: "Reality Anchor" prevents units from moving between Combat Zones.

2. **Partial Restrictions**: Limits but doesn't completely prevent zone interactions.
   - Example: "Mana Disruption" increases the cost of moving cards from Hand to Combat Zones by 1.

3. **One-Way Barriers**: Allows movement in only one direction.
   - Example: "Void Gate" allows cards to enter the Banish Pile but prevents them from leaving.

4. **Conditional Passages**: Requires specific criteria for zone movement.
   - Example: "Quantum Filter" only allows units with even-numbered costs to enter Combat Zones.

## Special Zone Interactions by Faction

Each faction has characteristic ways of interacting with zones:

### Solaris Nexus

- Specializes in direct Hero Zone to Combat Zone interactions
- Can transfer Energy from Resource Zone to empower units in Combat Zones

### Umbral Eclipse

- Excels at using the Discard Pile as an extension of the Hand
- Can hide cards in "shadow zones" that exist temporarily between normal zones

### Aeonic Dominion

- Masters of manipulating cards between Deck and Hand
- Can place "time counters" on cards in any zone to trigger future effects

### Primordial Genesis

- Focuses on evolving units within Combat Zones over time
- Can seed other zones with Evolution catalysts

### Infernal Core

- Specializes in sacrificing units from Combat Zones for Hero Zone benefits
- Can temporarily exchange cards between Discard Pile and Combat Zones

### Neuralis Conclave

- Creates psychic connections between cards in different zones
- Can copy effects from one zone to another without moving cards

### Synthetic Directive

- Builds compound effects by linking cards across multiple zones
- Can assemble components from different zones into combined effects

## Tournament Rules for Zone Interactions

For competitive play, these additional rules ensure clarity in zone interactions:

1. **Zone Announcement**: Players must clearly announce when moving cards between zones
2. **Physical Placement**: Cards must be physically placed in the correct zone immediately
3. **Timing Verification**: Both players must acknowledge zone transitions before proceeding
4. **Zone State Knowledge**: Players are entitled to know the number of cards in each public zone
5. **History Tracking**: The sequence of zone movements can be tracked for verification

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*
