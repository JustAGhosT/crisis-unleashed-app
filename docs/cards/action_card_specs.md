# Action Card Specifications

This document details the layout specifications for Action Cards in Crisis Unleashed.

## Visual Reference

``` card
┌─────────────────────────────┐
│ ┌─────┐               ┌───┐ │
│ │COST │   CARD NAME   │FAC│ │
│ └─────┘               └───┘ │
│                             │
│                             │
│                             │
│        ACTION ARTWORK       │
│                             │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│ ┌─────┐ ACTION TYPE         │
│ │TIMING│                    │
│ └─────┘                     │
├─────────────────────────────┤
│                             │
│        EFFECT TEXT          │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│         FLAVOR TEXT         │
└─────────────────────────────┘
```

## Key Elements

### Primary Game Elements

1. **Cost** (Top Left)

   - Circle or hexagonal shape
   - Large, bold number (24-28pt)
   - Power resource icon
   - High contrast with background
   - May include additional cost indicators for special costs

2. **Timing Indicator** (Below Artwork, Left)

   - Icon indicating when card can be played
   - Options include:
     - ⚡ Instant (can be played anytime)
     - 🔄 Standard (your turn only)
     - ⏱️ Delayed (effect activates later)
     - 🔁 Recurring (repeats multiple times)

3. **Action Type** (Below Artwork, Right)

   - Tactical category of the action
   - Examples: Spell, Combat, Support, Enhancement, Control
   - Determines card interactions and synergies

4. **Faction Indicator** (Top Right)

   - Faction-specific icon
   - Subtler than on Character/Hero cards
   - Frame treatment reflecting faction

### Card Identity Elements

1. **Card Name** (Top Center)

   - 18-22pt bold font
   - Faction-colored text glow or underline
   - Maximum 25 characters

2. **Effect Keywords** (In Effect Text)

   - Bold highlighted terms
   - Standardized terminology
   - Often paired with small icons

### Content Elements

1. **Action Artwork** (Upper 50%)

   - Full bleed to middle band
   - Dynamic scene showing effect in action
   - More abstract than character artwork
   - Visual clarity of the action's impact

2. **Effect Text** (Lower Middle)

   - Clear, concise text (12-14pt)
   - Structured with bullet points for multiple effects
   - May include conditional statements ("If...", "When...")
   - Left-aligned for readability

3. **Flavor Text** (Bottom Section)

   - Italicized 10pt text
   - Quote or lore snippet related to action
   - 1-2 lines maximum
   - Not present on all cards

## Visual Design Specifications

### Differentiation from Other Card Types

- **Landscape-oriented frame elements**: Visual cue for action type
- **Dynamic artwork**: Shows motion and effect rather than character
- **Effect-focused layout**: More space allocated to effect text
- **Color saturation**: Slightly higher to indicate temporary effect

### Color Coding

#### By Action Type

- **Offensive**: Red/orange gradient background in text box
- **Defensive**: Blue/green gradient background in text box
- **Utility**: Purple/blue gradient background in text box
- **Enhancement**: Yellow/white gradient background in text box
- **Control**: Teal/purple gradient background in text box

#### By Faction

- **Solaris Nexus**: Gold/white frame with blue accents
- **Umbral Eclipse**: Purple/black frame with teal accents
- **Synthetic Directive**: Silver/blue frame with red accents
- **Aeonic Dominion**: Teal/bronze frame with gold accents
- **Primordial Genesis**: Green/brown frame with amber accents
- **Infernal Core**: Red/black frame with orange accents
- **Neuralis Conclave**: Blue/purple frame with silver accents

#### By Timing

- **Instant**: Lightning bolt icon with blue highlights
- **Standard**: Clock icon with green highlights
- **Delayed**: Hourglass icon with orange highlights
- **Recurring**: Cycle icon with purple highlights

### Typography

- **Card Name**: Cinzel Bold
- **Action Type**: Cinzel Regular, all caps
- **Effect Text**: Open Sans
- **Flavor Text**: Open Sans Italic
- **Keywords**: Open Sans Bold

### Accessibility Considerations

- Icon + text for timing indicators
- Color-coded effect types also have distinct icons
- Higher contrast between text and background
- Icons have distinctive shapes for colorblind accessibility

## Digital Implementation

For the digital version, Action Cards include:

1. **Interactive Elements**
   - Card glows when playable
   - Valid targets highlighted when selected
   - Effect preview on hover (when applicable)

2. **Animation Guidelines**
   - Draw animation: Quick slide from deck
   - Play animation: Spin forward and enlarge
   - Activation animation: Expand and dissolve
   - Effect animation: Custom VFX for each card

3. **Sound Design**
   - Card type sound on draw
   - Action-specific sound on play
   - Impact sounds on effect resolution
   - Voice lines for legendary actions

## Template Resources

- [Action Card Template - PSD](../design/templates/action_card_template.psd)
- [Action Card Template - PNG](../design/templates/action_card_template.png)
- [Action Card Icons Pack](../design/icons/action_icons.zip)

## Examples

### Offensive Action Example

![Offensive Action Example](../design/examples/offensive_action_card.png)

### Utility Action Example

![Utility Action Example](../design/examples/utility_action_card.png)

### Legendary Action Example

![Legendary Action Example](../design/examples/legendary_action_card.png)

---

*Related Documents:*

- [Card Layout Overview](card_layout_overview.md)
- [Action Type Reference](../mechanics/action_types.md)
- [Timing Rules](../mechanics/card_timing_rules.md)
