"use client";

import Link from "next/link";
import { useFeatureFlag } from "@/lib/feature-flags/useFeatureFlag";
import { useSafeTheme } from "@/lib/theme/theme-utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const isNewThemeEnabled = useFeatureFlag("useNewTheme");
  const { isDark } = useSafeTheme();
  
  // Determine footer classes based on theme
  const footerClasses = isNewThemeEnabled
    ? isDark 
      ? "bg-gray-900 text-white" 
      : "bg-gray-100 text-gray-800"
    : "bg-gray-800 text-white"; // Original styling
  
  // Determine link classes based on theme
  const linkClasses = isNewThemeEnabled
    ? isDark 
      ? "text-gray-300 hover:text-white transition" 
      : "text-gray-600 hover:text-gray-900 transition"
    : "text-gray-300 hover:text-white transition"; // Original styling
  
  // Determine border classes based on theme
  const borderClasses = isNewThemeEnabled
    ? isDark 
      ? "border-gray-800" 
      : "border-gray-200"
    : "border-gray-700"; // Original styling
  
  // Determine text color for copyright
  const copyrightClasses = isNewThemeEnabled
    ? isDark 
      ? "text-gray-400" 
      : "text-gray-500"
    : "text-gray-400"; // Original styling
  
  return (
    <footer className={`${footerClasses} py-8 transition-colors duration-200`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Crisis Unleashed</h3>
            <p className={linkClasses}>
              A strategic card game set in a dystopian future where factions battle for control.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className={linkClasses}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/factions" className={linkClasses}>
                  Factions
                </Link>
              </li>
              <li>
                <Link href="/cards" className={linkClasses}>
                  Cards
                </Link>
              </li>
              <li>
                <Link href="/rules" className={linkClasses}>
                  Game Rules
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className={linkClasses}>
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className={linkClasses}>
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className={linkClasses}>
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t ${borderClasses} mt-8 pt-6 text-center ${copyrightClasses}`}>
          <p>© {currentYear} Crisis Unleashed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}