# Feature Flag System

This directory contains components and utilities for the Crisis Unleashed feature flag system. Feature flags allow us to safely deploy new features to production while controlling who can access them.

## Components

- `FeatureGate`: A component that conditionally renders content based on a feature flag
- `FeatureFlagIndicator`: A floating indicator that shows which experimental features are active

## Usage Examples

### Basic Usage with FeatureGate Component

```tsx
import { FeatureGate } from "@/components/feature-flags/FeatureGate";

function MyComponent() {
  return (
    <div>
      <h1>My Component</h1>
      
      {/* Only render this content if the new faction UI is enabled */}
      <FeatureGate flag="useNewFactionUI">
        <p>This is the new faction UI!</p>
      </FeatureGate>
      
      {/* Provide a fallback for when the feature is disabled */}
      <FeatureGate 
        flag="useNewDeckBuilder" 
        fallback={<p>The new deck builder is coming soon!</p>}
      >
        <p>This is the new deck builder!</p>
      </FeatureGate>
    </div>
  );
}
```

### Using the Higher-Order Component

```tsx
import { withFeatureFlag } from "@/components/feature-flags/FeatureGate";

// Original component
function NewNavigation() {
  return <nav>New Navigation</nav>;
}

// Legacy component (fallback)
function LegacyNavigation() {
  return <nav>Legacy Navigation</nav>;
}

// Create a feature-flagged version of the component
const FeatureFlaggedNavigation = withFeatureFlag(
  NewNavigation,
  "useNewNavigation",
  LegacyNavigation
);

// Use it in your app
function App() {
  return (
    <div>
      <FeatureFlaggedNavigation />
    </div>
  );
}
```

### Using the useFeatureFlag Hook

```tsx
import { useFeatureFlag } from "@/lib/feature-flags/useFeatureFlag";

function MyComponent() {
  // Basic usage
  const isNewThemeEnabled = useFeatureFlag("useNewTheme");
  
  // With tracking and callbacks
  const isNewCardDisplayEnabled = useFeatureFlag("useNewCardDisplay", {
    trackUsage: true,
    onEnabled: () => console.log("New card display is enabled!"),
    onDisabled: () => console.log("New card display is disabled!")
  });
  
  // Conditional rendering based on the flag
  return (
    <div className={isNewThemeEnabled ? "new-theme" : "old-theme"}>
      {isNewCardDisplayEnabled ? (
        <div>New Card Display</div>
      ) : (
        <div>Old Card Display</div>
      )}
    </div>
  );
}
```

## Managing Feature Flags

Feature flags can be managed through the admin interface at `/admin/feature-flags`. This interface allows administrators to:

1. Enable or disable individual features
2. Enable or disable all features at once
3. See which features are currently active

## Feature Flag Indicator

The `FeatureFlagIndicator` component is automatically included in the application layout. It shows a floating button in the bottom-right corner of the screen with the number of active feature flags. Clicking this button reveals a panel with details about which flags are active and a link to the admin interface.

## Adding New Feature Flags

To add a new feature flag:

1. Update the `FeatureFlags` type in `src/lib/feature-flags/feature-flag-provider.tsx`
2. Add the flag to the `defaultFlags` object in the same file
3. Update the `flagsByRole` object in `src/app/api/feature-flags/route.ts`
4. Add a new card to the admin interface in `src/app/admin/feature-flags/page.tsx`