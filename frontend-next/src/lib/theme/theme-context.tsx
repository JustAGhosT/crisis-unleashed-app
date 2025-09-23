"use client";

import React from "react";
import { type FactionKey } from "./faction-theme";
import { setThemeCookie } from "./cookie-utils";

export type FactionThemeContextValue = {
  factionKey: FactionKey;
  setFactionKey: (key: FactionKey) => void;
};

const FactionThemeContext = React.createContext<FactionThemeContextValue | null>(
  null,
);

export function useFactionTheme(): FactionThemeContextValue {
  const ctx = React.useContext(FactionThemeContext);
  if (!ctx) {
    console.error("useFactionTheme must be used within FactionThemeProvider - falling back to default");
    // Fallback with default values instead of throwing
    return {
      factionKey: "solaris_nexus" as const,
      setFactionKey: () => console.warn("setFactionKey called outside of FactionThemeProvider")
    };
  }
  return ctx;
}

export function FactionThemeProvider({
  initial,
  children,
}: {
  initial: FactionKey;
  children: React.ReactNode;
}) {
  const [factionKey, _setFactionKey] = React.useState<FactionKey>(initial);

  const setCookieValue = React.useCallback((key: FactionKey) => {
    setThemeCookie(key);
  }, []);

  const setFactionKey = React.useCallback((key: FactionKey) => {
    _setFactionKey(key);
    setCookieValue(key);
  }, [setCookieValue]);

  React.useEffect(() => {
    setCookieValue(factionKey);
  }, [factionKey, setCookieValue]);

  return (
    <FactionThemeContext.Provider value={{ factionKey, setFactionKey }}>
      {children}
    </FactionThemeContext.Provider>
  );
}
