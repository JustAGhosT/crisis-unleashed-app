---
trigger: model_decision
description: Used for analyzing and documenting core game mechanics, card interactions, combat systems and battlefield algorithms
---

# === USER INSTRUCTIONS ===
trigger: model_decision
# === END USER INSTRUCTIONS ===

# game-algorithms

Core Battle System
Location: frontend-next/src/components/game/Battlefield.tsx
Importance Score: 90
- Hex-based battlefield grid with 3 distinct zones per player
- Zone of Control (ZOC) mechanics affecting unit movement
- Combat resolution using phase-based sequencing
- Terrain effect modifiers on movement and combat
- Line of sight calculations for ranged abilities

Card Combat Engine
Location: frontend-next/src/lib/card-utils.ts
Importance Score: 85
- Initiative-based combat sequence
- Multi-phase turn structure:
  1. Draw Phase (resource generation)
  2. Deploy Phase (unit placement)
  3. Action Phase (combat/abilities)
  4. End Phase (cleanup/effects)
- Faction-specific ability triggers
- Status effect application and resolution

Faction Mechanics
Location: frontend-next/src/types/faction.ts
Importance Score: 85
- Seven unique faction implementations:
  - Solaris: Energy manipulation
  - Umbral: Stealth mechanics
  - Aeonic: Time manipulation
  - Primordial: Growth/Evolution
  - Infernal: Sacrifice mechanics
  - Neuralis: Mind control
  - Synthetic: Resource conversion
- Inter-faction synergy calculations
- Opposition penalties between conflicting factions

Deployment Logic
Location: frontend-next/src/lib/hex.ts
Importance Score: 75
- Zone-based unit placement restrictions
- Formation bonuses for aligned units
- Tactical advantage calculations based on positioning
- Range and movement path validation
- Zone control point scoring

Resource Management
Location: frontend-next/src/types/game.ts
Importance Score: 70
- Dual resource system (Energy/Momentum)
- Faction-specific resource generation rates
- Resource conversion mechanics
- Special ability cost calculations
- Resource curve optimization