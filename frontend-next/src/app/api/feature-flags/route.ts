// Default flags - should match the ones in feature-flag-provider.tsx
const defaultFlags: FeatureFlags = {
  // Migration flags (set to true by default)
  useNewFactionUI: true,
  useNewDeckBuilder: true,
  useNewCardDisplay: true,
  useNewNavigation: true,
  useNewTheme: true,
  
  // New feature flags
  enableAdvancedDeckAnalytics: false,
  enableCardAnimations: true,
  enableMultiplayerChat: false,
  enableTournamentMode: false,
  enableAIOpponent: false,
};

// For demo purposes, we'll simulate different flag values for different user roles
// In a real app, this would come from a database or external service
const flagsByRole: Record<string, Partial<FeatureFlags>> = {
  admin: {
    // Admins get all features
    enableAdvancedDeckAnalytics: true,
    enableCardAnimations: true,
    enableMultiplayerChat: true,
    enableTournamentMode: true,
    enableAIOpponent: true,
  },
  developer: {
    // Developers get most features
    enableAdvancedDeckAnalytics: true,
    enableCardAnimations: true,
    enableMultiplayerChat: true,
    enableTournamentMode: false,
    enableAIOpponent: true,
  },
  beta_tester: {
    // Beta testers get some features
    enableAdvancedDeckAnalytics: true,
    enableCardAnimations: true,
    enableMultiplayerChat: false,
    enableTournamentMode: false,
    enableAIOpponent: false,
  },
  user: defaultFlags,
};

export async function GET(request: NextRequest) {
  try {
    // Check for existing flags in cookies
    const cookieStore = cookies();
    const flagsCookie = cookieStore.get("featureFlags");

    if (flagsCookie) {
      try {
        const parsedFlags = JSON.parse(decodeURIComponent(flagsCookie.value));
        return NextResponse.json(parsedFlags);
      } catch (e) {
        console.error("Failed to parse feature flags cookie", e);
      }
    }

    // If no cookie exists, determine flags based on user role
    // In a real app, you would get the user from a session/auth system
    const userRole = request.cookies.get("userRole")?.value || "user";
    
    // Merge default flags with role-specific overrides
    const flags = {
      ...defaultFlags,
      ...(flagsByRole[userRole] || {}),
    };

    // Set cookie for future requests
    const response = NextResponse.json(flags);
    response.cookies.set({
      name: "featureFlags",
      value: encodeURIComponent(JSON.stringify(flags)),
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Error in feature flags API:", error);
    return NextResponse.json(defaultFlags, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the incoming data
    const validFlags = Object.keys(defaultFlags);
    const incomingFlags = Object.keys(body);
    
    // Check if all incoming flags are valid
    const invalidFlags = incomingFlags.filter(flag => !validFlags.includes(flag));
    if (invalidFlags.length > 0) {
      return NextResponse.json(
        { error: `Invalid flags: ${invalidFlags.join(", ")}` },
        { status: 400 }
      );
    }
    
    // Merge with defaults to ensure all flags are present
    const flags = { ...defaultFlags, ...body };
    
    // Set cookie for future requests
    const response = NextResponse.json({ success: true, flags });
    response.cookies.set({
      name: "featureFlags",
      value: encodeURIComponent(JSON.stringify(flags)),
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    
    // In a real app, you might also persist these settings to a database
    // await db.userSettings.update({ userId: user.id, featureFlags: flags });
    
    return response;
  } catch (error) {
    console.error("Error updating feature flags:", error);
    return NextResponse.json(
      { error: "Failed to update feature flags" },
      { status: 500 }
    );
  }
}