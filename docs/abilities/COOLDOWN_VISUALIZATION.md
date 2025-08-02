# Cooldown Visualization

This document details the visual system for representing ability cooldowns across units, heroes, and other game elements.

## Table of Contents

1. [Cooldown System Overview](#cooldown-system-overview)
2. [Visual Design Principles](#visual-design-principles)
3. [Digital Implementation](#digital-implementation)
4. [Physical Implementation](#physical-implementation)
5. [Cooldown Types](#cooldown-types)
6. [State Transitions](#state-transitions)
7. [Cooldown Modifications](#cooldown-modifications)
8. [Accessibility Considerations](#accessibility-considerations)
9. [UI Integration](#ui-integration)

## Cooldown System Overview

The cooldown system manages the reuse timing of powerful abilities across various game elements. Effective visualization of cooldowns is critical for player decision-making and game readability.

### Core Cooldown Mechanics

- **Cooldown Timer**: Number of turns before an ability can be used again
- **Cooldown Initialization**: Triggered when an ability is used
- **Cooldown Reduction**: Effects that can decrease remaining cooldown time
- **Cooldown Reset**: Effects that immediately reset cooldown to zero
- **Cooldown Lock**: Effects that prevent cooldown from decreasing
- **Extended Cooldown**: Effects that increase the base cooldown duration

### Design Goals

The cooldown visualization system aims to:

- Provide clear, unmistakable indication of ability availability
- Show precise information about remaining cooldown duration
- Integrate harmoniously with the overall visual design
- Maintain readability in complex board states
- Accommodate various cooldown durations and states
- Support accessibility needs for all players

## Visual Design Principles

The fundamental principles guiding cooldown visualization:

### Visual Hierarchy

Cooldowns follow a clear visual hierarchy:

- **Available**: Most visually prominent state
- **Cooling Down**: Clear but less prominent than available
- **Locked/Disabled**: Least visually prominent state

### Color System

| State | Primary Color | Secondary Color | Purpose |
|-------|--------------|-----------------|---------|
| Available | Bright faction color | White pulse | Draw attention to ready abilities |
| Cooldown Active | Muted faction color | Gray overlay | Indicate unavailability while maintaining identity |
| Final Cooldown Turn | Brightening faction color | Yellow pulse | Alert to upcoming availability |
| Cooldown Paused | Frozen blue overlay | White crystalline texture | Indicate suspended countdown |
| Cooldown Locked | Red overlay | Dark ripple effect | Indicate inability to cool down |

### Animation Guidelines

Animation patterns serving specific information purposes:

- **Rhythmic Pulse**: Indicates available ability, pulse rate increases when optimal use conditions exist
- **Clockwise Fill**: Shows cooldown progression, moving from empty to full
- **Brightening Intensity**: Increases as cooldown approaches completion
- **Shimmer Effect**: Draws attention to newly available abilities
- **Alert Flash**: Indicates status changes (cooldown started, reduced, or reset)

## Digital Implementation

Technical implementation of cooldown visualization in the digital game:

### Base Visualization Components

![Cooldown Indicator Anatomy](../assets/cooldowns/cooldown_anatomy.png)

| Component | Purpose | Behavior |
|-----------|---------|----------|
| Ability Icon | Identifies the ability | Dims during cooldown |
| Cooldown Overlay | Shows remaining time | Circular sweep from full to empty |
| Numeric Counter | Precise turns remaining | Number decreases each turn |
| Status Effect Indicator | Shows cooldown modifications | Icon appears when cooldown is affected |
| Availability Pulse | Indicates ready state | Pulsates when ability is available |

### Animation Specifications

| Animation | Duration | Trigger | Technical Requirements |
|-----------|----------|---------|------------------------|
| Cooldown Start | 0.5s | Ability use | Radial wipe transition |
| Cooldown Tick | 0.3s | Turn change | Numeric decrease with bounce effect |
| Cooldown Complete | 0.7s | Reaching zero | Shimmer effect with bright pulse |
| Cooldown Reduction | 0.4s | Reduction effect | Counter flash with rapid decrease |
| Cooldown Reset | 0.6s | Reset effect | Burst effect with rapid transition |

### Technical Implementation Guidelines

- Use shader-based effects for smooth circular cooldown indicators
- Implement composite layer system to handle status modifiers
- Ensure animation timing synchronizes with game turn transitions
- Cache cooldown states to ensure consistent visualization after screen transitions
- Implement adaptive resolution for cooldown indicators based on device capabilities

## Physical Implementation

Cooldown visualization for the physical version of the game:

### Cooldown Trackers

![Physical Cooldown Tracker](../assets/cooldowns/physical_tracker.png)

| Component | Implementation | Usage |
|-----------|----------------|-------|
| Cooldown Dial | Rotating dial with numbered positions | Turn to indicate remaining cooldown |
| Cooldown Tokens | Numbered tokens placed on ability cards | Remove one token each turn |
| Status Markers | Colored clips attached to ability cards | Indicate modified cooldown states |
| Cooldown Track | Numbered track on player board | Move marker along track each turn |
| Cooldown Cards | Small cards placed on abilities | Flip or discard each turn |

### Physical Game Guidance

- Recommend standardized method for counting cooldowns (clockwise rotation)
- Provide clear turn sequence instructions for cooldown management
- Include cooldown reset reminders on turn summary cards
- Use distinct token shapes/colors for different cooldown types
- Provide template for printable cooldown trackers

## Cooldown Types

Different abilities have different cooldown visualization patterns:

### Standard Cooldowns

Most common cooldown type with straightforward visualization:

- Clear numeric display
- Consistent clockwise fill pattern
- Standardized color treatment
- Regular turn-based reduction

### Variable Cooldowns

Cooldowns that may change based on conditions:

- Range indicator showing minimum/maximum values
- Dynamic fill pattern with gradient color
- Secondary indicator showing condition for reduction
- Tooltip explaining variable factors

### Conditional Cooldowns

Cooldowns based on specific conditions rather than turns:

- Icon showing trigger condition
- Text explanation of reset mechanism
- Distinct visual treatment from turn-based cooldowns
- Progress indicator toward condition when applicable

### Permanent Cooldowns

One-time use abilities that don't reset:

- "Used" overlay instead of cooldown indicator
- Distinct visual treatment from standard cooldowns
- No numeric counter
- Optional: acquisition method for additional uses

## State Transitions

Visualizing transitions between cooldown states:

### Ability Usage Transition

When an ability is used and enters cooldown:

- Initial flash effect on ability icon
- Smooth fill animation of cooldown overlay
- Numeric counter appears with initial value
- Ability icon desaturates to indicate unavailability
- Optional sound effect reinforces transition

### Cooldown Progression

As cooldown naturally decreases each turn:

- Smooth animation of overlay reduction
- Numeric counter decrements with attention effect
- Subtle sound cue for cooldown tick
- Color intensity increases as cooldown approaches zero
- Ability icon gradually regains saturation

### Cooldown Completion

When cooldown reaches zero:

- Burst animation emanating from ability icon
- Overlay disappears with dissolve effect
- Numeric counter disappears
- Ability icon returns to full saturation with pulse effect
- Distinctive sound cue signals availability

### Cooldown Modification

When cooldown is affected by external effects:

- Flash effect highlights the change
- Numeric counter updates with emphasis effect
- Special particle effects indicate nature of modification
- Appropriate sound cue signifies type of modification

## Cooldown Modifications

Visualizing effects that alter normal cooldown progression:

### Cooldown Reduction

When an effect reduces remaining cooldown time:

- Brief yellow flash on cooldown indicator
- Accelerated fill animation
- Numeric counter decreases with emphasizing effect
- Particle effect showing time acceleration
- Reduction amount briefly displayed (e.g., "-2")

### Cooldown Reset

When cooldown is immediately reduced to zero:

- Bright flash effect across entire ability
- Rapid fill animation completing the cooldown
- Counter rapidly decreases to zero
- Distinctive "reset" sound effect
- Availability pulse begins immediately

### Cooldown Extension

When cooldown duration is increased:

- Red flash on cooldown indicator
- Expanded cooldown area with reverse fill
- Numeric counter increases with emphasizing effect
- Particle effect showing time deceleration
- Extension amount briefly displayed (e.g., "+2")

### Cooldown Lock

When cooldown progression is paused:

- Blue crystalline overlay appears on cooldown indicator
- Pulsing freeze effect around counter
- "Locked" icon appears next to counter
- Counter displays normally but with frost visual effect
- Duration of lock displayed if applicable

## Accessibility Considerations

Ensuring cooldown status is clear for all players:

### Visual Accessibility

- High contrast mode enhances difference between cooldown states
- Numeric indicators use clear, legible font at minimum 16pt size
- Cooldown states distinguishable without relying solely on color
- Pattern differentiation supplements color coding
- Screen reader integration announces cooldown states and changes

### Cognitive Accessibility

- Consistent positioning of cooldown indicators
- Clear association between abilities and their cooldowns
- Simplified visualization option reduces animation complexity
- Optional text descriptions of cooldown status
- Consistent language for cooldown mechanics across UI

### Motor Accessibility

- Hover tooltips provide detailed cooldown information
- Automatic turn reminders for available abilities
- Option to display all cooldowns in consolidated area
- Voice command support for cooldown information
- Adjustable timing for cooldown animation speed

## UI Integration

How cooldown visualization integrates with the broader game interface:

### Card Presentation

- Cooldown indicators positioned consistently on ability cards
- Size proportional to ability importance
- Layered above card art but below card frame
- Semi-transparent to avoid obscuring key art elements
- Consistent placement across all card types

### Board State View

- Cooldown status visible on unit/hero representations on board
- Consolidated cooldown panel available in side UI
- Option to highlight all available/unavailable abilities
- Sorting options to group abilities by cooldown status
- Turn planning tool showing projected cooldown states

### Action Sequence

- Ability use immediately updates cooldown visualization
- End of turn effects that modify cooldowns show clear cause-effect
- Beginning of turn updates occur simultaneously
- Option to pause between cooldown update animations
- History log tracks cooldown changes with timestamps

### Information Density Management

- Scaled visualization based on zoom level
- Ability to toggle detailed/simplified cooldown display
- Consolidation of similar cooldowns when appropriate
- Prioritized display of near-complete cooldowns
- Context-sensitive detail level based on current game phase

---

The cooldown visualization system ensures players always have clear information about ability availability, helping them make strategic decisions while maintaining an immersive gameplay experience.

Last Updated: 2025-08-01
