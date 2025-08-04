# Crisis Unleashed - Developer Quick Start

This guide provides essential information for developers to quickly set up and start working on the Crisis Unleashed project.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/crisis-unleashed-app.git
cd crisis-unleashed-app
```

### 2. Install Dependencies

The project uses pnpm for package management:

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install all dependencies
pnpm install

# Or install frontend dependencies only
pnpm --filter frontend install
```

### 3. Set Up Backend Environment

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
pnpm start

# Start only frontend
cd frontend
pnpm start

# Start only backend
cd backend
python -m uvicorn server:app --reload
```

## 🏗️ Project Structure

### Key Directories

- `/frontend` - React application
  - `/src/components` - UI components
  - `/src/features` - Game feature modules
  - `/src/pages` - Page components
  - `/src/types` - TypeScript type definitions
  - `/src/utils` - Utility functions
  - `/src/theme` - Theming system

- `/backend` - FastAPI server
  - `server.py` - Main application entry point

### Key Files

- `/frontend/src/App.tsx` - Main application component
- `/frontend/src/theme/factionThemes.ts` - Faction theme definitions
- `/frontend/src/types/game.types.ts` - Game type definitions
- `/frontend/src/utils/factionUtils.ts` - Faction utility functions

## 💻 Development Workflow

### Creating a New Component

1. Create a new file in the appropriate directory
2. Use the existing component structure as a template
3. Create accompanying CSS Module if needed
4. Export the component as a named export
5. Add tests in a `__tests__` folder

Example:

```typescript
// NewComponent
import React from 'react';
import styles from './NewComponent.module.css';

interface NewComponentProps {
  someProp: string;
}

export const NewComponent: React.FC<NewComponentProps> = ({ someProp }) => {
  return (
    <div className={styles.container}>
      {someProp}
    </div>
  );
};
```

### Testing Components

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage
```

Example test:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NewComponent } from '../NewComponent';

describe('NewComponent', () => {
  it('renders correctly', () => {
    render(<NewComponent someProp="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

### Styling Components

The project uses a combination of TailwindCSS and CSS Modules:

```tsx
// Using TailwindCSS
<div className="flex flex-col items-center justify-center p-4">
  <h1 className="text-xl font-bold text-primary">Title</h1>
</div>

// Using CSS Modules
import styles from './Component.module.css';

<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
</div>
```

### Working with Themes

To use the faction themes in components:

```tsx
import { useTheme } from '@/theme/ThemeProvider';

const MyComponent: React.FC = () => {
  const { theme, setFaction } = useTheme();
  
  return (
    <div style={{ 
      backgroundColor: theme.colors.background,
      color: theme.colors.text
    }}>
      <h1 style={{ color: theme.colors.primary }}>
        {theme.name} Faction
      </h1>
      <button onClick={() => setFaction('umbral')}>
        Switch to Umbral
      </button>
    </div>
  );
};
```

## ⚙️ API Reference

### Available Endpoints

- `GET /api` - Health check
- `GET /api/status` - Get recent status checks
- `POST /api/status` - Create a status check

## 📦 Available Scripts

### Root Level

- `pnpm start` - Start both frontend and backend
- `pnpm build` - Build the frontend for production
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code

### Frontend

- `pnpm --filter frontend start` - Start frontend development server
- `pnpm --filter frontend build` - Build frontend for production
- `pnpm --filter frontend test` - Run frontend tests
- `pnpm --filter frontend lint` - Lint frontend code

### Backend

- `cd backend && python -m uvicorn server:app --reload` - Start backend server
- `cd backend && pytest` - Run backend tests (when available)

## 🧪 Testing Guidelines

### Component Test Structure

```typescript
describe('ComponentName', () => {
  // Setup that runs before each test
  beforeEach(() => {
    // Setup code
  });
  
  // Test a specific behavior
  it('should render correctly', () => {
    // Test code
    expect(result).toBe(expectedValue);
  });
  
  // Test another behavior
  it('should handle user interaction', () => {
    // Test code
    expect(result).toBe(expectedValue);
  });
});
```

### Common Testing Patterns

- Test component rendering
- Test user interactions (click, input, etc.)
- Test conditional rendering
- Test component props
- Test context consumption

## 🔄 Git Workflow

1. Create a feature branch from main
   ```bash
   git checkout -b feature/new-feature
   ```

2. Make and test your changes

3. Commit with a descriptive message
   ```bash
   git commit -m "feat: add new feature"
   ```

4. Push your branch
   ```bash
   git push origin feature/new-feature
   ```

5. Create a pull request to main

## 💻 VS Code Setup

### Recommended Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Jest Runner
- Python

### Workspace Settings

Create a `.vscode/settings.json` with:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## 🧱 Faction System Reference

The game features seven factions, each with unique mechanics:

- **Solaris Nexus**: Divine Algorithm Implementation
- **Umbral Eclipse**: Shadow Realm Manipulation
- **Neuralis Conclave**: Collective Consciousness Network
- **Aeonic Dominion**: Temporal Engineering
- **Infernal Core**: Blood-Catalyzed Dimensional Rifts
- **Primordial Genesis**: Accelerated Evolutionary Biotechnology
- **Synthetic Directive**: Perfect Optimization Systems

## 🏆 Game Mechanics Quick Reference

### Card Types

```typescript
enum CardType {
  Character = 'character',
  Action = 'action',
  Upgrade = 'upgrade',
  Tactic = 'tactic',
}
```

### Unit Types

```typescript
enum UnitType {
  Unit = 'unit',
  Commander = 'commander',
  Structure = 'structure',
}
```

### Card Rarity

```typescript
enum CardRarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}
```

## 📚 Additional Resources

- [Game System Documentation](GAME_SYSTEM_IMPLEMENTATION.md)
- [Frontend Architecture](FRONTEND_ARCHITECTURE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Blockchain Integration](BLOCKCHAIN_INTEGRATION.md)

## ❓ Common Issues

### Deployment Issues

**Issue**: `pnpm: command not found`  
**Solution**: Install pnpm globally with `npm install -g pnpm`

**Issue**: MongoDB connection error  
**Solution**: Add MongoDB connection string to `.env` file

### Testing Issues

**Issue**: Tests can't find components  
**Solution**: Make sure path aliases are properly set up in `vite.config.ts` and `vitest.config.ts`

**Issue**: Context-related errors in tests  
**Solution**: Wrap components in necessary providers:

```typescript
render(
  <ThemeProvider initialFaction="solaris">
    <ComponentUnderTest />
  </ThemeProvider>
);
```

### TypeScript Issues

**Issue**: Type errors with component props  
**Solution**: Define proper interfaces for component props:

```typescript
interface ComponentProps {
  requiredProp: string;
  optionalProp?: number;
}
```

## 🤝 Contributing Guidelines

1. Follow the existing code style
2. Write tests for new features
3. Update documentation for significant changes
4. Break large changes into smaller PRs
5. Discuss major architectural changes before implementation