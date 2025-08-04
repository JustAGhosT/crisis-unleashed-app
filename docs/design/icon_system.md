# Icon System Documentation

## Overview

The Crisis Unleashed icon system provides a consistent visual language for representing game concepts. Icons enhance gameplay by providing instant recognition of effects, abilities, and states without requiring players to read full text descriptions.

## Design Principles

All Crisis Unleashed icons adhere to these core principles:

1. **Clarity**: Immediately recognizable at small sizes (as small as 16×16px)
2. **Consistency**: Similar concepts share visual elements
3. **Distinction**: Each icon is clearly distinguishable from others
4. **Scalability**: Functions at multiple sizes without loss of meaning
5. **Faction Alignment**: Where appropriate, incorporates faction visual language

## Core Icon Categories

### Resource Icons

#### Energy Crystal

![Energy Crystal Icon]

- Primary game resource
- Appears on cards, UI, and game elements
- Variations: Active (glowing), Depleted (dimmed), Locked (with chain)

#### Secondary Resources

![Secondary Resource Icons]

- Faction-specific resources:

  - **Solaris**: Divine Light (sunburst symbol)
  - **Umbral**: Void Essence (shadow spiral)
  - **Aeonic**: Chrono Particles (hourglass symbol)
  - **Primordial**: Vital Essence (leaf symbol)
  - **Infernal**: Soul Fragments (flame symbol)
  - **Neuralis**: Mind Energy (brain symbol)
  - **Synthetic**: Computation Units (circuit symbol)

### Status Effect Icons

#### Positive Status Effects

- **Shield**: Hexagonal barrier icon
- **Stealth**: Faded silhouette icon
- **Enhanced**: Upward arrow with sparkles
- **Regeneration**: Circular arrow with plus symbol
- **Charged**: Lightning bolt symbol
- **Blessed**: Radiant halo symbol
- **Focus**: Target/bullseye symbol

#### Negative Status Effects

- **Burning**: Flame icon
- **Frozen**: Snowflake icon
- **Poisoned**: Dripping droplet icon
- **Corrupted**: Purple decay symbol
- **Stunned**: Stars/swirls icon
- **Weakened**: Downward arrow icon
- **Controlled**: Puppet strings icon
- **Glitched**: Digital distortion symbol

#### Neutral Status Effects

- **Transformed**: Metamorphosis butterfly symbol
- **Linked**: Chain link symbol
- **Phased**: Semi-transparent/faded icon
- **Delayed**: Clock with countdown symbol
- **Marked**: Target/crosshairs symbol

### Action Type Icons

- **Attack**: Crossed swords
- **Defense**: Shield
- **Utility**: Gear/cog
- **Movement**: Directional arrow
- **Draw**: Card being drawn
- **Discard**: Card being discarded
- **Heal**: Heart or plus symbol
- **Boost**: Upward trending graph
- **Counter**: Reflecting arrow
- **Search**: Magnifying glass
- **Transform**: Metamorphosis symbol
- **Control**: Mental waves/puppet strings
- **Summon**: Upward beam of light

### Card Type Icons

- **Unit**: Silhouette figure
- **Action**: Lightning/energy bolt
- **Condition**: Persistent effect symbol
- **Hero**: Crown or star
- **WORM**: Reality-warping symbol

### Faction Icons

Each faction has a primary icon that represents its core identity:

- **Solaris Nexus**: Radiant circuit halo
- **Umbral Eclipse**: Shadow tendril spiral
- **Aeonic Dominion**: Fractal time crystal
- **Primordial Genesis**: Evolving DNA/growth spiral
- **Infernal Core**: Demonic circuit flame
- **Neuralis Conclave**: Neural network pattern
- **Synthetic Directive**: Connected drone swarm

## Icon Combinations

Complex game concepts are represented by combining base icons:

### Modifier Overlays

