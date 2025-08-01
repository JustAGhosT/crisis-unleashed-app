# Visual Gameboard Setup Guide

## Overview

This guide provides visual references for setting up the Crisis Unleashed gameboard. While the game can adapt to various play environments, these diagrams represent the standard tournament layout and proper card positioning.

## Complete Gameboard Layout

The following diagram shows the complete two-player setup with all zones labeled:

```
┌─────────────────────────────────────────────────────────────┐
│                     PLAYER B (OPPONENT)                     │
├─────────┬─────────┬─────────┬─────────┬─────────┬───────────┤
│         │ ENERGY  │ BANISH  │ DISCARD │  DECK   │           │
│         │ POOL    │  PILE   │  PILE   │         │           │
│  HERO   ├─────────┴─────────┴─────────┴─────────┤           │
│  ZONE   │                                       │           │
│         │           PLAYER B RESOURCES          │           │
│  ┌───┐  │                                       │           │
│  │ B │  └───────────────────────────────────────┘           │
│  └───┘                                                      │
├─────────┬─────────┬─────────┬─────────┬─────────┬───────────┤
│         │         │         │         │         │           │
│ PLAYER  │ BACK    │ MIDDLE  │ FRONT   │         │           │
│    B    │ LANE    │ LANE    │ LANE    │         │           │
│ METRICS │         │         │         │         │           │
│         │         │         │         │         │           │
├─────────┼─────────┼─────────┼─────────┼─────────┼───────────┤
│         │         │         │         │         │           │
│         │         │         │         │         │           │
│         │         │CONDITION│         │         │           │
│         │         │  FIELD  │         │         │           │
│         │         │         │         │         │           │
├─────────┼─────────┼─────────┼─────────┼─────────┼───────────┤
│         │         │         │         │         │           │
│ PLAYER  │ BACK    │ MIDDLE  │ FRONT   │         │           │
│    A    │ LANE    │ LANE    │ LANE    │         │           │
│ METRICS │         │         │         │         │           │
│         │         │         │         │         │           │
├─────────┬─────────┴─────────┴─────────┴─────────┬───────────┤
│         │                                       │           │
│  HERO   │           PLAYER A RESOURCES          │           │
│  ZONE   │                                       │           │
│         ├─────────┬─────────┬─────────┬─────────┤           │
│  ┌───┐  │  DECK   │ DISCARD │ BANISH  │ ENERGY  │           │
│  │ A │  │         │  PILE   │  PILE   │ POOL    │           │
│  └───┘  │         │         │         │         │           │
├─────────┴─────────┴─────────┴─────────┴─────────┴───────────┤
│                     PLAYER A (YOU)                          │
└─────────────────────────────────────────────────────────────┘
```

## Hero Zone Setup

The Hero Zone contains your hero card and tracks essential resources:

```
┌─────────────────────────────┐
│        HERO ZONE            │
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │       HERO CARD       │  │
│  │                       │  │
│  │   Name: Commander Eva │  │
│  │   Health: 25          │  │
│  │   Abilities:          │  │
│  │   - Tactical Strike   │  │
│  │   - Solar Flare       │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
├─────────┬─────────┬─────────┤
│ HEALTH  │MOMENTUM │COOLDOWN │
│ ┌─────┐ │ ┌─────┐ │ ┌─────┐ │
│ │ 25  │ │ │  2  │ │ │  1  │ │
│ └─────┘ │ └─────┘ │ └─────┘ │
└─────────┴─────────┴─────────┘
```

**Key Components:**
- **Hero Card**: Central card showing your hero's abilities
- **Health Tracker**: Track your hero's current health (starting value shown on card)
- **Momentum Counter**: Tracks momentum resources for hero abilities
- **Cooldown Track**: Shows abilities on cooldown and their remaining duration

## Combat Zones Setup

Combat Zones are divided into three lanes where units are deployed:

```
┌─────────────────────────────────────────────────┐
│                  COMBAT ZONES                    │
├─────────────────┬─────────────────┬─────────────┤
│   BACK LANE     │   MIDDLE LANE   │  FRONT LANE │
├─────────────────┼─────────────────┼─────────────┤
│ ┌─────────────┐ │ ┌─────────────┐ │ ┌─────────┐ │
│ │             │ │ │             │ │ │         │ │
│ │  UNIT CARD  │ │ │  UNIT CARD  │ │ │  UNIT   │ │
│ │             │ │ │             │ │ │  CARD   │ │
│ │             │ │ │             │ │ │         │ │
│ └─────────────┘ │ └─────────────┘ │ └─────────┘ │
│                 │                 │             │
│                 │                 │ ┌─────────┐ │
│                 │                 │ │         │ │
│                 │                 │ │  UNIT   │ │
│                 │                 │ │  CARD   │ │
│                 │                 │ │         │ │
│                 │                 │ └─────────┘ │
└─────────────────┴─────────────────┴─────────────┘
```

**Key Features:**
- **Lane Separation**: Clear divisions between Back, Middle, and Front lanes
- **Unit Card Placement**: Cards should be placed fully within their lane
- **Multiple Units**: Multiple units can occupy the same lane
- **Status/Buff Indicators**: Counters or tokens showing effects on units

## Condition Field Setup

The Condition Field is a shared area where condition cards are played:

```
┌─────────────────────────────────────────────────┐
│                 CONDITION FIELD                  │
├─────────────────┬─────────────────┬─────────────┤
│                 │                 │             │
│ ┌─────────────┐ │ ┌─────────────┐ │             │
│ │             │ │ │             │ │             │
│ │  CONDITION  │ │ │  CONDITION  │ │             │
│ │     CARD    │ │ │     CARD    │ │             │
│ │             │ │ │             │ │             │
│ │             │ │ │             │ │             │
│ │  (Player A) │ │ │  (Player B) │ │             │
│ └─────────────┘ │ └─────────────┘ │             │
│                 │                 │             │
└─────────────────┴─────────────────┴─────────────┘
```

