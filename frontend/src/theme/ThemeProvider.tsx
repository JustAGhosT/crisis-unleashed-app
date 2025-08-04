import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react';
import { Faction } from '@/types/game.types';
import { FactionTheme, factionThemes, defaultTheme } from './factionThemes';
import styles from './ThemeProvider.module.css';

interface ThemeContextType {
  theme: FactionTheme;
  faction: Faction;
  setFaction: (faction: Faction) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  initialFaction?: Faction;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialFaction = 'solaris',
}) => {
  const [faction, setFaction] = useState<Faction>(initialFaction);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = factionThemes[faction] || defaultTheme;

  // Apply theme to document root for CSS variables
  useEffect(() => {
    const root = document.documentElement;

    // Set CSS variables
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-highlight', theme.colors.highlight);
    root.style.setProperty('--color-energy', theme.colors.energy);
    root.style.setProperty('--color-health', theme.colors.health);

    // Set gradient
    root.style.setProperty('--gradient-bg', theme.gradient);

    // Set card theme
    root.style.setProperty('--card-bg', theme.cardTheme.background);
    root.style.setProperty('--card-border', theme.cardTheme.border);
    root.style.setProperty('--card-highlight', theme.cardTheme.highlight);
    root.style.setProperty('--card-text', theme.cardTheme.text);

    // Set button theme
    root.style.setProperty('--button-primary', theme.buttonTheme.primary);
    root.style.setProperty('--button-hover', theme.buttonTheme.hover);
    root.style.setProperty('--button-text', theme.buttonTheme.text);

    // Set dark mode
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    // Add theme class to body for global styles
    document.body.className = `${faction}-theme`;

    return () => {
      // Cleanup
      document.body.className = '';
    };
  }, [faction, theme, isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = useMemo(
    () => ({
      theme,
      faction,
      setFaction,
      isDarkMode,
      toggleDarkMode,
    }),
    [theme, faction, isDarkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Theme selector component for development/testing
export const ThemeSelector: React.FC = () => {
  const { faction, setFaction, isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className={styles.themeSelector}>
      <div className={styles.themeSelectorContent}>
        <h3 className={styles.themeSelectorTitle}>Theme Selector</h3>
        <div className={styles.factionGrid}>
          {Object.entries(factionThemes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setFaction(key as Faction)}
              className={`${styles.factionButton} ${styles[key]} ${faction === key ? styles.active : ''}`}
            >
              {theme.name}
            </button>
          ))}
        </div>
        <button
          onClick={toggleDarkMode}
          className={styles.darkModeToggle}
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </div>
  );
};

export default ThemeProvider;