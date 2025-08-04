import React from 'react';
import { Faction } from '@/types/game.types';
import { factionThemes } from '@/theme/factionThemes';
import FactionCard from './FactionCard';
import styles from './FactionHexagon.module.css';

interface FactionHexagonProps {
  factions: Faction[];
  hoveredFaction: Faction | null;
  focusedFaction: Faction | null;
  onHover: (faction: Faction | null) => void;
  onFocus: (faction: Faction) => void;
  onNavigate: (faction: Faction) => void;
}

/**
 * Component that displays factions in a hexagonal formation
 * with interactive connection lines
 */
const FactionHexagon: React.FC<FactionHexagonProps> = ({
  factions,
  hoveredFaction,
  focusedFaction,
  onHover,
  onFocus,
  onNavigate
}) => {
  // Make sure we have all 7 factions
  if (factions.length !== 7) {
    console.error('FactionHexagon requires exactly 7 factions');
    return null;
  }

  // Helper function to safely get faction colors
  const getFactionColor = (faction: Faction | null, defaultColor = 'rgba(255, 255, 255, 0.7)') => {
    if (!faction || !factionThemes[faction]) {
      return defaultColor;
    }
    return factionThemes[faction].colors.primary;
  };

  const [
    centerFaction,  // Solaris
    topFaction,     // Primordial
    topRightFaction, // Synthetic
    bottomRightFaction, // Infernal
    bottomFaction,  // Aeonic
    bottomLeftFaction, // Neuralis
    topLeftFaction  // Umbral
  ] = factions;

  return (
    <div className={`${styles.hexagonContainer} ${focusedFaction ? styles.hasFocus : ''}`}>
      {/* Center Faction - Solaris */}
      <div className={styles.centerFaction}>
        <FactionCard
          faction={centerFaction}
          onClick={() => onFocus(centerFaction)}
          onHover={onHover}
          onNavigate={onNavigate}
          isHovered={hoveredFaction === centerFaction}
          size="large"
        />
      </div>
      
      {/* Top Faction - Primordial */}
      <div className={styles.topFaction}>
        <FactionCard
          faction={topFaction}
          onClick={() => onFocus(topFaction)}
          onHover={onHover}
          onNavigate={onNavigate}
          isHovered={hoveredFaction === topFaction}
        />
      </div>
      
      {/* Top Right Faction - Synthetic */}
      <div className={styles.topRightFaction}>
        <FactionCard
          faction={topRightFaction}
          onClick={() => onFocus(topRightFaction)}
          onHover={onHover}
          onNavigate={onNavigate}
          isHovered={hoveredFaction === topRightFaction}
        />
      </div>
      
      {/* Bottom Right Faction - Infernal */}
      <div className={styles.bottomRightFaction}>
        <FactionCard
          faction={bottomRightFaction}
          onClick={() => onFocus(bottomRightFaction)}
          onHover={onHover}
          onNavigate={onNavigate}
          isHovered={hoveredFaction === bottomRightFaction}
        />
      </div>
      
      {/* Bottom Faction - Aeonic */}
      <div className={styles.bottomFaction}>
        <FactionCard
          faction={bottomFaction}
          onClick={() => onFocus(bottomFaction)}
          onHover={onHover}
          onNavigate={onNavigate}
          isHovered={hoveredFaction === bottomFaction}
        />
      </div>
      
      {/* Bottom Left Faction - Neuralis */}
      <div className={styles.bottomLeftFaction}>
        <FactionCard
          faction={bottomLeftFaction}
          onClick={() => onFocus(bottomLeftFaction)}
          onHover={onHover}
          onNavigate={onNavigate}
          isHovered={hoveredFaction === bottomLeftFaction}
        />
      </div>
      
      {/* Top Left Faction - Umbral */}
      <div className={styles.topLeftFaction}>
        <FactionCard
          faction={topLeftFaction}
          onClick={() => onFocus(topLeftFaction)}
          onHover={onHover}
          isHovered={hoveredFaction === topLeftFaction}
        />
      </div>
      
      {/* Connection Lines */}
      <svg className={styles.connectionLines} viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet">
        {/* Center point */}
        <circle 
          cx="400" cy="400" r="8" 
          fill={hoveredFaction ? getFactionColor(hoveredFaction) : "white"}
          className={styles.centerNode}
        />
        
        {/* Radial connections from center */}
        <line 
          x1="400" y1="400" x2="400" y2="150" 
          className={`${styles.connectionLine} ${(hoveredFaction === centerFaction || hoveredFaction === topFaction) ? styles.active : ''}`}
          stroke={`url(#center-top)`}
        />
        <line 
          x1="400" y1="400" x2="625" y2="250"
          className={`${styles.connectionLine} ${(hoveredFaction === centerFaction || hoveredFaction === topRightFaction) ? styles.active : ''}`}
          stroke={`url(#center-topRight)`}
        />
        <line 
          x1="400" y1="400" x2="625" y2="550"
          className={`${styles.connectionLine} ${(hoveredFaction === centerFaction || hoveredFaction === bottomRightFaction) ? styles.active : ''}`}
          stroke={`url(#center-bottomRight)`} 
        />
        <line 
          x1="400" y1="400" x2="400" y2="650" 
          className={`${styles.connectionLine} ${(hoveredFaction === centerFaction || hoveredFaction === bottomFaction) ? styles.active : ''}`}
          stroke={`url(#center-bottom)`}
        />
        <line 
          x1="400" y1="400" x2="175" y2="550" 
          className={`${styles.connectionLine} ${(hoveredFaction === centerFaction || hoveredFaction === bottomLeftFaction) ? styles.active : ''}`}
          stroke={`url(#center-bottomLeft)`}
        />
        <line 
          x1="400" y1="400" x2="175" y2="250" 
          className={`${styles.connectionLine} ${(hoveredFaction === centerFaction || hoveredFaction === topLeftFaction) ? styles.active : ''}`}
          stroke={`url(#center-topLeft)`}
        />
        
        {/* Outer hexagon connections */}
        <line 
          x1="175" y1="250" x2="400" y2="150" 
          className={`${styles.connectionLine} ${(hoveredFaction === topLeftFaction || hoveredFaction === topFaction) ? styles.active : ''}`}
          stroke={`url(#topLeft-top)`}
        />
        <line 
          x1="400" y1="150" x2="625" y2="250" 
          className={`${styles.connectionLine} ${(hoveredFaction === topFaction || hoveredFaction === topRightFaction) ? styles.active : ''}`}
          stroke={`url(#top-topRight)`}
        />
        <line 
          x1="625" y1="250" x2="625" y2="550" 
          className={`${styles.connectionLine} ${(hoveredFaction === topRightFaction || hoveredFaction === bottomRightFaction) ? styles.active : ''}`}
          stroke={`url(#topRight-bottomRight)`}
        />
        <line 
          x1="625" y1="550" x2="400" y2="650" 
          className={`${styles.connectionLine} ${(hoveredFaction === bottomRightFaction || hoveredFaction === bottomFaction) ? styles.active : ''}`}
          stroke={`url(#bottomRight-bottom)`}
        />
        <line 
          x1="400" y1="650" x2="175" y2="550" 
          className={`${styles.connectionLine} ${(hoveredFaction === bottomFaction || hoveredFaction === bottomLeftFaction) ? styles.active : ''}`}
          stroke={`url(#bottom-bottomLeft)`}
        />
        <line 
          x1="175" y1="550" x2="175" y2="250" 
          className={`${styles.connectionLine} ${(hoveredFaction === bottomLeftFaction || hoveredFaction === topLeftFaction) ? styles.active : ''}`}
          stroke={`url(#bottomLeft-topLeft)`}
        />
        
        {/* Gradients for connection lines */}
        <defs>
          {/* Radial connections */}
          <linearGradient id="center-top" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getFactionColor(centerFaction)} />
            <stop offset="100%" stopColor={getFactionColor(topFaction)} />
          </linearGradient>
          <linearGradient id="center-topRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getFactionColor(centerFaction)} />
            <stop offset="100%" stopColor={getFactionColor(topRightFaction)} />
          </linearGradient>
          <linearGradient id="center-bottomRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getFactionColor(centerFaction)} />
            <stop offset="100%" stopColor={getFactionColor(bottomRightFaction)} />
          </linearGradient>
          <linearGradient id="center-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getFactionColor(centerFaction)} />
            <stop offset="100%" stopColor={getFactionColor(bottomFaction)} />
          </linearGradient>
          <linearGradient id="center-bottomLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getFactionColor(centerFaction)} />
            <stop offset="100%" stopColor={getFactionColor(bottomLeftFaction)} />
          </linearGradient>
          <linearGradient id="center-topLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getFactionColor(centerFaction)} />
            <stop offset="100%" stopColor={getFactionColor(topLeftFaction)} />
          </linearGradient>
          
          {/* Outer hexagon connections */}
          <linearGradient id="topLeft-top" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getFactionColor(topLeftFaction)} />
            <stop offset="100%" stopColor={getFactionColor(topFaction)} />
          </linearGradient>
          <linearGradient id="top-topRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getFactionColor(topFaction)} />
            <stop offset="100%" stopColor={getFactionColor(topRightFaction)} />
          </linearGradient>
          <linearGradient id="topRight-bottomRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getFactionColor(topRightFaction)} />
            <stop offset="100%" stopColor={getFactionColor(bottomRightFaction)} />
          </linearGradient>
          <linearGradient id="bottomRight-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getFactionColor(bottomRightFaction)} />
            <stop offset="100%" stopColor={getFactionColor(bottomFaction)} />
          </linearGradient>
          <linearGradient id="bottom-bottomLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getFactionColor(bottomFaction)} />
            <stop offset="100%" stopColor={getFactionColor(bottomLeftFaction)} />
          </linearGradient>
          <linearGradient id="bottomLeft-topLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getFactionColor(bottomLeftFaction)} />
            <stop offset="100%" stopColor={getFactionColor(topLeftFaction)} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default FactionHexagon;