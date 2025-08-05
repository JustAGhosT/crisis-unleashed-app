import { Faction } from "@/types/faction";
import { FactionCard } from "./FactionCard";

interface FactionGridProps {
  factions: Faction[];
}

export function FactionGrid({ factions }: FactionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {factions.map((faction) => (
        <FactionCard key={faction.id} faction={faction} />
      ))}
    </div>
  );
}