"use client";

import { useFeatureFlags } from "./feature-flag-provider";
import { useEffect } from "react";

declare global {
  interface Window {
    analytics?: {
      track: (event: string, payload: Record<string, unknown>) => void;
    };
  }
}

type FeatureFlagOptions = {
  /**
   * Whether to log usage of this feature flag to analytics
   */
  trackUsage?: boolean;
  
  /**
   * Optional callback when the feature is enabled
   */
  onEnabled?: () => void;
  
  /**
   * Optional callback when the feature is disabled
   */
  onDisabled?: () => void;
};

/**
 * Hook for checking a specific feature flag with additional options
 * 
 * @param flagName The name of the feature flag to check
 * @param options Additional options for tracking and callbacks
 * @returns Boolean indicating if the feature is enabled
 */
export function useFeatureFlag(
  flagName: keyof ReturnType<typeof useFeatureFlags>["flags"],
  options: FeatureFlagOptions = {}
): boolean {
  const { flags } = useFeatureFlags();
  const isEnabled = flags[flagName];
  
  // Track feature flag usage in analytics
  useEffect(() => {
    if (options.trackUsage && typeof window !== 'undefined') {
      // Track feature flag check in analytics
      if ('analytics' in window) {
        window.analytics?.track('Feature Flag Checked', {
          flag: flagName,
          enabled: isEnabled,
          path: window.location.pathname,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Call callbacks based on flag state
    if (isEnabled && options.onEnabled) {
      options.onEnabled();
    } else if (!isEnabled && options.onDisabled) {
      options.onDisabled();
    }
  }, [flagName, isEnabled, options]);
  
  return isEnabled;
}