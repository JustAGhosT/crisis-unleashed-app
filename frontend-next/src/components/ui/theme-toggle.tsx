"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFeatureFlag } from "@/lib/feature-flags/useFeatureFlag";

export type ThemeToggleVariant = "dropdown" | "buttons";

interface ThemeToggleProps {
  /**
   * Display variant - 'dropdown' shows a menu, 'buttons' shows inline buttons
   */
  variant?: ThemeToggleVariant;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Show system theme option
   */
  showSystemOption?: boolean;
  /**
   * Require feature flag to be enabled
   */
  requireFeatureFlag?: boolean;
}

export function ThemeToggle({
  variant = "dropdown",
  className = "",
  showSystemOption = true,
  requireFeatureFlag = false,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isNewThemeEnabled = useFeatureFlag("useNewTheme");

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render if not mounted or if feature flag is required but not enabled
  if (!mounted || (requireFeatureFlag && !isNewThemeEnabled)) {
    return null;
  }

  if (variant === "buttons") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <button
          onClick={() => setTheme("light")}
          className={`p-2 rounded-md transition-colors ${
            theme === "light"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
          aria-label="Light theme"
          type="button"
        >
          <Sun className="h-5 w-5" />
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={`p-2 rounded-md transition-colors ${
            theme === "dark"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
          aria-label="Dark theme"
          type="button"
        >
          <Moon className="h-5 w-5" />
        </button>

        {showSystemOption && (
          <button
            onClick={() => setTheme("system")}
            className={`p-2 rounded-md transition-colors ${
              theme === "system"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            aria-label="System theme"
            type="button"
          >
            <Monitor className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        {showSystemOption && (
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            System
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// For backward compatibility, export the old component names
export { ThemeToggle as ModeToggle };
export default ThemeToggle;