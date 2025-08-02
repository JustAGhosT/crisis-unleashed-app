# Card Layout Specifications - Overview

This document provides a comprehensive overview of card layouts in Crisis Unleashed. For detailed specifications of each card type, refer to the corresponding documents.

## Card Types Overview

| Card Type | Primary Purpose | Key Visual Elements | Detailed Specs |
|-----------|----------------|---------------------|----------------|
| Hero Cards | Player avatar and special abilities | Hero portrait, Ultimate ability, Passive effects | [Hero Card Specs](hero_card_specs.md) |
| Character Cards | Battlefield units and combatants | Character art, Combat stats, Abilities | [Character Card Specs](character_card_specs.md) |
| Action Cards | Spells, tactics, and effects | Effect illustration, Timing indicators | [Action Card Specs](action_card_specs.md) |
| Crisis Cards | Global events affecting gameplay | Environmental art, Effect duration | [Crisis Card Specs](crisis_card_specs.md) |

## Core Design Principles

### Visual Hierarchy

All card designs follow these priorities:

1. Card type should be immediately identifiable at a glance
2. Key gameplay information (cost, stats) must be highly legible
3. Faction identity should be visually reinforced
4. Artwork should enhance thematic elements without reducing readability

### Color System

- **Card frames** use faction-specific colors and textures
- **Text boxes** maintain consistent coloring across all cards
- **Icons** follow a standardized color scheme for instant recognition
- **Rarity indicators** use universal color coding:
  - Common: White/Silver
  - Uncommon: Green
  - Rare: Blue
  - Epic: Purple
  - Legendary: Gold/Orange

### Text Guidelines

- **Card names**: 18-24pt bold, centered
- **Game text**: 12-14pt, left aligned
- **Flavor text**: 10-12pt italics
- **Font stack**: Primary game font with fallback to system fonts

## Card Anatomy Common Elements

All cards share these fundamental elements:

- **Card Name**: Top center
- **Cost**: Top left corner
- **Type Indicator**: Top of text box
- **Faction Indicator**: Frame design and icon
- **Set Symbol**: Bottom of card
- **Rarity Indicator**: Set symbol color/texture

## Card Dimensions and Production Specifications

### Physical Card Specifications

- **Dimensions**: 63mm × 88mm (Standard size)
- **Corners**: 3mm radius
- **Bleed Area**: 3mm on all sides
- **Safe Zone**: 3mm inset from cut line

### Digital Card Specifications

- **Resolution**: 800px × 1100px (with 36px bleed area)
- **Format**: PNG with transparency for UI implementation
- **DPI**: 300 for print-ready assets

## Design Resources

- [Card Frame Templates](../design/templates/card_frames/)
- [Icon Library](../design/icons/)
- [Texture Resources](../design/textures/)

## Next Sections

See the following documents for detailed specifications of each card type:

- [Hero Card Specifications](hero_card_specs.md)
- [Character Card Specifications](character_card_specs.md)
- [Action Card Specifications](action_card_specs.md)
- [Crisis Card Specifications](crisis_card_specs.md)
