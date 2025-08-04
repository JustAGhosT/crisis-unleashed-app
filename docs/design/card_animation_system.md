# Card Animation System

## Overview

The Crisis Unleashed card animation system creates dynamic, interactive visual effects that enhance the player experience. Animations are tied directly to card rarity, with higher-rarity cards featuring progressively more elaborate and impressive visual effects when players interact with them.

## Core Animation Principles

### Rarity-Based Animation Scale

Card animations increase in complexity and visual impact based on rarity:

| Rarity | Animation Level | Description |
|--------|----------------|-------------|
| Common | Subtle | Simple highlight effects, minimal movement |
| Uncommon | Basic | Light particle effects and gentle movement |
| Rare | Enhanced | Noticeable animations with faction-specific effects |
| Epic | Advanced | Dynamic elements with partial boundary breaking |
| Legendary | Premium | Extensive animations with significant boundary effects |
| Mythical | Ultimate | Full character extension beyond card boundaries |

### Interaction Triggers

Animations activate through specific player interactions:

1. **Hover** - Primary trigger for animation effects
2. **Selection** - Enhanced animation when card is selected/clicked
3. **Play** - Special animation sequence when card enters play
4. **Victory** - Unique celebration animation for winning cards

## Animation Specifications by Rarity

### Common Cards (Subtle Animation)

**Hover Effects:**

- Soft glow around card border (faction color, 20% opacity)
- Slight card scale increase (105%)
- 300ms animation duration

**Technical Requirements:**

- Maximum file size: 50KB per animation
- Frames: 15-20 for complete animation cycle
- No special rendering techniques required

### Uncommon Cards (Basic Animation)

**Hover Effects:**

- Card border illumination with pulsing effect
- Minor movement of character/subject (5% movement range)
- Simple particle effects in background (faction-themed)
- Scale increase to 108%
- 400ms animation duration

**Technical Requirements:**

- Maximum file size: 100KB per animation
- Frames: 20-30 for complete animation cycle
- Basic particle system

### Rare Cards (Enhanced Animation)

**Hover Effects:**

- Dynamic border effects with flowing energy
- Character/subject animation (10% movement range)
- Background elements shift and react to movement
- Energy effects emanate from key points in artwork
- Scale increase to 112%
- 500ms animation duration

**Technical Requirements:**

- Maximum file size: 200KB per animation
- Frames: 30-45 for complete animation cycle
- Multi-layered animation with independent element movement
- Simple mask effects for contained animations

### Epic Cards (Advanced Animation)

**Hover Effects:**

- Card frame flexes and expands slightly
- Character/subject has significant animation (15% movement range)
- Weapon/item/effect extends slightly beyond card border (10% overflow)
- Dynamic lighting effects cast from character
- Environmental effects react to movement
- Scale increase to 115%
- 600ms animation duration

**Technical Requirements:**

- Maximum file size: 300KB per animation
- Frames: 45-60 for complete animation cycle
- Advanced particle systems
- Multiple animation layers with varying depths
- Masking techniques for controlled boundary breaking

### Legendary Cards (Premium Animation)

**Hover Effects:**

- Card frame transforms with dimensional effects
- Full character animation with integrated effects
- Significant elements extend beyond card borders (25% overflow)
- Environmental effects extend into surrounding space
- Energy/magic effects interact with card frame
- Scale increase to 120%
- 700ms animation duration

**Technical Requirements:**

- Maximum file size: 500KB per animation
- Frames: 60-90 for complete animation cycle
- Complex particle systems with physics
- Multi-plane animations with parallax
- Advanced masking and overflow management
- Dynamic lighting effects

### Mythical Cards (Ultimate Animation)

**Hover Effects:**

- Character/subject fully animates and extends beyond card boundaries (up to 50% overflow)
- Card frame transforms dramatically with dimensional effects
- Full environmental extension into surrounding space
- Integrated special effects that interact with UI elements
- Complete character poses that break the fourth wall
- Scale increase to 125%
- 800ms animation duration

**Technical Requirements:**

- Maximum file size: 800KB per animation
- Frames: 90-120 for complete animation cycle
- Premium particle and physics systems
- Multi-stage animations with sequenced triggers
- Advanced compositing techniques
- Unity timeline animations for maximum control
- Dynamic shadows and lighting that affect surrounding elements

## Technical Implementation Guidelines

### Asset Preparation

1. **Layered Artwork Requirements**

   - Character/subject isolated on separate layer
   - Background elements on separate layers
   - Effects/energy on separate layers
   - All layers extending beyond visible card boundaries for overflow animations

2. **File Formats and Organization**

   - Character animations: Sprite sheets or skeletal animation (Spine/Dragonbones)
   - Particle effects: JSON-based particle systems
   - Background animations: Separate sprite sheets or video textures
   - Cards must be built with minimum 200% artwork size to allow for extension

3. **Optimization Techniques**

   - Use vector animations where possible
   - Implement texture atlasing for all animation frames
   - Utilize GPU instancing for particle effects
   - Implement LOD (Level of Detail) for animations based on viewport size

### Development Implementation

