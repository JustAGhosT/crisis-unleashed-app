"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FeatureGate } from "@/components/feature-flags/FeatureGate";
import Link from "next/link";

export default function ThemeSettingsPage() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse">Loading theme settings...</div>
      </div>
    );
  }

  // Legacy theme settings (simple)
  const LegacyThemeSettings = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
      <p className="text-gray-600 mb-6">
        Theme settings are not available in the current version.
      </p>
      <Link href={"/settings" as import("next").Route} className="text-blue-600 hover:text-blue-800">
        Back to Settings
      </Link>
    </div>
  );

  // New theme settings with enhanced options
  const NewThemeSettings = () => {
    const currentTheme = theme === "system" ? `system (${systemTheme})` : theme;
    const [reducedMotion, setReducedMotion] = useState<boolean>(false);
    const [highContrast, setHighContrast] = useState<boolean>(false);

    // Initialize from localStorage and system prefs (client-only)
    useEffect(() => {
      try {
        const rmStored = typeof window !== "undefined" ? localStorage.getItem("reduced-motion") : null;
        const hcStored = typeof window !== "undefined" ? localStorage.getItem("high-contrast") : null;
        // System prefers-reduced-motion
        const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const initialRM = rmStored !== null ? rmStored === "true" : !!prefersReduced;
        const initialHC = hcStored !== null ? hcStored === "true" : false;
        setReducedMotion(initialRM);
        setHighContrast(initialHC);
      } catch {
        // ignore
      }
    }, []);

    // Apply document root classes and persist on change
    useEffect(() => {
      if (typeof document === "undefined") return;
      const root = document.documentElement;
      if (reducedMotion) {
        root.classList.add("reduced-motion");
      } else {
        root.classList.remove("reduced-motion");
      }
      try { localStorage.setItem("reduced-motion", String(reducedMotion)); } catch {}
    }, [reducedMotion]);

    useEffect(() => {
      if (typeof document === "undefined") return;
      const root = document.documentElement;
      if (highContrast) {
        root.classList.add("high-contrast");
      } else {
        root.classList.remove("high-contrast");
      }
      try { localStorage.setItem("high-contrast", String(highContrast)); } catch {}
    }, [highContrast]);

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Theme Settings</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Customize the appearance of Crisis Unleashed to match your
            preferences.
          </p>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3 dark:text-white">Current Theme</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              You&#39;re currently using the {" "}
              <span className="font-semibold">{currentTheme}</span> theme.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3 dark:text-white">Select Theme</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ThemeOption
                name="Light"
                description="Clean, bright interface"
                selected={theme === "light"}
                onClick={() => setTheme("light")}
              />
              <ThemeOption
                name="Dark"
                description="Reduced eye strain, perfect for night"
                selected={theme === "dark"}
                onClick={() => setTheme("dark")}
              />
              <ThemeOption
                name="System"
                description="Follows your device settings"
                selected={theme === "system"}
                onClick={() => setTheme("system")}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3 dark:text-white">Theme Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Light Theme</h4>
                <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-800">Preview Content</span>
                </div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-gray-100 mb-2">Dark Theme</h4>
                <div className="h-20 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-gray-200">Preview Content</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Link
              href={"/settings" as import("next").Route}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Back to Settings
            </Link>
            <button
              onClick={() => setTheme("system")}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            >
              Reset to System Default
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Advanced Settings</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Additional theme customization options.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 id="reduced-motion-label" className="font-medium dark:text-white">
                  Reduced Motion
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Minimize animations throughout the interface
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="reduced-motion"
                  name="reduced-motion"
                  className="sr-only"
                  aria-labelledby="reduced-motion-label"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                />
                <label htmlFor="reduced-motion" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer">
                  <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out"></span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 id="high-contrast-label" className="font-medium dark:text-white">
                  High Contrast
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Increase contrast for better readability
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="high-contrast"
                  name="high-contrast"
                  className="sr-only"
                  aria-labelledby="high-contrast-label"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
                <label htmlFor="high-contrast" className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer">
                  <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Appearance Settings</h1>

      <FeatureGate flag="useNewTheme" fallback={<LegacyThemeSettings />}>
        <NewThemeSettings />
      </FeatureGate>
    </div>
  );
}

function ThemeOption({
  name,
  description,
  selected,
  onClick,
}: {
  name: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`border rounded-lg p-4 text-left transition-all ${
        selected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500"
          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
    >
      <h3 className={`font-medium ${selected ? "text-blue-600 dark:text-blue-400" : "dark:text-white"}`}>
        {name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
    </button>
  );
}