**Key Features:**
- **Shared Area**: Both players can place condition cards in this field
- **Owner Indication**: Cards should clearly indicate which player played them
- **Limit**: Typically restricts each player to a maximum of 3 condition cards
- **Duration Tracking**: Some condition cards may have counters showing their remaining duration

## Resource & Deck Zones Setup

This area organizes your deck, discard pile, and resources:

```
┌─────────────────────────────────────────────────┐
│               RESOURCE & DECK ZONES             │
├─────────────────┬─────────────────┬─────────────┤
│     DECK        │   DISCARD PILE  │  BANISH PILE│
├─────────────────┼─────────────────┼─────────────┤
│ ┌─────────────┐ │ ┌─────────────┐ │┌───────────┐│
│ │/////////////│ │ │             │ ││           ││
│ │/////////////│ │ │    CARD     │ ││   CARD    ││
│ │/////////////│ │ │             │ ││           ││
│ │/////////////│ │ └─────────────┘ │└───────────┘│
│ └─────────────┘ │ ┌─────────────┐ │             │
│                 │ │             │ │             │
│                 │ │    CARD     │ │             │
│                 │ │             │ │             │
│                 │ └─────────────┘ │             │
├─────────────────┴─────────────────┴─────────────┤
│                  ENERGY POOL                     │
├─────────────────────────────────────────────────┤
│                                                 │
│   ○   ○   ○   ○   ○   ○   ○   ○   ○   ○        │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Key Features:**
- **Deck Placement**: Face-down pile of cards you draw from
- **Discard Pile**: Face-up pile of used or destroyed cards
- **Banish Pile**: Face-up pile of cards removed from the game
- **Energy Pool**: Area for energy tokens/crystals
- **Clear Organization**: Each pile should be clearly separated

## Card Orientation Guidelines

Proper card orientation helps indicate status:

```
┌───────────────────┐   ┌───────────────────┐
│                   │   │                   │
│                   │   │                   │
│  READY UNIT       │   │  EXHAUSTED UNIT   │
│  (Vertical)       │   │  (Horizontal)     │
│                   │   │                   │
│                   │   │                   │
└───────────────────┘   └───────────────────┘
```

**Card Status Indications:**
- **Vertical (Ready)**: Unit can attack/use abilities
- **Horizontal (Exhausted)**: Unit has attacked/used abilities this turn
- **Attachment Cards**: Place partially overlapping the card they modify
- **Counters/Tokens**: Place on top of the card they affect

## Mobile/Tablet Adaptation

For digital play on mobile devices, the board adapts to a vertical orientation:

```
┌───────────────────────┐
│    OPPONENT HERO      │
├───────────────────────┤
│    OPPONENT DECK      │
│    AND RESOURCES      │
├───────────────────────┤
│                       │
│     FRONT LANE        │
│                       │
├───────────────────────┤
│                       │
│     MIDDLE LANE       │
│                       │
├───────────────────────┤
│                       │
│      BACK LANE        │
│                       │
├───────────────────────┤
│                       │
│    CONDITION FIELD    │
│                       │
├───────────────────────┤
│                       │
│      BACK LANE        │
│                       │
├───────────────────────┤
│                       │
│     MIDDLE LANE       │
│                       │
├───────────────────────┤
│                       │
│     FRONT LANE        │
│                       │
├───────────────────────┤
│     YOUR DECK         │
│     AND RESOURCES     │
├───────────────────────┤
│      YOUR HERO        │
└───────────────────────┘
```

## Physical Table Setup

For in-person play, here's a top-down view of how to arrange components on a physical table:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                       OPPONENT                              │
│                                                             │
├─────────┬─────────────────────────────────────┬─────────────┤
│         │                                     │             │
│ OPPONENT│                                     │  OPPONENT   │
│  DECK & │          OPPONENT'S LANES           │    HERO     │
│ RESOURCE│                                     │             │
│         │                                     │             │
├─────────┼─────────────────────────────────────┼─────────────┤
│         │                                     │             │
│         │                                     │             │
│         │         CONDITION FIELD             │             │
│         │                                     │             │
│         │                                     │             │
├─────────┼─────────────────────────────────────┼─────────────┤
│         │                                     │             │
│  YOUR   │                                     │    YOUR     │
│ DECK &  │            YOUR LANES               │    HERO     │
│ RESOURCE│                                     │             │
│         │                                     │             │
├─────────┴─────────────────────────────────────┴─────────────┤
│                                                             │
│                           YOU                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Setup Checklist

Follow these steps to prepare the gameboard:

1. **Prepare Play Surface**: Ensure you have a flat surface approximately 2' × 2' (60cm × 60cm)
2. **Position Hero Cards**: Place your hero card in your Hero Zone
3. **Set Starting Resources**:
   - Set hero health to starting value
   - Set momentum to 0
   - Place energy tokens in your Energy Pool
4. **Prepare Decks**: Shuffle your deck and place it face-down in your Deck Zone
5. **Clear Other Zones**: Ensure Discard and Banish Piles are empty
6. **Draw Starting Hand**: Draw 5 cards (or as directed by special rules)
7. **Determine First Player**: Randomly decide who goes first

## Common Setup Errors to Avoid

- **Improper Lane Distinction**: Ensure clear separation between lanes
- **Resource Mixing**: Keep energy tokens separate from other counters
- **Unclear Card Ownership**: Always place your cards on your side of the Condition Field
- **Disorganized Resource Area**: Maintain clear separation between Deck, Discard, and Banish Piles
- **Obscured Hero Stats**: Keep hero health and momentum trackers visible to both players

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*