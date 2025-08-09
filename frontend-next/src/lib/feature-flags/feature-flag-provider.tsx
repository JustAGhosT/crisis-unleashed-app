"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type FeatureFlags = {
  useNewFactionUI: boolean;
  useNewDeckBuilder: boolean;
  useNewCardDisplay: boolean;
  useNewNavigation: boolean;
  useNewTheme: boolean;
};

const defaultFlags: FeatureFlags = {
  useNewFactionUI: false,
  useNewDeckBuilder: false,
  useNewCardDisplay: false,
  useNewNavigation: false,
  useNewTheme: false,
};

const FeatureFlagContext = createContext<{
  flags: FeatureFlags;
  setFlag: (flag: keyof FeatureFlags, value: boolean) => void;
}>({
  flags: defaultFlags,
  setFlag: () => {},
});

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);

  useEffect(() => {
    // Load flags from local storage on client side
    const storedFlags = localStorage.getItem("featureFlags");
    if (storedFlags) {
      try {
        setFlags(JSON.parse(storedFlags));
      } catch (e) {
        console.error("Failed to parse stored feature flags", e);
      }
    } else {
      // Fetch from API
      fetch("/api/feature-flags")
        .then((res) => res.json())
        .then((data) => {
          setFlags(data);
          localStorage.setItem("featureFlags", JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Failed to fetch feature flags", error);
        });
    }
  }, []);

  const setFlag = (flag: keyof FeatureFlags, value: boolean) => {
    setFlags((prevFlags) => {
      const newFlags = { ...prevFlags, [flag]: value };
      localStorage.setItem("featureFlags", JSON.stringify(newFlags));
      
      // Immediately mirror to cookie so middleware can read it on next navigation
      try {
        const cookieValue = encodeURIComponent(JSON.stringify(newFlags));
        const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
        document.cookie = `featureFlags=${cookieValue}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
      } catch (e) {
        console.error("Failed to sync feature flags cookie (client)", e);
      }
      
      // Also notify server to persist cookie via Set-Cookie
      // This ensures consistent attributes and covers edge cases
      fetch("/api/feature-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFlags),
        credentials: "include",
      }).catch((e) => {
        console.error("Failed to POST feature flags for cookie sync", e);
      });
      
      // Track flag change in analytics
      if (typeof window !== 'undefined' && 'analytics' in window) {
        (window as any).analytics?.track('Feature Flag Changed', {
          flag,
          value,
          timestamp: new Date().toISOString()
        });
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