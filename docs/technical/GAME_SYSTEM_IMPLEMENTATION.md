# Crisis Unleashed - Game System Implementation

## Overview

This technical document outlines the implementation details of Crisis Unleashed's core game systems. The game combines strategic card placement, resource management, and faction-specific mechanics to create unique gameplay experiences.

## State Management

### Game State Structure

The game state is defined in `types/game.types.ts` and follows this structure:

```typescript
interface GameState {
  currentTurn: number;
  activePlayer: 'player1' | 'player2';
  momentum: number;
  energy: number;
  health: number;
  enemyHealth: number;
}
```

For the full implementation, the game state will be expanded to include:

```typescript
interface CompleteGameState {
  gameId: string;
  status: 'waiting' | 'in_progress' | 'completed';
  currentTurn: number;
  activePlayer: PlayerId;
  currentPhase: GamePhase;
  players: {
    [playerId: string]: PlayerState;
  };
  board: {
    [position: string]: BattlefieldZone;
  };
  effectsStack: Effect[];
  actionHistory: GameAction[];
}
```

### State Updates

The current implementation in `GameInterface.tsx` demonstrates state updates via React hooks:

```typescript
const [gameState, setGameState] = useState<GameState>({
  currentTurn: 1,
  activePlayer: 'player1',
  momentum: 3,
  energy: 7,
  health: 100,
  enemyHealth: 100,
});

// Example of a state update when ending a turn
const handleEndTurn = () => {
  setGameState(prevState => ({
    ...prevState,
    currentTurn: prevState.currentTurn + 1,
    activePlayer: prevState.activePlayer === 'player1' ? 'player2' : 'player1',
    energy: 7, // Reset energy at the start of turn
  }));
};
```

In the full implementation, these updates will be:
1. Triggered by player actions
2. Validated by the server
3. Applied atomically to maintain consistency
4. Broadcast to all clients via WebSockets

## Card System

### Card Types

The `types/game.types.ts` file defines the following card types:

```typescript
enum CardType {
  Character = 'character',
  Action = 'action',
  Upgrade = 'upgrade',
  Tactic = 'tactic',
}

interface CardBase {
  id: string | number;
  name: string;
  description: string;
  cost: number;
  rarity: CardRarity;
  type: CardType;
  abilities?: string[];
  image?: string;
}

interface CharacterCard extends CardBase {
  type: CardType.Character;
  attack: number;
  health: number;
  defense?: number;
  range?: number;
  movement?: number;
}

interface ActionCard<TTarget = Unit | Player | BattlefieldZone> extends CardBase {
  type: CardType.Action;
  isInstant?: boolean;
  targetType?: 'unit' | 'player' | 'area' | 'self' | 'any';
  effect: (target: TTarget) => void;
}

type Card = CharacterCard | ActionCard | UpgradeCard | TacticCard | CardBase;```

### Card Rarity System

```typescript
enum CardRarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}
```

Rarity affects card stats, abilities, and appearance. Higher rarities offer more powerful effects but are more difficult to obtain.

## Unit System

### Unit Types

The game supports different types of field units:

```typescript
enum UnitType {
  Unit = 'unit',
  Commander = 'commander',
  Structure = 'structure',
}

interface UnitBase {
  id: string;
  name: string;
  type: UnitType;
  health: number;
  attack: number;
  player: PlayerId;
  maxHealth?: number;
  abilities?: string[];
  position?: string; // Format: 'row-col'
  canAttack?: boolean;
  canMove?: boolean;
}

interface Unit extends UnitBase {
  type: UnitType.Unit;
  movement?: number;
  range?: number;
}

interface Commander extends UnitBase {
  type: UnitType.Commander;
  ability?: string;
  abilityCooldown?: number;
}

interface Structure extends UnitBase {
  type: UnitType.Structure;
  isInvulnerable?: boolean;
  isFlying?: boolean;
}

type BattlefieldUnit = Unit | Commander | Structure;
```

### Battlefield Implementation

The battlefield is represented as a grid of zones:

```typescript
interface BattlefieldZone {
  position: string; // 'row-col'
  unit: BattlefieldUnit | null;
  isPlayerZone: boolean;
  isEnemyZone: boolean;
  isNeutralZone: boolean;
  isFrontline: boolean;
  isBackline: boolean;
}
```

The current implementation in `Battlefield.tsx` renders a visual representation of this grid and handles unit placement and interaction.

## Resource System

### Energy System

Energy is the primary resource for playing cards. The current implementation:
- Starts at a predefined value (7 in the demo)
- Is reset when ending a turn
- Will be incremented each turn up to a maximum in the full game

### Momentum System

Momentum is a secondary resource used for special abilities:
- Displayed in the Player HUD
- Gained through strategic plays
- Will be used for faction-specific powerful abilities

## Player System

The `Player` interface defines the state for each player:

