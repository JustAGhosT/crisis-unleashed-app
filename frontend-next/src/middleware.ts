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