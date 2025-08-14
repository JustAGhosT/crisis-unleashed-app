"use client";

import React from "react";

/**
 * Provides CSS variables for chart components (Recharts, etc.).
 * Variables:
 *  --chart-text-color
 *  --tooltip-bg
 *  --tooltip-border
 *  --tooltip-text
 */
export function ChartThemeVars({ children }: { children: React.ReactNode }) {
  return <div className="chart-theme">{children}</div>;
}
