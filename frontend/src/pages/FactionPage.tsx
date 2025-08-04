import React, { useState } from 'react';
import { Faction } from '@/types/game.types';
import { FactionThemeProvider } from '@/context/FactionThemesContext';
import MoodBoard from '@/components/factions/MoodBoard';
import styles from './FactionPage.module.css';

interface FactionPageProps {
  faction: Faction;
  activePage?: 'overview' | 'lore' | 'moodboard' | 'heroes' | 'artifacts' | 'actions';
}

/**
 * Main page template for all faction-specific content
 */
const FactionPage: React.FC<FactionPageProps> = ({ 
  faction = 'solaris',
  activePage = 'overview'
}) => {
  const [currentPage, setCurrentPage] = useState(activePage);
  
  // Function to render the appropriate content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'moodboard':
        return <MoodBoard expanded={true} />;
      case 'lore':
        return <div className={styles.comingSoon}>Lore content coming soon...</div>;
      case 'heroes':
        return <div className={styles.comingSoon}>Heroes content coming soon...</div>;
      case 'artifacts':
        return <div className={styles.comingSoon}>Artifacts content coming soon...</div>;
      case 'actions':
        return <div className={styles.comingSoon}>Actions content coming soon...</div>;
      case 'overview':
      default:
        return (
          <div className={styles.overviewContainer}>
            <div className={styles.overviewHeader}>
              <h1>Faction Overview</h1>
            </div>
            <div className={styles.overviewContent}>
              <div className={styles.overviewSection}>
                <h2>Identity & Philosophy</h2>
                <p>About this faction&apos;s core beliefs and approach to the universe...</p>
              </div>
              <div className={styles.overviewSection}>
                <h2>Visual Preview</h2>
                <div className={styles.moodPreview}>
                  <MoodBoard expanded={false} />
                </div>
              </div>
              <div className={styles.overviewSection}>
                <h2>Key Resources</h2>
                <ul className={styles.resourceList}>
                  <li>
                    <button onClick={() => setCurrentPage('lore')} className={styles.resourceButton}>
                      Faction Lore
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCurrentPage('moodboard')} className={styles.resourceButton}>
                      Visual Design Guide
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCurrentPage('heroes')} className={styles.resourceButton}>
                      Heroes & Characters
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCurrentPage('artifacts')} className={styles.resourceButton}>
                      Artifacts & Technology
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setCurrentPage('actions')} className={styles.resourceButton}>
                      Actions & Abilities
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <FactionThemeProvider initialFaction={faction}>
      <div className={styles.pageContainer}>
        {/* Navigation */}
        <nav className={styles.navigation}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>Crisis Unleashed</div>
          </div>
          <ul className={styles.navItems}>
            <li 
              className={`${styles.navItem} ${currentPage === 'overview' ? styles.active : ''}`}
              onClick={() => setCurrentPage('overview')}
            >
              Overview
            </li>
            <li 
              className={`${styles.navItem} ${currentPage === 'lore' ? styles.active : ''}`}
              onClick={() => setCurrentPage('lore')}
            >
              Lore
            </li>
            <li 
              className={`${styles.navItem} ${currentPage === 'moodboard' ? styles.active : ''}`}
              onClick={() => setCurrentPage('moodboard')}
            >
              Visual Design
            </li>
            <li 
              className={`${styles.navItem} ${currentPage === 'heroes' ? styles.active : ''}`}
              onClick={() => setCurrentPage('heroes')}
            >
              Heroes
            </li>
            <li 
              className={`${styles.navItem} ${currentPage === 'artifacts' ? styles.active : ''}`}
              onClick={() => setCurrentPage('artifacts')}
            >
              Artifacts
            </li>
            <li 
              className={`${styles.navItem} ${currentPage === 'actions' ? styles.active : ''}`}
              onClick={() => setCurrentPage('actions')}
            >
              Actions
            </li>
          </ul>
          <div className={styles.factionSelector}>
            {/* Faction switcher would go here */}
          </div>
        </nav>
        
        {/* Main content area */}
        <main className={styles.mainContent}>
          {renderContent()}
        </main>
        
        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>Crisis Unleashed - Faction Portal</p>
            <p className={styles.copyright}>© 2025 Crisis Unleashed. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </FactionThemeProvider>
  );
};

export default FactionPage;