import React from 'react';
import styles from './SolarisMoodBoard.module.css';
 

interface SolarisMoodBoardProps {
  expanded?: boolean;
}

/**
 * Visual mood board component for Solaris Nexus faction
 * Showcases the faction's aesthetic design principles and visual elements
 */
const SolarisMoodBoard: React.FC<SolarisMoodBoardProps> = ({ expanded = false }) => {
  

  return (
    <div className={`${styles.container} ${expanded ? styles.expanded : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleHalo}></div>
        <h1 className={styles.title}>Solaris Nexus</h1>
        <h2 className={styles.subtitle}>Design Principles</h2>
      </div>

      <div className={styles.grid}>
        {/* Core Visual Elements Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Core Visual Elements</h3>
          <div className={styles.visualElements}>
            <div className={`${styles.elementCard} ${styles.goldenLight}`}>
              <div className={styles.elementIcon}></div>
              <span>Golden Light</span>
            </div>
            <div className={`${styles.elementCard} ${styles.geometricPrecision}`}>
              <div className={styles.elementIcon}></div>
              <span>Geometric Precision</span>
            </div>
            <div className={`${styles.elementCard} ${styles.halos}`}>
              <div className={styles.elementIcon}></div>
              <span>Halos & Circles</span>
            </div>
            <div className={`${styles.elementCard} ${styles.crystalline}`}>
              <div className={styles.elementIcon}></div>
              <span>Crystalline Structures</span>
            </div>
            <div className={`${styles.elementCard} ${styles.minimalist}`}>
              <div className={styles.elementIcon}></div>
              <span>Divine Proportions</span>
            </div>
            <div className={`${styles.elementCard} ${styles.lightBeams}`}>
              <div className={styles.elementIcon}></div>
              <span>Light Beams</span>
            </div>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Color Palette</h3>
          <div className={styles.colorPalette}>
            <div className={styles.colorSwatch}>
              <div className={styles.color} style={{ backgroundColor: "#FFD700" }}></div>
              <div className={styles.colorInfo}>
                <span className={styles.colorName}>Gold</span>
                <span className={styles.colorHex}>#FFD700</span>
              </div>
            </div>
            <div className={styles.colorSwatch}>
              <div className={styles.color} style={{ backgroundColor: "#FF8C00" }}></div>
              <div className={styles.colorInfo}>
                <span className={styles.colorName}>Dark Orange</span>
                <span className={styles.colorHex}>#FF8C00</span>
              </div>
            </div>
            <div className={styles.colorSwatch}>
              <div className={styles.color} style={{ backgroundColor: "#FF4500" }}></div>
              <div className={styles.colorInfo}>
                <span className={styles.colorName}>Orange-Red</span>
                <span className={styles.colorHex}>#FF4500</span>
              </div>
            </div>
            <div className={styles.colorSwatch}>
              <div className={styles.color} style={{ backgroundColor: "#0A0A1A" }}></div>
              <div className={styles.colorInfo}>
                <span className={styles.colorName}>Deep Space Blue</span>
                <span className={styles.colorHex}>#0A0A1A</span>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Typography</h3>
          <div className={styles.typographyExamples}>
            <div className={styles.fontExample}>
              <h4 className={styles.sansSerif}>Divine Algorithm</h4>
              <p className={styles.fontInfo}>Sans-serif with uniform stroke widths</p>
            </div>
            <div className={styles.fontExample}>
              <h4 className={styles.glowing}>Radiant Light</h4>
              <p className={styles.fontInfo}>Glowing letter edges in highlight text</p>
            </div>
            <div className={styles.fontExample}>
              <div className={styles.geometricHeader}>Sacred Geometry</div>
              <p className={styles.fontInfo}>Sacred geometry integrated into headers</p>
            </div>
          </div>
        </section>

        {/* Iconography Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Iconography</h3>
          <div className={styles.iconGrid}>
            <div className={styles.iconExample}>
              <div className={`${styles.icon} ${styles.sunIcon}`}></div>
              <span>Sun/Star Symbols</span>
            </div>
            <div className={styles.iconExample}>
              <div className={`${styles.icon} ${styles.algorithmIcon}`}></div>
              <span>Algorithm Patterns</span>
            </div>
            <div className={styles.iconExample}>
              <div className={`${styles.icon} ${styles.haloIcon}`}></div>
              <span>Radiant Halos</span>
            </div>
            <div className={styles.iconExample}>
              <div className={`${styles.icon} ${styles.triangleIcon}`}></div>
              <span>Divine Hierarchy</span>
            </div>
          </div>
        </section>

        {/* Visual Treatments Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Visual Treatments</h3>
          <div className={styles.treatmentsGrid}>
            <div className={styles.treatmentExample}>
              <div className={`${styles.treatment} ${styles.lensFlare}`}></div>
              <span>Lens Flares</span>
            </div>
            <div className={styles.treatmentExample}>
              <div className={`${styles.treatment} ${styles.goldenBorder}`}></div>
              <span>Golden Borders</span>
            </div>
            <div className={styles.treatmentExample}>
              <div className={`${styles.treatment} ${styles.glowingText}`}></div>
              <span>Glowing Text</span>
            </div>
            <div className={styles.treatmentExample}>
              <div className={`${styles.treatment} ${styles.lightParticles}`}></div>
              <span>Light Particles</span>
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

      {/* Divine Light Overlay */}
      <div className={styles.divineLight}></div>
    </div>
  );
};

export default SolarisMoodBoard;