# Resource Icons

## Overview

Resource icons represent the currencies, energy types, and trackable quantities in Crisis Unleashed. These fundamental icons appear on cards, the game board, and interface elements. This document details all resource icons and their implementation across the game.

## Core Resource Types

Crisis Unleashed features several primary resource types, each with distinct visual identities.

### Energy Icons

Energy is the primary resource used to play cards and activate abilities.

#### Standard Energy

![Energy](../assets/icons/resources/energy.svg)

- **Design**: Crystalline hexagon with inner glow
- **Color**: #00BFFF (Primary), #E0FFFF (Secondary)
- **Animation**: Subtle pulse effect
- **Sizes**: 16x16, 24x24, 32x32, 48x48, 64x64
- **Function**: Universal resource for playing cards
- **Counter Style**: Numeric with icon indicator

#### Specialized Energy Types

Each specialized energy type has its own distinct icon:

![Solar Energy](../assets/icons/resources/solar_energy.svg)

#### **Solar Energy**

- **Design**: Sunburst pattern within energy crystal
- **Color**: #FFD700 (Primary), #FFFAAA (Secondary)
- **Usage**: Solaris Nexus faction resource

![Shadow Energy](../assets/icons/resources/shadow_energy.svg)

#### **Shadow Energy**

- **Design**: Darkened void within energy crystal
- **Color**: #2E0854 (Primary), #483D8B (Secondary)
- **Usage**: Umbral Eclipse faction resource

![Temporal Energy](../assets/icons/resources/temporal_energy.svg)

#### **Temporal Energy**

- **Design**: Clock face within energy crystal
- **Color**: #4682B4 (Primary), #ADD8E6 (Secondary)
- **Usage**: Aeonic Dominion faction resource

![Bio Energy](../assets/icons/resources/bio_energy.svg)

#### **Bio Energy**

- **Design**: Leaf pattern within energy crystal
- **Color**: #228B22 (Primary), #90EE90 (Secondary)
- **Usage**: Primordial Genesis faction resource

![Infernal Energy](../assets/icons/resources/infernal_energy.svg)

#### **Infernal Energy**

- **Design**: Flame pattern within energy crystal
- **Color**: #B22222 (Primary), #FF6347 (Secondary)
- **Usage**: Infernal Core faction resource

![Psionic Energy](../assets/icons/resources/psionic_energy.svg)

#### **Psionic Energy**

- **Design**: Brainwave pattern within energy crystal
- **Color**: #8A2BE2 (Primary), #E6E6FA (Secondary)
- **Usage**: Neuralis Conclave faction resource

![Synthetic Energy](../assets/icons/resources/synthetic_energy.svg)

#### **Synthetic Energy**

- **Design**: Circuit pattern within energy crystal
- **Color**: #2F4F4F (Primary), #90EE90 (Secondary)
- **Usage**: Synthetic Directive faction resource

### Health Icons

Health represents the durability of heroes and units.

![Health](../assets/icons/resources/health.svg)

- **Design**: Heart with pulse line
- **Color**: #FF0000 (Primary), #FA8072 (Secondary)
- **Animation**: Heartbeat pulse
- **Sizes**: 16x16, 24x24, 32x32, 48x48, 64x64
- **Function**: Tracks unit and hero health
- **Counter Style**: Numeric with icon, HP abbreviation

### Momentum Icons

Momentum is a special resource for hero abilities.

![Momentum](../assets/icons/resources/momentum.svg)

- **Design**: Spiral arrow moving forward
- **Color**: #FF4500 (Primary), #FFA500 (Secondary)
- **Animation**: Forward spinning motion
- **Sizes**: 16x16, 24x24, 32x32, 48x48, 64x64
- **Function**: Activates hero abilities
- **Counter Style**: Numeric with icon indicator

### Attack Icons

Attack value represents combat strength.

![Attack](../assets/icons/resources/attack.svg)

- **Design**: Crossed swords
- **Color**: #8B0000 (Primary), #CD5C5C (Secondary)
- **Animation**: Brief flash on attack
- **Sizes**: 16x16, 24x24, 32x32, 48x48, 64x64
- **Function**: Indicates attack power
- **Counter Style**: Numeric with icon indicator

