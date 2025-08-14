# Feature Flag Implementation Guide

This guide explains where the feature-flag implementation lives and how to use it during migration from the Vite frontend to Next.js 14.

## Implementation Locations

- Provider: frontend-next/src/lib/feature-flags/feature-flag-provider.tsx
  - Exports: FeatureFlags, FeatureFlagProvider, useFeatureFlags
  - Persists flags to localStorage and the featureFlags cookie (Path=/, SameSite=Lax, Max-Age=31536000; Secure on HTTPS). Note: Client-set cookies cannot be HttpOnly; only store non-sensitive data and consider signing the value (e.g., HMAC) to prevent tampering.
- API route: frontend-next/src/app/api/feature-flags/route.ts
  - Env-driven example for initial flag values
- Layout wiring: frontend-next/src/app/layout.tsx and frontend-next/src/components/providers.tsx
  - Uses the Providers pattern for client components in server contexts
- Admin UI: frontend-next/src/app/admin/feature-flags/page.tsx
  - Toggle flags via UI using the provider
- Middleware: frontend-next/src/middleware.ts
  - Reads featureFlags cookie to decide rewrites to legacy when disabled
- Example wrapper usage: frontend-next/src/components/factions/FactionGridWrapper.tsx
  - Switches between new and legacy components based on flags

## Provider Wiring in Next.js App Router

Next.js App Router uses Server Components by default, but React context providers require Client Components. To properly implement providers:

1. Create a dedicated Client Component for providers:

```tsx
// frontend-next/src/components/providers.tsx
'use client';

import { ReactNode } from 'react';
import { FeatureFlagProvider } from '@/lib/feature-flags/feature-flag-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FeatureFlagProvider>
      {children}
    </FeatureFlagProvider>
  );
}
```

2. Use this component in your root layout:

```tsx
// frontend-next/src/app/layout.tsx
import { Providers } from '@/components/providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

This pattern allows you to:
- Keep the layout as a Server Component
- Isolate client-side code to specific components
- Properly provide context to the entire application
- Add additional providers in a single location

## Usage

- Access flags in client components:
  - import { useFeatureFlags } from "@/lib/feature-flags/feature-flag-provider"
  - const { flags, setFlag } = useFeatureFlags()
  - Must be used within Client Components (marked with 'use client')

- Server Components cannot directly access feature flags via hooks, but can:
  - Read from cookies in Server Components
  - Pass flag values as props to Client Components
  - Use the middleware for routing decisions

## Persistence

- Flags are persisted to:
  - localStorage for client usage
  - featureFlags cookie for server-side middleware access during request-time rewrites

## Rollout Sequence (recommended)

1. useNewTheme
2. useNewNavigation
3. useNewFactionUI
4. useNewCardDisplay
5. useNewDeckBuilder