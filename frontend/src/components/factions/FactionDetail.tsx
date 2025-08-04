import { factionThemes } from '@/theme/factionThemes';
import { Faction } from '@/types/game.types';
import {
  getFactionLongDescription,
  getFactionPhilosophy,
  getFactionStrength,
  getFactionTechnology
} from '@/utils/factionUtils';
import styles from './FactionDetail.module.css';
import React from 'react';

interface FactionDetailProps {
  faction: Faction;
  onClose: () => void;
  onExplore: (faction: Faction) => void;
}export const FactionDetail = ({ faction, onClose, onExplore }: FactionDetailProps) => {
  const theme = factionThemes[faction];

  // Set CSS custom properties for this component
  React.useEffect(() => {
    document.documentElement.style.setProperty('--faction-primary', theme.colors.primary);
    document.documentElement.style.setProperty('--faction-bg-image', `url('/assets/factions/${faction}/background.jpg')`);
    
    return () => {
      document.documentElement.style.removeProperty('--faction-primary');
      document.documentElement.style.removeProperty('--faction-bg-image');
    };
  }, [faction, theme.colors.primary]);

  return (
    <div className={styles.factionDetail}>
      <div className={styles.detailContent}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close detail view"
        >
          ×
        </button><div className={styles.detailHeader}>
          <div className={styles.detailEmblem}>
            <img src={`/assets/factions/${faction}/emblem.svg`} alt={theme.name} />
          </div>
          <h2 className={styles.detailTitle}>
            {theme.name}
          </h2>
        </div>

        <div className={styles.detailBody}>
          <p className={styles.detailDescription}>
            {getFactionLongDescription(faction)}
          </p>
          <div className={styles.detailAttributes}>
            <div className={styles.attributeItem}>
              <span className={styles.attributeLabel}>Core Technology:</span>
              <span className={styles.attributeValue}>{getFactionTechnology(faction)}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeLabel}>Philosophy:</span>
              <span className={styles.attributeValue}>{getFactionPhilosophy(faction)}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeLabel}>Key Strength:</span>
              <span className={styles.attributeValue}>{getFactionStrength(faction)}</span>
            </div>
          </div>
        </div>
        <button
          className={styles.exploreDetailButton}
          onClick={() => onExplore(faction)}
        >
          Explore Full Faction
        </button>
      </div>
    </div>
  );
};