```typescript
// Conceptual implementation example
class CardAnimation {
    private readonly raritySettings = {
        common: { scale: 1.05, duration: 300, overflow: 0 },
        uncommon: { scale: 1.08, duration: 400, overflow: 0 },
        rare: { scale: 1.12, duration: 500, overflow: 0 },
        epic: { scale: 1.15, duration: 600, overflow: 0.1 },
        legendary: { scale: 1.2, duration: 700, overflow: 0.25 },
        mythical: { scale: 1.25, duration: 800, overflow: 0.5 }
    };
    
    constructor(private card: Card) {
        this.setupAnimations();
    }
    
    private setupAnimations(): void {
        const settings = this.raritySettings[this.card.rarity];
        
        // Set up hover animations
        this.card.element.addEventListener('mouseenter', () => {
            this.activateAnimation(settings);
        });
        
        this.card.element.addEventListener('mouseleave', () => {
            this.deactivateAnimation(settings);
        });
    }
    
    private activateAnimation(settings: RaritySettings): void {
        // Scale card
        this.card.element.style.transform = `scale(${settings.scale})`;
        this.card.element.style.zIndex = '100';
        
        // Activate appropriate animation layers based on rarity
        if (settings.overflow > 0) {
            this.card.characterLayer.style.transform = `scale(${1 + settings.overflow})`;
            this.card.effectsLayer.classList.add('overflow-enabled');
        }
        
        // Play animation sequence
        this.card.animationController.play(settings.duration);
    }
    
    private deactivateAnimation(settings: RaritySettings): void {
        // Reset card state with appropriate transition
        this.card.element.style.transform = 'scale(1)';
        this.card.element.style.zIndex = 'auto';
        
        if (settings.overflow > 0) {
            this.card.characterLayer.style.maxWidth = '100%';
            this.card.characterLayer.style.maxHeight = '100%';
            this.card.effectsLayer.classList.remove('overflow-enabled');
        }
        
        // Return to idle state
        this.card.animationController.returnToIdle(settings.duration / 2);
    }
}
```

## Visual Examples

### Character Extension Beyond Borders

![Mythical Card Animation Example]

Characters in mythical rarity cards dramatically extend beyond the card frame when hovered, creating a striking 3D effect. The character appears to "break free" from the confines of the card, creating a premium, immersive experience.

Key aspects of this effect include:

- Main character extending up to 50% beyond card boundaries
- Dynamic lighting that casts shadows onto the UI
- Particle effects that flow into surrounding space
- Secondary elements that react to character movement

### Animation Storyboard

For each mythical card, create a storyboard defining:

1. Idle state (subtle movement)
2. Hover transition (initial reaction)
3. Full extension state (character breaking boundaries)
4. Interactive elements (parts that react to additional user input)
5. Return transition (character returning to card)

## Faction-Specific Animation Styles

Each faction has unique animation characteristics:

### Solaris Nexus

- Golden light rays emanate from character
- Divine symbols materialize and orbit
- Precise, controlled movement patterns
- Light refraction and lens flare effects

### Umbral Eclipse

- Shadow tendrils extend beyond borders
- Digital glitch effects at boundary edges
- Unpredictable, asymmetrical movements
- Particles dissolve and reform continuously

### Aeonic Dominion

- Time fractures appear at card edges
- Multiple time-phased versions of character visible
- Clock mechanisms and gears materialize
- Smooth, flowing motion with temporal echoes

### Primordial Genesis

- Organic growth extends beyond boundaries
- Crystal formations emerge and evolve
- Primal energy pulses through extensions
- Natural, weight-driven movements

### Infernal Core

- Flames and smoke break card boundaries
- Molten effects drip beyond frame
- Aggressive, explosive movement patterns
- Heat distortion affects surrounding area

### Neuralis Conclave

- Psionic waves ripple outward
- Mental energy connects to UI elements
- Elegant, cerebral movement patterns
- Thought bubbles and neural connections extend

### Synthetic Directive

- Mechanical parts extend beyond frame
- Data streams flow between card and UI
- Precise, robotic movement sequences
- Drone elements detach and reattach

## Performance Considerations

To maintain smooth performance across devices:

1. **Adaptive Quality System**
   - Automatically adjust animation complexity based on device capabilities
   - Implement frame rate throttling on lower-end devices
   - Provide options to disable or reduce animations

2. **Loading Optimization**
   - Preload animations for cards in hand only
   - Use progressive loading for deck animations
   - Implement asset bundling by faction

3. **Memory Management**
   - Cache animations for frequently viewed cards
   - Unload animations for cards not in current view
   - Implement texture compression for animation frames

## Implementation Roadmap

### Phase 1: Foundation

- Implement basic hover scaling for all cards
- Establish technical framework for layered animations
- Create animation templates for each rarity level

### Phase 2: Rarity Enhancement

- Develop animations for rare and above cards
- Implement border overflow systems
- Integrate faction-specific animation styles

### Phase 3: Premium Effects

- Implement full mythical card animations
- Create special case animations for promotional cards
- Develop environmental interaction effects

### Phase 4: Optimization

- Performance testing across device range
- Optimization of animation assets
- Implementation of adaptive quality system

## Quality Assurance Guidelines

Each card animation should be tested for:

- Performance impact (frame rate, memory usage)
- Visual consistency with faction guidelines
- Correct behavior on hover/unhover
- Proper z-index handling when multiple cards animate
- Boundary overflow handling
- Transition smoothness

## Accessibility Considerations

- All animations must have an option to be disabled
- Reduced motion settings must be respected
- Visual effects should not rely solely on motion to convey information
- Animation speeds should be configurable for users with cognitive requirements

> *Note: The animation system should create a sense of premium value and excitement when players interact with high-rarity cards, while maintaining performance and accessibility across all platforms and devices.*
