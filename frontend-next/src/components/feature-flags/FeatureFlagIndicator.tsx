"use client";

import { useFeatureFlags } from "@/lib/feature-flags/feature-flag-provider";
import { useState } from "react";
import Link from "next/link";

/**
 * A component that displays an indicator for active feature flags
 * Useful for developers and testers to quickly see which experimental features are enabled
 */
export default function FeatureFlagIndicator() {
  const { flags } = useFeatureFlags();
  const [isExpanded, setIsExpanded] = useState(false);

  // Count active flags
  const activeFlags = Object.entries(flags).filter(([, enabled]) => enabled);
  const activeFlagCount = activeFlags.length;

  // If no flags are active, don't render anything
  if (activeFlagCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-sm">Active Feature Flags</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <ul className="space-y-2 mb-3">
            {activeFlags.map(([flag]) => (
              <li key={flag} className="text-xs flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="font-mono">{flag}</span>
              </li>
            ))}
          </ul>

          <div className="text-center">
            <Link
              href="/admin/feature-flags"
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Manage Flags
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
          title="Feature flags active"
        >
          <span className="sr-only">Feature flags active</span>
          <span className="text-xs font-bold">{activeFlagCount}</span>
        </button>
      )}
    </div>
  );
}
