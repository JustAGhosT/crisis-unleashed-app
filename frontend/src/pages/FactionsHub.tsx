import {
  DescriptionSection,
  FactionDetail,
  FactionHexagon,
  Footer,
  Header,
  TimelineSection
} from '@/components/factions';
import { Faction } from '@/types/game.types';
import { getFactionsList } from '@/utils/factionUtils';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FactionsHub.module.css';

/**
 * Central hub page for accessing all faction content
 */
export const FactionsHub: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredFaction, setHoveredFaction] = useState<Faction | null>(null);
  const [focusedFaction, setFocusedFaction] = useState<Faction | null>(null);

  // List of all factions for rendering
  const allFactions = getFactionsList();

  // Handle faction click
  const navigateToFaction = (faction: Faction) => {
    navigate(`/${faction}`);
  };

  // Handle faction focus/detail view
  const toggleFactionFocus = (faction: Faction) => {
    if (focusedFaction === faction) {
      setFocusedFaction(null);
    } else {
      setFocusedFaction(faction);
    }
  };

  // Clear focus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.factionDetail}`) &&
        !target.closest(`.${styles.factionHexagon}`)) {
        setFocusedFaction(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container} data-testid="factions-hub">
      <Header title="The Factions of Crisis Unleashed" />

      <div className={styles.mainContent}>
        {/* Hexagonal layout with all seven factions */}
        <FactionHexagon
          factions={allFactions}
          hoveredFaction={hoveredFaction}
          focusedFaction={focusedFaction}
          onHover={setHoveredFaction}
          onFocus={toggleFactionFocus}
          onNavigate={navigateToFaction}
        />{/* Detailed faction view when focused */}
        {focusedFaction && (
          <FactionDetail
            faction={focusedFaction}
            onClose={() => setFocusedFaction(null)}
            onExplore={navigateToFaction}
          />
        )}
      </div>

      <DescriptionSection
        title="The Universal Program"
        choiceText="Choose your allegiance wisely."
      >
        <p>
          Each faction represents a unique component of the Universal Program, with distinct
          philosophies, technologies, and aesthetic identities. Explore their histories, heroes, and visual
          designs to discover which calls to you.
        </p>
      </DescriptionSection>
      <TimelineSection
        title="Universal Timeline"
        description="The struggle between factions occurs across a vast timeline of universal history. Explore key events and conflicts that shaped their development."
        buttonText="View Complete Timeline"
        onTimelineClick={() => navigate('/timeline')}
      />

      <Footer copyright="© 2025 Crisis Unleashed. All rights reserved.">
        <p>Crisis Unleashed - Factions Portal</p>
      </Footer>
    </div>
  );
};