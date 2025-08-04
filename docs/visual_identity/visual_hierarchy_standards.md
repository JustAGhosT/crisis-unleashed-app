# Visual Hierarchy Standards

## Overview

Visual hierarchy is the arrangement of elements in order of importance. In Crisis Unleashed, a clear visual hierarchy ensures players can quickly process information during gameplay, understand card effects at a glance, and identify key game elements without confusion. This document establishes the standards for visual hierarchy across all game components.

## Core Principles

The visual hierarchy in Crisis Unleashed follows these fundamental principles:

1. **Information Priority**: The most important information appears in the most prominent positions
2. **Visual Contrast**: More important elements have greater visual weight through size, color, and contrast
3. **Spatial Relationships**: Related elements are grouped together
4. **Consistent Placement**: Similar elements appear in the same position across different components
5. **Progressive Disclosure**: Complex information is revealed in stages, not all at once

## Card Visual Hierarchy

### Hero Cards

Hero cards have the most complex information structure and establish the primary visual hierarchy pattern:

``` text
┌───────────────────────────┐
│ 1. HERO NAME & COST       │ ← Primary identifier
├───────────────────────────┤
│                           │
│ 2. HERO ART               │ ← Visual identity
│                           │
├───────────────────────────┤
│ 3. FACTION IDENTIFIER     │ ← Categorization
├───────────────────────────┤
│                           │
│ 4. HERO TYPE & STATS      │ ← Core mechanics
│                           │
├───────────────────────────┤
│                           │
│ 5. PRIMARY ABILITY        │ ← Primary gameplay
│                           │
├───────────────────────────┤
│                           │
│ 6. SECONDARY ABILITIES    │ ← Secondary gameplay
│                           │
├───────────────────────────┤
│ 7. FLAVOR TEXT            │ ← Tertiary content
└───────────────────────────┘
```

**Implementation Guidelines**:

1. **Name & Cost**
   - Largest text size on card (18-24pt)
   - High contrast against background
   - Always includes associated Energy/Momentum cost in top corner

2. **Hero Art**
   - Occupies 40-50% of card face
   - Full-bleed art with transparent overlay for name
   - Character positioned for eye contact with viewer

3. **Faction Identifier**
   - Unique faction symbol
   - Faction color as background element
   - Always in the same position relative to name

4. **Hero Type & Stats**
   - Bold numerical indicators for Health/Attack
   - Type indicator (True/Echo/Dual) with distinct icon
   - Immediately identifiable through shape and position

5. **Primary Ability**
   - First ability listed
   - Slightly larger text than secondary abilities
   - Often includes unique ability icon

6. **Secondary Abilities**
   - Uniform text size
   - Clearly delineated from primary ability
   - Limited to 2-3 abilities to prevent overcrowding

7. **Flavor Text**
   - Smallest text size (8-10pt)
   - Italicized and lower contrast
   - Visually separated from mechanical text

### Unit Cards

Unit cards follow a similar but simplified hierarchy:

``` text
┌───────────────────────────┐
│ 1. UNIT NAME & COST       │
├───────────────────────────┤
│                           │
│ 2. UNIT ART               │
│                           │
├───────────────────────┬───┤
│ 3. UNIT TYPE          │4. │ ← Attack/Health stats
├───────────────────────┴───┤
│                           │
│ 5. ABILITIES              │
│                           │
├───────────────────────────┤
│ 6. FLAVOR TEXT            │
└───────────────────────────┘
```

### Action Cards

Action cards emphasize the effect over other elements:

``` text
┌───────────────────────────┐
│ 1. ACTION NAME & COST     │
├───────────────────────────┤
│                           │
│ 2. ACTION ART             │
│                           │
├───────────────────────────┤
│ 3. ACTION TYPE            │
├───────────────────────────┤
│                           │
│ 4. EFFECT TEXT            │
│                           │
├───────────────────────────┤
│ 5. FLAVOR TEXT            │
└───────────────────────────┘
```

### Condition Cards

