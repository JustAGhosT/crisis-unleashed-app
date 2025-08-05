import { Faction } from "@/types/faction";
import { LegacyFactionCard } from "./LegacyFactionCard";
import styles from "./LegacyFactionGrid.module.css";

interface FactionGridProps {
  factions: Faction[];
}

export function FactionGrid({ factions }: FactionGridProps) {
  return (
    <div className={styles.grid}>
      {factions.map((faction) => (
        <LegacyFactionCard key={faction.id} faction={faction} />
      ))}
    </div>
  );
}