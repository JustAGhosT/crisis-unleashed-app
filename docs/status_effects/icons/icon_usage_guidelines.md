# Icon Usage Guidelines

## Overview

This document provides comprehensive guidelines for the proper usage of icons throughout Crisis Unleashed. Following these standards ensures consistency across all game components, maximizes player recognition, and maintains the visual integrity of the game's design language.

## General Icon Usage Principles

### Core Principles

1. **Consistency**: Use icons consistently for the same concept across all contexts
2. **Clarity**: Select the most appropriate icon to clearly communicate function
3. **Simplicity**: Use the minimum number of icons needed to convey information
4. **Context**: Consider the surrounding context when implementing icons
5. **Accessibility**: Ensure icons work for players of all abilities

### When to Use Icons

Icons should be used when they:

- Provide instant recognition of a function or concept
- Save space compared to text equivalents
- Reinforce text elements
- Need to be recognized across language barriers
- Represent standardized game concepts

### When to Avoid Icons

Avoid using icons when:

- The concept is too complex to represent visually
- There are too many similar icons that may cause confusion
- The icon would be unfamiliar to players without extensive explanation
- Text alone would be clearer or more efficient

## Physical Card Implementation

### Card Element Icons

| Card Location | Icon Type | Size | Placement | Notes |
|---------------|-----------|------|-----------|-------|
| Top Left | Cost | 12mm | Flush with corner | High contrast background |
| Top Center | Card Type | 10mm | Centered on type bar | Consistent across card types |
| Text Box | Keywords | 5mm | Left-aligned before keyword text | Always paired with text |
| Bottom Right | Rarity | 8mm | Flush with corner | Color matches rarity |
| Stats Area | Attack/Health | 7mm | Adjacent to value | Consistent position |

### Multiple Icon Presentation

When multiple icons need to appear together:

- **Horizontal Arrangement**: Place icons in a single row with 2-3mm spacing
- **Vertical Stacking**: Stack no more than 3 icons vertically with 2mm spacing
- **Grouping**: Use subtle dividing lines or backgrounds to separate icon groups
- **Priority Order**: Most important icons should appear leftmost or topmost

### Physical Card Example

``` text
┌───────────────────────┐
│ ⚡3 │                │
│    │   CARD NAME     │
│    │                 │
├────┼─────────────────┤
│    │                 │
│    │                 │
│    │   CARD ART      │
│    │                 │
│    │                 │
├────┴─────────────────┤
│ FACTION   │ TYPE ◆   │
├───────────┴──────────┤
│                      │
│ 🛡️ DEFENDER          │
│                      │
│ Card text describing │
│ effects and abilities│
│                      │
├──────────────────────┤
│ ⚔️2     │      3❤️   │
│         │          ★ │
└─────────┴────────────┘
```

## Digital Interface Implementation

### Icon Sizing Standards

| Context | Size | Spacing | Notes |
|---------|------|---------|-------|
| Navigation | 32px | 16px | Primary navigation icons |
| Buttons | 24px | 12px | Action button icons |
| Status Effects | 20px | 8px | On cards or units |
| Card Elements | 16px | 6px | Small indicators |
| Tooltips | 12px | 4px | Information icons |

### Icon States in UI

Each interactive icon must have these states:

1. **Default**: Normal appearance
2. **Hover/Focus**: Subtle highlight or glow effect
3. **Active/Pressed**: Visually depressed or highlighted state
4. **Disabled**: Greyed out appearance
5. **Selected**: Clearly distinguished selected state

### Responsive Design Considerations

Icons must adapt to different screen sizes:

- **Desktop**: Standard sizing with hover states
- **Tablet**: 25% larger with increased touch areas
- **Mobile**: 50% larger with at least 44x44px touch targets
- **Critical Actions**: Position within thumb-reachable areas

### Digital Implementation Example

``` text
┌─────────────────────────────────────┐
│ ⚡ 15  │  ❤️ 25  │  🌀 2  │  ⚔️ 0   │  ← Resource bar
├─────────────────────────────────────┤
│                                     │
│                                     │
│                                     │
│          GAME BOARD AREA            │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  🏠    │  ⚙️    │  👤    │   ?     │  ← Navigation icons
└─────────────────────────────────────┘
```

## Icon Color Usage

### Color Hierarchy

Icon colors should follow these general principles:

1. **Primary Function Color**: Represents the icon's core function
2. **Secondary Detail Color**: Used for details within the icon
3. **State Colors**: Used to indicate different states (active, disabled, etc.)
4. **Background Contrast**: Ensure sufficient contrast with background

### Standard Color Meanings

| Color | Hex Code | Usage |
|-------|----------|-------|
| Blue | #1E90FF | Navigation, information |
| Green | #32CD32 | Positive effects, success |
| Red | #B22222 | Negative effects, warnings |
| Gold | #FFD700 | Special, rare, valuable |
| Purple | #800080 | Magical, mysterious effects |
| Grey | #808080 | Neutral, disabled states |

### Color Interaction Rules

When multiple icon colors appear together:

- Maintain at least 3:1 contrast ratio between adjacent icons
- Limit to no more than 5 different colored icons in one view
- Use consistent color meanings across the interface
- Consider colorblind-friendly combinations

## Icon Animation Guidelines