Condition cards highlight their duration and persistent effects:

``` text
┌───────────────────────────┐
│ 1. CONDITION NAME & COST  │
├───────────────────────────┤
│                           │
│ 2. CONDITION ART          │
│                           │
├───────────────────────┬───┤
│ 3. CONDITION TYPE     │4. │ ← Duration indicator
├───────────────────────┴───┤
│                           │
│ 5. EFFECT TEXT            │
│                           │
├───────────────────────────┤
│ 6. FLAVOR TEXT            │
└───────────────────────────┘
```

## Interface Visual Hierarchy

### Main Game Screen

The visual hierarchy of the digital interface organizes information to minimize cognitive load:

``` text
┌─────────────────────────────────────────────────┐
│ 1. OPPONENT HERO INFORMATION                    │ ← Primary opponent information
├─────────────────────────────────────────────────┤
│                                                 │
│ 2. OPPONENT BOARD STATE                         │ ← Secondary opponent information
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ 3. SHARED GAME STATE (Condition Field)          │ ← Shared information
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ 4. PLAYER BOARD STATE                           │ ← Primary game state
│                                                 │
├─────────────────────────────────────────────────┤
│ 5. PLAYER HAND                                  │ ← Available actions
├─────────────────────────────────────────────────┤
│ 6. PLAYER HERO INFORMATION                      │ ← Player information
└─────────────────────────────────────────────────┘
```

**Implementation Guidelines**:

1. **Focus Area Highlighting**: The active area receives increased brightness/saturation
2. **Information Density Management**: More complex zones can be expanded when active
3. **Action Indicators**: Available actions have visual cues (glowing borders, etc.)
4. **Alert Hierarchy**: Critical alerts override the standard hierarchy temporarily

### Card Detail View

When examining a specific card, the hierarchy shifts to emphasize details:

``` text
┌─────────────────────────────────────────────────┐
│ ← RETURN TO GAME                                │ ← Navigation
├─────────────────────────────────────────────────┤
│                                                 │
│                                                 │
│                                                 │
│ 1. ENLARGED CARD                                │ ← Primary focus
│                                                 │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│ 2. CARD DETAILS AND RULES TEXT                  │ ← Expanded information
├─────────────────────────────────────────────────┤
│ 3. RELATED CARDS / INTERACTIONS                 │ ← Contextual information
└─────────────────────────────────────────────────┘
```

## Visual Weight Techniques

The following techniques establish visual hierarchy across all components:

### Size Hierarchy

Element sizes follow a consistent ratio pattern:

1. **Primary elements**: 100% (base size)
2. **Secondary elements**: 70-80% of primary
3. **Tertiary elements**: 50-60% of primary
4. **Quaternary elements**: 30-40% of primary

### Color and Contrast Hierarchy

Color is used systematically to direct attention:

1. **Primary information**: Highest contrast (90-100% against background)
2. **Secondary information**: High contrast (70-80%)
3. **Tertiary information**: Medium contrast (50-60%)
4. **Quaternary information**: Low contrast (30-40%)

### Typography Hierarchy

Text follows a consistent hierarchy through size and weight:

1. **Primary text**: Large (18-24pt), Bold or Heavy
2. **Secondary text**: Medium (14-16pt), Semi-Bold
3. **Tertiary text**: Small (10-12pt), Regular
4. **Quaternary text**: Very small (8-10pt), Light or Italic

## Element Positioning Standards

### Z-Index Layering

The layering of interface elements follows this priority order (from top to bottom):

1. **Critical alerts and notifications**
2. **Active selection highlights**
3. **Interactive controls and buttons**
4. **Card information and game state**
5. **Decorative elements and backgrounds**

### Reading Patterns

Layout design accounts for cultural reading patterns:

1. **Primary markets**: Left-to-right, top-to-bottom reading pattern
2. **RTL language support**: Right-to-left adaptation available
3. **Key information**: Always positioned in F-pattern hotspots

## Responsive Adaptation

The visual hierarchy adapts to different screen sizes while maintaining information priority:

