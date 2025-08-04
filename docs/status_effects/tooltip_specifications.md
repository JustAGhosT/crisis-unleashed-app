# Tooltip Specifications

## Overview

Tooltips in Crisis Unleashed provide contextual information about game elements when players hover over or select them. This document defines the comprehensive specifications for tooltip design, behavior, content, and implementation across all game platforms.

## Tooltip Design System

### Visual Design

All tooltips follow these core visual design principles:

1. **Consistent Framework**: Standardized appearance across all game contexts
2. **Hierarchical Information**: Most important information appears first
3. **Visual Relationship**: Tooltips visually connect to their trigger elements
4. **Minimal Obstruction**: Positioned to avoid covering critical game information
5. **Appropriate Sizing**: Size adapts to content while remaining compact

### Standard Tooltip Components

Each tooltip includes these components:

``` text
┌─────────────────────────────────┐
│ TITLE                           │ ← Primary identifier
├─────────────────────────────────┤
│                                 │
│ Description text that explains  │ ← Core information
│ the function or effect.         │
│                                 │
├─────────────────────────────────┤
│ ADDITIONAL DETAILS              │ ← Supplementary information
│ • Detail point one              │
│ • Detail point two              │
├─────────────────────────────────┤
│ ℹ️ Contextual note or tip       │ ← Optional helper information
└─────────────────────────────────┘
```

### Visual Styling

Standard tooltip styling:

- **Background**: #1A1A1A (85% opacity)
- **Border**: 1px solid #4682B4
- **Title Text**: 14pt, #FFFFFF, Bold
- **Description Text**: 12pt, #E0E0E0, Regular
- **Detail Text**: 11pt, #CCCCCC, Regular
- **Note Text**: 11pt, #AAAAAA, Italic
- **Drop Shadow**: 2px offset, 40% opacity
- **Corner Radius**: 4px
- **Maximum Width**: 300px
- **Padding**: 10px

## Tooltip Types and Behavior

### Tooltip Types

Crisis Unleashed uses these tooltip variations:

#### Basic Information Tooltip

- **Trigger**: Hover over simple UI elements
- **Content**: Short description of function
- **Duration**: Visible only during hover
- **Example**: Navigation buttons, simple icons

#### Extended Game Element Tooltip

- **Trigger**: Hover over game elements like cards, units
- **Content**: Full details including stats, abilities, effects
- **Duration**: Persists during hover, can be locked with click
- **Example**: Cards in hand, units on board

#### Instructional Tooltip

- **Trigger**: First encounter with new features or during tutorial
- **Content**: How-to information with images or animation
- **Duration**: Remains until dismissed, may have next/previous navigation
- **Example**: Tutorial elements, new feature introduction

#### Contextual Action Tooltip

- **Trigger**: Available actions or choices
- **Content**: Describes available actions and consequences
- **Duration**: Visible while action is available
- **Example**: Combat choices, card targeting options

#### Status Effect Tooltip

- **Trigger**: Hover over status effect icon
- **Content**: Effect name, description, duration, source
- **Duration**: Persists during hover
- **Example**: Empowered, Protected, or Corrupt status effects

### Tooltip Behavior

Tooltips follow these behavioral rules:

#### Timing and Animation

- **Appear Delay**: 300ms hover before tooltip appears
- **Appear Animation**: 150ms fade-in
- **Disappear Delay**: 100ms after hover ends
- **Disappear Animation**: 100ms fade-out
- **Extended Viewing**: Click to lock tooltip in place (mobile: tap and hold)

#### Positioning

- **Primary Position**: Above the element with bottom center aligned to element
- **Fallback Positions**: Below, right, left (in that order) if primary position would go off-screen
- **Minimum Distance**: 5px from trigger element
- **Screen Edge Buffer**: Minimum 10px from any screen edge
- **Z-Index**: Above all game elements except critical notifications

#### Stacking Behavior

- **Multiple Elements**: Only one tooltip visible at a time
- **New Tooltip**: Replaces existing tooltip with smooth transition
- **Nested Information**: Deeper information accessible through expanding sections

## Tooltip Content Guidelines

### Content Structure

Information in tooltips should be structured in this order:

