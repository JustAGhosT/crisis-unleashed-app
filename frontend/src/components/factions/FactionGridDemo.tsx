import React, { useState } from 'react';
import { Faction } from '@/types/game.types';
import { FactionGrid, FactionPosition } from './FactionGrid';
import FactionCard from './FactionCard';
import styles from './FactionGridDemo.module.css';

/**
 * Demo component showing how to use FactionGrid with connection animations
 */
export const FactionGridDemo = () => {
  const [hoveredFaction, setHoveredFaction] = useState<Faction | null>(null);
  const [showConnections, setShowConnections] = useState(true);

  const factions: Faction[] = ['solaris', 'primordial', 'synthetic', 'infernal', 'aeonic', 'neuralis', 'umbral'];

  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoControls}>
        <button 
          onClick={() => setShowConnections(!showConnections)}
          className={`${styles.toggleButton} ${showConnections ? styles.active : styles.inactive}`}
        >
          {showConnections ? 'Hide' : 'Show'} Connections
        </button>
      </div>
      
      <FactionGrid showConnections={showConnections} hoveredFaction={hoveredFaction}>
        <FactionPosition position="center">
          <FactionCard
            faction={factions[0]}
            onClick={() => console.log('Clicked center')}
            onHover={setHoveredFaction}
            isHovered={hoveredFaction === factions[0]}
            size="large"
          />
        </FactionPosition>
        
        <FactionPosition position="top">
          <FactionCard
            faction={factions[1]}
            onClick={() => console.log('Clicked top')}
            onHover={setHoveredFaction}
            isHovered={hoveredFaction === factions[1]}
          />
        </FactionPosition>
        
        <FactionPosition position="topRight">
          <FactionCard
            faction={factions[2]}
            onClick={() => console.log('Clicked topRight')}
            onHover={setHoveredFaction}
            isHovered={hoveredFaction === factions[2]}
          />
        </FactionPosition>
        
        <FactionPosition position="bottomRight">
          <FactionCard
            faction={factions[3]}
            onClick={() => console.log('Clicked bottomRight')}
            onHover={setHoveredFaction}
            isHovered={hoveredFaction === factions[3]}
          />
        </FactionPosition>
        
        <FactionPosition position="bottom">
          <FactionCard
            faction={factions[4]}
            onClick={() => console.log('Clicked bottom')}
            onHover={setHoveredFaction}
            isHovered={hoveredFaction === factions[4]}
          />
        </FactionPosition>
        
        <FactionPosition position="bottomLeft">
          <FactionCard
            faction={factions[5]}
            onClick={() => console.log('Clicked bottomLeft')}
            onHover={setHoveredFaction}
            isHovered={hoveredFaction === factions[5]}
          />
        </FactionPosition>
        
        <FactionPosition position="topLeft">
          <FactionCard
            faction={factions[6]}
            onClick={() => console.log('Clicked topLeft')}
            onHover={setHoveredFaction}
            isHovered={hoveredFaction === factions[6]}
          />
        </FactionPosition>
      </FactionGrid>
    </div>
  );
};