## Specialized Resource Icons

Beyond the core resources, Crisis Unleashed has specialized resources for specific mechanics.

### Countdown Icons

Used for tracking duration effects.

![Countdown](../assets/icons/resources/countdown.svg)

- **Design**: Hourglass with flowing sand
- **Color**: #4682B4 (Primary), #B0C4DE (Secondary)
- **Animation**: Sand flowing between bulbs
- **Sizes**: 16x16, 24x24, 32x32, 48x48
- **Function**: Tracks turns until effect
- **Counter Style**: Numeric overlay

### Soul Counter Icons

Used in specific faction mechanics.

![Soul Counter](../assets/icons/resources/soul_counter.svg)

- **Design**: Ethereal wisp with glowing center
- **Color**: #9370DB (Primary), #E6E6FA (Secondary)
- **Animation**: Gentle floating motion
- **Sizes**: 16x16, 24x24, 32x32, 48x48
- **Function**: Tracks soul collection
- **Counter Style**: Individual markers

### Evolution Icons

Tracks evolution progress.

![Evolution](../assets/icons/resources/evolution.svg)

- **Design**: DNA strand with glowing nodes
- **Color**: #008000 (Primary), #98FB98 (Secondary)
- **Animation**: DNA rotation
- **Sizes**: 16x16, 24x24, 32x32, 48x48
- **Function**: Tracks evolution stages
- **Counter Style**: Multi-stage indicator

### Charge Icons

Tracks ability charges.

![Charge](../assets/icons/resources/charge.svg)

- **Design**: Battery with power level
- **Color**: #1E90FF (Primary), #00FFFF (Secondary)
- **Animation**: Energy filling
- **Sizes**: 16x16, 24x24, 32x32, 48x48
- **Function**: Tracks ability uses
- **Counter Style**: Individual charge pips

## Faction-Specific Resource Icons

Each faction has unique resources that power their specific mechanics.

### Solaris Nexus

![Solar Essence](../assets/icons/resources/solar_essence.svg)

#### **Solar Essence**

- **Design**: Concentrated sun icon
- **Color**: #FFD700 (Primary)
- **Function**: Powers blessing effects

![Radiance](../assets/icons/resources/radiance.svg)

#### **Radiance**

- **Design**: Expanding light rays
- **Color**: #FFFACD (Primary)
- **Function**: Enhances units over time

### Umbral Eclipse

![Void Fragment](../assets/icons/resources/void_fragment.svg)

#### **Void Fragment**

- **Design**: Jagged dark crystal
- **Color**: #2E0854 (Primary)
- **Function**: Powers corruption effects

![Shadow Mark](../assets/icons/resources/shadow_mark.svg)

#### **Shadow Mark**

- **Design**: Dark brand symbol
- **Color**: #483D8B (Primary)
- **Function**: Tracks marked targets

### Aeonic Dominion

![Chrono Particle](../assets/icons/resources/chrono_particle.svg)

#### **Chrono Particle**

- **Design**: Miniature clock gear
- **Color**: #4682B4 (Primary)
- **Function**: Accelerates/decelerates effects

![Paradox Point](../assets/icons/resources/paradox_point.svg)

#### **Paradox Point**

- **Design**: Intersecting timeline
- **Color**: #B0C4DE (Primary)
- **Function**: Powers reality-altering effects

### Primordial Genesis

![Growth Spore](../assets/icons/resources/growth_spore.svg)

#### **Growth Spore**

- **Design**: Germinating seed
- **Color**: #228B22 (Primary)
- **Function**: Accelerates evolution

![Adaptation Token](../assets/icons/resources/adaptation_token.svg)

#### **Adaptation Token**

- **Design**: Transforming creature
- **Color**: #90EE90 (Primary)
- **Function**: Unlocks new adaptations

### Infernal Core

![Chaos Ember](../assets/icons/resources/chaos_ember.svg)

#### **Chaos Ember**

- **Design**: Glowing hot coal
- **Color**: #B22222 (Primary)
- **Function**: Powers destructive effects

![Blood Tithe](../assets/icons/resources/blood_tithe.svg)

