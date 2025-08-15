"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type FeatureFlags = {
  // Keep existing flags for backward compatibility
  useNewFactionUI: boolean;
  useNewDeckBuilder: boolean;
  useNewCardDisplay: boolean;
  useNewNavigation: boolean;
  useNewTheme: boolean;

  // Add new feature flags for future features
  enableAdvancedDeckAnalytics: boolean;
  enableCardAnimations: boolean;
  enableMultiplayerChat: boolean;
  enableTournamentMode: boolean;
  enableAIOpponent: boolean;
  // New: gate realtime connection scaffolding
  enableRealtime: boolean;
};

const defaultFlags: FeatureFlags = {
  // Set existing flags to true since migration is complete
  useNewFactionUI: true,
  useNewDeckBuilder: true,
  useNewCardDisplay: true,
  useNewNavigation: true,
  useNewTheme: true,

  // Set new feature flags to false by default
  enableAdvancedDeckAnalytics: false,
  enableCardAnimations: true,
  enableMultiplayerChat: false,
  enableTournamentMode: false,
  enableAIOpponent: false,
  enableRealtime: false,
};

// Runtime type guard for FeatureFlags shape
function isFeatureFlags(value: unknown): value is FeatureFlags {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.useNewFactionUI === "boolean" &&
    typeof obj.useNewDeckBuilder === "boolean" &&
    typeof obj.useNewCardDisplay === "boolean" &&
    typeof obj.useNewNavigation === "boolean" &&
    typeof obj.useNewTheme === "boolean" &&
    typeof obj.enableAdvancedDeckAnalytics === "boolean" &&
    typeof obj.enableCardAnimations === "boolean" &&
    typeof obj.enableMultiplayerChat === "boolean" &&
    typeof obj.enableTournamentMode === "boolean" &&
    typeof obj.enableAIOpponent === "boolean" &&
    typeof obj.enableRealtime === "boolean"
  );
}

const FeatureFlagContext = createContext<{
  flags: FeatureFlags;
  setFlag: (flag: keyof FeatureFlags, value: boolean) => void;
}>({
  flags: defaultFlags,
  setFlag: () => {},
});

// Helper function to safely check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

// Helper to safely parse JSON with type validation
const safeParseFlags = (json: string): FeatureFlags | null => {
  try {
    const parsed = JSON.parse(json);
    if (isFeatureFlags(parsed)) return parsed;

    console.warn(
      "Stored feature flags missing required keys or have wrong types",
    );
    return null;
  } catch (e) {
    console.error("Failed to parse stored feature flags", e);
    return null;
  }
};

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);
  const [storageAvailable, setStorageAvailable] = useState<boolean | null>(
    null,
  );

  // Check if localStorage is available once on mount
  useEffect(() => {
    setStorageAvailable(isLocalStorageAvailable());
  }, []);

  // Load feature flags
  useEffect(() => {
    // Skip if we haven't checked storage availability yet
    if (storageAvailable === null) return;

    const fetchFromApi = () => {
      console.log("Fetching feature flags from API");
      fetch("/api/feature-flags")
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (isFeatureFlags(data)) {
            setFlags(data);
          } else {
            console.warn(
              "API returned invalid feature flags; keeping defaults/current state",
            );
          }

          // Only try to save to localStorage if it's available
          if (storageAvailable && isFeatureFlags(data)) {
            try {
              // Only save valid flags
              localStorage.setItem("featureFlags", JSON.stringify(data));
            } catch (e) {
              console.error("Failed to save feature flags to localStorage", e);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to fetch feature flags from API", error);
        });
    };

    // Try to load from localStorage first if available
    let loadedFromStorage = false;

    if (storageAvailable) {
      try {
        const storedFlags = localStorage.getItem("featureFlags");

        if (storedFlags) {
          // Safely parse and validate the stored flags
          const parsedFlags = safeParseFlags(storedFlags);

          if (parsedFlags) {
            setFlags(parsedFlags);
            loadedFromStorage = true;
            console.log("Loaded feature flags from localStorage");
          }
        }
      } catch (e) {
        console.error("Failed to access localStorage", e);
      }
    }

    // Only fetch from API if we couldn't load valid flags from localStorage
    if (!loadedFromStorage) {
      fetchFromApi();
    }
  }, [storageAvailable]);

  const setFlag = (flag: keyof FeatureFlags, value: boolean) => {
    setFlags((prevFlags) => {
      const newFlags = { ...prevFlags, [flag]: value };

      // Only try localStorage operations if it's available
      if (storageAvailable) {
        try {
          localStorage.setItem("featureFlags", JSON.stringify(newFlags));
        } catch (e) {
          console.error("Failed to save feature flags to localStorage", e);
        }
      }

      try {
        // Set cookie for middleware/SSR access
        const cookieValue = encodeURIComponent(JSON.stringify(newFlags));
        const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
        document.cookie = `featureFlags=${cookieValue}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
      } catch (e) {
        console.error("Failed to set feature flags cookie", e);
      }

      // Notify server to persist cookie via Set-Cookie
      fetch("/api/feature-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFlags),
        credentials: "include",
      }).catch((e) => {
        console.error("Failed to POST feature flags for cookie sync", e);
      });

      // Track flag change in analytics
      try {
        type AnalyticsLike = {
          track: (event: string, props?: Record<string, unknown>) => void;
        };
        if (typeof window !== "undefined") {
          const w = window as unknown as { analytics?: AnalyticsLike };
          w.analytics?.track("Feature Flag Changed", {
            flag,
            value,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.error("Failed to track feature flag change", e);
      }

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
