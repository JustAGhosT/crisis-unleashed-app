# Standard and Alternate Gameboard Layouts

## Overview

Crisis Unleashed offers multiple gameboard layouts to accommodate different play environments, devices, and game modes. This document details the standard layout used in tournament play as well as several alternative layouts designed for specific use cases.

## Standard Tournament Layout

The standard tournament layout is the default configuration for competitive play and is optimized for clarity and strategic depth.

### Structure

The standard layout features a symmetrical board with the following arrangement for each player:

``` text
┌───────────────────────────────────┐
│           OPPONENT                │
├───────┬───────┬───────┬───────────┤
│ Deck & │ Back  │ Middle │ Front   │
│Resource│ Lane  │ Lane   │ Lane    │
│ Zone   │       │        │         │
├───────┼───────┼───────┼──────────┤
│       │       │        │         │
│Discard│       │CONDITION FIELD   │
│ Pile  │       │                  │
│       │       │                  │
├───────┼───────┼───────┼──────────┤
│ Hero  │ Back  │ Middle │ Front   │
│ Zone  │ Lane  │ Lane   │ Lane    │
│       │       │        │         │
├───────┴───────┴───────┴──────────┤
│             PLAYER               │
└───────────────────────────────────┘
```

### Key Features

- **Symmetrical Design**: Creates a balanced battlefield for both players
- **Clear Zone Separation**: Physical dividers or visual indicators on playmats mark different zones
- **Proximity Logic**: Related zones are positioned adjacent to each other
- **Visibility Priority**: Critical information (hero health, combat zones) is positioned for optimal visibility

### Physical Implementation

In physical play, the standard layout is typically represented on a playmat measuring approximately 24" × 14" (61cm × 36cm), with printed zone indicators.

## Vertical Layout (Digital)

The vertical layout is optimized for mobile devices and tablets with portrait orientation, where horizontal space is limited.

### Structure, Vertical

``` text
┌─────────────────────┐
│      OPPONENT       │
├─────────┬───────────┤
│  Hero   │  Deck &   │
│  Zone   │ Resources │
├─────────┴───────────┤
│                     │
│    Front Lane       │
│                     │
├─────────────────────┤
│                     │
│    Middle Lane      │
│                     │
├─────────────────────┤
│                     │
│     Back Lane       │
│                     │
├─────────────────────┤
│                     │
│  CONDITION FIELD    │
│                     │
├─────────────────────┤
│                     │
│     Back Lane       │
│                     │
├─────────────────────┤
│                     │
│    Middle Lane      │
│                     │
├─────────────────────┤
│                     │
│    Front Lane       │
│                     │
├─────────┬───────────┤
│  Hero   │  Deck &   │
│  Zone   │ Resources │
├─────────┴───────────┤
│       PLAYER        │
└─────────────────────┘
```

### Key Features, Vertical

- **Stacked Lanes**: Lanes are arranged vertically rather than horizontally
- **Compact Resources**: Resource and deck zones are condensed
- **Scrollable View**: Digital implementation allows scrolling to focus on relevant zones
- **Tap to Expand**: Zones can be expanded for detailed view with a tap

### Digital Adaptations

- **Auto-scrolling**: Interface automatically scrolls to show active zones during different phases
- **Zoom Function**: Players can pinch to zoom on specific zones
- **Collapse/Expand**: Inactive zones can collapse to save space

## Hex-Grid Layout

The hex-grid layout is an advanced configuration used for special game modes and tournaments that incorporate positional strategy beyond the standard lane system.

### Structure, Hex

Each player has a hexagonal grid of spaces where units can be placed, creating more complex positional relationships than the standard layout.

``` text
        ┌───┐   ┌───┐   ┌───┐
        │ O │   │ O │   │ O │
        └───┘   └───┘   └───┘
    ┌───┐   ┌───┐   ┌───┐   ┌───┐
    │ O │   │ O │   │ O │   │ O │
    └───┘   └───┘   └───┘   └───┘
┌───┐   ┌───┐   ┌───┐   ┌───┐   ┌───┐
│ O │   │ O │   │CF │   │ O │   │ O │
└───┘   └───┘   └───┘   └───┘   └───┘
    ┌───┐   ┌───┐   ┌───┐   ┌───┐
    │ P │   │ P │   │ P │   │ P │
    └───┘   └───┘   └───┘   └───┘
        ┌───┐   ┌───┐   ┌───┐
        │ P │   │ P │   │ P │
        └───┘   └───┘   └───┘
```

(O = Opponent spaces, P = Player spaces, CF = Condition Field)

### Key Features, Hex

- **Adjacent Positioning**: Units can interact with all adjacent hexes
- **Flanking Mechanics**: Units can flank enemies by positioning around them
- **Territory Control**: Controlling connected groups of hexes provides strategic advantages
- **Expanded Tactical Options**: Movement and positioning have greater strategic importance

### Game Mode Adaptations

- **Hex Control**: Special game mode where controlling hexes earns victory points
- **Terrain Effects**: Certain hexes may have terrain effects that modify units placed there
- **Zone Control**: Controlling specific regions of the hex grid provides bonuses

## Tarot-Style Layout (Narrative)

The tarot-style layout is used for narrative and campaign play, where storytelling elements are integrated into the gameplay.

### Structure, Tarot Style

The layout resembles a tarot card spread, with specific positions holding story significance.

``` text
          ┌───────┐
          │ Fate  │
          │ Card  │
          └───────┘
┌───────┐ ┌───────┐ ┌───────┐
│ Past  │ │Present│ │Future │
│ Zone  │ │ Zone  │ │ Zone  │
└───────┘ └───────┘ └───────┘
┌───────┐ ┌───────┐ ┌───────┐
│Player │ │ Hero  │ │Destiny│
│Hand   │ │ Zone  │ │Field  │
└───────┘ └───────┘ └───────┘
```

### Key Features, Tarot Style

- **Narrative Integration**: Each zone represents a storytelling element
- **Progressive Revelation**: Cards in certain zones are revealed as the story progresses
- **Fate Mechanics**: Special "fate cards" influence game direction
- **Asymmetrical Setup**: Players may have different zone arrangements based on their role in the story

### Campaign Adaptations

- **Chapter Cards**: Special cards that introduce new rules for each chapter of a campaign
- **Legacy Elements**: Components may be modified permanently as campaigns progress
- **NPC Integration**: Neutral character cards that interact with specific zones

## Accessibility Considerations

All layouts are designed with accessibility in mind, incorporating:

- **Color Coding**: Zones have distinct colors with high contrast
- **Texture Differentiation**: Physical versions include tactile indicators
- **Symbol System**: Consistent iconography supplements color indicators
- **Screen Reader Support**: Digital versions include screen reader compatibility

## Implementation Guidelines

### Physical Game

- **Playmats**: Pre-printed playmats with zone indicators
- **Zone Dividers**: Physical dividers for organizing cards
- **Size Standards**: Standard layout requires approximately 2' × 2' (60cm × 60cm) table space

### Digital Game

- **Responsive Design**: Layouts adjust automatically based on device orientation and size
- **User Preferences**: Players can choose their preferred layout in settings
- **Customization Options**: Color schemes and zone positioning can be adjusted
- **Transition Animations**: Clear animations when switching between layouts

## Tournament Regulations

For official tournament play, only the Standard Tournament Layout is permitted, with these specifications:

- **Zone Sizing**: Standard dimensions for all zones
- **Required Markers**: Official zone indicators must be used
- **Card Orientation**: Specific orientation requirements for each zone
- **Clear Boundaries**: Zones must have visible separation

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*
