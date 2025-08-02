import React from 'react';
import { useFactionTheme } from '@/context/FactionThemesContext';
import { getMoodBoardData } from '@/data/factions';
import styles from './MoodBoard.module.css';

interface MoodBoardProps {
  expanded?: boolean;
}

/**
 * Generic mood board component that adapts to the current faction theme
 */
const MoodBoard: React.FC<MoodBoardProps> = ({ expanded = false }) => {
  const { currentTheme } = useFactionTheme();
  const factionData = getMoodBoardData(currentTheme.id);
  
  // CSS Variables approach for theming
  const themeVars = {
    '--primary-color': currentTheme.colors.primary,
    '--secondary-color': currentTheme.colors.secondary,
    '--accent-color': currentTheme.colors.accent,
    '--background-color': currentTheme.colors.background,
    '--text-color': currentTheme.colors.text,
    '--highlight-color': currentTheme.colors.highlight,
    '--gradient': currentTheme.gradient,
    '--glow': currentTheme.glow,
  } as React.CSSProperties;

  return (
    <div 
      className={`${styles.container} ${expanded ? styles.expanded : ''}`} 
      style={themeVars}
      data-faction={currentTheme.id}
    >
      {/* Faction specific overlay effect */}
      <div className={`${styles.themeOverlay} ${styles[currentTheme.id + 'Overlay']}`}></div>
      
      <div className={styles.header}>
        <div className={`${styles.factionIcon} ${styles[currentTheme.id + 'Icon']}`}></div>
        <h1 className={styles.title}>{currentTheme.name}</h1>
        <h2 className={styles.subtitle}>{factionData.tagline}</h2>
      </div>

      <div className={styles.grid}>
        {/* Core Visual Elements Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Core Visual Elements</h3>
          <div className={styles.visualElements}>
            {factionData.visualElements.map((element, index) => (
              <div key={index} className={`${styles.elementCard} ${styles[element.cssClass]}`}>
                <div 
                  className={styles.elementIcon} 
                  style={element.iconUrl ? {backgroundImage: `url(${element.iconUrl})`} : {}}
                ></div>
                <span>{element.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Color Palette Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Color Palette</h3>
          <div className={styles.colorPalette}>
            {factionData.colorPalette.map((color, index) => (
              <div key={index} className={styles.colorSwatch}>
                <div className={styles.color} style={{ backgroundColor: color.hex }}></div>
                <div className={styles.colorInfo}>
                  <span className={styles.colorName}>{color.name}</span>
                  <span className={styles.colorHex}>{color.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Typography</h3>
          <div className={styles.typographyExamples}>
            {factionData.typography.map((item, index) => (
              <div key={index} className={styles.fontExample}>
                <h4 className={styles[item.cssClass]}>{item.example}</h4>
                <p className={styles.fontInfo}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Iconography Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Iconography</h3>
          <div className={styles.iconGrid}>
            {factionData.iconography.map((icon, index) => (
              <div key={index} className={styles.iconExample}>
                <div 
                  className={`${styles.icon} ${styles[icon.cssClass]}`}
                  style={icon.iconUrl ? {backgroundImage: `url(${icon.iconUrl})`} : {}}
                ></div>
                <span>{icon.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Visual Treatments Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Visual Treatments</h3>
          <div className={styles.treatmentsGrid}>
            {factionData.visualTreatments.map((treatment, index) => (
              <div key={index} className={styles.treatmentExample}>
                <div 
                  className={`${styles.treatment} ${styles[treatment.cssClass]}`}
                  style={treatment.imageUrl ? {backgroundImage: `url(${treatment.imageUrl})`} : {}}
                ></div>
                <span>{treatment.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Applied Examples Section */}
        <section className={styles.fullWidthSection}>
          <h3 className={styles.sectionTitle}>Applied Design Examples</h3>
          <div className={styles.examplesContainer}>
            {factionData.examples.map((example, index) => (
              <div key={index} className={styles.exampleCard}>
                <div className={styles.cardHeader}>{example.type}</div>
                <div 
                  className={styles.cardContent}
                  style={{backgroundImage: `url(${example.imageUrl})`}}
                ></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Faction-specific animated effect */}
      <div className={`${styles.factionEffect} ${styles[currentTheme.id + 'Effect']}`}></div>
    </div>
  );
};

export default MoodBoard;