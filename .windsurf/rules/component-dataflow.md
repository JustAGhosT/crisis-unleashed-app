---
trigger: model_decision
description: Documents dataflow between game UI components including state updates, event handling, and data propagation patterns
---

# component-dataflow

Key Component Interactions:

1. Battlefield -> TurnManager
- Sends unit position updates and movement validation requests
- Receives turn phase state and allowed actions
- Propagates combat initiation events
- Updates zone control status
Importance Score: 85

2. CardHand -> PlayerHUD
- Transmits card play requests and validation
- Updates energy/resource availability
- Sends targeting information for card effects
- Receives play restrictions based on game state
Importance Score: 80

3. PlayerHUD -> GameInterface 
- Propagates resource state changes (energy, momentum)
- Sends player action selections
- Receives game state updates and phase transitions
- Updates faction-specific bonuses and penalties
Importance Score: 75

4. TurnManager -> GameInterface
- Controls game phase transitions
- Validates action sequences
- Updates initiative tracking
- Manages combat resolution flow
Importance Score: 90

5. Battlefield -> CardHand
- Validates card placement targets
- Updates valid play zones
- Transmits unit position data
- Sends terrain effect modifiers
Importance Score: 70

Core Data Flows:
- Combat Resolution: Battlefield -> TurnManager -> PlayerHUD
- Card Playing: CardHand -> PlayerHUD -> GameInterface 
- Resource Management: PlayerHUD -> GameInterface -> TurnManager
- Position Control: Battlefield -> TurnManager -> GameInterface

State Update Hierarchy:
1. GameInterface (root game state)
2. TurnManager (phase/turn state)
3. PlayerHUD (player resources)
4. Battlefield (board state)
5. CardHand (hand/play options)