# Card Template Specifications

## Overview

This document defines the standard specifications for all Crisis Unleashed card templates. Consistent card design is crucial for gameplay clarity, brand recognition, and aesthetic coherence across all game materials.

## Card Dimensions

### Digital Cards

- Standard resolution: 750 × 1050 pixels (5:7 ratio)
- High-resolution version: 1500 × 2100 pixels
- Safe area: 675 × 975 pixels (45px margin on all sides)

### Physical Cards

- Card size: 63mm × 88mm (standard trading card size)
- Printing bleed: 3mm on all sides
- Rounded corners: 3mm radius
- Stock weight: 300gsm blue core

## Anatomy of a Card

### Frame Components

1. **Title Bar** (60px height)
   - Contains card name and cost
   - Position: Top of card

2. **Artwork Area** (420px height)
   - Contains primary card illustration
   - Position: Below title bar

3. **Type Bar** (40px height)
   - Contains card type and subtype
   - Position: Below artwork area

4. **Text Box** (410px height)
   - Contains rules text and flavor text
   - Position: Below type bar

5. **Info Bar** (40px height)
   - Contains card number, rarity, set symbol, etc.
   - Position: Bottom of card

6. **Stat Box** (For unit cards only)
   - Position: Bottom right of text box
   - Size: 120px × 80px

7. **Border** (20px width)
   - Surrounds entire card
   - Varies by faction

### Typography Specifications

