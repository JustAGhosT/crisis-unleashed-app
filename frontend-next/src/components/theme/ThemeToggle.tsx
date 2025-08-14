"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useFeatureFlag } from "@/lib/feature-flags/useFeatureFlag";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isNewThemeEnabled = useFeatureFlag("useNewTheme");

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isNewThemeEnabled) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md ${
          theme === "light"
            ? "bg-blue-100 text-blue-600"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-5 w-5" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md ${
          theme === "dark"
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-5 w-5" />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-md ${
          theme === "system"
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        aria-label="System theme"
      >
        <Monitor className="h-5 w-5" />
      </button>
    </div>
  );
}
