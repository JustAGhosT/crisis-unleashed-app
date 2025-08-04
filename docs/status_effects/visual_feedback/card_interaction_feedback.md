# Card Interaction Feedback

## Overview

Card interaction feedback encompasses all visual responses that occur when players interact with cards in Crisis Unleashed. These feedback mechanisms help players understand card states, available actions, and the results of their interactions with cards throughout the game.

## Card State Indicators

### Card Selection States

Cards visually indicate their selection state:

| State | Visual Indicator | Duration | Animation |
|-------|-----------------|----------|-----------|
| Unselected | Standard appearance | Default state | None |
| Hover | Subtle glow effect, 10% scale increase | During hover | 0.2s ease-in transition |
| Selected | Prominent glow effect, lifted 20px, 15% scale increase | Until deselected | 0.3s ease-out transition |
| Highlighted | Pulsing golden border | Context-dependent | Subtle pulse every 1.5s |
| Disabled | Desaturated (-40%), darkened (-30%) | While unavailable | 0.3s transition to state |

### Playability Indicators

Cards indicate their current playability:

| State | Visual Indicator | Trigger Condition |
|-------|-----------------|------------------|
| Playable | Green glow around cost, subtle upward hover animation | Sufficient resources and valid play conditions |
| Partially Playable | Yellow glow around cost | Special conditions required (e.g., cost reduction needed) |
| Unplayable | Red glow around cost, slightly darkened | Insufficient resources or invalid play conditions |
| Conditionally Playable | Pulsing blue glow | Requirements can be met this turn with additional actions |

## Card Movement Animations

### Draw Animation

When cards are drawn:

1. **Starting Position**: Slightly off-screen at deck position
2. **Movement Path**: Arc motion toward hand position
3. **Movement Speed**: 400ms duration with ease-out timing
4. **Rotation**: Card rotates from deck orientation to hand orientation
5. **Scale**: Card scales from 70% to 100% during movement
6. **Special Cases**: Last card in deck has distinctive "final card" golden trail effect

### Play Animation

When cards are played:

1. **Starting Position**: Hand position
2. **Movement Path**: Arc toward target position (field, condition area, etc.)
3. **Movement Speed**: 350ms duration with ease-in-out timing
4. **Rotation**: Card rotates to match destination orientation
5. **Scale**: Card scales appropriately for destination
6. **Energy Effect**: Energy particles flow from player's energy pool to card

### Discard Animation

When cards are discarded:

1. **Starting Position**: Current card location
2. **Movement Path**: Quick arc toward discard pile
3. **Movement Speed**: 250ms duration with ease-in timing
4. **Rotation**: Card rotates 180° during movement
5. **Scale**: Card scales down to 60% during movement
6. **Effect**: Brief red particle effect as card reaches discard pile

## Targeting Feedback

### Valid Targets

When selecting targets for card effects:

1. **Indicator**: Pulsing green circular aura beneath valid targets
2. **Connection Visual**: Subtle energy line connecting card to potential targets
3. **Hover Effect**: Target highlight intensity increases on hover
4. **Selection Effect**: Brief flash effect when target is selected
5. **Multiple Targets**: Numbered indicators appear when selecting multiple targets

### Invalid Targets

When attempting to target invalid targets:

1. **Indicator**: Red X icon briefly appears
2. **Effect**: Subtle shake animation (3 oscillations over 0.4s)
3. **Audio**: Error sound supplements visual feedback
4. **Tooltip**: Context-specific tooltip explains why target is invalid
5. **Cursor**: Cursor changes to "invalid" state

### Target Preview

Preview effects for targeted actions:

1. **Damage Preview**: Red number indicates predicted damage
2. **Healing Preview**: Green number indicates predicted healing
3. **Buff Preview**: Blue arrow indicates stat increase
4. **Debuff Preview**: Red arrow indicates stat decrease
5. **Complex Effects**: Icon indicates special effect with tooltip for details

## Card Transformation Feedback

### Card Evolution

Visual feedback when a card evolves:

1. **Initial Effect**: Card glows and particle effect builds (1s)
2. **Transition**: Card art morphs between states (0.8s)
3. **Frame Change**: Card frame transforms to evolved state (0.6s)
4. **Stat Change**: Stats pulse and change with numeric indicators (0.5s)
5. **Completion Effect**: Burst of energy particles from card (0.4s)

### Card Corruption

Visual feedback when a card becomes corrupted:

1. **Initial Effect**: Dark tendrils appear at card edges (0.7s)
2. **Transition**: Corruption effect spreads across card (1.2s)
3. **Color Shift**: Card colors shift toward corruption palette (0.8s)
4. **Stat Change**: Stats pulse and change with numeric indicators (0.5s)
5. **Completion Effect**: Dark aura remains around card

### Card Cleansing

Visual feedback when a card is cleansed:

1. **Initial Effect**: White light appears at card center (0.5s)
2. **Transition**: Cleansing light spreads outward (0.8s)
3. **Color Restoration**: Card colors return to normal state (0.6s)
4. **Stat Restoration**: Stats pulse and restore with numeric indicators (0.5s)
5. **Completion Effect**: Brief shimmering effect (0.3s)

## Invalid Action Feedback

When players attempt invalid card actions:

| Invalid Action | Visual Feedback | Duration | Additional Effects |
|----------------|----------------|----------|-------------------|
| Insufficient Energy | Card shakes, energy cost flashes red | 0.5s | Energy indicator also flashes |
| Invalid Target | Targeting line breaks with spark effect | 0.4s | Red X appears at target point |
| Invalid Placement | Card returns to hand with bounce effect | 0.6s | Brief red outline on invalid zone |
| Restricted Action | Card pulses red and returns to original position | 0.7s | "Restricted" icon appears briefly |
| Timing Restriction | Clock icon appears over card | 0.8s | Card briefly displays "Not Now" indicator |

## Card Examination Feedback

When players examine cards in detail:

1. **Initial Scale**: Card scales up to 150% of normal size
2. **Position**: Card moves to center-screen examination area
3. **Background**: Rest of game darkens by 40%
4. **Detail Elements**: Card elements highlight as hovered
5. **Related Cards**: Related cards appear in smaller size below
6. **Dismissal**: Card returns to original position with reverse animation

## Physical Card Implementation

For the physical card game:

1. **Card Finishes**: Metallic foil highlights on special cards
2. **Tactile Elements**: Embossed borders for key card elements
3. **Light Interaction**: Holographic elements that change with viewing angle
4. **Card Backs**: Distinctive pattern designs that indicate card types
5. **Token Indicators**: Physical tokens that match digital visual effects

## Accessibility Considerations

Accommodations for players with different needs:

1. **High Contrast Mode**: Increases distinction between card elements
2. **Animation Reduction**: Option to reduce or disable card animations
3. **Color Blind Support**: Pattern distinctions in addition to color coding
4. **Screen Reader Support**: Textual descriptions of visual feedback
5. **Zoom Functionality**: Ability to magnify card details further

## Technical Implementation

For developers implementing card feedback:

1. **Asset Requirements**: Sprite sheets for each animation state
2. **Performance Considerations**: Level-of-detail scaling based on device performance
3. **Memory Management**: Pooled effect system for efficient resource usage
4. **Animation Framework**: Timeline-based system with interrupt handling
5. **State Management**: Clean state transitions between feedback types

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*
