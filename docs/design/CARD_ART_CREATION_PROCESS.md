# Card Art Creation Process

This document outlines the complete workflow for creating, approving, and implementing card artwork in the game. It covers both physical card art and digital animations.

## Table of Contents

1. [Overview](#overview)
2. [Faction Visual Guidelines](#faction-visual-guidelines)
3. [Card Art Creation Workflow](#card-art-creation-workflow)
4. [Digital Implementation](#digital-implementation)
5. [Card Animation System](#card-animation-system)
6. [Quality Control](#quality-control)
7. [Art Revision Process](#art-revision-process)
8. [File Management Standards](#file-management-standards)

## Overview

Card art is a crucial component of the game experience, serving to:
- Establish the visual identity of each faction
- Communicate card function through visual cues
- Create an immersive universe that enhances player engagement
- Provide distinct visual recognition for different card types

## Faction Visual Guidelines

Each faction has a specific color palette and visual aesthetic that must be adhered to:

### Solaris Nexus
- **Primary Colors**: White, gold, blue
- **Visual Elements**: Geometric patterns, light emanation, circuitry integration
- **Atmosphere**: Bright, technologically advanced, orderly

### Umbral Eclipse
- **Primary Colors**: Purple, black, cyan
- **Visual Elements**: Shadows, glitches, corrupted data streams
- **Atmosphere**: Dark, mysterious, subversive

### Aeonic Dominion
- **Primary Colors**: Teal, silver, white
- **Visual Elements**: Time artifacts, clockwork, temporal distortion
- **Atmosphere**: Ethereal, ancient yet futuristic

### Primordial Genesis
- **Primary Colors**: Green, amber, brown
- **Visual Elements**: Organic patterns, growth structures, evolutionary forms
- **Atmosphere**: Vibrant, primal, constantly evolving

### Infernal Core
- **Primary Colors**: Red, orange, obsidian
- **Visual Elements**: Volcanic imagery, molten technology, flame patterns
- **Atmosphere**: Intense, chaotic, destructive

### Neuralis Conclave
- **Primary Colors**: Blue, violet, silver
- **Visual Elements**: Neural networks, psychic waves, mind structures
- **Atmosphere**: Cerebral, complex, consciousness-focused

### Synthetic Directive
- **Primary Colors**: Grey, blue, neon accents
- **Visual Elements**: Robotic designs, assembly patterns, modular structures
- **Atmosphere**: Efficient, logical, industrial

## Card Art Creation Workflow

### 1. Concept Phase
- **Card Brief Creation**: Game designers create a detailed brief including:
  - Card name and type
  - Faction alignment
  - Mechanical function
  - Narrative role
  - Key visual elements to include

- **Mood Board Development**: Art directors compile mood boards with:
  - Faction-specific visual references
  - Similar card type examples
  - Stylistic direction guidance

- **Sketching**: Artists create 2-3 rough concept sketches exploring different approaches

### 2. Refinement Phase
- **Concept Selection**: Design team selects preferred direction
- **Refined Sketch**: Artist creates detailed sketch
- **Color Studies**: Artist develops 2-3 color treatments
- **Design Approval**: Art director and lead designer sign off

### 3. Production Phase
- **Final Illustration**: Artist creates full resolution artwork
- **Card Layout Integration**: Design team integrates art into card template
- **Text and Icon Placement**: UI designers add:
  - Card name and type
  - Cost and stats
  - Ability text and icons
  - Rarity indicators

### 4. Review and Finalization
- **Art Review**: Full art review by art director
- **Design Review**: Mechanics review by lead designer
- **Lore Review**: Narrative consistency check by lore team
- **Final Approval**: Sign-off by project lead

## Digital Implementation

### File Format Standards
- **Source Files**: PSD or equivalent with layers, 600dpi, RGB color space
- **Master Art**: 4000x3000px minimum resolution
- **Game Assets**: Exported at appropriate sizes for:
  - Physical printing (CMYK conversion)
  - Digital display (RGB optimization)
  - Mobile scaling (compressed versions)

### Asset Processing
- **Card Frame Integration**: 
  - Art must fit within designated "art box" 
  - Templates provided for each card type
  - Safe zones indicated for text overlay

- **Animation Preparation**:
  - Layer separation for animated elements
  - Designation of static vs. dynamic elements
  - Background/foreground separation

## Card Animation System

Our proprietary Card Animation System enables digital versions of cards to feature subtle animations that enhance the play experience without being distracting.

### Animation Categories
1. **Idle Animations**: Subtle movements when card is static
2. **Hover Animations**: Enhanced animation when player focuses on card
3. **Play Animations**: Dramatic effects when card is played
4. **Effect Animations**: Visualizations of card abilities activating

### Animation Implementation Process
1. **Animation Planning**: 
   - Storyboard key animation states
   - Define animation trigger points
   - Establish animation timing

2. **Asset Preparation**:
   - Artists create multiple layers and states
   - Separate moving elements from static background
   - Prepare particle and lighting effects

3. **Implementation**:
   - Technical artists implement animations in game engine
   - QA tests performance and visual fidelity
   - Optimization for different platforms

### AI Artwork Generation Guidelines
To maintain consistency while using AI assistance:

- Use approved faction-specific style prompts
- Always iterate with human artist refinement
- Apply consistent post-processing filters
- Ensure compliance with visual identity standards
- Manual review for:
  - Anatomical correctness
  - Logical environmental elements
  - Consistent lighting and perspective

## Quality Control

### Technical Requirements
- **Resolution**: Minimum 300dpi for print, scaled appropriately for digital
- **Color Accuracy**: Color-managed workflow with calibrated displays
- **Contrast Ratio**: Must meet accessibility standards
- **Distinctive Silhouette**: Card art should be recognizable at thumbnail size

### Artistic Standards
- **Faction Consistency**: Must adhere to faction visual guidelines
- **Archetype Representation**: Should clearly communicate card archetype
- **Unique Identity**: Must be visually distinct from other cards
- **Emotional Impact**: Should evoke appropriate emotional response

## Art Revision Process

### Feedback Collection
- Feedback provided through standard form
- All comments collected before returning to artist
- Clear, actionable revision requests

### Revision Rounds
- Maximum three revision rounds:
  1. Major compositional changes
  2. Color/detail refinements
  3. Final small adjustments

### Final Approval Checklist
- Narrative integration
- Mechanical representation
- Faction alignment
- Technical specifications
- Accessibility considerations

## File Management Standards

### Naming Convention
```
[Faction]_[CardType]_[CardName]_[Version].[extension]
```
Example: SolarisNexus_Unit_QuantumProtector_v2.psd

### Version Control
- Working files stored in secured cloud repository
- Version history maintained through standard naming
- Archive of all iterations preserved
- Final assets tagged and centralized

### Metadata Requirements
Each asset must include metadata for:
- Artist information
- Creation date
- Copyright status
- Approval status
- Implementation status

---

This document will be periodically updated as art standards evolve and new techniques are developed. Last updated: 2025-08-01.