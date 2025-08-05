# Feature Flag Implementation Guide

This document provides implementation details for the feature flag system that will enable progressive migration from the Vite-based frontend to the Next.js 14 stack.

## Overview

The feature flag system will allow us to:
- Gradually roll out Next.js components and features
- Toggle between legacy and new implementations
- Test new features with specific user groups
- Quickly roll back problematic features if necessary
- Track metrics for both implementations

## Implementation Steps

### 1. Create Feature Flag Provider

```tsx
// src/lib/feature-flags/feature-flag-provider.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type FeatureFlags = {
  useNewFactionUI: boolean;
  useNewDeckBuilder: boolean;
  useNewCardDisplay: boolean;
  useNewNavigation: boolean;
  useNewTheme: boolean;
};

const defaultFlags: FeatureFlags = {
  useNewFactionUI: false,
  useNewDeckBuilder: false,
  useNewCardDisplay: false,
  useNewNavigation: false,
  useNewTheme: false,
};

const FeatureFlagContext = createContext<{
  flags: FeatureFlags;
  setFlag: (flag: keyof FeatureFlags, value: boolean) => void;
}>({
  flags: defaultFlags,
  setFlag: () => {},
});

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);

  useEffect(() => {
    // Load flags from local storage on client side
    const storedFlags = localStorage.getItem("featureFlags");
    if (storedFlags) {
      try {
        setFlags(JSON.parse(storedFlags));
      } catch (e) {
        console.error("Failed to parse stored feature flags", e);
      }
    } else {
      // Fetch from API
      fetch("/api/feature-flags")
        .then((res) => res.json())
        .then((data) => {
          setFlags(data);
          localStorage.setItem("featureFlags", JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Failed to fetch feature flags", error);
        });
    }
  }, []);

  const setFlag = (flag: keyof FeatureFlags, value: boolean) => {
    setFlags((prevFlags) => {
      const newFlags = { ...prevFlags, [flag]: value };
      localStorage.setItem("featureFlags", JSON.stringify(newFlags));
      return newFlags;
    });
  };

  return (
    <FeatureFlagContext.Provider value={{ flags, setFlag }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  return useContext(FeatureFlagContext);
}
```

### 2. Create Feature Flag API Endpoint

```tsx
// app/api/feature-flags/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // In a real implementation, you might:
  // 1. Check user identity/role from session
  // 2. Load flags from database based on user/role
  // 3. Apply A/B testing rules
  
  // This is a simplified example
  return NextResponse.json({
    useNewFactionUI: process.env.ENABLE_NEW_FACTION_UI === "true",
    useNewDeckBuilder: process.env.ENABLE_NEW_DECK_BUILDER === "true",
    useNewCardDisplay: process.env.ENABLE_NEW_CARD_DISPLAY === "true", 
    useNewNavigation: process.env.ENABLE_NEW_NAVIGATION === "true",
    useNewTheme: process.env.ENABLE_NEW_THEME === "true",
  });
}
```

### 3. Add Feature Flag Provider to Layout

```tsx
// app/layout.tsx
import { FeatureFlagProvider } from "@/lib/feature-flags/feature-flag-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FeatureFlagProvider>
          {/* Rest of your app */}
          {children}
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
```

### 4. Create Feature Flag Admin UI

```tsx
// app/admin/feature-flags/page.tsx
"use client";

import { useFeatureFlags } from "@/lib/feature-flags/feature-flag-provider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeatureFlagAdmin() {
  const { flags, setFlag } = useFeatureFlags();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Feature Flag Administration</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <FeatureFlagCard 
          title="Faction UI" 
          description="New faction cards and detail pages"
          flagKey="useNewFactionUI"
          enabled={flags.useNewFactionUI}
          setFlag={setFlag}
        />
        
        <FeatureFlagCard 
          title="Deck Builder" 
          description="New deck builder interface with improved UX"
          flagKey="useNewDeckBuilder"
          enabled={flags.useNewDeckBuilder}
          setFlag={setFlag}
        />
        
        <FeatureFlagCard 
          title="Card Display" 
          description="Redesigned card layout and animations"
          flagKey="useNewCardDisplay"
          enabled={flags.useNewCardDisplay}
          setFlag={setFlag}
        />
        
        <FeatureFlagCard 
          title="Navigation" 
          description="New header and navigation components"
          flagKey="useNewNavigation"
          enabled={flags.useNewNavigation}
          setFlag={setFlag}
        />
        
        <FeatureFlagCard 
          title="Theme System" 
          description="New theming with dark/light mode support"
          flagKey="useNewTheme"
          enabled={flags.useNewTheme}
          setFlag={setFlag}
        />
      </div>
      
      <div className="mt-6 flex gap-4">
        <Button variant="default" onClick={() => {
          Object.keys(flags).forEach(key => {
            setFlag(key as keyof typeof flags, true);
          });
        }}>
          Enable All
        </Button>
        
        <Button variant="outline" onClick={() => {
          Object.keys(flags).forEach(key => {
            setFlag(key as keyof typeof flags, false);
          });
        }}>
          Disable All
        </Button>
      </div>
    </div>
  );
}

function FeatureFlagCard({ 
  title, 
  description, 
  flagKey, 
  enabled, 
  setFlag 
}: { 
  title: string; 
  description: string; 
  flagKey: keyof typeof useFeatureFlags extends Function ? never : ReturnType<typeof useFeatureFlags>["flags"]; 
  enabled: boolean; 
  setFlag: ReturnType<typeof useFeatureFlags>["setFlag"]; 
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="font-medium">{enabled ? "Enabled" : "Disabled"}</span>
          <Switch 
            checked={enabled}
            onCheckedChange={(checked) => setFlag(flagKey, checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
```