### When to Animate Icons

Animate icons sparingly and only when:

- Indicating a state change
- Drawing attention to critical information
- Showing a process in progress
- Providing feedback to user actions
- Enhancing understanding of function

### Animation Types

1. **Subtle Pulse**: For drawing attention
2. **Rotate/Spin**: For loading or processing
3. **Color Shift**: For state changes
4. **Scale Change**: For selection or emphasis
5. **Directional Movement**: For indicating flow or process

### Animation Timing

- **Subtle Animations**: 0.2-0.3 seconds
- **State Changes**: 0.3-0.5 seconds
- **Attention Getting**: 0.5-0.8 seconds
- **Loading Indicators**: Continuous but subtle
- **Idle Animations**: Minimum 3-second cycle

### Animation Example

For a "Charging" status effect:

1. Initial appearance: Fade in over 0.3 seconds
2. Idle state: Subtle pulse every 2 seconds
3. Almost complete: More frequent pulsing (every 1 second)
4. Completion: Flash briefly (0.5 seconds) then transform

## Icon Combinations

### Modifier Icons

Modifier icons can be combined with base icons to extend meanings:

| Modifier | Example | Meaning |
|----------|---------|---------|
| + (Plus) | Attack+ | Enhanced version |
| × (Cross) | Defend× | Canceled/negated |
| ↑ (Up Arrow) | Energy↑ | Increasing/gaining |
| ↓ (Down Arrow) | Health↓ | Decreasing/losing |
| ! (Exclamation) | Move! | Urgent/special version |

### Stacking Conventions

For stacked status effects or keywords:

- Maximum 3-4 icons in a stack
- Ordered by importance (top to bottom)
- Show count (×2, ×3) for multiples of the same icon
- Group similar icons together

### Combination Examples

``` text
┌──────┐
│  ⚔️   │
│  ↑    │ ← Enhanced attack
└──────┘

┌──────┐
│  🛡️   │
│  ×    │ ← Negated defense
└──────┘

┌──────┐
│ ⚡×3  │ ← Three energy
└──────┘
```

## Special Considerations

### Opponent View Mirroring

When showing opponent's icons:

- Mirror horizontal layouts to maintain relationship direction
- Use consistent colors regardless of player perspective
- Add subtle opponent indicator when necessary
- Ensure critical information is equally legible

### Tournament Mode

In tournament/competitive displays:

- Emphasize clarity over aesthetics
- Increase size of critical information icons by 25%
- Add numerical values beside icons where applicable
- Ensure all icons visible from standard viewing distance

### Spectator Mode

For viewers/spectators:

- Add additional text labels for less common icons
- Highlight key information for viewers
- Use pulsing animation to draw attention to important changes
- Consider simplified icon set for new viewers

## Icon Localization

### Universal Design

Core game icons should be designed to be understood internationally:

- Avoid culture-specific symbols
- Test icons for cultural sensitivity
- Use universal concepts where possible
- Avoid text within icons when possible

### Text Replacement

When icons replace text:

- Provide tooltips or explanations on first encounter
- Include option to display text alongside icons
- Consider text-to-speech descriptions for accessibility
- Maintain consistent icon-to-concept mapping

### RTL Language Support

For right-to-left languages:

- Mirror directional icons (forward/back)
- Adjust icon placement to follow RTL reading order
- Test layouts with native RTL language speakers
- Maintain consistent meaning despite mirroring

## Accessibility Guidelines

### Visual Impairment Considerations

For players with visual impairments:

1. **High Contrast Mode**: Provide high-contrast versions of all icons
2. **Size Options**: Allow icon scaling up to 200%
3. **Colorblind Modes**: Alternative color schemes for all types of color blindness
4. **Pattern Differentiation**: Use distinct shapes and patterns, not just color
5. **Screen Reader Support**: Include text alternatives for all icons

### Cognitive Accessibility

For cognitive accessibility:

1. **Consistency**: Maintain strict icon-to-function consistency
2. **Simplicity**: Favor simple, clear icons over complex ones
3. **Familiarity**: Use widely recognized symbology when possible
4. **Reinforcement**: Pair icons with text in learning contexts
5. **Progressive Disclosure**: Introduce icons gradually during tutorials

### Physical Gameplay Considerations

For physical card game accessibility:

1. **Tactile Differentiation**: Use embossed or textured icons
2. **Size Standards**: Minimum 8mm for essential icons
3. **Contrast Ratios**: At least 4.5:1 for critical information
4. **Redundant Coding**: Use position, color, and shape to differentiate

## Implementation Checklist

Before implementing icons, verify the following:

- [ ] Icon clearly communicates intended function
- [ ] Consistent with existing icon system
- [ ] Works at all required sizes
- [ ] Maintains legibility in context
- [ ] Functions for colorblind users
- [ ] Has necessary states (if interactive)
- [ ] Includes accessibility alternatives
- [ ] Tested with target audience

## Icon Update Process

When updating existing icons:

1. **Gradual Transition**: Phase in changes over time
2. **Side-by-Side Display**: Show old and new versions during transition
3. **User Education**: Highlight changes and explain reasoning
4. **Backwards Compatibility**: Ensure old documentation remains relevant
5. **Version Tracking**: Label clearly with version numbers

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*