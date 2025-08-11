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
