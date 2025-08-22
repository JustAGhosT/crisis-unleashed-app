import React from "react";
import { DeckBuilderClient } from "./DeckBuilderClient";

export default function DeckBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DeckBuilderClient>{children}</DeckBuilderClient>;
}
