# Crisis Unleashed

[![CI/CD](https://img.shields.io/badge/pipeline-active-green)](https://github.com/yourusername/crisis-unleashed-app)
[![Frontend](https://img.shields.io/badge/frontend-vite%20%2B%20react-blue)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/backend-fastapi-green)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> *A strategic digital collectible card game set in a multiverse where six unique factions battle for supremacy*

Crisis Unleashed combines deep tactical combat with rich narrative elements, featuring hero-based gameplay, faction-specific mechanics, and blockchain integration for true digital ownership of cards and assets.

## 🎮 Features

### Core Gameplay

- **Seven Unique Factions**: Each with distinct mechanics and playstyles
  - **Solaris Nexus**: Cybernetic Order (Divine + Technology)
  - **Umbral Eclipse**: Shadow Tech (Darkness + Information)
  - **Aeonic Dominion**: Time Architects
  - **Primordial Genesis**: Bio-Titans
  - **Infernal Core**: Techno-Demons
  - **Neuralis Conclave**: Mind Over Matter
  - **Synthetic Directive**: Perfect Optimization Systems

### Game Systems

- **Hero-Based Combat**: Deploy legendary heroes with unique abilities
- **Multi-Resource System**: Energy and Momentum management
- **Crisis Events**: Dynamic battlefield modifiers
- **Faction Synergies**: Cross-faction strategies and combinations
- **Progressive Upgrade System**: Evolve your deck and heroes

### Digital Ownership

- **NFT Integration**: True ownership of cards and heroes
- **Cross-Chain Support**: Etherlink (Ethereum/Tezos) and Solana
- **Marketplace**: Trade and collect rare assets
- **Tournament Rewards**: Earn exclusive digital collectibles

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- pnpm >= 7.0.0
- Python 3.8+

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/crisis-unleashed-app.git
   cd crisis-unleashed-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up the backend**

   ```bash

   cd backend
   python -m venv .venv

   // Windows
   .venv\Scripts\Activate
  
   // macOS/Linux
   source .venv/bin/activate

   pip install -r requirements.txt
   cd ..
   ```

4. **Start the development environment**

   ```bash

   pnpm start
   ```

   This launches:

   ``` text
    Frontend: [http://localhost:5173](http://localhost:5173)
    Backend API: [http://localhost:8000](http://localhost:8000)
    API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
   ```

## 🏗️ Tech Stack

### Frontend

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Fast unit testing
- **React Router** - Client-side routing

### Backend

- **FastAPI** - High-performance Python API
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **PostgreSQL** - Primary database
- **Redis** - Session management

### Blockchain

- **Etherlink** - Ethereum/Tezos integration
- **Solana** - High-performance blockchain
- **Web3.js** - Blockchain interactions

### DevOps

- **pnpm** - Fast, disk space efficient package manager
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Prettier** - Code formatting
- **ESLint** - Code linting

## 📁 Project Structure

``` text
crisis-unleashed-app/
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── factions/     # Faction-specific components
│   │   │   ├── game/         # Game interface components
│   │   │   └── common/       # Shared components
│   │   ├── pages/           # Application pages
│   │   ├── features/        # Game features (battlefield, cards)
│   │   ├── types/           # TypeScript type definitions
│   │   ├── theme/           # Styling and faction themes
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   └── scripts/             # Build and asset generation scripts
├── backend/                  # FastAPI server
│   ├── server.py           # Main application entry
│   ├── requirements.txt    # Python dependencies
│   └── setup.ps1          # Development setup script
├── docs/                    # Comprehensive game documentation
│   ├── factions/           # Faction guides and lore
│   ├── mechanics/          # Game system documentation
│   ├── heroes/             # Hero abilities and strategies
│   ├── cards/              # Card specifications
│   └── starter_decks/      # Pre-built deck guides
└── tests/                   # End-to-end and integration tests
```

## 🎯 Available Scripts

### Root Level

- `pnpm start` - Start both frontend and backend in development mode
- `pnpm build` - Build the frontend for production
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm format` - Format code with Prettier

### Frontend Development

```bash
cd frontend
pnpm start    # Start dev server (http://localhost:5173)
pnpm build    # Build for production
pnpm test     # Run tests with Vitest
pnpm lint     # Run ESLint
```

### Backend Development

```bash
cd backend
# With activated virtual environment
python -m uvicorn server:app --reload    # Start development server
python -m pytest                         # Run tests (when available)
```

## 🎲 Game Systems

### Faction Mechanics

Each faction offers unique gameplay:

- **Solaris Nexus**: Predictive algorithms and energy manipulation
- **Umbral Eclipse**: Stealth mechanics and information warfare
- **Aeonic Dominion**: Time manipulation and board control
- **Primordial Genesis**: Growth systems and overwhelming force
- **Infernal Core**: High-risk/high-reward sacrifice mechanics
- **Neuralis Conclave**: Mind control and psychic abilities
- **Synthetic Directive**: Perfect optimization and mechanical precision

### Core Systems

- **Turn Structure**: Draw → Energy → Main → Combat → End phases
- **Resource Management**: Energy and Momentum systems
- **Hero Progression**: Level up heroes and unlock abilities
- **Crisis Integration**: Dynamic events that change gameplay

## 🧪 Development

### Running Tests

```bash
# Frontend tests
cd frontend

pnpm test                    # Run all tests
pnpm test --watch           # Watch mode
pnpm test --coverage        # With coverage report

# Integration tests
pnpm test:integration       # Full integration test suite
```

### Code Quality

```bash
pnpm lint                   # Check all files
pnpm lint:fix              # Auto-fix issues
pnpm format                # Format code
pnpm type-check            # TypeScript checking
```

### Asset Generation

```bash
cd frontend
node scripts/generate-placeholder-assets.js    # Generate game assets
```

## 📚 Documentation

Comprehensive game documentation is available in the [`docs/`](docs/) directory:

- [Game Introduction](docs/GAME_INTRODUCTION.md) - Overview and core concepts
- [Game Rules](docs/GAME_RULES.md) - Complete ruleset and mechanics
- [Faction System](docs/factions/) - Detailed faction guides
- [Strategy Guide](docs/STRATEGY_GUIDE.md) - Advanced tactics
- [Hero Abilities](docs/heroes/) - Hero guides and abilities
- [Starter Decks](docs/starter_decks/) - Pre-built deck recommendations

## 🚀 Deployment

### Production Build

```bash
pnpm build                  # Build optimized frontend
```

### Environment Setup

1. Configure environment variables for production
   - Backend health monitoring
     - `HEALTHCHECK_TIMEOUT_SEC` (default: 2)
     - `HEALTHCHECK_CB_THRESHOLD` (default: 3)
     - `HEALTHCHECK_CB_COOLDOWN_SEC` (default: 60)
   - Cards API caching
     - `CARDS_HTTP_CACHE_SEC` (default: 60)
     - `CARDS_HTTP_SWR_SEC` (default: 300)
2. Set up database connections
3. Configure blockchain network settings
4. Deploy using your preferred hosting platform

### Recommended Hosting

- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Railway, Heroku, or AWS ECS
- **Database**: PostgreSQL on AWS RDS, Google Cloud SQL, or similar

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](.neuralliquid-ai/DEVELOPMENT_GUIDELINES.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Use Prettier for formatting
- Write meaningful commit messages
- Add documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [x] **Phase 1**: Core gameplay implementation
- [ ] **Phase 2**: Multiplayer and ranking systems
- [ ] **Phase 3**: NFT marketplace integration
- [ ] **Phase 4**: Mobile app development
- [ ] **Phase 5**: Tournament and esports features

## 🔗 Links

- [Live Demo](https://crisis-unleashed.app) *(when available)*
- [Documentation](docs/README.md)
- [API Documentation](http://localhost:8000/docs) *(development)*
- [Discord Community](https://discord.gg/crisis-unleashed) *(when available)*

---

**Crisis Unleashed** - Where strategy meets the multiverse. Choose your faction, master your deck, and unleash chaos across dimensions.
