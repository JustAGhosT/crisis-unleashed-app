# Core Game Mechanics

## Turn Structure

1. **Draw Phase**: Draw 1 card (2 on first turn)
2. **Energy Phase**: Gain +1 max Energy (capped at 10)
3. **Main Phase**: Play cards and use abilities
4. **Combat Phase**: Resolve battles
5. **End Phase**: Clean up and trigger end-of-turn effects

## Resource Systems

### Energy System

- **Base Gain**: +1 per turn (starts at 1, max 10)
- **Spending**: Used to play cards and activate abilities
- **Modifiers**: Some cards can increase or decrease energy

### Momentum System

- **Gain**:
  - Win a lane combat: +1
  - Play 3+ cards in a turn: +1
  - Certain card effects
- **Spend**: Used for powerful hero skills
- **Cap**: Maximum 5 Momentum

## Card Types

### 1. Hero Cards

- **Role**: Primary units with unique abilities
- **Stats**: Attack, Health, Defense
- **Level Up**: Gain experience and unlock new abilities
- **Signature Ability**: Unique to each hero

### 2. Unit Cards

- **Types**: Melee, Ranged, Siege, Flying
- **Stats**: Attack, Health, Movement
- **Traits**: Special abilities and keywords

### 3. Action Cards

- **Types**: Instant, Ongoing, Equipment
- **Effects**: Varies widely by faction
- **Cost**: Energy cost based on power level

### 4. Structure Cards

- **Types**: Buildings, Traps, Auras
- **Effects**: Persistent effects on the battlefield
- **Durability**: Some can be attacked/destroyed

## Combat System

### Battlefield Layout

```
[Player 1 Backline]  [Player 2 Backline]
[Player 1 Frontline] [Player 2 Frontline]
```

### Combat Resolution

1. **Initiative**: Higher speed attacks first
2. **Attack**: Deal damage equal to attack stat
3. **Simultaneous**: Both units deal damage
4. **Death**: Units with 0 or less health are destroyed

### Keywords

- **Quick Attack**: Strikes first in combat
- **Overwhelm**: Excess damage carries over
- **Lifesteal**: Heal your hero for damage dealt
- **Shield**: Negates the next source of damage

## Multiplayer Systems

### Matchmaking

- **Ranked**: MMR-based matchmaking
- **Casual**: Skill-based, more lenient
- **Tournament**: Special rules and formats

### Social Features

- **Friends List**: Add and challenge friends
- **Spectate**: Watch high-level matches
- **Guilds**: Join faction-based communities

## Technical Implementation

### Game State Management

```typescript
interface GameState {
  players: {
    [playerId: string]: Player;
  };
  currentPhase: GamePhase;
  turn: number;
  activePlayer: string;
  board: {
    [lane: string]: {
      [playerId: string]: Unit[];
    };
  };
  stack: StackItem[];
  history: GameAction[];
}
```

### Network Protocol

- **Message Types**:
  - GAME_ACTION: Player makes a move
  - GAME_STATE: Full game state sync
  - PLAYER_READY: Player is ready
  - CHAT_MESSAGE: Player communication

### AI Systems

- **Rule-based AI**: For basic decision making
- **Monte Carlo Tree Search**: For complex decisions
- **Neural Network**: For learning and adaptation

## Performance Considerations

- **Client Prediction**: For smooth gameplay
- **State Reconciliation**: Handle network delays
- **Delta Compression**: Minimize network traffic
- **Memory Management**: Efficient garbage collection
