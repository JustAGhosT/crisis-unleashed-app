# Combat Feedback

## Overview

Combat feedback in Crisis Unleashed provides players with clear visual indications of attack actions, damage resolution, and combat outcomes. This sophisticated feedback system ensures players can easily understand the flow of battle and the results of combat interactions.

## Attack Initiation Feedback

### Attacker Animation

Visual feedback when a unit initiates an attack:

| Attack Type | Visual Effect | Duration | Animation Details |
|-------------|--------------|----------|-------------------|
| Melee Attack | Forward lunge animation with weapon swing | 0.4s | Unit moves 30% toward target then returns |
| Ranged Attack | Projectile launch with weapon drawing back | 0.5s | Unit shifts weight back, then forward on release |
| Spell Attack | Magical casting animation with rune circles | 0.7s | Energy gathers around unit before releasing toward target |
| Special Attack | Unique animation based on unit type | 0.6-0.9s | Distinctive signature movement for hero or legendary units |

### Attack Preparation

Pre-attack visual indicators:

1. **Target Selection**: Pulsing red reticle appears beneath potential targets
2. **Attack Path**: Glowing line connects attacker to potential targets
3. **Valid/Invalid**: Green or red highlighting on potential targets
4. **Prediction**: Damage numbers appear in preview (can be toggled in settings)
5. **Special Effects**: Icon indicators for special attack properties (First Strike, Overwhelm, etc.)

## Damage Resolution Feedback

### Impact Effects

Visual effects at the moment of attack impact:

| Damage Type | Visual Effect | Duration | Animation Details |
|-------------|--------------|----------|-------------------|
| Physical Damage | Impact flash with physical collision | 0.3s | White flash at impact point with directional force lines |
| Fire Damage | Fiery explosion with ember particles | 0.4s | Orange/red burst with lingering embers |
| Ice Damage | Crystalline impact with frost particles | 0.4s | Blue/white crystal shatter effect with frost vapor |
| Shadow Damage | Dark implosion with void tendrils | 0.5s | Purple/black inward collapse with shadow wisps |
| Holy Damage | Radiant light burst | 0.4s | Golden/white outward rays with light particles |

### Damage Number Indicators

Numerical feedback for damage amounts:

1. **Appearance**: Numbers rise from the impacted unit and fade out
2. **Styling**: Color coded by damage type (physical: white, fire: red, etc.)
3. **Size Scaling**: Larger numbers for larger damage amounts (proportional scaling)
4. **Critical Hits**: 25% larger with starburst behind and brief screen shake
5. **Damage Reduction**: Shield icon with reduced number shown in parentheses
6. **Immunity**: "Immune" text with appropriate immunity icon

### Health Bar Updates

Visual feedback for health changes:

1. **Damage Taken**: Health bar reduces with red flash effect
2. **Delayed Animation**: Bar animates over 0.4s to show change
3. **Critical Health**: Bar pulses red when below 25%
4. **Healing**: Health bar increases with green glow effect
5. **Overheal**: Brief golden pulse if healing would exceed maximum
6. **Death Threshold**: Distinctive white flash when health reaches zero

## Special Combat Effects

### First Strike

Visual feedback for First Strike ability:

1. **Indicator**: Yellow speed lines around attacking unit
2. **Timing**: Attacker's damage resolves with 0.3s priority
3. **Defender Delay**: Defender's counter-attack visibly delayed
4. **Text Effect**: "First Strike" text briefly appears

### Overwhelm

Visual feedback for Overwhelm ability:

1. **Indicator**: Red force waves emanating from attacker
2. **Excess Damage**: Red arc shows damage flowing past defender to hero
3. **Hero Impact**: Secondary impact effect on hero
4. **Text Effect**: "Overwhelm" text with excess damage amount

### Counter

Visual feedback for Counter ability:

1. **Indicator**: Blue reflective barrier forms
2. **Animation**: Attack visibly bounces back toward attacker
3. **Counter Damage**: Separate damage resolution animation
4. **Text Effect**: "Counter" text briefly appears

### Defender

Visual feedback for Defender ability:

1. **Indicator**: Shield icon pulses when Defender intercepts
2. **Redirection**: Attacking unit's animation redirects to Defender
3. **Barrier Effect**: Visual barrier forms in front of protected units
4. **Text Effect**: "Defended" text briefly appears