- **+**: Enhancement/increase (upper right)
- **-**: Reduction/decrease (upper right)
- **×**: Multiplication/repeat (upper right)
- **!**: Urgent/immediate (upper right)
- **?**: Random/uncertain (upper right)
- **↺**: Recurring/repeating (bottom)
- **⟳**: Transform/change (center)
- **⊗**: Nullify/prevent (diagonal overlay)

### Combination Examples

- Attack + Enhancement = Enhanced Attack (sword with + overlay)
- Shield + Recurring = Regenerating Shield (shield with ↺ overlay)
- Unit + Nullify = Disable Unit (silhouette with ⊗ overlay)

## Technical Specifications

### Size Guidelines

- **Small**: 16×16px (minimum size for UI elements)
- **Medium**: 32×32px (standard size for card text)
- **Large**: 64×64px (feature size for UI focus)
- **Extra Large**: 128×128px (promotional materials)

### Design Grid

All icons are designed on a 16×16 grid with:

- 1px padding on all sides
- Core shape occupying central 14×14 area
- Consistent line weight (1.5px at 16×16 size)

### Color Variants

Each icon exists in several color variants:

1. **Neutral**: Gray scale with white highlights
2. **Faction-Colored**: Using faction primary/secondary colors
3. **State-Based**:
    - **Active**: Bright, saturated colors
    - **Inactive**: Desaturated, lower opacity
    - **Prohibited**: Red overlay with diagonal line

### File Formats

Icons are available in the following formats:

- SVG (vector source files)
- PNG (with transparency at multiple sizes)
- Icon font (for web implementation)
- Unity sprite atlas (for digital game)

## Implementation Guidelines

### Card Implementation

- Status effect icons appear in ability text
- Energy cost uses the Energy Crystal icon
- Card type icon appears on type line
- Special abilities may have their own icons

### Digital Interface

- Tooltips appear when hovering over icons
- Animation states reflect active/inactive status
- Size increases slightly (110%) on hover/selection
- Consistent positioning in UI elements

### Physical Components

- Printed cards use high-contrast versions of icons
- Token components feature embossed icons where possible
- Player reference cards include complete icon library
- Rulebook contains comprehensive icon guide

## Accessibility Considerations

This section provides guidelines to ensure all players can understand and interact with the icon system, regardless of ability.

### Screen Reader & Alt Text Guidance

To ensure a comprehensive experience for users relying on screen readers, all icons that convey information must include descriptive alternative text (alt text).

- **Standard Format**: Alt text should be concise and clearly describe the icon's meaning. The recommended format is `[Concept Name] Icon`. For example: `alt="Attack Icon"`. Avoid redundant phrases like "Image of."
- **Implementation**: For standard image assets (PNG), use the `alt` attribute. For inline SVGs, use an `aria-label` attribute or include a `<title>` element.
- **Dynamic Content**: For icons representing a value (e.g., Attack +2), the alt text must be dynamically generated to be specific: `alt="Attack bonus of 2"`.
- **Decorative Icons**: If an icon is purely for visual flair and provides no information not already present in text, it should have empty alt text (`alt=""`) to be ignored by screen readers.

### Visual & Physical Accessibility

- **High Contrast**: All icons must have a high-contrast variant available as a user-selectable option in the game's settings to support players with low vision.
- **Colorblind Accessibility**: Icons must use distinct shapes, not just color, to be distinguishable. Test all icons in grayscale to confirm clarity.
- **Tactile Differentiation**: On physical components, icons should be embossed or engraved where possible to provide tactile feedback.

## Icon Creation Process

When creating new icons for Crisis Unleashed:

1. Identify the concept requiring visual representation
2. Check existing icons for similar concepts
3. Sketch multiple variations adhering to grid system
4. Test at multiple sizes and in different contexts
5. Validate with player testing
6. Create all required color and state variations
7. Add to master icon library with appropriate metadata

## Icon Library Management

The complete icon library is maintained in:

- Master SVG library file
- Online asset management system
- Version-controlled repository

New icons must be approved by the art director and game design lead before implementation.

> *Note: Icon designs are subject to change through game development. This document will be updated to reflect the current icon system.*
