# Hero Card Specifications

This document details the layout specifications for Hero Cards in Crisis Unleashed.

## Visual Reference

``` text
┌─────────────────────────────┐
│                       ┌───┐ │
│     HERO NAME         │FAC│ │
│                       └───┘ │
│                             │
│                             │
│                             │
│       HERO ARTWORK          │
│                             │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│ TITLE / EPITHET             │
├─────────────────────────────┤
│                             │
│      PASSIVE ABILITY        │
│                             │
├─────────┬───────────────────┤
│ MOMENTUM│    ULTIMATE       │
│ COST    │    ABILITY        │
│         │                   │
├─────────┴───────────────────┤
│         FLAVOR TEXT         │
├─────────────────────────────┤
│ INITIAL HP      │   MAX HP  │
└─────────────────────────────┘
```

## Key Elements

### Primary Game Elements

1. **Momentum Cost** (Lower Left)
   - Circle or specialized shape
   - Large, bold number (24-28pt)
   - Momentum resource icon
   - Higher contrast than character cards
   - Represents cost to activate Ultimate Ability

2. **Initial HP** (Bottom Left)
   - Starting health value
   - Shield icon with number
   - 18-20pt bold number

3. **Maximum HP** (Bottom Right)
   - Maximum possible health
   - Enhanced shield icon
   - 18-20pt bold number

4. **Faction Indicator** (Top Right)
   - Larger and more elaborate than on character cards
   - Premium treatment (metallic, embossed)
   - Faction-specific decoration extending into frame

### Card Identity Elements

1. **Hero Name** (Top Left)
   - 22-26pt bold font
   - Faction-colored text with enhanced glow
   - Premium treatment for legendary status
   - Maximum 20 characters

2. **Title/Epithet** (Below Artwork)
   - Descriptive subtitle for hero
   - 14-16pt italic font
   - Thematic to hero's role and backstory
   - E.g., "The Radiant Sentinel" or "Harbinger of Shadows"

### Content Elements

1. **Hero Artwork** (Upper 50%)
   - Full bleed to middle section
   - Character in iconic pose
   - Higher detail and focus than standard cards
   - Background elements reinforcing hero's theme and faction

2. **Passive Ability** (Middle Section)
   - Always-active hero power
   - Clearly distinguished from Ultimate Ability
   - Icon indicating passive nature
   - Left-aligned for readability

3. **Ultimate Ability** (Lower Middle)
   - Hero's signature power move
   - Distinct visual treatment (border, background)
   - Explicit Momentum cost indicator
   - Can include multiple effects with bullet points

4. **Flavor Text** (Above Bottom Stats)
   - Character quote representing hero's personality
   - 1-2 lines maximum
   - Italicized 12pt text
   - Higher prominence than on character cards

## Visual Design Specifications

### Visual Differentiation from Character Cards

- **Premium Frame**: More elaborate and visually distinct
- **Vertical Orientation**: Elements arranged vertically rather than horizontally
- **Enhanced Texture**: Higher detail in frame texture and finish
- **Foil Treatment**: Light-catching elements in physical cards
- **Layered Design**: Multiple visual planes creating depth

### Color Coding

#### By Ascension Path

Heroes show their chosen Ascension Path through color accents:

- **Path of Technology**: Blue energy/circuit motifs
- **Path of Magic**: Purple energy/arcane motifs
- **Path of Combat**: Red energy/martial motifs
- **Path of Leadership**: Gold energy/command motifs

#### By Rarity

All Hero cards have Legendary rarity treatment by default:

- **Base Hero**: Gold/orange frame with faction-colored accents
- **Ascended Hero**: Enhanced frame with additional effects
- **Ultimate Ascension**: Premium frame with animated effects (digital)

### Typography

- **Hero Name**: Cinzel Bold, slightly larger than regular card names
- **Title/Epithet**: Cinzel Regular Italic
- **Game Text**: Open Sans, slightly larger than regular cards
- **Flavor Text**: Open Sans Italic
- **Stats**: Impact, enhanced with subtle glow

### Accessibility Considerations

- Larger text size throughout compared to standard cards
- Enhanced contrast for better readability
- Distinct shape language for quick identification
- Tactile differentiation for physical cards (thicker stock or texture)

## Digital Implementation

For the digital version, Hero Cards include:

1. **Premium Effects**
   - Subtle animation in card frame
   - Particle effects themed to hero's faction
   - Dynamic lighting effects on artwork
   - Special sound effects when played or activated

2. **Interactive Elements**
   - HP tracker with visual damage representation
   - Momentum accumulation visual indicator
   - Ultimate ability cooldown display
   - Animation when Ultimate becomes available

3. **Animation Guidelines**
   - Entry animation: Rise from below with light burst
   - Ultimate activation: Full-screen special effect
   - Critical health: Pulsing red indicators
   - Victory pose: Special animation when winning

## Template Resources

- [Hero Card Template - PSD](../design/templates/hero_card_template.psd)
- [Hero Card Template - PNG](../design/templates/hero_card_template.png)
- [Hero Banner Assets](../design/templates/hero_banners.zip)

## Examples

### Solaris Nexus Hero Example

![Solaris Nexus Hero Example](../design/examples/solaris_hero_example.png)

### Umbral Eclipse Hero Example

![Umbral Eclipse Hero Example](../design/examples/umbral_hero_example.png)

### Ascended Hero Example

![Ascended Hero Example](../design/examples/ascended_hero_example.png)

---

*Related Documents:*

- [Card Layout Overview](card_layout_overview.md)
- [Hero Progression System](../mechanics/hero_progression.md)
- [Ultimate Abilities Reference](../mechanics/ultimate_abilities.md)