```typescript
interface Player {
  id: PlayerId;
  name: string;
  health: number;
  energy: number;
  maxEnergy: number;
  hand: Card[];
  deck: Card[];
  discardPile: Card[];
  battlefield: BattlefieldUnit[];
  commander: Commander;
  resources: {
    mana?: number;
    influence?: number;
    [key: string]: number | undefined;
  };
}
```

## Faction System

### Faction Definition

Factions are defined as a string union type:

```typescript
type Faction = 'solaris' | 'umbral' | 'neuralis' | 'aeonic' | 'infernal' | 'primordial' | 'synthetic';
```

### Faction Implementation

Each faction has distinct characteristics defined in `utils/factionUtils.ts`:

```typescript
// Example for one faction
{
  solaris: {
    description: "The Solaris Nexus serves as caretakers of the Divine Algorithm...",
    technology: "Divine Algorithm Implementation",
    philosophy: "Perfect Order Through Divine Pattern",
    strength: "Reality Editing Fields"
  }
}
```

### Faction Theming

Visual theming for factions is implemented in `theme/factionThemes.ts`:

```typescript
interface FactionTheme {
  id: Faction;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    highlight: string;
    energy: string;
    health: string;
  };
  gradient: string;
  glow: string;
  cardTheme: {
    background: string;
    border: string;
    highlight: string;
    text: string;
  };
  buttonTheme: {
    primary: string;
    hover: string;
    text: string;
  };
}
```

This theming is applied throughout the UI to give each faction a distinct visual identity.

## Turn Structure Implementation

Currently implemented in `TurnManager.tsx` with this flow:

1. **Display current turn**: Show turn number and active player
2. **Action phase**: Player can play cards and use abilities
3. **End turn**: Pass turn to the opponent

The full game will implement this expanded structure:

1. **Start Phase**
   - Process start-of-turn triggers
   - Apply recurring effects

2. **Draw Phase**
   - Current player draws a card
   - If deck is empty, player takes damage

3. **Energy Phase**
   - Increment player's max energy (capped at 10)
   - Refill player's energy to maximum

4. **Main Phase**
   - Play cards from hand
   - Activate abilities
   - Move units on the battlefield

5. **Combat Phase**
   - Declare attackers
   - Resolve combat
   - Apply damage and effects

6. **End Phase**
   - Process end-of-turn triggers
   - Clear temporary effects
   - Pass turn to opponent

## Combat System

The combat system will be expanded with these features:

1. **Attack Declaration**
   - Select attacking unit
   - Verify attack eligibility (range, cooldowns)

2. **Target Selection**
   - Valid targets based on unit abilities
   - Highlighting valid targets in UI

3. **Combat Resolution**
   - Calculate attack and defense values
   - Apply faction-specific combat modifiers
   - Resolve combat and apply damage
   - Process death triggers

## Future Implementation Tasks

The following game systems need to be implemented:

1. **Ability Resolution System**
   - Priority handling for simultaneous abilities
   - Targeting validation
   - Effect application
   - Visual feedback

2. **Expanded Card/Unit Types**
   - Create remaining card type implementations
   - Add faction-specific units
   - Implement legendary units with unique abilities

3. **Effect Stack**
   - Track ongoing effects
   - Handle effect duration
   - Process effect triggers
   - Manage effect priorities

4. **Win Condition Checking**
   - Health-based victory
   - Special victory conditions
   - Surrender/concede handling

5. **Blockchain Integration**
   - NFT card ownership
   - Card minting
   - Marketplace transactions
   - Tournament rewards

## Technical Architecture

### Frontend Components

The game UI is composed of these main components:

- `GameInterface.tsx`: Main container for the game UI
- `Battlefield.tsx`: Renders the game board and handles unit placement
- `PlayerHUD.tsx`: Displays player resources and health
- `CardHand.tsx`: Shows the player's hand and enables card selection
- `TurnManager.tsx`: Controls turn sequence and displays turn information
- `OpponentHand.tsx`: Shows the opponent's hand (card backs only)

### State Flow

The current implementation uses React component state for demonstration purposes. The full implementation will use:

1. **Client State Management**
   - Local predictive state changes
   - Cached game state
   - UI state (selections, animations)

2. **Server State Management**
   - Authoritative game state
   - Validation of all actions
   - Game history tracking

3. **Synchronization**
   - WebSocket for real-time updates
   - State reconciliation for network issues  
   - Optimistic updates for responsiveness

## Implementation Plan

The implementation will follow this sequence:

1. **Core Game Logic**
   - Complete turn structure
   - Battlefield mechanics
   - Card playing mechanics

2. **Faction-Specific Systems**
   - Unique abilities
   - Faction mechanics
   - Special resources

3. **Multiplayer & Networking**
   - Real-time state sync
   - Authentication
   - Matchmaking

4. **Blockchain Integration**
   - NFT card system
   - Ownership verification  
   - Transaction handling

5. **Extended Features**
   - Tournament system
   - Ranking and progression
   - Social features