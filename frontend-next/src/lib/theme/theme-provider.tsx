"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

/**
 * Theme provider component that wraps the application to provide theme context
 * Uses next-themes for theme management with SSR support
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
