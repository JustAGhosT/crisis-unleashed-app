import React, { useState, useEffect } from 'react';
import { Faction } from '@/types/game.types';
import { useNavigate } from 'react-router-dom';
import { factionThemes } from '@/theme/factionThemes';
import styles from './FactionsHub.module.css';

/**
 * Central hub page for accessing all faction content
 * Features the Universal Program Formation layout
 */
const FactionsHub: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredFaction, setHoveredFaction] = useState<Faction | null>(null);
  const [activeFaction, setActiveFaction] = useState<Faction | null>(null);

  // For the pulsing connection lines effect
  useEffect(() => {
    if (hoveredFaction) {
      setActiveFaction(hoveredFaction);
      const timer = setTimeout(() => {
        setActiveFaction(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hoveredFaction]);
  
  // Handle faction click
  const navigateToFaction = (faction: Faction) => {
    navigate(`/${faction}`);
  };
  
  // Helper function to safely get a faction color
  const getFactionColor = (faction: Faction | null, defaultColor = 'rgba(255, 255, 255, 0.7)') => {
    if (!faction || !factionThemes[faction]) {
      return defaultColor;
    }
    return factionThemes[faction].colors.primary;
  };

  return (
    <div className={styles.hubContainer}>
      <div className={styles.heroSection}>
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          <h1 className={styles.title}>The Factions of Crisis Unleashed</h1>
          <p className={styles.subtitle}>
            Seven fragments of one truth, seven paths to one destination
          </p>
        </div>
      </div>
      
      <div className={styles.introSection}>
        <div className={styles.introContent}>
          <h2>The Universal Program</h2>
          <p>
            Each faction represents a unique component of the Universal Program, with distinct
            philosophies, technologies, and aesthetic identities. Explore their histories, heroes, and visual
            designs to discover which calls to you.
          </p>
          <p>
            Choose your allegiance wisely, for the fate of the universe may depend on your choice.
          </p>
        </div>
      </div>
      
      {/* Universal Program Formation */}
      <div className={styles.programWrapper}>
        <div className={styles.universalProgram}>
          {/* Center Faction - Solaris */}
          <div 
            className={styles.centerFaction}
            onMouseEnter={() => setHoveredFaction('solaris')}
            onMouseLeave={() => setHoveredFaction(null)}
            onClick={() => navigateToFaction('solaris')}
          >
            <div className={styles.factionContent}>
              <div className={styles.factionEmblem} style={{ borderColor: getFactionColor('solaris') }}>
                <img src="/assets/factions/solaris/emblem.svg" alt="Solaris Nexus" />
              </div>
              <h3 className={styles.factionName} style={{ color: getFactionColor('solaris') }}>
                Solaris Nexus
              </h3>
              <p className={`${styles.factionDescription} ${hoveredFaction === 'solaris' ? styles.visible : ''}`}>
                Caretakers of the Divine Algorithm, channeling its radiant power to maintain cosmic order and purify corruption.
              </p>
              <button 
                className={styles.exploreButton}
                style={{ backgroundColor: getFactionColor('solaris') }}
              >
                Explore Faction
              </button>
            </div>
          </div>
          
          {/* Hexagon Positions - Clockwise from top */}
          <div 
            className={`${styles.factionNode} ${styles.topPosition}`}
            onMouseEnter={() => setHoveredFaction('primordial')}
            onMouseLeave={() => setHoveredFaction(null)}
            onClick={() => navigateToFaction('primordial')}
          >
            <div className={styles.factionContent}>
              <div className={styles.factionEmblem} style={{ borderColor: getFactionColor('primordial') }}>
                <img src="/assets/factions/primordial/emblem.svg" alt="Primordial Genesis" />
              </div>
              <h3 className={styles.factionName} style={{ color: getFactionColor('primordial') }}>
                Primordial Genesis
              </h3>
              <p className={`${styles.factionDescription} ${hoveredFaction === 'primordial' ? styles.visible : ''}`}>
                Evolutionary accelerators who commune with the biological foundations of reality, guiding life toward its ultimate potential.
              </p>
              <button 
                className={styles.exploreButton}
                style={{ backgroundColor: getFactionColor('primordial') }}
              >
                Explore Faction
              </button>
            </div>
          </div>
          
          <div 
            className={`${styles.factionNode} ${styles.topRightPosition}`}
            onMouseEnter={() => setHoveredFaction('synthetic')}
            onMouseLeave={() => setHoveredFaction(null)}
            onClick={() => navigateToFaction('synthetic')}
          >
            <div className={styles.factionContent}>
              <div className={styles.factionEmblem} style={{ borderColor: getFactionColor('synthetic') }}>
                <img src="/assets/factions/synthetic/emblem.svg" alt="Synthetic Directive" />
              </div>
              <h3 className={styles.factionName} style={{ color: getFactionColor('synthetic') }}>
                Synthetic Directive
              </h3>
              <p className={`${styles.factionDescription} ${hoveredFaction === 'synthetic' ? styles.visible : ''}`}>
                Perfect optimizers who achieve ultimate efficiency through mechanical precision and resource management.
              </p>
              <button 
                className={styles.exploreButton}
                style={{ backgroundColor: getFactionColor('synthetic') }}
              >
                Explore Faction
              </button>
            </div>
          </div>
          
          <div 
            className={`${styles.factionNode} ${styles.bottomRightPosition}`}
            onMouseEnter={() => setHoveredFaction('infernal')}
            onMouseLeave={() => setHoveredFaction(null)}
            onClick={() => navigateToFaction('infernal')}
          >
            <div className={styles.factionContent}>
              <div className={styles.factionEmblem} style={{ borderColor: getFactionColor('infernal') }}>
                <img src="/assets/factions/infernal/emblem.svg" alt="Infernal Core" />
              </div>
              <h3 className={styles.factionName} style={{ color: getFactionColor('infernal') }}>
                Infernal Core
              </h3>
              <p className={`${styles.factionDescription} ${hoveredFaction === 'infernal' ? styles.visible : ''}`}>
                Dimensional engineers who utilize blood sacrifice to power portals between worlds and harness probability manipulation.
              </p>
              <button 
                className={styles.exploreButton}
                style={{ backgroundColor: getFactionColor('infernal') }}
              >
                Explore Faction
              </button>
            </div>
          </div>
          
          <div 
            className={`${styles.factionNode} ${styles.bottomPosition}`}
            onMouseEnter={() => setHoveredFaction('aeonic')}
            onMouseLeave={() => setHoveredFaction(null)}
            onClick={() => navigateToFaction('aeonic')}
          >
            <div className={styles.factionContent}>
              <div className={styles.factionEmblem} style={{ borderColor: getFactionColor('aeonic') }}>
                <img src="/assets/factions/aeonic/emblem.svg" alt="Aeonic Dominion" />
              </div>
              <h3 className={styles.factionName} style={{ color: getFactionColor('aeonic') }}>
                Aeonic Dominion
              </h3>
              <p className={`${styles.factionDescription} ${hoveredFaction === 'aeonic' ? styles.visible : ''}`}>
                Temporal architects who perceive and manipulate the flow of time, preserving the integrity of the timeline.
              </p>
              <button 
                className={styles.exploreButton}
                style={{ backgroundColor: getFactionColor('aeonic') }}
              >
                Explore Faction
              </button>
            </div>
          </div>
          
          <div 
            className={`${styles.factionNode} ${styles.bottomLeftPosition}`}
            onMouseEnter={() => setHoveredFaction('neuralis')}
            onMouseLeave={() => setHoveredFaction(null)}
            onClick={() => navigateToFaction('neuralis')}
          >
            <div className={styles.factionContent}>
              <div className={styles.factionEmblem} style={{ borderColor: getFactionColor('neuralis') }}>
                <img src="/assets/factions/neuralis/emblem.svg" alt="Neuralis Conclave" />
              </div>
              <h3 className={styles.factionName} style={{ color: getFactionColor('neuralis') }}>
                Neuralis Conclave
              </h3>
              <p className={`${styles.factionDescription} ${hoveredFaction === 'neuralis' ? styles.visible : ''}`}>
                Psychic explorers who harness the collective power of consciousness to transcend physical limitations.
              </p>
              <button 
                className={styles.exploreButton}
                style={{ backgroundColor: getFactionColor('neuralis') }}
              >
                Explore Faction
              </button>
            </div>
          </div>
          
          <div 
            className={`${styles.factionNode} ${styles.topLeftPosition}`}
            onMouseEnter={() => setHoveredFaction('umbral')}
            onMouseLeave={() => setHoveredFaction(null)}
            onClick={() => navigateToFaction('umbral')}
          >
            <div className={styles.factionContent}>
              <div className={styles.factionEmblem} style={{ borderColor: getFactionColor('umbral') }}>
                <img src="/assets/factions/umbral/emblem.svg" alt="Umbral Eclipse" />
              </div>
              <h3 className={styles.factionName} style={{ color: getFactionColor('umbral') }}>
                Umbral Eclipse
              </h3>
              <p className={`${styles.factionDescription} ${hoveredFaction === 'umbral' ? styles.visible : ''}`}>
                Masters of shadow technology, exploring the unseen spaces between realities and the power of information manipulation.
              </p>
              <button 
                className={styles.exploreButton}
                style={{ backgroundColor: getFactionColor('umbral') }}
              >
                Explore Faction
              </button>
            </div>
          </div>
          
          {/* Connection Lines */}
          <div className={styles.connectionLines}>
            {/* Radial lines from center to each faction */}
            <div className={`${styles.connectionLine} ${styles.lineTop} ${hoveredFaction === 'primordial' || hoveredFaction === 'solaris' ? styles.active : ''}`} 
                style={{ background: `linear-gradient(to top, ${getFactionColor('solaris')}, ${getFactionColor('primordial')})` }}></div>
                
            <div className={`${styles.connectionLine} ${styles.lineTopRight} ${hoveredFaction === 'synthetic' || hoveredFaction === 'solaris' ? styles.active : ''}`} 
                style={{ background: `linear-gradient(to top right, ${getFactionColor('solaris')}, ${getFactionColor('synthetic')})` }}></div>
                
            <div className={`${styles.connectionLine} ${styles.lineBottomRight} ${hoveredFaction === 'infernal' || hoveredFaction === 'solaris' ? styles.active : ''}`} 
                style={{ background: `linear-gradient(to bottom right, ${getFactionColor('solaris')}, ${getFactionColor('infernal')})` }}></div>
                
            <div className={`${styles.connectionLine} ${styles.lineBottom} ${hoveredFaction === 'aeonic' || hoveredFaction === 'solaris' ? styles.active : ''}`} 
                style={{ background: `linear-gradient(to bottom, ${getFactionColor('solaris')}, ${getFactionColor('aeonic')})` }}></div>
                
            <div className={`${styles.connectionLine} ${styles.lineBottomLeft} ${hoveredFaction === 'neuralis' || hoveredFaction === 'solaris' ? styles.active : ''}`} 
                style={{ background: `linear-gradient(to bottom left, ${getFactionColor('solaris')}, ${getFactionColor('neuralis')})` }}></div>
                
            <div className={`${styles.connectionLine} ${styles.lineTopLeft} ${hoveredFaction === 'umbral' || hoveredFaction === 'solaris' ? styles.active : ''}`} 
                style={{ background: `linear-gradient(to top left, ${getFactionColor('solaris')}, ${getFactionColor('umbral')})` }}></div>
            
            {/* Outer hexagon lines connecting the factions */}
            <div className={`${styles.connectionLine} ${styles.lineHexTop} ${hoveredFaction === 'primordial' || hoveredFaction === 'umbral' ? styles.active : ''}`} 
                style={{ background: `linear-gradient(to right, ${getFactionColor('umbral')}, ${getFactionColor('primordial')})` }}></div>
                
            <div className={`${styles.connectionLine} ${styles.lineHexTopRight} ${hoveredFaction === 'primordial' || hoveredFaction === 'synthetic' ? styles.active : ''}`} 
                style={{ background: `linear-gradient(to bottom right, ${getFactionColor('primordial')}, ${getFactionColor('synthetic')})` }}></div>
                
            <div className={`${styles.connectionLine} ${styles.lineHexBottomRight} ${hoveredFaction === 'synthetic' || hoveredFaction === 'infernal' ? styles.active : ''}`} 
                style={{ background: `linear-gradient(to bottom, ${getFactionColor('synthetic')}, ${getFactionColor('infernal')})` }}></div>
                
            <div className={`${styles.connectionLine} ${styles.lineHexBottom} ${hoveredFaction === 'infernal' || hoveredFaction === 'aeonic' ? styles.active : ''}`} 
                style={{ background: `linear-gradient(to left, ${getFactionColor('infernal')}, ${getFactionColor('aeonic')})` }}></div>
                
            <div className={`${styles.connectionLine} ${styles.lineHexBottomLeft} ${hoveredFaction === 'aeonic' || hoveredFaction === 'neuralis' ? styles.active : ''}`} 
                style={{ background: `linear-gradient(to top left, ${getFactionColor('aeonic')}, ${getFactionColor('neuralis')})` }}></div>
                
            <div className={`${styles.connectionLine} ${styles.lineHexTopLeft} ${hoveredFaction === 'neuralis' || hoveredFaction === 'umbral' ? styles.active : ''}`} 
                style={{ background: `linear-gradient(to top, ${getFactionColor('neuralis')}, ${getFactionColor('umbral')})` }}></div>
            
            {/* Central nexus */}
            <div 
              className={styles.centerNexus} 
              style={{ 
                backgroundColor: hoveredFaction ? getFactionColor(hoveredFaction) : 'rgba(255, 255, 255, 0.7)',
                boxShadow: hoveredFaction ? `0 0 20px ${getFactionColor(hoveredFaction)}` : '0 0 20px rgba(255, 255, 255, 0.3)' 
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className={styles.timelineSection}>
        <h2>Universal Timeline</h2>
        <p>
          The struggle between factions occurs across a vast timeline of universal history.
          Explore key events and conflicts that shaped their development.
        </p>
        <button 
          className={styles.timelineButton}
          onClick={() => navigate('/timeline')}
        >
          View Complete Timeline
        </button>
      </div>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>Crisis Unleashed - Factions Portal</p>
          <p className={styles.copyright}>© 2025 Crisis Unleashed. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FactionsHub;