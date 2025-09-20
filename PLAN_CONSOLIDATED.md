# Crisis Unleashed - Consolidated Implementation Plan

> **Last Updated**: August 12, 2025
> **Status**: In Progress (25% Complete)

## Table of Contents

1. [Project Overview](#project-overview)
2. [Design Philosophy](#design-philosophy)
3. [Implementation Status](#implementation-status)
4. [Technical Architecture](#technical-architecture)
5. [Feature Roadmap](#feature-roadmap)
6. [Migration Strategy](#migration-strategy)
7. [Testing & Quality Assurance](#testing--quality-assurance)
8. [Performance Optimization](#performance-optimization)
9. [Documentation](#documentation)
10. [Timeline & Milestones](#timeline--milestones)

## Project Overview

Crisis Unleashed is a digital card game with blockchain integration, featuring seven unique factions with distinct mechanics. This document consolidates all planning and migration efforts into a single source of truth.

## Design Philosophy

### Hybrid UI Approach

- **Zero-Noise Core**: Clean, minimal interface emphasizing key information
- **Holographic Theme**: Immersive UI elements enhancing the sci-fi experience
- **Progressive Disclosure**: Advanced features revealed as players become comfortable
- **Tactical Depth**: Clear visualization of synergies and crisis events

## Implementation Status

### Completed Components

- ✅ Basic Next.js application structure
- ✅ React Query integration
- ✅ Feature flag system
- ✅ Core UI components (Button, Card, Badge, Alert)
- ✅ Faction system migration (cards, grid, details)
- ✅ Card browsing components
- ✅ Basic layout components
- ✅ Type-check baseline clean (frontend-next)
- ✅ Deck builder core UI (grid, list)

### In Progress

- 🔄 Deck builder migration (polish & lint cleanup) — see active work items under Deck Builder Functionality
- 🔄 Authentication system
- 🔄 Game integration systems
- 🔄 Real-time game status updates — see active work items under Real-time Features

### Quality and Tooling

- ✔ ESLint and TypeScript checks are clean (as of 2025-08-12)
- ✔ Markdown lint issues in this plan resolved (spacing/blank lines)
- ✔ Spell-check dictionary updated (cspell: Backstab)

## Technical Architecture

### Frontend

- **Framework**: Next.js 14 with App Router
- **State Management**: React Query + Context API
- **Styling**: Tailwind CSS + shadcn/ui
- **Testing**: Jest, React Testing Library, Cypress

## Backend

- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Real-time**: WebSockets
- **Authentication**: NextAuth.js

## Feature Roadmap

### Core Gameplay (High Priority)

- [ ] Turn management system
- [ ] Card playing mechanics
- [ ] Battlefield implementation
- [ ] Crisis event system
- [ ] Victory conditions

### User Interface (High Priority)

- [ ] Holographic theme implementation
- [ ] Responsive layouts
- [ ] Accessibility improvements
- [ ] Animations and feedback
  - Notes: Chart theming and variables present for stats (`frontend-next/src/components/charts/ChartThemeVars.tsx`).

### Multiplayer (Medium Priority)

- [ ] Matchmaking system
- [ ] Real-time game state sync
- [ ] Chat system
- [ ] Friend system

## Migration Strategy

### Completed Migrations

- Faction components to Next.js
- Core UI components to shadcn/ui
- State management to React Query
- Deck builder core UI (grid, list)

### Pending Migrations

#### 1. Deck Builder Interface

- [ ] **UI Components**
  - [x] Create card grid with filtering and search
  - [x] Implement deck list management
  - [x] Add card details panel
    - Acceptance criteria:
      - [x] Shows name, type, faction, rarity badge, cost, description, and image when available.
      - [x] Displays combat stats and keywords when provided.
      - [x] Empty state prompts user to select a card.
  - [x] Create deck statistics display
    - Acceptance criteria:
      - [x] Shows summary stats (total, unique, averages) and visualizations for cost, type, rarity.
      - [x] Handles empty deck state gracefully.
      - [x] Charts readable in light/dark themes (see `ChartThemeVars.tsx`).

- [ ] **Functionality**
- [ ] Implement card drag-and-drop
  - Acceptance criteria:
    - [x] Drag from card grid to deck list adds the card; dragging within deck reorders if supported.
    - [x] Visual drag feedback (cursor, hover/target highlight) and keyboard-accessible add/remove alternatives.
    - [x] Prevents invalid drops and respects deck constraints (max copies, hero cap, single non-neutral faction, deck size).
  - Work items (active):
    - [x] Wire drop handling to enforce constraints during drop in `DeckList.tsx`
    - [x] Add hover/target highlight on valid drop zones; provide keyboard alternative (e.g., Space to add)
    - [x] Optional: support intra-deck reorder via drag; add smoke tests for add/remove/reorder
- [x] Add deck validation rules
  - Notes: Enforced 30–50 card count, max 3 copies (1 for unique), and up to 2 non-neutral factions; drop guard blocks invalid additions.
- [x] Create deck import/export
  - Notes: Export via JSON download; Import added to `DeckBuilderInterface.tsx`.
- [x] Add deck sharing functionality
  - Notes: Backend shortlinks (`/api/decks/share`, `/api/decks/share/{id}`) and UI Share button; supports `s` param (short id) with `d` (base64 JSON) fallback.

- [ ] **Integration**
  - [x] Connect to card database
    - Notes: Backend `/api/cards/search` sources from `CARDS_SOURCE_URL` (or `CARDS_SOURCE_FILE`) with TTL cache; frontend `CardService` uses it transparently.
  - [x] Implement deck saving/loading (in-memory backend + UI save)
  - [x] Add deck versioning (increment on update in backend)
  - [x] Implement state synchronization
    - Notes: Server-authoritative sync over WebSocket (`/ws`) using `deck.subscribe`/`deck.update` with idempotency ids and server `seq`; client reconciles via `realtime:deck.state`.
  - [x] Add undo/redo functionality (context `past`/`future` + UI controls)

#### 2. Authentication Flow

- [ ] **Core Authentication**
  - [x] Implement email/password auth
  - [x] Add social login (Google, Discord)
  - [x] Set up JWT token handling
  - [ ] Implement password reset flow

- [ ] **User Management**
  - [ ] Create user profile system
  - [ ] Implement email verification
  - [ ] Add account settings
  - [ ] Set up user roles and permissions

- [ ] **Security**
  - [ ] Implement rate limiting
  - [ ] Add CSRF protection
  - [x] Set up session management
  - [ ] Configure CORS policies

#### 3. Game State Management

- [ ] **State Architecture**
  - [ ] Design game state schema
  - [ ] Implement state reducers
  - [ ] Create action creators
  - [ ] Set up state persistence

- [ ] **Game Logic**
  - [ ] Implement turn management
  - [ ] Create card effect system
  - [ ] Add win/lose conditions
  - [ ] Set up game history

- [ ] **Integration**
  - [ ] Connect to backend API
  - [ ] Add error handling
  - [ ] Implement state synchronization
  - [ ] Add undo/redo functionality

#### 4. Real-time Features

- [ ] **WebSocket Setup**
  - [x] Implement WebSocket server
  - [x] Create connection manager
  - [x] Add heartbeat/ping system
  - [x] Implement reconnection logic

- [ ] **Real-time Events**
  - [ ] Game state updates
  - [ ] Player actions/events
  - [ ] Chat messages
  - [ ] Notifications

- [ ] **Performance**
  - [ ] Implement message batching
  - [ ] Add rate limiting
  - [ ] Optimize payload size
  - [ ] Set up monitoring

##### Tracking

- [ ] Event schema documented (action names, payloads, versioning, idempotency keys)
- [ ] Transport chosen (WebSocket/SSE); reconnection backoff strategy defined
- [ ] Presence/heartbeat protocol and timeouts specified
- [ ] Client state sync model (server authority vs optimistic updates) agreed
- [ ] Error handling, retries, and outbox/inbox patterns documented

  - Work items (active):
    - [x] Decide transport (WebSocket) and draft event schema (`docs/technical/REALTIME_EVENT_SCHEMA.md`)
    - [x] Implement minimal connection manager with heartbeat and exponential backoff
    - [x] Define state sync strategy and idempotency keys (server authority, per-deck seq/idempotency)
    - [ ] Add monitoring hooks

## Testing & Quality Assurance

### Unit Testing

- [ ] Core game logic
- [ ] Component rendering
- [ ] State management
- [ ] Utility functions

### Integration Testing

- [ ] User flows
- [ ] API interactions
- [ ] Real-time features

### E2E Testing

- [ ] Game scenarios
- [ ] Cross-browser testing
- [ ] Performance testing

## Performance Optimization

### Current Focus

- [ ] Bundle size optimization
- [ ] Lazy loading
- [ ] Image optimization
- [ ] State management efficiency
- [ ] Real User Monitoring (web-vitals) wired to RUM endpoint

### Future Optimizations

- Code splitting
- Server-side rendering
- Caching strategies

## Documentation

### Developer Documentation

- [x] Component documentation
- [ ] API documentation
- [ ] Architecture decisions
- [ ] Setup guide

### User Documentation

- [ ] Game rules
- [ ] Tutorials
- [ ] FAQ

## Timeline & Milestones

### Phase 1: Core Systems (Completed)

- Basic application structure
- Core UI components
- Faction system

### Phase 2: Gameplay (Current)

- Deck building
- Game mechanics
- Multiplayer foundation

### Phase 3: Polish (Upcoming)

- Visual polish
- Performance optimization
- Documentation

## Next Steps

1. Complete deck builder polish (details panel, stats display, DnD)
2. Implement authentication system
3. Set up real-time game state
4. Begin user testing
5. Gather feedback and iterate

## Plan Hygiene

- As DnD completes, mark the checklist items done and attach brief validation notes (screenshots or test IDs)

## Code Audit Notes (2025-09-20)

- React Query integration present: `frontend-next/src/lib/query-provider.tsx`, `frontend-next/src/components/providers.tsx`.
- Feature flags implemented: provider/hooks and server route in `frontend-next/src/lib/feature-flags/*` and `frontend-next/src/app/api/feature-flags/route.ts`; admin UI at `frontend-next/src/app/admin/feature-flags/page.tsx`.
- Deck builder UI components exist: `frontend-next/src/components/deck-builder/*` including `DeckList.tsx`, `CardGrid.tsx`, `CardDetailsPanel.tsx`.
- DnD support: intra-deck reorder implemented with tests (`DeckList.reorder.int.test.tsx`); grid→deck drop wiring still pending per work items.
- Authentication scaffolding present: NextAuth route at `frontend-next/src/app/api/auth/[...nextauth]/route.ts` (status likely in-progress).
- Real-time client module present: `frontend-next/src/lib/realtime/connection.ts` and `components/deck-builder/dev/RealtimeDevPanel.tsx` (server setup TBD).
- RUM wiring present: `frontend-next/src/lib/rum/web-vitals.ts`, `frontend-next/src/components/observability/RUMInit.tsx`, API endpoint at `frontend-next/src/app/api/rum/route.ts`.
- Battlefield groundwork present: components and libs (`frontend-next/src/components/game/Battlefield*.tsx`, `frontend-next/src/lib/turn-sequencing.ts`, `frontend-next/src/lib/combat-resolution.ts`, `frontend-next/src/lib/hex-advanced.ts`) with tests for zones/movement.
