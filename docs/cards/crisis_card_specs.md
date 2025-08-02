# Crisis Card Specifications

This document details the layout specifications for Crisis Cards in Crisis Unleashed.

## Visual Reference

``` text
┌─────────────────────────────┐
│                             │
│     CRISIS CARD NAME        │
│                             │
│                             │
│                             │
│                             │
│        CRISIS ARTWORK       │
│                             │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│ ┌─────┐ CRISIS TYPE         │
│ │DUR  │                     │
│ └─────┘                     │
├─────────────────────────────┤
│                             │
│        GLOBAL EFFECT        │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│      ADAPTATION OPTIONS     │
└─────────────────────────────┘
```

## Key Elements

### Primary Game Elements

1. **Duration** (Below Artwork, Left)
   - Circle or diamond shape
   - Number of rounds or special duration
   - Duration icon (hourglass, infinity, etc.)
   - High contrast with background

2. **Crisis Type** (Below Artwork, Right)
   - Category of global event
   - Options include:
     - Environmental: Physical battlefield effects
     - Temporal: Time and turn-based effects
     - Dimensional: Reality-warping effects
     - Anomalous: Unique and bizarre effects

3. **Adaptation Options** (Bottom Section)
   - Alternative player responses to the crisis
   - May include conditional benefits
   - Strategic choices that affect gameplay

### Card Identity Elements

1. **Card Name** (Top Center)
   - 22-26pt bold font
   - Dramatic naming convention
   - Enhanced visual treatment
   - Examples: "Void Surge," "Reality Fracture"

### Content Elements

1. **Crisis Artwork** (Upper 50%)
   - Full bleed to middle band
   - Dramatic, large-scale environmental scene
   - Global or cosmic in scope
   - High impact visual representing catastrophic event

2. **Global Effect** (Lower Middle)
   - Primary game-changing rule
   - Affects all players equally
   - May include multiple related effects
   - Left-aligned for readability
   - Often includes icons for affected elements

## Visual Design Specifications

### Differentiation from Other Card Types

- **Distinct premium frame**: More elaborate than standard cards
- **Landscape-oriented design elements**: Emphasizes global impact
- **Dramatic artwork**: Environmental or cosmic scale
- **Unique card back**: Special design to identify in Crisis deck

### Color Coding

#### By Crisis Type

- **Environmental**: Green/brown color scheme
- **Temporal**: Blue/purple color scheme
- **Dimensional**: Yellow/orange color scheme
- **Anomalous**: Red/black color scheme

#### By Duration

- **Single Round**: Simple border treatment
- **Multi-Round**: Enhanced border with round counters
- **Permanent**: Premium border with persistent effect indicator
- **Variable**: Special border with conditional duration markers

### Typography

- **Card Name**: Impact or similar dramatic font, 22-26pt
- **Crisis Type**: All caps, condensed font
- **Global Effect**: Open Sans, slightly larger than on standard cards
- **Adaptation Options**: Open Sans Italic

### Accessibility Considerations

- High contrast between text and background
- Distinct icon for each crisis type
- Duration clearly indicated by both number and visual cue
- Critical game terms highlighted for emphasis

## Digital Implementation

For the digital version, Crisis Cards include:

1. **Dramatic Entrance**
   - Fullscreen animation when revealed
   - Environmental effects on gameboard
   - Sound effects signaling impact
   - Dynamic lighting changes

2. **Visual Persistence**
   - Active crisis displayed prominently
   - Countdown timer for duration
   - Visual effects on battlefield reflecting crisis
   - UI elements showing affected game mechanics

3. **Animation Guidelines**
   - Reveal animation: Rise from center with shockwave effect
   - Duration transition: Visual countdown between turns
   - Resolution animation: Dissolve or dramatic exit effect
   - Persistent subtle animation while active

## Template Resources

- [Crisis Card Template - PSD](../design/templates/crisis_card_template.psd)
- [Crisis Card Template - PNG](../design/templates/crisis_card_template.png)
- [Crisis Effect Icons Pack](../design/icons/crisis_icons.zip)

## Examples

### Environmental Crisis Example

![Environmental Crisis Example](../design/examples/environmental_crisis_card.png)

### Temporal Crisis Example

![Temporal Crisis Example](../design/examples/temporal_crisis_card.png)

### Anomalous Crisis Example

![Anomalous Crisis Example](../design/examples/anomalous_crisis_card.png)

---

*Related Documents:*

- [Card Layout Overview](card_layout_overview.md)
- [Crisis System Mechanics](../mechanics/crisis_system.md)
- [Global Effects Reference](../mechanics/global_effects.md)
