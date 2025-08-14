"use client";

import React from "react";
import { FactionThemeProvider } from "@/lib/theme/theme-context";
import type { FactionKey } from "@/lib/theme/faction-theme";

export default function FactionThemeRoot({
  initial,
  children,
}: {
  initial: FactionKey;
  children: React.ReactNode;
}) {
  return <FactionThemeProvider initial={initial}>{children}</FactionThemeProvider>;
}