### 5. Using Feature Flags in Components

```tsx
// Example usage in a component
"use client";

import { useFeatureFlags } from "@/lib/feature-flags/feature-flag-provider";
import { LegacyFactionGrid } from "@/components/legacy/LegacyFactionGrid";
import { NewFactionGrid } from "@/components/factions/FactionGrid";

export default function FactionGridWrapper({ factions }) {
  const { flags } = useFeatureFlags();
  
  return flags.useNewFactionUI ? (
    <NewFactionGrid factions={factions} />
  ) : (
    <LegacyFactionGrid factions={factions} />
  );
}
```

### 6. Feature Flag Middleware for Routes

```tsx
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define routes that have new implementations
const NEXT_ENABLED_ROUTES = [
  '/factions',
  '/deck-builder',
  '/cards',
];

export function middleware(request: NextRequest) {
  // Check if the requested path is in the new routes list
  const { pathname } = request.nextUrl;
  const matchesNewRoute = NEXT_ENABLED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (!matchesNewRoute) {
    return NextResponse.next();
  }
  
  // Check feature flags from cookies
  // This is a simplified example - in practice you might need
  // a more sophisticated approach to sync with your feature flag system
  const featureFlagsCookie = request.cookies.get('featureFlags');
  let useNewUI = false;
  
  if (featureFlagsCookie) {
    try {
      const flags = JSON.parse(featureFlagsCookie.value);
      
      // Determine which flag to check based on path
      if (pathname.startsWith('/factions')) {
        useNewUI = flags.useNewFactionUI;
      } else if (pathname.startsWith('/deck-builder')) {
        useNewUI = flags.useNewDeckBuilder;
      } else if (pathname.startsWith('/cards')) {
        useNewUI = flags.useNewCardDisplay;
      }
    } catch (e) {
      console.error('Failed to parse feature flags cookie', e);
    }
  }
  
  // If flag is not enabled, redirect to legacy app
  if (!useNewUI) {
    const legacyUrl = new URL('/legacy', request.url);
    legacyUrl.pathname = pathname;
    return NextResponse.rewrite(legacyUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all frontend routes except specific system paths
    '/((?!_next/|api/|images/|favicon.ico|admin/|legacy/).*)' 
  ],
};
```

## Analytics and Monitoring

To track the effectiveness of the feature flags and user experience with new features:

1. Add analytics tracking when a feature flag is toggled
2. Implement specific event tracking for new components
3. Create A/B testing groups for different feature combinations
4. Set up dashboards to compare metrics between legacy and new implementations

Example analytics tracking:

```tsx
// Enhanced setFlag function in feature-flag-provider.tsx
const setFlag = (flag: keyof FeatureFlags, value: boolean) => {
  setFlags((prevFlags) => {
    const newFlags = { ...prevFlags, [flag]: value };
    localStorage.setItem("featureFlags", JSON.stringify(newFlags));
    
    // Track flag change in analytics
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('Feature Flag Changed', {
        flag,
        value,
        userId: getCurrentUserId(), // You would implement this function
        timestamp: new Date().toISOString()
      });
    }
    
    return newFlags;
  });
};
```

## Recommended Rollout Sequence

1. Start with the theme system (useNewTheme)
2. Then roll out navigation components (useNewNavigation)
3. Move to faction UI components (useNewFactionUI)
4. Implement card display components (useNewCardDisplay)
5. Finally, roll out the deck builder (useNewDeckBuilder)

This sequence allows for incremental migration of increasing complexity, starting with UI-only changes and progressing to more complex interactive features.