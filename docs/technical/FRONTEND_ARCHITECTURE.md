# Frontend Architecture - Crisis Unleashed

## Overview

This document outlines the frontend architecture of Crisis Unleashed, detailing the component structure, state management approach, and styling implementation. The frontend is built with React, TypeScript, and uses a modular component design to ensure maintainability and scalability.

## Tech Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with CSS Modules
- **Testing**: Vitest and React Testing Library
- **Routing**: React Router DOM
- **HTTP Client**: Axios (planned)
- **State Management**: React Context (currently), potentially Redux Toolkit for complex state

## Project Structure

The frontend codebase follows this organization:

``` text
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Generic components
│   │   ├── factions/      # Faction-specific components
│   │   ├── game/          # Game interface components
│   │   └── artifacts/     # Component artifacts
│   ├── features/          # Feature modules
│   │   ├── battlefield/   # Battlefield logic and components
│   │   ├── cards/         # Card-related components
│   │   └── players/       # Player-related components
│   ├── context/           # React Context providers
│   ├── data/              # Static data and types
│   │   ├── factions/      # Faction-specific data
│   │   └── types/         # Type definitions for data
│   ├── pages/             # Top-level page components
│   │   └── factions/      # Faction-specific pages
│   ├── routes/            # Routing configuration
│   ├── theme/             # Theming system
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── test/              # Test setup and configuration
├── public/                # Static assets
└── scripts/               # Build and utility scripts
```

## Component Architecture

The application uses a component-based architecture with these design principles:

### 1. Modular Components

Components are structured to be modular, reusable, and focused on specific responsibilities:

```typescript
// Example of a modular component (CardHand.tsx)
import React from 'react';
import { Card } from '@/types/game.types';
import styles from './CardHand.module.css';

interface CardHandProps {
  onCardSelect: (card: Card) => void;
  selectedCard: Card | null;
}

const CardHand: React.FC<CardHandProps> = ({ 
  onCardSelect, 
  selectedCard 
}) => {
  // Component implementation
  return (
    <div className={styles.cardHand}>
      {/* Card display logic */}
    </div>
  );
};

export default CardHand;
```

### 2. Component Hierarchy

Components follow a clear hierarchy:

1. **Page Components**: Top-level components rendered by routes
2. **Feature Components**: Specific game features like battlefield, card hand, player HUD
3. **Common Components**: Reusable UI elements shared across features
4. **Utility Components**: Helper components for layout, formatting, etc.

### 3. Container/Presentation Pattern

Where appropriate, complex components are split into container and presentation components:

- **Container components**: Handle state, data fetching, and business logic
- **Presentation components**: Focus on rendering UI based on props

Example:

```typescript
// Container component example
const GameInterfaceContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({...});
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  
  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };
  
  return (
    <GameInterfacePresentation
      gameState={gameState}
      selectedCard={selectedCard}
      onCardSelect={handleCardSelect}
      onEndTurn={() => handleEndTurn()}
    />
  );
};

// Presentation component example
interface GameInterfacePresentationProps {
  gameState: GameState;
  selectedCard: Card | null;
  onCardSelect: (card: Card) => void;
  onEndTurn: () => void;
}

const GameInterfacePresentation: React.FC<GameInterfacePresentationProps> = ({
  gameState,
  selectedCard,
  onCardSelect,
  onEndTurn
}) => (
  <div className="game-interface">
    <Battlefield selectedCard={selectedCard} />
    <CardHand onCardSelect={onCardSelect} selectedCard={selectedCard} />
    <TurnManager onEndTurn={onEndTurn} />
  </div>
);
```

## State Management

The application currently uses React Context for state management, with future plans to implement more robust solutions as complexity grows.

### Theme Context

The `ThemeProvider` component manages faction-based theming:

```typescript
// From ThemeProvider.tsx
export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setFaction: () => {},
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialFaction = 'solaris' 
}) => {
  const [faction, setFaction] = useState<Faction>(initialFaction);
  const theme = useMemo(() => factionThemes[faction], [faction]);
  
  return (
    <ThemeContext.Provider value={{ theme, setFaction }}>
      <div className={styles.themeProvider} style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.text 
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
```

### Game State Management

Currently, game state is managed using local component state in `GameInterface.tsx`:

```typescript
const [gameState, setGameState] = useState<GameState>({
  currentTurn: 1,
  activePlayer: 'player1',
  momentum: 3,
  energy: 7,
  health: 100,
  enemyHealth: 100,
});
```

Future implementations will use more robust state management:

1. **Game Context**: For managing game state accessible by all components
2. **Player Context**: For managing player-specific state
3. **Battlefield Context**: For managing board state and unit positions

## Styling Architecture

The application uses a combination of TailwindCSS and CSS Modules for styling:

### TailwindCSS

TailwindCSS provides utility classes for rapid development:

```html
<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
      Crisis Unleashed
    </h1>
  </div>
</div>
```

### CSS Modules

CSS Modules are used for component-specific styles:

```css
/* CardHand.module.css */
.cardHand {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  overflow-x: auto;
}

.card {
  flex: 0 0 auto;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.selected {
  transform: translateY(-20px);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}
```

```typescript
// Usage in component
import styles from './CardHand.module.css';

const CardHand = () => (
  <div className={styles.cardHand}>
    <div className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
      {/* Card content */}
    </div>
  </div>
);
```

### Faction Theming

The application implements dynamic theming based on factions:

