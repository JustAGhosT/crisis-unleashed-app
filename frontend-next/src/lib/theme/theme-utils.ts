import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Hook to safely access the current theme while avoiding hydration mismatch
 * @returns The current theme and a boolean indicating if the component is mounted
 */
export function useSafeTheme() {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only accessing theme after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the actual theme (accounting for system theme)
  const currentTheme = mounted ? (theme === "system" ? systemTheme : theme) : undefined;

  return {
    theme: currentTheme,
    setTheme,
    mounted,
    isDark: mounted && currentTheme === "dark",
    isLight: mounted && currentTheme === "light"
  };
}

/**
 * Utility to conditionally apply classes based on the current theme
 * @param lightClasses Classes to apply in light mode
 * @param darkClasses Classes to apply in dark mode
 * @returns A function that returns the appropriate classes based on the current theme
 */
export function createThemeClasses(lightClasses: string, darkClasses: string) {
  return (isDark: boolean) => isDark ? darkClasses : lightClasses;
}

/**
 * Get CSS variables for the current theme
 * @param isDark Whether dark mode is active
 * @returns An object with CSS variables for the current theme
 */
export function getThemeVariables(isDark: boolean) {
  return {
    // Background colors
    bgPrimary: isDark ? "#1f2937" : "#ffffff",
    bgSecondary: isDark ? "#111827" : "#f9fafb",
    bgAccent: isDark ? "#2563eb" : "#3b82f6",
    
    // Text colors
    textPrimary: isDark ? "#f9fafb" : "#111827",
    textSecondary: isDark ? "#d1d5db" : "#4b5563",
    textAccent: isDark ? "#60a5fa" : "#2563eb",
    
    // Border colors
    borderColor: isDark ? "#374151" : "#e5e7eb",
    
    // Shadow
    shadowColor: isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)",
  };
}