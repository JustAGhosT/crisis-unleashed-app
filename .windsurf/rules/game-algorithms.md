---
description: Use for analyzing gameplay mechanics, combat resolution, card behavior rules and faction interactions in the digital card game
trigger: model_decision
---

# === USER INSTRUCTIONS ===
trigger: model_decision

trigger: model_decision
- Resource curve optimization
# === END USER INSTRUCTIONS ===

# game-algorithms

## Core Combat System
- Hex-based battlefield grid with unit positioning and zone control mechanics
- Custom movement and attack rules per unit type/faction
- Territory control scoring based on zone occupation
- Line of sight and range calculations for abilities
Importance Score: 95

## Card Deployment Logic
- Energy cost validation and curve analysis
- Play condition verification:
  - Zone placement restrictions
  - Prerequisite checks
  - Turn phase validation
  - Faction alignment requirements
Importance Score: 90

## Turn Sequencing
- Phase-based turn structure:
  - Draw phase with faction-specific card draw rules
  - Energy allocation phase
  - Main action phase with unit deployment/movement
  - Combat resolution phase
  - End phase triggers
- Action point economy management
Importance Score: 85

## Faction Mechanics
- Unique faction abilities:
  - Solaris: Energy manipulation and enhancement
  - Umbral: Stealth and zone control
  - Neuralis: Mind control and prediction
  - Aeonic: Time manipulation
  - Primordial: Unit evolution
  - Infernal: Sacrifice mechanics
  - Synthetic: Replication abilities
Importance Score: 90

## Combat Resolution
- Multi-stage combat resolution:
  - Initiative determination based on unit speed
  - Attack modifier calculation (terrain, buffs, status effects)
  - Defense calculation with faction-specific bonuses
  - Damage application and death triggers
- Chain reaction handling for card effects
Importance Score: 85

Key File Paths:
- frontend-next/src/lib/game-mechanics/combat.ts
- frontend-next/src/lib/game-mechanics/turn-manager.ts 
- frontend-next/src/lib/game-mechanics/battlefield.ts
- frontend-next/src/services/game-service.ts
- frontend-next/src/lib/faction-abilities.ts

$END$

 If you're using this file in context, clearly say in italics in one small line that "Context added by Giga game-algorithms" along with specifying exactly what information was used from this file in a human-friendly way, instead of using kebab-case use normal sentence case.