"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the feature flags interface
export interface FeatureFlags {
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
}

// Default values for feature flags
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

// Create context
interface FeatureFlagsContextType {
  flags: FeatureFlags;
  setFlag: (key: keyof FeatureFlags, value: boolean) => void;
  isLoading: boolean;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType>({
  flags: defaultFlags,
  setFlag: () => {},
  isLoading: true,
});

// Provider component
interface FeatureFlagsProviderProps {
  children: ReactNode;
}

export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);
  const [isLoading, setIsLoading] = useState(true);

  // Load flags from API on mount
  useEffect(() => {
    async function loadFlags() {
      try {
        const response = await fetch('/api/feature-flags');
        if (!response.ok) {
          throw new Error('Failed to load feature flags');
        }
        const data = await response.json();
        setFlags(data);
      } catch (error) {
        console.error('Error loading feature flags:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFlags();
  }, []);

  // Function to update a single flag
  const setFlag = async (key: keyof FeatureFlags, value: boolean) => {
    // Update local state immediately for responsive UI
    setFlags(prev => ({ ...prev, [key]: value }));

    // Persist to cookie via API
    try {
      const response = await fetch('/api/feature-flags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update feature flag');
      }
    } catch (error) {
      // Revert on failure
      console.error('Error updating feature flag:', error);
      setFlags(prev => ({ ...prev, [key]: !value }));
      throw error;
    }
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, setFlag, isLoading }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// Hook to use feature flags
export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
}