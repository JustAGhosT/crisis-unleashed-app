import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Define the feature flags interface
interface FeatureFlags {
  useNewFactionUI: boolean;
  useNewDeckBuilder: boolean;
  useNewCardDisplay: boolean;
  useNewNavigation: boolean;
  useNewTheme: boolean;
  enableAdvancedDeckAnalytics: boolean;
  enableCardAnimations: boolean;
  enableMultiplayerChat: boolean;
  enableTournamentMode: boolean;
  enableAIOpponent: boolean;
  [key: string]: boolean; // Allow for dynamic keys
}

export async function GET() {
  try {
    // Default feature flags
    const defaultFlags: FeatureFlags = {
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
    const envFlags: Partial<FeatureFlags> = {
      useNewFactionUI: process.env.ENABLE_NEW_FACTION_UI === "true",
      useNewDeckBuilder: process.env.ENABLE_NEW_DECK_BUILDER === "true",
      useNewCardDisplay: process.env.ENABLE_NEW_CARD_DISPLAY === "true",
      useNewNavigation: process.env.ENABLE_NEW_NAVIGATION === "true",
      useNewTheme: process.env.ENABLE_NEW_THEME === "true",
      enableAdvancedDeckAnalytics: false,
      enableCardAnimations: false,
      enableMultiplayerChat: false,
      enableTournamentMode: false,
      enableAIOpponent: false,
    };

    // Check for user-specific overrides in cookies
    const userFlags: Partial<FeatureFlags> = {};
    const flagCookies = cookies();

    for (const key of Object.keys(defaultFlags)) {
      const cookieValue = flagCookies.get(`flag_${key}`);
      if (cookieValue) {
        userFlags[key] = cookieValue.value === "true";
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
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();

    // Validate input
    if (typeof key !== "string" || typeof value !== "boolean") {
      return NextResponse.json(
        { error: "Invalid input. Expected {key: string, value: boolean}" },
        { status: 400 },
      );
    }

    // Store in cookie
    const cookieStore = cookies();
    cookieStore.set(`flag_${key}`, value.toString(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating feature flag:", error);
    return NextResponse.json(
      { error: "Failed to update feature flag" },
      { status: 500 },
    );
  }
}
