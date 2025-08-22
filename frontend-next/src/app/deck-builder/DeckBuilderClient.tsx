"use client";

import React from "react";
import { DeckBuilderProvider } from "@/lib/deck-builder/deck-builder-context";

export function DeckBuilderClient({ children }: { children: React.ReactNode }) {
  return <DeckBuilderProvider>{children}</DeckBuilderProvider>;
}