1. **Name/Title**: Clear identifier (what it is)
2. **Primary Function**: Main gameplay effect (what it does)
3. **Statistics/Values**: Numerical attributes if applicable
4. **Duration/Timing**: When it occurs and how long it lasts
5. **Source**: What created this effect (if relevant)
6. **Relationships**: Connections to other game elements (if relevant)
7. **Counters/Synergies**: What strengthens or weakens it (if relevant)
8. **Flavor Text**: Lore information (lowest priority, only if space allows)

### Writing Style

Content should follow these writing guidelines:

- **Concise Language**: Use direct, clear phrasing
- **Consistent Terminology**: Use the same terms used elsewhere in the game
- **Present Tense**: Describe effects in present tense
- **Active Voice**: Use active rather than passive voice
- **Standard Formatting**: Apply consistent text formatting for keywords
- **Numerical Clarity**: Express numerical values precisely

### Icons in Tooltips

Guidelines for using icons within tooltips:

- **Icon Pairing**: Pair icons with text for clarity
- **Consistent Icons**: Use the same icons as seen elsewhere in the game
- **Size Relationship**: Icons 1-2pt smaller than the text they accompany
- **Icon Positioning**: Left-aligned before related text
- **Stacking Limit**: No more than 3 icons in a row

## Tooltip Implementation by Element Type

### Card Tooltips

Card tooltips display:

``` text
┌─────────────────────────────────┐
│ CARD NAME        Cost: 3 Energy │
├─────────────────────────────────┤
│ Type: Unit       Faction: Solar │
├─────────────────────────────────┤
│ This unit does something when   │
│ played and has an ongoing effect│
│ while in play.                  │
├─────────────────────────────────┤
│ Attack: 2        Health: 3      │
├─────────────────────────────────┤
│ Keywords:                        │
│ ⚡ Rush: Can attack immediately  │
│ 🛡️ Defender: Must be attacked   │
│      first                      │
├─────────────────────────────────┤
│ ℹ️ From: Core Set               │
└─────────────────────────────────┘
```

### Status Effect Tooltips

Status effect tooltips display:

``` text
┌─────────────────────────────────┐
│ EMPOWERED                       │
├─────────────────────────────────┤
│ Unit gains +1/+1 to its Attack  │
│ and Health statistics.          │
├─────────────────────────────────┤
│ Duration: Permanent             │
│ Source: Solar Blessing (Card)   │
├─────────────────────────────────┤
│ Stacks: Yes (currently x2)      │
│ Countered by: Weakened          │
└─────────────────────────────────┘
```

### Ability Tooltips

Ability tooltips display:

``` text
┌─────────────────────────────────┐
│ TACTICAL STRIKE                 │
├─────────────────────────────────┤
│ Deal 3 damage to a unit and 1   │
│ damage to adjacent units.       │
├─────────────────────────────────┤
│ Cost: 2 Energy                  │
│ Cooldown: 1 turn                │
├─────────────────────────────────┤
│ Currently: Available            │
└─────────────────────────────────┘
```

### Resource Tooltips

Resource tooltips display:

``` text
┌─────────────────────────────────┐
│ ENERGY                          │
├─────────────────────────────────┤
│ Primary resource used to play   │
│ cards and activate abilities.   │
├─────────────────────────────────┤
│ Current: 3 / 4                  │
│ Gain: +1 per turn (max 4)       │
└─────────────────────────────────┘
```

### UI Element Tooltips

UI element tooltips display:

``` text
┌─────────────────────────────────┐
│ END TURN                        │
├─────────────────────────────────┤
│ Finish your current turn and    │
│ pass priority to your opponent. │
├─────────────────────────────────┤
│ Keyboard Shortcut: Spacebar     │
└─────────────────────────────────┘
```

## Platform-Specific Implementations

### Desktop Implementation

For desktop/PC platforms:

- **Trigger**: Hover with mouse cursor
- **Navigation**: Arrow keys can navigate between tooltip elements
- **Lock/Unlock**: Left-click to lock, ESC or click elsewhere to dismiss
- **Extended Information**: Right-click for more detailed information
- **Keyboard Shortcut**: Alt key shows all available tooltips simultaneously

