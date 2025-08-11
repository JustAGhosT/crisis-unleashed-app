import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Default feature flags
    const defaultFlags = {
      ENABLE_NEW_FACTION_UI: false,
      ENABLE_NEW_DECK_BUILDER: false,
      ENABLE_NEW_CARD_DISPLAY: false,
      ENABLE_NEW_NAVIGATION: false,
      ENABLE_NEW_THEME: false,
      useNewFactionUI: false,
      useNewDeckBuilder: false,
      useNewCardDisplay: false,
      useNewNavigation: false,
      useNewTheme: false,
      enableAdvancedDeckAnalytics: false,
      enableCardAnimations: false,
      enableMultiplayerChat: false,
      enableTournamentMode: false,
      enableAIOpponent: false,
    };

    // Read flags from .env.local if available
    const envFlags = {
      useNewFactionUI: process.env.ENABLE_NEW_FACTION_UI === 'true',
      useNewDeckBuilder: process.env.ENABLE_NEW_DECK_BUILDER === 'true',
      useNewCardDisplay: process.env.ENABLE_NEW_CARD_DISPLAY === 'true',
      useNewNavigation: process.env.ENABLE_NEW_NAVIGATION === 'true',
      useNewTheme: process.env.ENABLE_NEW_THEME === 'true',
      enableAdvancedDeckAnalytics: false,
      enableCardAnimations: false,
      enableMultiplayerChat: false,
    };

    // Check for user-specific overrides in cookies
    const userFlags = {};
    const flagCookies = cookies();
    
    for (const key of Object.keys(defaultFlags)) {
      const cookieValue = flagCookies.get(`flag_${key}`);
      if (cookieValue) {
        userFlags[key] = cookieValue.value === 'true';
      }
    }

    // Combine flags with priority: user overrides > env > defaults
    const combinedFlags = {
      ...defaultFlags,
      ...envFlags,
      ...userFlags,
    };

    return NextResponse.json(combinedFlags);
  } catch (error) {
    console.error("Error in feature flags API:", error);
    return NextResponse.json(
      { error: "Failed to load feature flags" },
      { status: 500 }
    );
  }
}