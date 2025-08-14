"use client";

import React from "react";
import { DeckBuilderProvider } from "@/lib/deck-builder/deck-builder-context";
import DeckBuilderInterface from "./DeckBuilderInterface";

interface DeckBuilderWrapperProps {
  isLoading?: boolean;
}

export default function DeckBuilderWrapper({
  isLoading = false,
}: DeckBuilderWrapperProps) {
  if (isLoading) {
    // Loading state handled by new DeckBuilderInterface
    return <DeckBuilderInterface isLoading={true} />;
  }

  // Always use the new DeckBuilderInterface. Feature flag retained for future toggles if needed.
  return (
    <DeckBuilderProvider initialDeck={undefined}>
      <DeckBuilderInterface isLoading={false} />
    </DeckBuilderProvider>
  );
}