#### **Blood Tithe**

- **Design**: Blood droplet
- **Color**: #8B0000 (Primary)
- **Function**: Tracks sacrifice value

### Neuralis Conclave

![Psi Fragment](../assets/icons/resources/psi_fragment.svg)

#### **Psi Fragment**

- **Design**: Crystal with brainwave
- **Color**: #8A2BE2 (Primary)
- **Function**: Powers mental abilities

![Neural Link](../assets/icons/resources/neural_link.svg)

#### **Neural Link**

- **Design**: Connected neuron
- **Color**: #E6E6FA (Primary)
- **Function**: Tracks psychic connections

### Synthetic Directive

![Program Core](../assets/icons/resources/program_core.svg)

#### **Program Core**

- **Design**: Data chip
- **Color**: #2F4F4F (Primary)
- **Function**: Powers synthetic abilities

![Upgrade Module](../assets/icons/resources/upgrade_module.svg)

#### **Upgrade Module**

- **Design**: Enhancement package
- **Color**: #7FFFD4 (Primary)
- **Function**: Tracks available upgrades

## Resource Modifier Icons

Special icons that modify how resources function:

### Restricted

![Restricted](../assets/icons/resources/restricted.svg)

- **Design**: Resource icon with lock overlay
- **Function**: Resource cannot be used this turn

### Enhanced

![Enhanced](../assets/icons/resources/enhanced.svg)

- **Design**: Resource icon with glow effect
- **Function**: Resource provides bonus effects

### Decaying

![Decaying](../assets/icons/resources/decaying.svg)

- **Design**: Resource icon with decay overlay
- **Function**: Resource is lost if not used soon

### Shared

![Shared](../assets/icons/resources/shared.svg)

- **Design**: Resource icon with link symbol
- **Function**: Resource is shared between linked elements

## Resource UI Implementation

### Resource Counters

Resources are displayed in these standard formats:

``` text
┌─────────────┐
│  9 ⚡       │  Standard Energy Counter
└─────────────┘

┌─────────────┐
│  20/30 ❤️   │  Health Counter (current/maximum)
└─────────────┘

┌─────────────┐
│  ⚔️ 4       │  Attack Value
└─────────────┘

┌─────────────┐
│  🌀 3/5     │  Momentum Counter (current/maximum)
└─────────────┘
```

### Resource Gain/Loss Indicators

When resources change, special indicators appear:

``` text
┌─────────────┐
│  5 ⚡ (+2)  │  Energy Gain
└─────────────┘

┌─────────────┐
│  15 ❤️ (-3) │  Health Loss
└─────────────┘
```

### Resource Availability Indicators

Resources have visual states to indicate availability:

1. **Available**: Bright, fully saturated
2. **Partially Available**: Slightly dimmed
3. **Unavailable**: Greyed out with 50% opacity
4. **Locked**: Displays lock icon overlay

## Physical Implementation

For tabletop play:

1. **Resource Tokens**: Physical tokens with icon designs
2. **Counter Dials**: Rotating dials for tracking values
3. **Resource Cards**: Cards representing specialized resources
4. **Token Storage**: Designated board areas for resource tokens

### Token Color Standards

Physical tokens follow these color guidelines:

- **Energy**: Translucent blue acrylic
- **Health**: Red gemstones or tokens
- **Momentum**: Orange spiral tokens
- **Faction-Specific**: Colors matching digital versions

## Accessibility Considerations

For players with visual impairments:

1. **Distinct Shapes**: Each resource has a unique physical shape
2. **Tactile Indicators**: Embossed or textured surfaces
3. **Size Differentiation**: Different sized tokens for different resources
4. **Audio Cues**: Digital version has distinct sounds for each resource
5. **High Contrast**: Alternative color schemes available

## Technical Specifications

For designers and developers implementing resource icons:

1. **Vector Format**: Primary files in SVG format
2. **Animation Guidelines**: 60fps animations in JSON format for Lottie
3. **File Organization**: `resources/[type]/[resource_name].svg`
4. **Responsive Scaling**: Design maintains clarity from 16px to 64px
5. **Optimization**: Simplified versions for small displays

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*
