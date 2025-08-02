# Visual Guidelines for Card Effects

This document provides comprehensive guidelines for designing and implementing visual effects for cards in both digital and physical versions of the game.

## Table of Contents

1. [Introduction](#introduction)
2. [Card Effect Visual Hierarchy](#card-effect-visual-hierarchy)
3. [Faction-Specific Effect Guidelines](#faction-specific-effect-guidelines)
4. [Effect Categories](#effect-categories)
5. [Animation Principles](#animation-principles)
6. [Sound Design Integration](#sound-design-integration)
7. [Accessibility Considerations](#accessibility-considerations)
8. [Implementation Guidelines](#implementation-guidelines)

## Introduction

Card effects are visual representations of the game's mechanics that communicate gameplay information while enhancing immersion. Effective card effect visuals should:

- Clearly communicate the card's function
- Reinforce faction identity
- Create memorable gameplay moments
- Maintain readability and accessibility
- Scale appropriately across platforms

## Card Effect Visual Hierarchy

Effects should follow a consistent visual hierarchy to help players understand the relative power and importance of different actions.

### Power Level Indicators

| Effect Level | Visual Scale | Particle Density | Screen Coverage | Sound Importance |
|--------------|--------------|------------------|-----------------|------------------|
| Minor | Small, localized | Low | <10% | Subtle |
| Standard | Medium, focused | Medium | 10-30% | Clear |
| Major | Large, expansive | High | 30-50% | Prominent |
| Ultimate | Massive, dramatic | Very high | >50% | Dramatic |

### Visual Priority System

When multiple effects occur simultaneously, visual priority follows this order:

1. Game-state changing effects (victory, defeat)
2. Hero abilities and ultimates
3. Card play effects
4. Status effect applications
5. Passive/ongoing effects

## Faction-Specific Effect Guidelines

Each faction has a distinctive visual language for their effects that reinforces their identity.

### Solaris Nexus

- **Primary Effect Colors**: Gold, white, light blue
- **Effect Style**: Geometric, precise, radiant
- **Animation Pattern**: Expanding circles, precise angular movements
- **Particle Types**: Light rays, digital circuits, energy beams
- **Signature Effect**: "Divine Algorithm" - Cascading golden code fragments with white light

### Umbral Eclipse

- **Primary Effect Colors**: Deep purple, black, cyan accents
- **Effect Style**: Smoky, corrupting, glitched
- **Animation Pattern**: Wispy tendrils, fragmentation, distortion
- **Particle Types**: Shadow wisps, data corruption, digital tears
- **Signature Effect**: "Void Protocol" - Reality-tearing rifts with purple energy leakage

### Aeonic Dominion

- **Primary Effect Colors**: Teal, silver, chrono-blue
- **Effect Style**: Clockwork, temporal, precise
- **Animation Pattern**: Circular, rotating, time-warping
- **Particle Types**: Clock fragments, time dust, temporal echoes
- **Signature Effect**: "Temporal Recursion" - Overlapping time echoes with clock mechanisms

### Primordial Genesis

- **Primary Effect Colors**: Vibrant green, amber, brown
- **Effect Style**: Organic, growing, evolving
- **Animation Pattern**: Fractal growth, spiraling, blooming
- **Particle Types**: Spores, leaves, DNA structures, growth patterns
- **Signature Effect**: "Evolutionary Surge" - Rapid growth with genetic spiral patterns

### Infernal Core

- **Primary Effect Colors**: Crimson, orange, obsidian black
- **Effect Style**: Explosive, chaotic, consuming
- **Animation Pattern**: Erupting, shattering, flame-like
- **Particle Types**: Embers, lava fragments, heat distortion, smoke
- **Signature Effect**: "Molten Override" - Magma cracks with explosive fire eruptions

### Neuralis Conclave

- **Primary Effect Colors**: Deep blue, vivid purple, white
- **Effect Style**: Cerebral, wave-like, connective
- **Animation Pattern**: Pulsing, neural networking, thought bubbles
- **Particle Types**: Neural connections, thought energy, psychic waves
- **Signature Effect**: "Mind Nexus" - Expanding neural network with psychic pulses

### Synthetic Directive

- **Primary Effect Colors**: Steel blue, gray, neon accents
- **Effect Style**: Mechanical, modular, systematic
- **Animation Pattern**: Assembling, scanning, constructing
- **Particle Types**: Mechanical parts, diagnostic scans, assembly lines
- **Signature Effect**: "Assembly Protocol" - Grid-based construction with blueprint overlays

## Effect Categories

### Buff Effects

- **Visual Characteristics**: Upward movement, expanding auras, brightening
- **Duration Indicators**: Pulsing intensity corresponds to remaining duration
- **Stacking Indicators**: Visual layers or increasing intensity shows stacks

### Debuff Effects

- **Visual Characteristics**: Downward movement, encasing/trapping, darkening
- **Duration Indicators**: Fading opacity corresponds to remaining duration
- **Severity Indicators**: Increasing visual corruption shows severity

### Damage Effects

- **Impact Effects**: Brief, sharp animations at point of impact
- **Sustained Damage**: Persistent visual effect for DoT (Damage over Time)
- **Area Damage**: Expanding wave or pattern showing affected area

### Healing Effects

- **Burst Healing**: Upward spiraling particles with brightness
- **Sustained Healing**: Gentle pulsing aura with faction-specific coloration
- **Target Indicators**: Connecting beams between source and target

### Area Effects

- **Area of Effect Indicator**: Clear boundary visualization
- **Duration Visualization**: Fading/intensifying based on remaining duration
- **Faction Customization**: Base effect modified by faction-specific elements

### Transformation Effects

- **Pre-transform Warning**: Brief gathering energy phase
- **Transformation Moment**: Flash transition with particle burst
- **Post-transform Indicator**: Residual particles showing changed state

## Animation Principles

### Timing Guidelines

- **Quick Effects**: 0.3-0.5 seconds for standard actions
- **Standard Effects**: 0.5-1.5 seconds for normal abilities
- **Major Effects**: 1.5-3.0 seconds for significant abilities
- **Ultimate Effects**: 3.0-5.0 seconds for game-changing moments

### Animation Curves

- **Buff Application**: Ease-in-out for smooth power increase
- **Damage Delivery**: Quick ease-in, sharp peak, slow ease-out
- **Persistent Effects**: Looping patterns with subtle variations
- **Transformations**: Build-up (ease-in), sharp change, settling (ease-out)

### Camera Effects

- **Minor Abilities**: No camera movement
- **Standard Abilities**: Subtle camera shake or slight zoom
- **Major Abilities**: Moderate camera movement, focus shift
- **Ultimate Abilities**: Dramatic camera movement, perspective shift

## Sound Design Integration

Visual effects should be designed with sound integration in mind:

- **Sync Points**: Identify key moments in animation for sound synchronization
- **Volume Correlation**: More visually dominant effects should have correspondingly prominent audio
- **3D Audio Positioning**: Particle systems should include position data for audio sources
- **Faction Identity**: Visual effects should anticipate faction-specific sound profiles

## Accessibility Considerations

### Visual Clarity

- Effects must maintain clarity at all graphical settings
- Critical gameplay effects must be distinguishable from cosmetic effects
- Effects should be recognizable even with color vision deficiency

### Intensity Options

- Players should have options to reduce:
  - Particle density
  - Animation complexity
  - Screen shake
  - Flash intensity

### Information Conveyance

- Critical information should be conveyed through multiple channels:
  - Visual effects
  - UI indicators
  - Sound cues
  - Haptic feedback (where available)

## Implementation Guidelines

### Technical Specifications

- **Particle Budgets**:
  - Low-end devices: Max 500 particles per effect
  - Standard devices: Max 2000 particles per effect
  - High-end devices: Max 5000 particles per effect

- **Performance Optimization**:

  - Use LOD (Level of Detail) for particle systems
  - Implement culling for off-screen effects
  - Batch similar effects where possible

### Asset Creation Standards

- **Texture Atlases**: Use shared atlases for similar effect types
- **Material Standardization**: Create master materials with parameter variations
- **Component System**: Build effects from reusable components
- **Version Control**: Maintain effect version history for iterative improvement

### Testing Requirements

- **Performance Testing**: Validate frame rate impact across device spectrum
- **Clarity Testing**: Verify effect readability in various game scenarios
- **Accessibility Testing**: Test with color filters and reduced settings

---

This document will be updated as new effect types are developed and standards evolve. All card effect designs should be reviewed against these guidelines before implementation.

Last Updated: 2025-08-01
