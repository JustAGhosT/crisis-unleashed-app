# Character Card Specifications

This document details the layout specifications for Character Cards in Crisis Unleashed.

## Visual Reference

``` text
┌─────────────────────────────┐
│ ┌─────┐               ┌───┐ │
│ │COST │   CARD NAME   │FAC│ │
│ └─────┘               └───┘ │
│                             │
│                             │
│                             │
│      CHARACTER ARTWORK      │
│                             │
│                             │
│                             │
│                             │
├─────────┬─────────┬─────────┤
│ TYPE    │ SUBTYPE │ ASPECTS │
├─────────┴─────────┴─────────┤
│                             │
│        ABILITY TEXT         │
│                             │
│                             │
├─────────────────────────────┤
│         FLAVOR TEXT         │
├─────┬───────────────┬───────┤
│ ATK │ RACE │ PROV   │ HP    │
└─────┴───────────────┴───────┘
```

## Key Elements

### Primary Game Elements

1. **Cost** (Top Left)
   - Circle or hexagonal shape
   - Large, bold number (24-28pt)
   - Power resource icon
   - High contrast with background

2. **Attack Value** (Bottom Left)
   - Sword icon with value
   - Red/orange themed background
   - 18-20pt bold number

3. **Health Value** (Bottom Right)
   - Shield icon with value
   - Green/blue themed background
   - 18-20pt bold number

4. **Faction Indicator** (Top Right)
   - Faction-specific icon
   - Color-coded to match faction
   - Subtle frame treatment reflecting faction

### Card Identity Elements

1. **Card Name** (Top Center)
   - 18-22pt bold font
   - Faction-colored text glow or underline
   - Maximum 25 characters

2. **Character Type** (Middle Band Left)
   - Indicates role (Warrior, Mage, Support, etc.)
   - Icon and text representation
   - Used for synergy mechanics

3. **Subtype** (Middle Band Center)
   - Secondary classification
   - No icon, text only
   - Used for tribal synergies

4. **Aspects** (Middle Band Right)
   - Special keywords (Veil, Echo, etc.)
   - Small icon representation
   - Up to 3 aspect icons

5. **Race** (Bottom Center)
   - Character race/origin
   - Small icon paired with text
   - Used for tribal synergies

### Content Elements

1. **Character Artwork** (Upper 50%)
   - Full bleed to middle band
   - Character prominently featured
   - Background elements suggesting environment
   - Action pose reflecting character abilities

2. **Ability Text** (Lower Middle)
   - Clear, concise text (12-14pt)
   - Icons for activated abilities
   - Keywords in bold text
   - Left-aligned for readability

3. **Flavor Text** (Above Bottom Stats)
   - Italicized 10pt text
   - Character quote or lore snippet
   - 1-2 lines maximum
   - Not present on all cards

4. **Provision Cost** (Bottom Center)
   - Deckbuilding constraint
   - Small provision icon with value
   - 12pt number next to race

## Visual Design Specifications

### Color Coding

#### By Faction

- **Solaris Nexus**: Gold/white frame with blue accents
- **Umbral Eclipse**: Purple/black frame with teal accents
- **Synthetic Directive**: Silver/blue frame with red accents
- **Aeonic Dominion**: Teal/bronze frame with gold accents
- **Primordial Genesis**: Green/brown frame with amber accents
- **Infernal Core**: Red/black frame with orange accents
- **Neuralis Conclave**: Blue/purple frame with silver accents

#### By Rarity

- **Common**: Single-tone frame, minimal effects
- **Uncommon**: Dual-tone frame, subtle glow
- **Rare**: Metallic frame, noticeable glow
- **Epic**: Premium frame, animated effects (digital)
- **Legendary**: Premium frame with distinct border pattern

### Typography

- **Card Name**: Cinzel Bold
- **Game Text**: Open Sans
- **Flavor Text**: Open Sans Italic
- **Stats**: Impact

### Accessibility Considerations

- Contrast ratio of 4.5:1 minimum for all text elements
- Color is not the sole indicator of information
- Icons accompany all key mechanics for visual recognition
- Text size no smaller than 10pt for physical cards

## Digital Implementation

For the digital version, Character Cards include:

1. **Hover Effects**
   - Card enlargement on hover
   - Tooltips for keywords and complex abilities
   - Subtle animation for legendary cards

2. **Selection State**
   - Distinct glow when selected
   - Enhanced border visibility
   - Interactive ability highlights

3. **Animation Guidelines**
   - Entry animation: Slide from deck position
   - Activation animation: Brief glow pulse
   - Attack animation: Forward motion + flash
   - Damage animation: Shake + red flash

## Template Resources

- [Character Card Template - PSD](../design/templates/character_card_template.psd)
- [Character Card Template - PNG](../design/templates/character_card_template.png)
- [Character Card Icons Pack](../design/icons/character_icons.zip)

## Examples

### Basic Warrior Example

![Basic Warrior Card Example](../design/examples/basic_warrior_card.png)

### Complex Mage Example

![Complex Mage Card Example](../design/examples/complex_mage_card.png)

### Legendary Character Example

![Legendary Character Example](../design/examples/legendary_character.png)

---

*Related Documents:*

- [Card Layout Overview](card_layout_overview.md)
- [Type and Subtype Reference](card_types_reference.md)
- [Aspect Icons Guide](aspect_icons_guide.md)
