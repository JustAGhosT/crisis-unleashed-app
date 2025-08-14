"use client";

import { ReactNode } from "react";
import { useFeatureFlag } from "@/lib/feature-flags/useFeatureFlag";
import type { FeatureFlags } from "@/lib/feature-flags/feature-flag-provider";

type FeatureGateProps = {
  /**
   * The feature flag to check
   */
  flag: keyof FeatureFlags;

  /**
   * Content to render when the feature is enabled
   */
  children: ReactNode;

  /**
   * Optional content to render when the feature is disabled
   */
  fallback?: ReactNode;

  /**
   * Whether to track usage of this feature flag
   * @default false
   */
  trackUsage?: boolean;
};

/**
 * A component that conditionally renders content based on a feature flag
 */
export function FeatureGate({
  flag,
  children,
  fallback = null,
  trackUsage = false,
}: FeatureGateProps) {
  const isEnabled = useFeatureFlag(flag, { trackUsage });

  return isEnabled ? <>{children}</> : <>{fallback}</>;
}

/**
 * Higher-order component that wraps a component with a feature gate
 */
export function withFeatureFlag<P extends object>(
  Component: React.ComponentType<P>,
  flag: keyof FeatureFlags,
  FallbackComponent?: React.ComponentType<P>,
) {
  return function FeatureFlaggedComponent(props: P) {
    return (
      <FeatureGate
        flag={flag}
        fallback={FallbackComponent ? <FallbackComponent {...props} /> : null}
      >
        <Component {...props} />
      </FeatureGate>
    );
  };
}
