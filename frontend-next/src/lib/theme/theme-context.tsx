"use client";

import React from "react";
import { type FactionKey } from "./faction-theme";

export type FactionThemeContextValue = {
  factionKey: FactionKey;
  setFactionKey: (key: FactionKey) => void;
};

const FactionThemeContext = React.createContext<FactionThemeContextValue | null>(
  null,
);

export function useFactionTheme(): FactionThemeContextValue {
  const ctx = React.useContext(FactionThemeContext);
  if (!ctx) throw new Error("useFactionTheme must be used within FactionThemeProvider");
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

  const setFactionKey = React.useCallback((key: FactionKey) => {
    _setFactionKey(key);
    if (typeof document !== "undefined") {
      // 90 days persistence
      const maxAge = 60 * 60 * 24 * 90;
      document.cookie = `theme:active=${key}; Path=/; Max-Age=${maxAge}`;
    }
  }, []);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const maxAge = 60 * 60 * 24 * 90;
      document.cookie = `theme:active=${factionKey}; Path=/; Max-Age=${maxAge}`;
    }
  }, [factionKey]);

  return (
    <FactionThemeContext.Provider value={{ factionKey, setFactionKey }}>
      {children}
    </FactionThemeContext.Provider>
  );
}