### Desktop to Mobile Transition

```text
Desktop:                     Mobile:
┌───┬───┬───┬───┐           ┌───────────┐
│ 1 │ 2 │ 3 │ 4 │           │     1     │
├───┼───┼───┼───┤           ├───────────┤
│ 5 │ 6 │ 7 │ 8 │     →     │  2  │  3  │
├───┼───┼───┼───┤           ├───────────┤
│ 9 │10 │11 │12 │           │  4  │  5  │
└───┴───┴───┴───┘           └───────────┘
                            • Items 6-12 
                            accessible through
                            scrolling or tabs
```

**Key Principles for Adaptation**:

1. **Preserve information hierarchy** across all screen sizes
2. **Prioritize essential gameplay elements** when space is limited
3. **Group related elements** more tightly on smaller screens
4. **Replace textual elements with icons** where appropriate on smaller screens

## Accessibility Considerations

The visual hierarchy is designed to be perceivable by all players:

1. **Color is never the only differentiator** for important information
2. **Text contrast meets WCAG AA standards** at minimum
3. **Critical information has redundant cues** (color + shape + position)
4. **Focus states are clearly visible** for interactive elements

## Animation Hierarchy

Animations follow a hierarchical pattern to avoid overwhelming the player:

1. **Primary animations**: Major game events (victory, card played)
2. **Secondary animations**: State changes (turn change, unit damaged)
3. **Tertiary animations**: Ambient/environmental (card hover, idle effects)

**Duration Guidelines**:

- Primary animations: 0.6-1.0 seconds
- Secondary animations: 0.3-0.5 seconds
- Tertiary animations: 0.1-0.2 seconds

## Implementation Specifications

### Development Requirements

For developers implementing the visual hierarchy:

1. **CSS Class Naming**: Follow the pattern `cu-[element]-[priority]`
   - Example: `cu-text-primary`, `cu-text-secondary`, etc.

2. **Variable Structure**: Design tokens use this organization:

   ``` text
   --cu-hierarchy-primary-[property]: value;
   --cu-hierarchy-secondary-[property]: value;
   ```

3. **Component Structure**: Components must support hierarchy props:

   ```jsx
   <CrisisText hierarchyLevel="primary">Example</CrisisText>
   ```

### Designer Requirements

For designers creating assets that adhere to the visual hierarchy:

1. **Artboard Setup**: Use the standard template with hierarchy guides
2. **Layer Naming**: Name layers with hierarchy level prefix (`P_` for primary)
3. **Style Application**: Use shared styles from the hierarchy library

## Testing the Hierarchy

The effectiveness of the visual hierarchy should be tested using:

1. **Five-second tests**: Show interface for 5 seconds, ask what users remember
2. **Eye-tracking analysis**: Verify gaze patterns follow intended hierarchy
3. **Comprehension testing**: Verify users understand relationships between elements
4. **A/B testing**: Compare alternative hierarchies for effectiveness

## Faction-Specific Adaptations

While maintaining overall hierarchy standards, each faction has subtle variations

### Solaris Nexus

- Primary elements use radiant highlight effects
- Information radiates from central points

### Umbral Eclipse

- Increased contrast between hierarchy levels
- Secondary information often revealed on interaction

### Aeonic Dominion

- Temporal progression in information display
- Clockwise arrangement of secondary elements

### Primordial Genesis

- Organic, flowing transitions between hierarchy levels
- Growing/evolving visual indicators

### Infernal Core

- Intense primary element highlighting
- Dramatic contrast between levels

### Neuralis Conclave

- Subtle connection lines between related elements
- Neural network-inspired information grouping

### Synthetic Directive

- Modular, grid-based arrangement
- Systematic spacing between hierarchy levels

## Documentation and Reference

Designers and developers should refer to these additional resources:

1. **Hierarchy Specification Sheets**: Detailed measurements for each component
2. **Component Library**: Working examples with proper hierarchy implementation
3. **Animation Reference Videos**: Demonstrations of animation hierarchy

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*
