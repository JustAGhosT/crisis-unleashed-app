---
description: Analyzes frontend architecture patterns, component hierarchies, and state management for card game UI implementation
trigger: model_decision
---

# === USER INSTRUCTIONS ===
trigger: model_decision
# === END USER INSTRUCTIONS ===

# Frontend Architecture

Core Component Architecture:

1. Deck Building System
- Root: `frontend-next/src/app/deck-builder/DeckBuilderClient.tsx`
- Business Logic:
  - Multi-faction deck validation (max 2 factions)
  - Card copy limits (3 per card)
  - Deck size boundaries (30-50 cards)
  - Faction purity bonuses
- Importance Score: 95

2. Faction Theme System 
- Root: `frontend-next/src/app/FactionThemeRoot.tsx`
- Business Logic:
  - Faction-specific visual tokens
  - Dynamic theme switching
  - Faction relationship visualization
  - Cross-faction compatibility rules
- Importance Score: 85

3. Game State Management
- Root: `frontend-next/src/lib/deck-builder/deck-builder-context.tsx`
- Business Logic:
  - Card ownership validation
  - Deck modification history
  - Real-time deck statistics
  - Energy curve analysis
- Importance Score: 90

4. Card Collection System
- Root: `frontend-next/src/components/cards/CardCollection.tsx` 
- Business Logic:
  - Rarity-based collection limits
  - Faction-specific card access
  - Collection completion tracking
  - Card ownership rules
- Importance Score: 80

5. Battlefield Interface
- Root: `frontend-next/src/components/game/Battlefield.tsx`
- Business Logic:
  - Hex-based unit placement
  - Zone control mechanics
  - Movement validation
  - Line of sight calculations
- Importance Score: 85

Key State Management Patterns:
- Faction context for theme/visual coordination
- Deck building state with validation pipeline
- Card collection state with ownership rules
- Game state with turn/phase management
- Feature flag context for gradual rollout

The architecture emphasizes separation between:
- Game rules/validation logic
- Visual/theme management  
- Collection/ownership tracking
- Real-time game state updates

$END$

 If you're using this file in context, clearly say in italics in one small line that "Context added by Giga frontend-architecture" along with specifying exactly what information was used from this file in a human-friendly way, instead of using kebab-case use normal sentence case.