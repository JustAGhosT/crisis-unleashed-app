import { Faction } from "@/types/faction";
import Link from "next/link";
import styles from "./LegacyFactionCard.module.css";

interface LegacyFactionCardProps {
  faction: Faction;
}

export function LegacyFactionCard({ faction }: LegacyFactionCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header} style={{ backgroundColor: faction.color }}>
        <img 
          src={faction.logo || `/images/factions/${faction.id}-logo.svg`} 
          alt={`${faction.name} logo`}
          className={styles.logo}
        />
        <h2 className={styles.title}>{faction.name}</h2>
      </div>
      <div className={styles.content}>
        <p className={styles.description}>{faction.description}</p>
        
        {faction.mechanics && (
          <div className={styles.mechanics}>
            {faction.mechanics.map((mechanic) => (
              <span key={mechanic} className={styles.mechanic}>
                {mechanic}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <Link href={`/factions/${faction.id}`} className={styles.button}>
          View Details
        </Link>
      </div>
    </div>
  );
}