```typescript
// factionThemes.ts (excerpt)
export const factionThemes: Record<Faction, FactionTheme> = {
  solaris: {
    id: 'solaris',
    name: 'Solaris Nexus',
    colors: {
      primary: '#FFD700',
      secondary: '#FF6B00',
      accent: '#FFFFAA',
      background: '#1A0A00',
      text: '#FFFFFF',
      highlight: '#FFF0AA',
      energy: '#FFCC00',
      health: '#FF2200',
    },
    gradient: 'linear-gradient(135deg, #1A0A00 0%, #3A1A00 100%)',
    glow: '0 0 15px rgba(255, 215, 0, 0.5)',
    // Additional theme properties...
  },
  // Other faction themes...
}
```

## Routing System

The application uses React Router DOM for routing:

```typescript
// FactionRoutes.tsx
const FactionRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FactionsHub />} />
      <Route path="/factions" element={<FactionsHub />} />
      <Route path="/factions/solaris" element={<SolarisPage />} />
      <Route path="/factions/umbral" element={<UmbralPage />} />
      <Route path="/factions/neuralis" element={<NeuralisPage />} />
      <Route path="/factions/aeonic" element={<AeonicPage />} />
      <Route path="/factions/infernal" element={<InfernalPage />} />
      <Route path="/factions/primordial" element={<PrimordialPage />} />
      <Route path="/factions/synthetic" element={<SyntheticPage />} />
      <Route path="/timeline" element={<TimelinePage />} />
      <Route path="/debug" element={<DebugObjectPage />} />
      <Route path="/game" element={<GameInterface />} />
    </Routes>
  );
};
```

## Testing Strategy

The application uses Vitest and React Testing Library for testing:

### Unit Tests

For testing utility functions:

```typescript
// factionUtils.basic.test.ts
import { describe, it, expect } from 'vitest';
import { getFactionTechnology, getFactionPhilosophy, getFactionStrength, getFactionsList } from '../factionUtils';

describe('Faction Utilities - Basic', () => {
  it('should return faction technology for solaris faction', () => {
    expect(getFactionTechnology('solaris')).toBe('Divine Algorithm Implementation');
  });
  
  // More tests...
});
```

### Component Tests

For testing component rendering and behavior:

```typescript
// FactionDetail.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FactionDetail from '../FactionDetail';

describe('FactionDetail component', () => {
  it('renders the faction name and description', () => {
    render(<FactionDetail faction="solaris" />);
    
    expect(screen.getByText('Solaris Nexus')).toBeInTheDocument();
    expect(screen.getByText(/Divine Algorithm/i)).toBeInTheDocument();
  });
  
  // More tests...
});
```

### Integration Tests

For testing component interactions:

```typescript
// FactionsFlow.integration.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import FactionsHub from '@/pages/FactionsHub';

describe('Faction navigation flow', () => {
  it('allows selecting a faction and navigating to its details', async () => {
    render(
      <BrowserRouter>
        <FactionsHub />
      </BrowserRouter>
    );
    
    const solarisCard = screen.getByText('Solaris Nexus');
    fireEvent.click(solarisCard);
    
    // Check that we navigate to faction detail page
    expect(await screen.findByText('Divine Algorithm Implementation')).toBeInTheDocument();
  });
});
```

## API Integration

The application will integrate with the backend API using Axios:

```typescript
// Planned API service for card-related operations
import axios from 'axios';
import { Card } from '@/types/game.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class CardService {
  static async getUserCards() {
    const response = await axios.get(`${API_URL}/cards`);
    return response.data;
  }
  
  static async getCardById(cardId: string) {
    const response = await axios.get(`${API_URL}/cards/${cardId}`);
    return response.data;
  }
  
  static async createDeck(name: string, faction: string, cards: string[]) {
    const response = await axios.post(`${API_URL}/decks`, {
      name,
      faction,
      cards
    });
    return response.data;
  }
}

export default CardService;
```

## Planned Features and Improvements

The frontend architecture will evolve with these planned improvements:

### 1. State Management Enhancement

As the application grows, we will implement:

- Potential migration to Redux Toolkit for global state
- React Query for API data fetching and caching
- Custom hooks for reusable logic

### 2. Performance Optimizations

To maintain smooth performance even with complex UI:

- Code splitting with React.lazy and Suspense
- Virtualized lists for large collections of cards
- Memoization of expensive calculations
- Asset optimization for images and animations

### 3. Accessibility Improvements

Ensuring the game is accessible to all users:

- Implementing ARIA attributes for all components
- Adding keyboard navigation for all interactions
- Providing high-contrast mode and text scaling
- Supporting screen readers for game state

### 4. Mobile Responsiveness

Enhancing the responsive design:

- Optimized layouts for different screen sizes
- Touch-friendly interactions for mobile players
- Alternative controls for mobile gameplay

### 5. Internationalization

Supporting multiple languages:

- Setting up React-Intl or similar library
- Extracting all text into translation files
- Supporting right-to-left languages

## Development Guidelines

### Code Style

- Follow ESLint and Prettier configurations
- Use TypeScript for all new components
- Write self-documenting code with appropriate comments
- Export components as named exports

### Component Creation

- One component per file
- Use functional components with hooks
- Follow file naming conventions (PascalCase for components)
- Include prop type definitions for all components

### Styling Guidelines

- Prefer Tailwind for layout and common styles
- Use CSS Modules for component-specific styles
- Maintain consistent color variables using the theme system
- Avoid inline styles except for dynamic values

### Git Workflow

- Create feature branches from main
- Follow conventional commits (feat:, fix:, docs:, etc.)
- Request reviews for all PRs
- Write meaningful commit messages and PR descriptions
- 