### Mobile Implementation

For mobile platforms:

- **Trigger**: Tap and hold for 500ms
- **Navigation**: Swipe between elements when tooltip is locked
- **Lock/Unlock**: Single tap to lock, tap elsewhere to dismiss
- **Extended Information**: Two-finger tap for more detailed information
- **Gesture**: Pinch to zoom tooltip content on complex tooltips

### Tablet Implementation

For tablet platforms:

- **Trigger**: Hover with stylus, tap and hold with finger
- **Navigation**: Hybrid of desktop and mobile approaches
- **Lock/Unlock**: Tap to lock, tap elsewhere to dismiss
- **Extended Information**: Long press or double-tap for more details
- **Split View**: Option to show tooltips in dedicated side panel

### Console Implementation

For console platforms:

- **Trigger**: Highlight element and press designated button (typically Y or Triangle)
- **Navigation**: D-pad or analog stick to navigate between elements
- **Lock/Unlock**: Press button to toggle lock state
- **Extended Information**: Secondary button (typically X or Square) for more details
- **Haptic Feedback**: Subtle controller vibration when tooltip appears

## Accessibility Considerations

### Visual Accessibility

For visually impaired players:

- **Text Scaling**: All tooltip text scales with system accessibility settings
- **High Contrast Mode**: Alternative high-contrast version with 7:1 ratio
- **Screen Reader Support**: All tooltip content available to screen readers
- **Font Options**: Sans-serif font by default with dyslexic-friendly option
- **Animation Control**: Option to disable tooltip animations

### Cognitive Accessibility

For cognitive accessibility:

- **Simplified Mode**: Option for streamlined information presentation
- **Reading Time**: Adaptive timing based on content length
- **Consistent Placement**: Tooltips appear in predictable locations
- **Explicit Associations**: Clear visual connection to source element
- **Progressive Information**: Basic details first, expanding to more complex details

### Motor Accessibility

For players with motor impairments:

- **Extended Timing**: Configurable hover timing (300ms to 1500ms)
- **Persistence Options**: Setting for tooltips to remain until explicitly dismissed
- **Keyboard Navigation**: Full keyboard control of tooltip system
- **Touch Area**: Enlarged touch targets on mobile/tablet
- **Sticky Tooltips**: Option to make tooltips remain visible during gameplay

## Technical Implementation

### Performance Guidelines

To maintain performance:

- **Memory Management**: Pool and reuse tooltip objects
- **Content Loading**: Preload commonly used tooltip content
- **Rendering Optimization**: Use hardware acceleration for animations
- **Layering System**: Optimize z-index management
- **Text Rendering**: Use efficient text rendering techniques

### Data Structure

Tooltip data follows this standard structure:

```json
{
  "id": "tooltip_empowered",
  "title": "Empowered",
  "description": "Unit gains +1/+1 to its Attack and Health statistics.",
  "details": [
    {
      "label": "Duration",
      "value": "Permanent"
    },
    {
      "label": "Source",
      "value": "Solar Blessing (Card)"
    },
    {
      "label": "Stacks",
      "value": "Yes (currently x2)",
      "dynamic": true
    }
  ],
  "note": "Effects may be cleansed by certain abilities.",
  "icon": "status/empowered.svg",
  "tooltip_type": "status_effect"
}
```

### Developer Implementation Checklist

When implementing tooltips, verify:

- [ ] Tooltip appears on appropriate trigger action
- [ ] Content is accurate and updated with game state
- [ ] Positioning adjusts to remain on screen
- [ ] Animations are smooth and timing is correct
- [ ] Z-index properly places tooltip above relevant elements
- [ ] Locked state functions correctly
- [ ] Accessibility features are working
- [ ] Performance impact is minimal

## Localization Considerations

For international versions:

- **Text Expansion**: Design accommodates 30% text expansion for translations
- **Reading Direction**: Supports both LTR and RTL languages
- **Date and Number Formatting**: Adapts to local conventions
- **Cultural Considerations**: Avoids culture-specific idioms
- **Icons**: Uses universally recognized symbols
- **Variable Text**: Maintains proper grammar with variable substitution

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*
