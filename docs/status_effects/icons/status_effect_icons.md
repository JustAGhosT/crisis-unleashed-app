# Status Effect Icons

## Overview

Status effect icons provide immediate visual indication of temporary conditions affecting units, heroes, and other game elements. This document details all status effect icons used in Crisis Unleashed, their visual design, and implementation guidelines.

## Design System

All status effect icons follow these design principles:

1. **Shape Language**

   - Positive effects use upward/outward shapes
   - Negative effects use downward/inward shapes
   - Special effects use circular or spiral shapes

2. **Color Coding**

   - Positive effects: Primarily gold, white, and blue tones
   - Negative effects: Primarily red, black, and sickly green tones
   - Special effects: Primarily purple, cyan, and rainbow tones

3. **Border Treatment**

   - Positive effects: Solid or outward radiating borders
   - Negative effects: Jagged or inward-pointing borders
   - Special effects: Pulsing or animated borders

## Positive Status Effect Icons

### Empowered

![Empowered](../assets/icons/status/empowered.svg)

- **Design**: Upward-pointing golden arrow with radiant background
- **Color**: #FFD700 (Primary), #FFF8DC (Secondary)
- **Animation**: Pulsing outward gold rays
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Protected

![Protected](../assets/icons/status/protected.svg)

- **Design**: Blue shield with subtle glow
- **Color**: #007FFF (Primary), #E0FFFF (Secondary)
- **Animation**: Shield pulse when damage prevented
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Blessed

![Blessed](../assets/icons/status/blessed.svg)

- **Design**: White star cluster with light rays
- **Color**: #FFFFFF (Primary), #FFFAAA (Secondary)
- **Animation**: Gentle rising particles
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Charged

![Charged](../assets/icons/status/charged.svg)

- **Design**: Lightning bolt with energy tendrils
- **Color**: #0000FF (Primary), #00FFFF (Secondary)
- **Animation**: Electric arcs between points
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Swift

![Swift](../assets/icons/status/swift.svg)

- **Design**: Running figure with motion lines
- **Color**: #00FF00 (Primary), #CCFFCC (Secondary)
- **Animation**: Speed lines animation
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Evolved

![Evolved](../assets/icons/status/evolved.svg)

- **Design**: DNA helix transforming upward
- **Color**: #800080 (Primary), #D8BFD8 (Secondary)
- **Animation**: DNA spiral rotation
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

## Negative Status Effect Icons

### Weakened

![Weakened](../assets/icons/status/weakened.svg)

- **Design**: Downward-pointing red arrow with fading effect
- **Color**: #A00000 (Primary), #FF6666 (Secondary)
- **Animation**: Downward falling particles
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Vulnerable

![Vulnerable](../assets/icons/status/vulnerable.svg)

- **Design**: Cracked shield with red highlights
- **Color**: #DC143C (Primary), #FFB6C1 (Secondary)
- **Animation**: Pulsing crack grows
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Corrupted

![Corrupted](../assets/icons/status/corrupted.svg)

- **Design**: Dark web with purple highlights
- **Color**: #2E0854 (Primary), #483D8B (Secondary)
- **Animation**: Creeping tendrils
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Stunned

![Stunned](../assets/icons/status/stunned.svg)

- **Design**: Circling stars
- **Color**: #FFFF00 (Primary), #FFD700 (Secondary)
- **Animation**: Stars orbit slowly
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Frozen

![Frozen](../assets/icons/status/frozen.svg)

- **Design**: Snowflake with ice crystal details
- **Color**: #A5F2F3 (Primary), #E0FFFF (Secondary)
- **Animation**: Subtle ice shimmer
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Decaying

![Decaying](../assets/icons/status/decaying.svg)

- **Design**: Skull with green miasma
- **Color**: #7CFC00 (Primary), #556B2F (Secondary)
- **Animation**: Rising decay particles
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

## Special Status Effect Icons

### Quantum Flux

![Quantum Flux](../assets/icons/status/quantum_flux.svg)

- **Design**: Multi-colored spiral with energy particles
- **Color**: Rainbow spectrum (shifting)
- **Animation**: Color-shifting vortex
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Mindlinked

![Mindlinked](../assets/icons/status/mindlinked.svg)

- **Design**: Brain with connection lines
- **Color**: #00FFFF (Primary), #1E90FF (Secondary)
- **Animation**: Pulsing neural connections
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token; connection line to linked unit

### Phased

![Phased](../assets/icons/status/phased.svg)

- **Design**: Ghost-like figure with dimensional ripples
- **Color**: #ADD8E6 at 50% opacity (Primary), #F0F8FF (Secondary)
- **Animation**: Dimensional ripple effect
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Glitched

![Glitched](../assets/icons/status/glitched.svg)

- **Design**: Pixelated wrench with distortion effects
- **Color**: #00FF00 (Primary), #32CD32 (Secondary)
- **Animation**: Digital distortion artifacts
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

### Transcending

![Transcending](../assets/icons/status/transcending.svg)

- **Design**: Radiant star with upward transformation
- **Color**: #FFFACD to #FFFFFF gradient (Primary)
- **Animation**: Rising light particles
- **Sizes**: 16x16, 24x24, 32x32, 64x64
- **Usage**: Appears above unit card or on token

## Duration and Stack Indicator System

Status effect icons include duration and stack count indicators:

### Duration Indicators

- **Countdown Number**: Large number overlaid on bottom of icon
- **Duration Ring**: Circular progress indicator around icon perimeter
- **Infinity Symbol**: For permanent effects

### Stack Indicators

- **Stack Count**: "×N" notation in bottom right
- **Stack Intensity**: Brighter colors or larger icon for higher stacks
- **Maximum Stacks**: "(MAX)" indicator when stack limit reached

## Faction-Specific Variants

Each faction has unique visual styling for status effect icons:

### Solaris Nexus

- Solar flare animations
- Gold-white color schemes
- Radiant border treatments

### Umbral Eclipse

- Shadow wisp animations
- Deep purple-black color schemes
- Shadowed border treatments

### Aeonic Dominion

- Clock-like countdown animations
- Blue-silver color schemes
- Gear-shaped borders

### Primordial Genesis

- Organic growth patterns
- Vibrant green-brown color schemes
- Vine-like borders

### Infernal Core  

- Fiery ember animations
- Red-orange color schemes
- Molten border treatments

### Neuralis Conclave

- Neural network patterns
- Cyan-indigo color schemes
- Circuit-like borders

### Synthetic Directive

- Circuit-like patterns
- Metallic gray-green color schemes
- Modular border treatments

## Implementation Guidelines

### Digital Implementation

- Use vector formats (SVG) for UI scaling
- Include animation states (idle, activation, expiry)
- Implement keyboard focus indicators for accessibility
- Support both light and dark mode variants

### Physical Implementation

- Print at 300 DPI minimum for physical tokens
- Include colorblind-friendly patterns
- Use embossed or textured finishes on physical tokens for tactile identification
- Include reference card with all icons explained

## Accessibility Alternatives

For players with visual impairments:

- **Shape Coding**: Each status uses a distinct shape identifiable by touch
- **Pattern Differentiation**: Positive effects use dots, negative use lines, special use crosshatching
- **High Contrast Mode**: Enhanced contrast version of all icons
- **Text Alternatives**: All icons have text equivalents in digital implementation

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*
