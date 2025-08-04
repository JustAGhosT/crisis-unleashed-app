# Visual Examples of Card States

This document provides visual reference and explanation for all possible card states and visual treatments in the game.

## Table of Contents

- [Visual Examples of Card States](#visual-examples-of-card-states)
  - [Table of Contents](#table-of-contents)
  - [Base Card Anatomy](#base-card-anatomy)
  - [Card Rarity Visual Treatments](#card-rarity-visual-treatments)
  - [Status Effect Visualizations](#status-effect-visualizations)
    - [Blessing Status](#blessing-status)
    - [Corruption Status](#corruption-status)
    - [Other Status Effects](#other-status-effects)
  - [Combat State Visualizations](#combat-state-visualizations)
  - [Special Card States](#special-card-states)
    - [Playability States](#playability-states)
    - [Deck and Hand States](#deck-and-hand-states)
  - [Animation States](#animation-states)
  - [Cosmetic Variations](#cosmetic-variations)
  - [Accessibility Considerations](#accessibility-considerations)
    - [Color Blind Modes](#color-blind-modes)
    - [Reduced Motion Settings](#reduced-motion-settings)

## Base Card Anatomy

Every card contains these core visual elements, which serve as the foundation for all state changes:

![Card Anatomy](../assets/card_anatomy.png)

| Element | Purpose | State Changes |
|---------|---------|--------------|
| Card Frame | Indicates card type and rarity | Changes color and texture based on rarity |
| Cost Crystal | Displays energy cost | Changes color when modified (red for increased, green for reduced) |
| Artwork | Portrays card identity | May be darkened/brightened based on playable state |
| Name Banner | Displays card name | Changes color based on faction |
| Type Indicator | Shows card type (Unit/Action/Condition) | Includes additional icons for subtypes |
| Description Box | Contains card text | Contains embedded icons for keywords |
| Combat Stats | Shows attack/health for units | Changes color based on buffs/debuffs |
| Faction Emblem | Indicates card's faction | Glows when faction synergy is active |

## Card Rarity Visual Treatments

Each rarity tier has a distinct visual treatment:

| Rarity | Frame Treatment | Animation Level | Special Effects |
|--------|----------------|-----------------|----------------|
| Common | Basic single-color border | None | None |
| Uncommon | Silver accents on border | None | Subtle shine on emblem |
| Rare | Gold border with light texture | Minimal | Light reflections on border |
| Epic | Purple border with energy patterns | Moderate | Energy field around frame |
| Legendary | Red border with animated flame patterns | Significant | Particle effects emanate from artwork |
| Mythic | Cosmic multi-color shifting border | Extensive | Reality-warping effects around entire card |
| WORM | Reality-fractured border | Maximum | Full card animated with reality tears |

**Visual Examples:**

- [Common Card Example](../assets/rarity/common_example.png)
- [Uncommon Card Example](../assets/rarity/uncommon_example.png)
- [Rare Card Example](../assets/rarity/rare_example.png)
- [Epic Card Example](../assets/rarity/epic_example.png)
- [Legendary Card Example](../assets/rarity/legendary_example.png)
- [Mythic Card Example](../assets/rarity/mythic_example.png)
- [WORM Card Example](../assets/rarity/worm_example.png)

## Status Effect Visualizations

### Blessing Status

Blessing effects are visualized through these card states:

![Blessing State Example](../assets/states/blessing_state.png)

| Blessing Level | Visual Indicator | Animation |
|----------------|-----------------|-----------|
| Level 1 Blessing | Thin gold aura | Subtle pulse |
| Level 2 Blessing | Medium gold aura with particles | Steady pulse |
| Level 3 Blessing | Thick gold aura with intense particles | Rapid pulse with radiant effect |

### Corruption Status

Corruption effects create these visual states:

![Corruption State Example](../assets/states/corruption_state.png)

| Corruption Level | Visual Indicator | Animation |
|------------------|-----------------|-----------|
| Level 1 Corruption | Thin purple haze | Subtle void tendrils |
| Level 2 Corruption | Medium purple mist with dark particles | Swirling void energy |
| Level 3 Corruption | Thick dark shroud with void tears | Reality distortion effect |

### Other Status Effects

| Status | Visual Indicator | Animation | Example Image |
|--------|-----------------|-----------|---------------|
| Stunned | Yellow electrical surges | Sporadic zaps | [Stunned Example](../assets/states/stunned_state.png) |
| Frozen | Blue crystalline overlay | Slowed movement | [Frozen Example](../assets/states/frozen_state.png) |
| Empowered | Red energy aura | Expanding rings | [Empowered Example](../assets/states/empowered_state.png) |
| Protected | Blue shield bubble | Rotating shield | [Protected Example](../assets/states/protected_state.png) |
| Poisoned | Green mist | Dripping effect | [Poisoned Example](../assets/states/poisoned_state.png) |
| Mind Controlled | Pink neural connections | Pulsing tendrils | [Mind Controlled Example](../assets/states/mind_controlled_state.png) |
| Upgraded | Mechanical enhancements | Gear rotations | [Upgraded Example](../assets/states/upgraded_state.png) |

## Combat State Visualizations

Cards display different visual states during combat:

| Combat State | Visual Change | Animation | Example Image |
|--------------|---------------|-----------|---------------|
| Attack Ready | Green glow around attack value | Pulsing highlight | [Attack Ready Example](../assets/states/attack_ready_state.png) |
| Exhausted | Darkened card with gray overlay | Slow pulse | [Exhausted Example](../assets/states/exhausted_state.png) |
| Attacking | Red directional indicator | Swift movement | [Attacking Example](../assets/states/attacking_state.png) |
| Defending | Blue shield icon | Shield flash | [Defending Example](../assets/states/defending_state.png) |
| Damaged | Red damage numbers | Rising and fading | [Damaged Example](../assets/states/damaged_state.png) |
| Healing | Green healing numbers | Rising and fading | [Healing Example](../assets/states/healing_state.png) |
| Dying | Dissolving card edge | Particle disintegration | [Dying Example](../assets/states/dying_state.png) |

## Special Card States

Cards can enter various special states:

### Playability States

| State | Visual Indicator | Reason | Example Image |
|-------|-----------------|--------|---------------|
| Playable | Normal appearance with subtle glow | Sufficient resources | [Playable Example](../assets/states/playable_state.png) |
| Unplayable - Cost | Red cost crystal | Insufficient energy | [Unplayable Cost Example](../assets/states/unplayable_cost_state.png) |
| Unplayable - Condition | Gray overlay with X | Condition not met | [Unplayable Condition Example](../assets/states/unplayable_condition_state.png) |
| Discounted | Green cost crystal | Cost reduction | [Discounted Example](../assets/states/discounted_state.png) |
| Increased Cost | Red cost crystal with up arrow | Cost increase | [Increased Cost Example](../assets/states/increased_cost_state.png) |

### Deck and Hand States

| State | Visual Indicator | Meaning | Example Image |
|-------|-----------------|---------|---------------|
| Top of Deck | Glowing edge | Card is on top of deck | [Top Deck Example](../assets/states/top_deck_state.png) |
| Revealed | Card temporarily flipped | Information revealed | [Revealed Example](../assets/states/revealed_state.png) |
| Transformed | Morphing animation | Card changed identity | [Transformed Example](../assets/states/transformed_state.png) |
| Created | Materialization effect | Not from original deck | [Created Example](../assets/states/created_state.png) |
| Shuffled | Spinning card | Return to deck | [Shuffled Example](../assets/states/shuffled_state.png) |
| Locked | Chain overlay | Cannot be played | [Locked Example](../assets/states/locked_state.png) |

## Animation States

Cards have several animation states in digital play:

| Animation State | Trigger | Effect | Example |
|----------------|---------|--------|---------|
| Draw Animation | Card drawn | Slide from deck to hand | [Draw Animation](../assets/animations/draw_animation.gif) |
| Play Animation | Card played | Move from hand to field | [Play Animation](../assets/animations/play_animation.gif) |
| Hover State | Mouse over | Enlarge and highlight | [Hover Animation](../assets/animations/hover_animation.gif) |
| Active Effect | Effect triggers | Card-specific animation | [Effect Animation](../assets/animations/effect_animation.gif) |
| Destruction | Card destroyed | Dissolving particles | [Destroy Animation](../assets/animations/destroy_animation.gif) |
| Premium Animation | Always (premium only) | Continuous subtle motion | [Premium Animation](../assets/animations/premium_animation.gif) |

## Cosmetic Variations

Cards can have these cosmetic treatments regardless of state:

| Cosmetic Type | Visual Change | Acquisition | Example Image |
|--------------|---------------|-------------|---------------|
| Standard | Base version | Default | [Standard Example](../assets/cosmetics/standard_example.png) |
| Foil | Holographic pattern | Pack chance (10%) | [Foil Example](../assets/cosmetics/foil_example.png) |
| Golden | Gold-infused artwork | Achievements | [Golden Example](../assets/cosmetics/golden_example.png) |
| Alternate Art | Different artwork | Special events | [Alt Art Example](../assets/cosmetics/alt_art_example.png) |
| Full Art | Borderless extended art | Collector edition | [Full Art Example](../assets/cosmetics/full_art_example.png) |
| Animated | Living artwork | Premium packs | [Animated Example](../assets/cosmetics/animated_example.png) |
| Elemental | Energy-infused effects | Mastery rewards | [Elemental Example](../assets/cosmetics/elemental_example.png) |
| Corrupted | Void-influenced distortion | Special events | [Corrupted Example](../assets/cosmetics/corrupted_example.png) |
| Prismatic | Rainbow holographic | Tournament prizes | [Prismatic Example](../assets/cosmetics/prismatic_example.png) |

## Accessibility Considerations

Alternative visual states for accessibility settings:

### Color Blind Modes

| Color Blind Type | Visual Adjustments | Example Image |
|------------------|-------------------|---------------|
| Protanopia | Red/green modification with pattern differentiation | [Protanopia Example](../assets/accessibility/protanopia_example.png) |
| Deuteranopia | Green modification with enhanced contrast | [Deuteranopia Example](../assets/accessibility/deuteranopia_example.png) |
| Tritanopia | Blue/yellow modification with pattern differentiation | [Tritanopia Example](../assets/accessibility/tritanopia_example.png) |

### Reduced Motion Settings

| Setting | Visual Change | Example |
|---------|--------------|---------|
| Minimal Animation | Static effects replace animations | [Minimal Animation Example](../assets/accessibility/minimal_animation_example.png) |
| No Particle Effects | Clean visuals without particles | [No Particles Example](../assets/accessibility/no_particles_example.png) |
| High Contrast Mode | Enhanced borders and text contrast | [High Contrast Example](../assets/accessibility/high_contrast_example.png) |
| Text-Only Mode | Removes decorative elements | [Text-Only Example](../assets/accessibility/text_only_example.png) |

---

Note: This document references visual assets that should be included in the final documentation package. The asset paths shown are placeholder references to the expected location of these files in the documentation repository.

Last Updated: 2025-08-01
