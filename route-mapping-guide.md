# Route Migration Guide: React Router to Next.js App Router

This document provides a detailed mapping of routes from the current React Router implementation to the Next.js 14 App Router, along with implementation details and special considerations.

## Route Structure Comparison

| Current Route (React Router) | Next.js App Router Path | Page Type | Parameters |
|------------------------------|-------------------------|-----------|------------|
| `/` | `app/page.tsx` | Static | None |
| `/factions` | `app/factions/page.tsx` | Static/SSG | None |
| `/factions/:id` | `app/factions/[id]/page.tsx` | Dynamic | `id`: Faction identifier |
| `/deck-builder` | `app/deck-builder/page.tsx` | Client | None |
| `/deck-builder/:deckId` | `app/deck-builder/[deckId]/page.tsx` | Dynamic | `deckId`: Deck identifier |
| `/cards` | `app/cards/page.tsx` | Static/SSG | None |
| `/cards/:id` | `app/cards/[id]/page.tsx` | Dynamic | `id`: Card identifier |
| `/profile` | `app/profile/page.tsx` | Protected | None |
| `/login` | `app/login/page.tsx` | Public | None |
| `/register` | `app/register/page.tsx` | Public | None |
| `/timeline` | `app/timeline/page.tsx` | Static | None |
| `/debug` | `app/debug/page.tsx` | Protected | None |

## Layout Structure

``` tools
app/
├── layout.tsx              # Root layout (applies to all pages)
├── page.tsx                # Homepage
├── factions/
│   ├── layout.tsx          # Factions layout
│   ├── page.tsx            # Factions list page
│   └── [id]/
│       └── page.tsx        # Faction detail page
├── deck-builder/
│   ├── layout.tsx          # Deck builder layout
│   ├── page.tsx            # New deck page
│   └── [deckId]/
│       └── page.tsx        # Edit deck page
├── cards/
│   ├── layout.tsx          # Cards layout
│   ├── page.tsx            # Cards list page
│   └── [id]/
│       └── page.tsx        # Card detail page
├── profile/
│   ├── layout.tsx          # Profile layout
│   └── page.tsx            # User profile page
├── login/
│   └── page.tsx            # Login page
├── register/
│   └── page.tsx            # Registration page
├── timeline/
│   └── page.tsx            # Timeline page
└── debug/
    └── page.tsx            # Debug page
```

## Implementation Examples

### 1. Root Layout

```tsx
// app/layout.tsx
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata = {
  title: {
    default: 'Card Game',
    template: '%s | Card Game',
  },
  description: 'Strategic card game with unique factions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

### 2. Faction List Page (Static/SSG)

```tsx
// app/factions/page.tsx
import { FactionGrid } from '@/components/factions/FactionGrid';
import { getFactions } from '@/lib/data';

// Make this page static with revalidation every hour
export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: 'Factions',
    description: 'Explore the different factions in the game',
  };
}

export default async function FactionsPage() {
  const factions = await getFactions();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Factions</h1>
      <FactionGrid factions={factions} />
    </div>
  );
}
```

### 3. Dynamic Route - Faction Detail

```tsx
// app/factions/[id]/page.tsx
import { notFound } from 'next/navigation';
import { FactionDetail } from '@/components/factions/FactionDetail';
import { getFaction, getFactionIds } from '@/lib/data';

// Generate static pages for known factions
export async function generateStaticParams() {
  const factionIds = await getFactionIds();
  return factionIds.map(id => ({ id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const faction = await getFaction(params.id);
  
  if (!faction) {
    return {
      title: 'Faction Not Found',
    };
  }
  
  return {
    title: faction.name,
    description: faction.description,
  };
}

export default async function FactionPage({ params }: { params: { id: string } }) {
  const faction = await getFaction(params.id);
  
  if (!faction) {
    notFound();
  }
  
  return <FactionDetail faction={faction} />;
}
```

### 4. Protected Route with Authentication

```tsx
// app/profile/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ProfileView } from '@/components/profile/ProfileView';
import { getUserProfile } from '@/lib/data';

export const metadata = {
  title: 'Profile',
  description: 'Your user profile',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/profile');
  }
  
  const profile = await getUserProfile(session.user.id);
  
  return <ProfileView profile={profile} />;
}
```

### 5. Interactive Client Component - Deck Builder

```tsx
// app/deck-builder/page.tsx
export const metadata = {
  title: 'Deck Builder',
  description: 'Create and customize your deck',
};

export default function DeckBuilderPage() {
  return (
    <>
      <h1 className="sr-only">Deck Builder</h1>
      <DeckBuilderClient />
    </>
  );
}

// app/deck-builder/DeckBuilderClient.tsx
"use client";

import { useState } from 'react';
import { DeckEditor } from '@/components/deck-builder/DeckEditor';
import { CardBrowser } from '@/components/deck-builder/CardBrowser';
import { useDeck } from '@/hooks/useDeck';

export function DeckBuilderClient() {
  const { deck, addCard, removeCard, saveDeck } = useDeck();
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  
  return (
    <div className="container mx-auto py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <CardBrowser 
          selectedFaction={selectedFaction} 
          onSelectFaction={setSelectedFaction}
          onAddCard={addCard}
        />
      </div>
      <div>
        <DeckEditor 
          deck={deck}
          onRemoveCard={removeCard}
          onSaveDeck={saveDeck}
        />
      </div>
    </div>
  );
}
```

## Special Considerations

### 1. Route Protection with Middleware

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/profile',
  '/deck-builder',
  '/debug',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route should be protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute) {
    const token = await getToken({ req: request });
    
    // If not authenticated, redirect to login
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all frontend routes except specific system paths
    '/((?!_next/|api/|images/|favicon.ico|login|register).*)' 
  ],
};
```

### 2. Handling Query Parameters

In React Router, query parameters are often handled with `useSearchParams()`. In Next.js App Router, you can handle them in different ways:

#### Server Component

```tsx
// app/cards/page.tsx
export default async function CardsPage({
  searchParams,
}: {
  searchParams: { faction?: string; type?: string; search?: string };
}) {
  const { faction, type, search } = searchParams;
  const cards = await getFilteredCards({ faction, type, search });
  
  return (
    <div>
      <h1>Cards</h1>
      <CardGrid cards={cards} />
    </div>
  );
}
```

#### Client Component

```tsx
// components/search/CardSearch.tsx
"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export function CardSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams);
    
    // Update or remove the search param
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    
    // Update the URL
    router.push(`${pathname}?${params.toString()}`);
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search cards..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

### 3. Not Found and Error Pages

Create custom 404 and error pages:

```tsx
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8">The page you are looking for doesn't exist.</p>
      <Link 
        href="/" 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        Return Home
      </Link>
    </div>
  );
}
```

```tsx
// app/error.tsx
"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
      <p className="mb-8">We encountered an error while processing your request.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### 4. Loading States

Create loading states for better UX:

```tsx
// app/factions/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}
```

## Migration Strategy

1. **Start with static pages first**
   - Homepage, Faction list, Timeline
   - These are the simplest to migrate and test

2. **Next, implement dynamic pages**
   - Faction details, Card details
   - These demonstrate dynamic routing but are still relatively simple

3. **Then, migrate interactive pages**
   - Deck builder, Profile
   - These are more complex and may require more client-side interactivity

4. **Finally, implement authentication and protected routes**
   - Setup middleware for route protection
   - Migrate login/register pages

This approach allows for an incremental migration, starting with simpler pages and progressively tackling more complex functionality.