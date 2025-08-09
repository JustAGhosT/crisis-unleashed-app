import { useEffect, useState } from 'react';
import { FeatureFlags } from '@/app/api/feature-flags/types';

// Default flags - all features disabled
const defaultFlags: FeatureFlags = {
  useNewFactionUI: false,
  useNewDeckBuilder: false,
  useNewCardDisplay: false,
  useNewNavigation: false,
  useNewTheme: false,
};

export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFlags() {
      try {
        setLoading(true);
        const response = await fetch('/api/feature-flags');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch feature flags: ${response.status}`);
        }
        
        const data = await response.json();
        setFlags(data);
      } catch (err) {
        console.error('Error fetching feature flags:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchFlags();
  }, []);

  return { flags, loading, error };
}