import { Faction } from "@/types/faction";
import Link from "next/link";
import Image from "next/image";
import styles from "./LegacyFactionCard.module.css";

interface LegacyFactionCardProps {
  faction: Faction;
}

export function LegacyFactionCard({ faction }: LegacyFactionCardProps) {
  // Get mechanics from faction.mechanics object (if it exists)
  const getMechanicsList = () => {
    if (!faction.mechanics) return [];
    
    // If mechanics is an object with boolean flags
    if (typeof faction.mechanics === 'object' && !Array.isArray(faction.mechanics)) {
      return Object.entries(faction.mechanics)
        .filter(([_, value]) => Boolean(value))
        .map(([key]) => key);
    }
    
    // If mechanics is already an array of strings
    return Array.isArray(faction.mechanics) ? faction.mechanics : [];
  };

  return (
    <div className={styles.card}>
      <div 
        className={`${styles.header} ${styles[`header_${faction.id}`] || ''}`}
      >
        <Image 
          src={faction.logo || `/images/factions/${faction.id}-logo.svg`} 
          alt={`${faction.name} logo`}
          className={styles.logo}
          width={40}
          height={40}
        />
        <h2 className={styles.title}>{faction.name}</h2>
      </div>
      <div className={styles.content}>
        {faction.description && (
          <p className={styles.description}>{faction.description}</p>
        )}
        
        {faction.mechanics && (
          <div className={styles.mechanics}>
            {getMechanicsList().map((mechanic) => (
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