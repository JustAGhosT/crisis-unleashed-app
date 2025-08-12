import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Faction } from '@/types/game.types';
import { getFactionTheme, FactionTheme } from '@/theme/factionThemes';

type FactionThemeContextType = {
  currentTheme: FactionTheme;
  setActiveFaction: (faction: Faction) => void;
};

const FactionThemeContext = createContext<FactionThemeContextType | undefined>(undefined);

export const FactionThemeProvider: React.FC<{
  children: ReactNode;
  initialFaction?: Faction;
}> = ({ children, initialFaction = 'solaris' }) => {
  const [activeFaction, setActiveFaction] = useState<Faction>(initialFaction);
  const currentTheme = getFactionTheme(activeFaction);

  return (
    <FactionThemeContext.Provider value={{ currentTheme, setActiveFaction }}>
      {children}
    </FactionThemeContext.Provider>
  );
};

export const useFactionTheme = () => {
  const context = useContext(FactionThemeContext);
  if (context === undefined) {
    throw new Error('useFactionTheme must be used within a FactionThemeProvider');
  }
  return context;
};