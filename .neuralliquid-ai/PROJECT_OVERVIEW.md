# Crisis Unleashed - Project Overview

## Core Concept

Crisis Unleashed is a strategic digital collectible card game (DCCG) set in a multiverse where six unique factions battle for supremacy. The game combines deep tactical combat with rich narrative elements, featuring hero-based gameplay and faction-specific mechanics.

## Technical Stack

- **Frontend**: React/TypeScript with Next.js
- **Backend**: Node.js with Express
- **Database**: PostgreSQL for player data, Redis for session management
- **Blockchain**: Etherlink on Ethereum/Tezos and Solana for NFT integration
- **Multiplayer**: WebSockets for real-time gameplay
- **CI/CD**: GitHub Actions with automated testing
- **Infrastructure**: Docker, Kubernetes, AWS/GCP

## Project Structure

``` text
crisis-unleashed-app/
├── client/                 # Frontend application
│   ├── components/        # Reusable UI components
│   ├── pages/             # Next.js page routes
│   ├── styles/            # Global styles and themes
│   └── utils/             # Helper functions and hooks
├── server/                # Backend services
│   ├── api/               # API endpoints
│   ├── game/              # Core game logic
│   ├── models/            # Database models
│   └── services/          # Business logic
├── contracts/             # Smart contracts
├── docs/                  # Game documentation
└── tests/                 # Test suites
```

## Development Workflow

1. **Branching Strategy**: Git Flow with feature branches
2. **Code Reviews**: Required for all merges to main
3. **Testing**: Unit, integration, and E2E tests required
4. **Documentation**: Code comments and API docs mandatory
5. **Deployment**: Staging -> QA -> Production pipeline

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see .env.example)
4. Run development server: `npm run dev`
5. Access the game at `http://localhost:3000`
