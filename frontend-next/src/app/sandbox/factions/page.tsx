"use client";

import * as React from "react";
import { Faction, FactionId } from "@/types/faction";
import { FactionHexagon } from "@/components/factions/FactionHexagon";
import FactionDetail from "@/components/factions/FactionDetail";
import { cn } from "@/lib/utils";

const mock = (id: FactionId, name: string, colors: { primary: string; secondary: string; accent: string }): Faction => ({
  id,
  name,
  tagline: `Tagline of ${name}`,
  description: `${name} is a placeholder description for visual verification of hexagon and detail components.`,
  philosophy: "Calculated ambition",
  strength: "Synergistic advantage",
  technology: "Quantum resonators",
  mechanics: {},
  colors,
});

const MOCK_FACTIONS: Faction[] = [
  mock("solaris", "Solaris Nexus", { primary: "#f59e0b", secondary: "#fde68a", accent: "#fbbf24" }),
  mock("primordial", "Primordial Genesis", { primary: "#10b981", secondary: "#6ee7b7", accent: "#34d399" }),
  mock("synthetic", "Synthetic Directive", { primary: "#06b6d4", secondary: "#67e8f9", accent: "#22d3ee" }),
  mock("infernal", "Infernal Core", { primary: "#ef4444", secondary: "#fecaca", accent: "#fb7185" }),
  mock("aeonic", "Aeonic Dominion", { primary: "#6366f1", secondary: "#c7d2fe", accent: "#60a5fa" }),
  mock("neuralis", "Neuralis Conclave", { primary: "#ec4899", secondary: "#fbcfe8", accent: "#f472b6" }),
  mock("umbral", "Umbral Eclipse", { primary: "#8b5cf6", secondary: "#ddd6fe", accent: "#a78bfa" }),
];

export default function FactionSandboxPage() {
  const [focused, setFocused] = React.useState<Faction | null>(null);

  return (
    <div className={cn("container mx-auto space-y-8 py-6")}> 
      <section>
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Faction Hexagon</h2>
        <FactionHexagon
          factions={MOCK_FACTIONS}
          hoveredFaction={null}
          focusedFaction={focused}
          onHover={() => {}}
          onFocus={(f) => setFocused(f)}
        />
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Faction Detail</h2>
        <FactionDetail
          faction={focused ?? MOCK_FACTIONS[0]}
          onClose={() => setFocused(null)}
        />
      </section>
    </div>
  );
}