1. **Card Name**
   - Font: Exo 2 Bold
   - Size: 36pt
   - Color: White (#FFFFFF)
   - Drop shadow: 2px offset, 50% opacity

2. **Type Line**
   - Font: Exo 2 Semibold
   - Size: 24pt
   - Color: White (#FFFFFF)

3. **Rules Text**
   - Font: Roboto Regular
   - Size: 21pt
   - Color: Black (#000000)
   - Line spacing: 120%

4. **Flavor Text**
   - Font: Roboto Italic
   - Size: 18pt
   - Color: Dark Gray (#444444)
   - Set apart from rules text with a small dividing line

5. **Energy Cost**
   - Font: Exo 2 Black
   - Size: 48pt
   - Color: White (#FFFFFF)
   - Stroke: 3px black

6. **Stats (Power/Health)**
   - Font: Exo 2 Black
   - Size: 42pt
   - Color: White (#FFFFFF)
   - Stroke: 3px black

## Faction-Specific Elements

Each faction has unique template elements that distinguish their cards:

### Solaris Nexus

- Border pattern: Circuit-like golden lines on white background
- Frame texture: Polished metallic with light rays
- Energy crystal: Diamond-shaped, glowing golden core
- Title background: Radiant gold gradient
- Text box: Semi-transparent crystalline structure

### Umbral Eclipse

- Border pattern: Glitching shadow tendrils
- Frame texture: Digital distortion over dark background
- Energy crystal: Irregular purple crystal with shadow effects
- Title background: Dark purple with data stream effects
- Text box: Appears to emerge from darkness

### Aeonic Dominion

- Border pattern: Clockwork and time symbols
- Frame texture: Temporal distortions with overlapping moments
- Energy crystal: Hourglass-shaped with flowing energy
- Title background: Teal with time ripple effects
- Text box: Multiple ghost images showing past/future states

### Primordial Genesis

- Border pattern: Organic growth and root systems
- Frame texture: Living tissue with crystal formations
- Energy crystal: Amber crystal with organic inclusions
- Title background: Natural gradient from green to amber
- Text box: Appears carved from living wood or amber

### Infernal Core

- Border pattern: Flame and molten metal
- Frame texture: Heat distortion and cooling magma
- Energy crystal: Volcanic crystal with internal fire
- Title background: Gradient from dark red to bright orange
- Text box: Appears forged from cooling volcanic rock

### Neuralis Conclave

- Border pattern: Neural network patterns
- Frame texture: Psionic energy waves
- Energy crystal: Brain-shaped crystal with energy pulses
- Title background: Violet energy gradient
- Text box: Appears to float in mental energy field

### Synthetic Directive

- Border pattern: Grid system and network nodes
- Frame texture: Brushed metal with LED indicators
- Energy crystal: Modular crystal with data readouts
- Title background: Metallic gradient with scanning line
- Text box: Resembles high-resolution display screen

## Card Type Variations

### Unit Cards

- Feature stat box in bottom right
- Artwork shows full character/entity
- Subtype appears after "Unit -" on type line

### Action Cards

- No stat box
- Artwork shows the action being performed
- "Action" appears on type line, possibly with subtypes

### Condition Cards

- Features unique condition symbol
- Artwork shows effect on environment
- "Condition" appears on type line, possibly with duration indicator

### Hero Cards

- Oversized (89mm × 124mm physical; 1050 × 1470px digital)
- Portrait-oriented artwork showing full hero
- Additional ability box below main text
- Evolution path indicators
- Faction emblems and special rarity indicators

## Rarity Indicators

Rarity is indicated through multiple visual elements:

1. **Set Symbol Color**
   - Common: Black
   - Uncommon: Silver
   - Rare: Gold
   - Epic: Purple
   - Legendary: Red
   - WORM: Rainbow holographic

2. **Card Name Color/Effect**
   - Common: Standard white
   - Uncommon: Silver with subtle sheen
   - Rare: Gold with subtle animation
   - Epic: Faction color with particle effects
   - Legendary: Animated gradient with energy effects
   - WORM: Shifting prismatic effect

3. **Frame Enhancements**
   - Common: Standard frame
   - Uncommon: Added metallic highlights
   - Rare: Glowing frame elements
   - Epic: Dynamic frame effects
   - Legendary: Full animated frame
   - WORM: Reality-distorting frame effects

## Asset Requirements

### Art Specifications

- Art dimensions: 690 × 420 pixels
- Format: 32-bit PNG with transparency (digital)
- Resolution: 300 DPI minimum
- Color space: RGB for digital, CMYK for print

### Symbol Assets

- Energy crystal: 120 × 120 pixels
- Faction emblem: 80 × 80 pixels
- Type icons: 40 × 40 pixels
- Set symbols: 40 × 40 pixels
- Status effect icons: 30 × 30 pixels

## Template Variations

### Full Art Cards

- Extended artwork that covers 80% of card face
- Reduced text box height
- Semi-transparent text background
- Maintained card information structure

### Alternate Art Cards

- Same template structure
- Different artwork
- Small indicator showing it's an alternate version

### Promo Cards

- Special frame treatment
- Unique texture overlays
- Event or promotion indicators
- Maintained core template structure

## Digital Implementation Guides

### Animation Guidelines

- Frame animations should be subtle and non-distracting
- Energy effects should pulse at approximately 1-second intervals
- Legendary card animations should loop seamlessly
- File format: JSON animation data for web, sprite sheets for mobile

### Interactive Elements

- Tap/click response: Slight scale increase (105%)
- Hover effect: Subtle glow based on faction colors
- Selection indicator: Bright outline using faction accent color
- Drag visual: Semi-transparent with motion blur

## Accessibility Considerations

- Text contrast ratio: Minimum 4.5:1 for all text elements
- Color-blind friendly visualization of stats and effects
- Alternate text versions available for low-vision players
- Distinct tactile elements for physical cards

## Quality Control Checklist

- [ ] All text is legible at card size
- [ ] Faction-specific elements match style guide
- [ ] Color values adhere to faction palette
- [ ] All required card information is present
- [ ] Bleed area extends beyond trim line
- [ ] Template layers structured correctly
- [ ] Appropriate file formats and resolutions used

## Template Files

Template files are available in the following formats:

- Adobe Photoshop (.psd)
- Adobe Illustrator (.ai)
- Affinity Designer/Photo (.afdesign/.afphoto)
- PNG templates

Access the template files in the Asset Repository under `/design/templates/cards/`

> *Note: All card designs must adhere to these specifications to maintain a cohesive visual identity across Crisis Unleashed products and platforms.*
