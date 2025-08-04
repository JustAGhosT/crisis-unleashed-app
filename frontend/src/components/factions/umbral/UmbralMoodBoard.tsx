import React, { useEffect, useState } from 'react';
import styles from './UmbralMoodBoard.module.css';

interface UmbralMoodBoardProps {
  expanded?: boolean;
}

/**
 * Visual mood board component for Umbral Eclipse faction
 * Showcases the faction's aesthetic design principles and visual elements
 */
const UmbralMoodBoard: React.FC<UmbralMoodBoardProps> = ({ expanded = false }) => {
  const [glitchActive, setGlitchActive] = useState(false);
  
  // Random glitch effect for shadow elements
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => {
        setGlitchActive(false);
      }, 200);
    }, 5000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className={`${styles.container} ${expanded ? styles.expanded : ''}`}>
      {/* Shadow veil effect */}
      <div className={styles.shadowVeil}></div>
      
      <div className={styles.header}>
        <div className={styles.eclipseIcon}></div>
        <h1 className={`${styles.title} ${glitchActive ? styles.glitch : ''}`}>Umbral Eclipse</h1>
        <h2 className={styles.subtitle}>Shadow & Veiled Design</h2>
      </div>

      <div className={styles.grid}>
        {/* Core Visual Elements Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Core Visual Elements</h3>
          <div className={styles.visualElements}>
            <div className={`${styles.elementCard} ${styles.shadowSilhouettes}`}>
              <div className={styles.elementIcon}></div>
              <span>Shadow Silhouettes</span>
            </div>
            <div className={`${styles.elementCard} ${styles.fractals}`}>
              <div className={styles.elementIcon}></div>
              <span>Shifting Fractals</span>
            </div>
            <div className={`${styles.elementCard} ${styles.veiled}`}>
              <div className={styles.elementIcon}></div>
              <span>Veiled Imagery</span>
            </div>
            <div className={`${styles.elementCard} ${styles.inkSwirls}`}>
              <div className={styles.elementIcon}></div>
              <span>Ink-like Swirls</span>
            </div>
            <div className={`${styles.elementCard} ${styles.asymmetrical}`}>
              <div className={styles.elementIcon}></div>
              <span>Asymmetrical Design</span>
            </div>
            <div className={`${styles.elementCard} ${styles.reflective}`}>
              <div className={styles.elementIcon}></div>
              <span>Distorted Reflections</span>
            </div>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Color Palette</h3>
          <div className={styles.colorPalette}>
            <div className={styles.colorSwatch}>
              <div className={`${styles.color} ${styles.colorMediumPurple}`}></div>
              <div className={styles.colorInfo}>
                <span className={styles.colorName}>Medium Purple</span>
                <span className={styles.colorHex}>#9B59B6</span>
              </div>
            </div>
            <div className={styles.colorSwatch}>
              <div className={`${styles.color} ${styles.colorDarkViolet}`}></div>
              <div className={styles.colorInfo}>
                <span className={styles.colorName}>Dark Violet</span>
                <span className={styles.colorHex}>#8E44AD</span>
              </div>
            </div>
            <div className={styles.colorSwatch}>
              <div className={`${styles.color} ${styles.colorDeepPurple}`}></div>
              <div className={styles.colorInfo}>
                <span className={styles.colorName}>Deep Purple</span>
                <span className={styles.colorHex}>#6C3483</span>
              </div>
            </div>
            <div className={styles.colorSwatch}>
              <div className={`${styles.color} ${styles.colorNearBlack}`}></div>
              <div className={styles.colorInfo}>
                <span className={styles.colorName}>Near-Black</span>
                <span className={styles.colorHex}>#0A0A0A</span>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Typography</h3>
          <div className={styles.typographyExamples}>
            <div className={styles.fontExample}>
              <h4 className={styles.serif}>Shadow Protocol</h4>
              <p className={styles.fontInfo}>Serif fonts with variable stroke widths</p>
            </div>
            <div className={styles.fontExample}>
              <h4 className={styles.redacted}>Classified <span className={styles.redactedText}>Information</span></h4>
              <p className={styles.fontInfo}>Text that appears partially redacted</p>
            </div>
            <div className={styles.fontExample}>
              <h4 className={styles.shadowed}>Dark Knowledge</h4>
              <p className={styles.fontInfo}>Subtle shadow effects behind text</p>
            </div>
          </div>
        </section>

        {/* Iconography Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Iconography</h3>
          <div className={styles.iconGrid}>
            <div className={styles.iconExample}>
              <div className={`${styles.icon} ${styles.eclipseIcon}`}></div>
              <span>Eclipse Symbols</span>
            </div>
            <div className={styles.iconExample}>
              <div className={`${styles.icon} ${styles.ringsIcon}`}></div>
              <span>Interlocking Rings</span>
            </div>
            <div className={styles.iconExample}>
              <div className={`${styles.icon} ${styles.eyeIcon}`}></div>
              <span>Unusual Eye Designs</span>
            </div>
            <div className={styles.iconExample}>
              <div className={`${styles.icon} ${styles.networkIcon}`}></div>
              <span>Neural Pathways</span>
            </div>
          </div>
        </section>

        {/* Visual Treatments Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Visual Treatments</h3>
          <div className={styles.treatmentsGrid}>
            <div className={styles.treatmentExample}>
              <div className={`${styles.treatment} ${styles.shadowCasting}`}></div>
              <span>Shadow Casting</span>
            </div>
            <div className={styles.treatmentExample}>
              <div className={`${styles.treatment} ${styles.smokeMist}`}></div>
              <span>Smoke & Mist</span>
            </div>
            <div className={styles.treatmentExample}>
              <div className={`${styles.treatment} ${styles.glitchEffect}`}></div>
              <span>Glitch Effects</span>
            </div>
            <div className={styles.treatmentExample}>
              <div className={`${styles.treatment} ${styles.violetHighlights}`}></div>
              <span>Violet Highlights</span>
            </div>
          </div>
        </section>

        {/* Applied Examples Section */}
        <section className={styles.fullWidthSection}>
          <h3 className={styles.sectionTitle}>Applied Design Examples</h3>
          <div className={styles.examplesContainer}>
            <div className={styles.exampleCard}>
              <div className={styles.cardHeader}>Interface Design</div>
              <div className={`${styles.cardContent} ${styles.interfaceExample}`}></div>
            </div>
            <div className={styles.exampleCard}>
              <div className={styles.cardHeader}>Document Style</div>
              <div className={`${styles.cardContent} ${styles.documentExample}`}></div>
            </div>
            <div className={styles.exampleCard}>
              <div className={styles.cardHeader}>Architectural Concept</div>
              <div className={`${styles.cardContent} ${styles.architectureExample}`}></div>
            </div>
          </div>
        </section>
      </div>

      {/* Animated Shadows Overlay */}
      <div className={styles.animatedShadows}></div>
    </div>
  );
};

export default UmbralMoodBoard;