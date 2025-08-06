import { Faction } from "@/types/faction";
import { LegacyFactionCard } from "./LegacyFactionCard";

interface LegacyFactionGridProps {
  factions: Faction[];
}

export function LegacyFactionGrid({ factions }: LegacyFactionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {factions.map((faction) => (
        <LegacyFactionCard key={faction.id} faction={faction} />
      ))}
    </div>
  );
}