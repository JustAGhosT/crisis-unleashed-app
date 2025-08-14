# Crisis Unleashed - Next.js Frontend

Modern Next.js 14 frontend for Crisis Unleashed, featuring App Router, Shadcn UI, TanStack Query, and TypeScript.

## 🚀 **Modern Stack**

- **Next.js 14** - Latest version with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Beautiful, accessible components
- **TanStack Query** - Server state management
- **React Hook Form + Zod** - Form handling with validation
- **Next Themes** - Dark/light mode support

## 📁 **Project Structure**

```text
frontend-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles with Tailwind
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn UI base components
│   │   ├── factions/         # Game-specific components
│   │   └── theme-provider.tsx # Theme management
│   ├── data/                 # Static data and constants
│   ├── lib/                  # Utilities and configurations
│   │   ├── utils.ts          # Common utility functions
│   │   └── query-provider.tsx # TanStack Query setup
│   └── types/                # TypeScript type definitions
├── tailwind.config.ts        # Tailwind configuration
├── next.config.js           # Next.js configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎯 **Key Features Implemented**

### **SOLID Principles Applied**

- **Single Responsibility**: Each component has one clear purpose
- **Open/Closed**: Components are extensible through props
- **Liskov Substitution**: All components follow consistent interfaces
- **Interface Segregation**: Clean, focused prop interfaces
- **Dependency Inversion**: Components depend on abstractions

### **Component Architecture**

- **FactionCard**: Displays individual faction information
- **FactionGrid**: Responsive grid of faction cards
- **Theme System**: Faction-specific colors and gradients
- **Type Safety**: Full TypeScript coverage

### **Modern Patterns**

- Server/Client component separation
- Composition over inheritance
- Custom hooks for reusable logic
- Proper error boundaries
- Accessibility-first design

## 🛠️ **Development Setup**

### **Prerequisites**

- Node.js 18+
- pnpm (recommended) or npm

### **Installation**

```bash
cd frontend-next
pnpm install
```

### **Development Commands**

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type checking
pnpm type-check
```

### **Development Server**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000 (proxied via Next.js)

## 🎨 **Styling System**

### **Faction Colors**

Each faction has a dedicated color palette:

- **Solaris**: Gold to Orange gradient
- **Umbral**: Purple to Violet gradient
- **Aeonic**: Cyan to Turquoise gradient
- **Primordial**: Green to Spring Green gradient
- **Infernal**: Crimson to Pink gradient
- **Neuralis**: Blue to Sky Blue gradient
- **Synthetic**: Silver to Gray gradient

### **Utility Classes**

```css
/* Faction gradients */
.faction-gradient-solaris
.faction-gradient-umbral
/* ... etc */

/* Interactive effects */
.card-hover
.faction-glow
```

## 🔄 **Migration Strategy**

### **Phase 1: Infrastructure ✅**

- [x] Next.js 14 setup with App Router
- [x] Shadcn UI component library
- [x] TanStack Query configuration
- [x] TypeScript and linting
- [x] Faction system foundation

### **Phase 2: Component Migration ✅**

- [x] Migrate faction components
  - [x] FactionCard, FactionGrid
  - [x] Legacy compatibility components
  - [x] Faction detail page
- [x] Implement feature flag system
  - [x] Feature flag provider
  - [x] Admin UI for flags
- [x] Set up data services
  - [x] Faction service with mock data
  - [x] Type adapters for compatibility
- [ ] Implement form components with React Hook Form + Zod
- [ ] Add data fetching hooks with TanStack Query
- [ ] Create reusable UI patterns

See [MIGRATION_STATUS.md](./MIGRATION_STATUS.md) for detailed migration status.

### **Phase 3: Feature Development**

- [ ] Game interface components
- [ ] Deck building system
- [ ] Battle system interface
- [ ] User management

## 🧪 **Testing Strategy**

### **Planned Testing Stack**

- **Vitest** - Fast unit testing
- **Testing Library** - Component testing
- **Playwright** - E2E testing
- **Storybook** - Component documentation

## 📱 **Responsive Design**

Mobile-first approach with breakpoints:

- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+
- **Large**: 1280px+

## 🔧 **API Integration**

### **TanStack Query Setup**

```typescript
// Example query hook
const { data: factions, isLoading } = useQuery({
  queryKey: ["factions"],
  queryFn: fetchFactions,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### **Backend Integration**

- API routes proxied through Next.js
- Automatic retry on network failures
- Loading and error states
- Optimistic updates

## 🚀 **Deployment**

### **Recommended Platforms**

- **Vercel** - Optimal for Next.js
- **Netlify** - Alternative with good DX
- **AWS Amplify** - Enterprise solution

### **Environment Variables**

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BLOCKCHAIN_NETWORK=testnet
```

## 🔄 **Comparison: Old vs New**

| Feature            | Old (Vite + React)   | New (Next.js 14)               |
| ------------------ | -------------------- | ------------------------------ |
| **Routing**        | React Router         | App Router                     |
| **Styling**        | CSS Modules          | Tailwind + Shadcn              |
| **State**          | React Context        | TanStack Query                 |
| **Forms**          | Manual validation    | React Hook Form + Zod          |
| **Build**          | Vite                 | Next.js                        |
| **SSR**            | Client-only          | Server/Client hybrid           |
| **Performance**    | Good                 | Excellent                      |
| **Components**     | Class/Function mix   | Function + Hooks               |
| **Faction System** | Basic implementation | Enhanced with SOLID principles |
| **Type Safety**    | Partial              | Complete                       |
| **Feature Flags**  | Limited              | Comprehensive system           |

## 🎮 **Game-Specific Features**

### **Faction System** ✅

- Complete faction data with colors and themes
- Responsive faction cards with hover effects
- Grid layout with loading states
- Detailed faction pages
- Progressive enhancement with feature flags
- Type-safe faction interfaces
- Legacy compatibility layer

### **Planned Features**

- Card collection interface
- Deck builder with drag-and-drop
- Real-time battle interface
- NFT integration UI
- Tournament brackets

## 🤝 **Contributing**

### **Code Standards**

- TypeScript strict mode
- ESLint + Prettier formatting
- Component naming: PascalCase
- File naming: PascalCase for components
- Named exports preferred

### **Component Guidelines**

- Follow SOLID principles
- Include JSDoc comments
- Handle loading/error states
- Support keyboard navigation
- Include accessibility attributes

---

**Crisis Unleashed** - Where strategy meets the multiverse in a modern web experience! 🎯
