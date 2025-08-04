import React from 'react';
import { Faction } from '@/types/game.types';
import { factionThemes } from '@/theme/factionThemes';
import styles from './FactionCard.module.css';

interface FactionCardProps {
  faction: Faction;
  onClick: () => void;
  onHover: (faction: Faction | null) => void;
  onNavigate?: (faction: Faction) => void;
  isHovered: boolean;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Reusable faction card component for display in various contexts
 */
const FactionCard: React.FC<FactionCardProps> = ({
  faction,
  onClick,
  onHover,
  onNavigate,
  isHovered,
  size = 'medium'
}) => {
  const factionData = factionThemes[faction];
  
  if (!factionData) {
    return null;
  }

  // Get description based on faction
  const description = getFactionDescription(faction);

  return (
    <div 
      className={`${styles.factionCard} ${styles[size]}`}
      onMouseEnter={() => onHover(faction)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <div 
        className={styles.factionEmblem} 
        style={{ borderColor: factionData.colors.primary }}
      >
        <img src={`/assets/factions/${faction}/emblem.svg`} alt={factionData.name} />
      </div>
      <h3 
        className={styles.factionName} 
        style={{ color: factionData.colors.primary }}
      >
        {factionData.name}
      </h3>
      <div className={`${styles.factionDescription} ${isHovered ? styles.visible : ''}`}>
        {description}
      </div>
      <button 
        className={styles.exploreButton}
        style={{ backgroundColor: factionData.colors.primary }}
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the card's onClick
          if (onNavigate) {
            onNavigate(faction);
          }
        }}
        aria-label={`Explore ${factionData.name}`}
      >
        Explore Faction
      </button>
    </div>
  );
};

// Helper function to get faction descriptions
function getFactionDescription(faction: Faction): string {
  const descriptions: Record<Faction, string> = {
    solaris: "Caretakers of the Divine Algorithm, channeling its radiant power to maintain cosmic order and purify corruption.",
    
    umbral: "Masters of shadow technology, exploring the unseen spaces between realities and the power of information manipulation.",
    
    neuralis: "Psychic explorers who harness the collective power of consciousness to transcend physical limitations.",
    
    aeonic: "Temporal architects who perceive and manipulate the flow of time, preserving the integrity of the timeline.",
    
    infernal: "Dimensional engineers who utilize blood sacrifice to power portals between worlds and harness probability manipulation.",
    
    primordial: "Evolutionary accelerators who commune with the biological foundations of reality, guiding life toward its ultimate potential.",
    
    synthetic: "Perfect optimizers who achieve ultimate efficiency through mechanical precision and resource management."
  };
  
  return descriptions[faction];
}

export default FactionCard;