## Unit State Changes

### Unit Destruction

Visual feedback when a unit is destroyed:

1. **Initial Effect**: Unit flashes red and white
2. **Destruction Animation**: Unit breaks apart/dissolves over 0.7s
3. **Particle Effect**: Fragments scatter based on damage type
4. **Sound Sync**: Visual effects synchronized with audio cue
5. **Board Impact**: Brief camera shake for legendary units

### Unit Exhaustion

Visual feedback when a unit becomes exhausted after attacking:

1. **Card Rotation**: Unit card rotates 90 degrees
2. **Overlay Effect**: Subtle gray overlay appears
3. **Energy Depletion**: Unit's energy aura dims
4. **Recovery Preview**: Faint timer indicator shows when ready again
5. **State Indicator**: "Exhausted" status icon appears briefly

### Unit Revival

Visual feedback when a unit is revived:

1. **Initial Effect**: Swirling energy at card position
2. **Materialization**: Unit gradually reforms over 0.8s
3. **Energy Surge**: Bright flash as unit fully returns
4. **State Indicator**: "Revived" text appears briefly
5. **Health Indicator**: Health bar reappears with appropriate value

## Zone-Specific Combat Feedback

### Lane Combat

Visual feedback for combat within lanes:

1. **Lane Highlight**: Entire lane highlights during combat resolution
2. **Directional Indicators**: Arrows show attack direction
3. **Splash Effects**: Area effects show clear zone of influence
4. **Multi-Unit Effects**: Connected highlights for multi-unit interactions
5. **Resolution Sequence**: Clear visual order for multi-unit combat

### Hero Combat

Visual feedback for combat involving heroes:

1. **Dramatic Effects**: Enhanced visual effects for hero combat
2. **Hero Highlight**: Heroes receive distinctive glow during combat
3. **Hero Powers**: Visual indicators when hero powers influence combat
4. **Critical Moments**: Slow-motion effect for game-changing hero combat
5. **Hero Vulnerability**: Pulsing indicators when hero is directly threatened

## Combat Resolution Sequence

The visual sequence for full combat resolution:

1. **Initiation Phase**: Attacker animation begins
2. **Connection Phase**: Attack effect travels to defender
3. **Impact Phase**: Impact effect occurs on defender
4. **Damage Phase**: Health changes and damage numbers appear
5. **Counter Phase**: Defender's counter-attack if applicable
6. **Resolution Phase**: Final state changes (destruction, status effects, etc.)
7. **Reset Phase**: Units return to base states (except for exhaustion)

## Multi-Unit Combat Feedback

Visual handling of complex multi-unit combat:

1. **Sequencing**: Clear visual order with 0.2s timing between each resolution
2. **Unit Grouping**: Visual grouping of units involved in same combat event
3. **Mass Effects**: Specialized effects for board-wide combat
4. **Area Indicators**: Transparent overlays show affected areas
5. **Summary Effects**: Aggregate damage numbers for mass damage events

## Accessibility Considerations

Combat feedback adaptations for accessibility:

1. **Reduced Motion**: Option to simplify and reduce combat animations
2. **High Contrast Mode**: Enhanced visibility of critical combat information
3. **Longer Timing**: Option to extend animation durations for easier tracking
4. **Text Indicators**: Optional additional text descriptors for all combat events
5. **Color Blind Support**: Pattern and shape differentiation in addition to color
6. **Screen Reader**: Detailed combat descriptions available for screen readers

## Physical Game Implementation

Guidance for the physical card game:

1. **Combat Tokens**: Physical markers to show attack commitments
2. **Damage Counters**: Standardized damage tokens placed on cards
3. **Status Indicators**: Combat-related status tokens with distinct shapes
4. **Combat Mat**: Playmat with designated combat resolution spaces
5. **Reference Cards**: Quick-reference cards showing combat sequence

## Technical Implementation

For developers implementing combat feedback:

1. **Animation System**: Timeline-based system with interruptible sequences
2. **Particle Effects**: Performant particle system with level-of-detail scaling
3. **Sound Integration**: Tight synchronization between visuals and audio
4. **Performance Optimization**: Combat effects optimized for lower-end devices
5. **State Management**: Clean state tracking during complex combat sequences

---

*Document Version: 1.0.0*  
*Last Updated: 2025-08-01*
