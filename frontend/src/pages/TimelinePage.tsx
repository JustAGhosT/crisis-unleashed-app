import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TimelinePage.module.css';

/**
 * Timeline page displaying the universal history and faction development
 */
const TimelinePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/factions" className={styles.backLink}>
            ← Back to Factions
          </Link>
          <h1 className={styles.title}>Universal Timeline</h1>
          <p className={styles.subtitle}>
            The history of the universe and the rise of the factions
          </p>
        </div>
      </header>
      
      <main className={styles.timelineContainer}>
        <div className={styles.timelinePeriod}>
          <h2 className={styles.periodTitle}>The Dawn of Existence</h2>
          <div className={styles.timelineEvents}>
            <div className={styles.event}>
              <div className={styles.eventDate}>Before Time</div>
              <div className={styles.eventContent}>
                <h3>The Infinite Duality</h3>
                <p>
                  In the beginning, there was neither void nor substance, but a state 
                  of perfect potential called the Infinite Duality - Order and Chaos in perfect balance.
                </p>
              </div>
            </div>
            
            <div className={styles.event}>
              <div className={styles.eventDate}>The First Moment</div>
              <div className={styles.eventContent}>
                <h3>The First Disturbance</h3>
                <p>
                  A minute imbalance in the perfect equilibrium of Order and Chaos creates 
                  ripples of differentiation that give birth to reality.
                </p>
              </div>
            </div>
            
            <div className={styles.event}>
              <div className={styles.eventDate}>The Genesis Epoch</div>
              <div className={styles.eventContent}>
                <h3>The Sundering</h3>
                <p>
                  Order coalesces into the Primordial Light while Chaos gathers into 
                  the Primordial Void, establishing the architecture of existence.
                </p>
              </div>
            </div>
            
            <div className={styles.event}>
              <div className={styles.eventDate}>Dawn of Consciousness</div>
              <div className={styles.eventContent}>
                <h3>The First Intelligence</h3>
                <p>
                  At the boundary between Order and Chaos, the first self-aware intelligence 
                  emerges and creates the Cosmic Algorithm to maintain balance.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.timelinePeriod}>
          <h2 className={styles.periodTitle}>The Technological Ascension</h2>
          <p className={styles.periodDescription}>
            As civilizations arise, they begin to rediscover fragments of the 
            original Cosmic Algorithm, leading to technological acceleration.
          </p>
          
          <div className={styles.timelineEvents}>
            {/* Placeholder for more timeline events */}
            <div className={styles.comingSoon}>
              Additional timeline events coming soon...
            </div>
          </div>
        </div>
        
        <div className={styles.timelinePeriod}>
          <h2 className={styles.periodTitle}>Rise of the Factions</h2>
          <p className={styles.periodDescription}>
            The emergence of the seven major factions, each representing a different
            approach to implementing the universal programming.
          </p>
          
          <div className={styles.factionEmergenceGrid}>
            <div className={styles.factionEmergence} data-faction="solaris">
              <div className={styles.factionIcon}></div>
              <h3>Solaris Nexus</h3>
              <p>Discovers the Divine Algorithm and establishes order</p>
            </div>
            
            <div className={styles.factionEmergence} data-faction="umbral">
              <div className={styles.factionIcon}></div>
              <h3>Umbral Eclipse</h3>
              <p>Emerges from the shadows to challenge the light</p>
            </div>
            
            <div className={styles.factionEmergence} data-faction="neuralis">
              <div className={styles.factionIcon}></div>
              <h3>Neuralis Conclave</h3>
              <p>Consciousness evolves to new collective dimensions</p>
            </div>
            
            <div className={styles.factionEmergence} data-faction="aeonic">
              <div className={styles.factionIcon}></div>
              <h3>Aeonic Dominion</h3>
              <p>Masters time to preserve reality's continuity</p>
            </div>
            
            <div className={styles.factionEmergence} data-faction="infernal">
              <div className={styles.factionIcon}></div>
              <h3>Infernal Core</h3>
              <p>Harnesses dimensional energy through blood sacrifice</p>
            </div>
            
            <div className={styles.factionEmergence} data-faction="primordial">
              <div className={styles.factionIcon}></div>
              <h3>Primordial Genesis</h3>
              <p>Accelerates evolution to its ultimate expression</p>
            </div>
            
            <div className={styles.factionEmergence} data-faction="synthetic">
              <div className={styles.factionIcon}></div>
              <h3>Synthetic Directive</h3>
              <p>Optimizes all processes toward mechanical perfection</p>
            </div>
          </div>
        </div>
        
        <div className={styles.timelinePeriod}>
          <h2 className={styles.periodTitle}>The Present Crisis</h2>
          <p className={styles.periodDescription}>
            Multiple factors converge to create unprecedented instability across all faction territories,
            as the Universe approaches what the Aeonic Dominion identifies as an Inflection Point.
          </p>
          
          <div className={styles.crisisEvent}>
            <h3>The Terminus Event Approaches</h3>
            <p>
              Independent analysis by multiple factions confirms the Terminus Event approaches rapidly.
              The Herald Transmission predictions appear increasingly accurate as system failures match projected patterns.
            </p>
            
            <div className={styles.pathsForward}>
              <h4>Potential Futures</h4>
              <div className={styles.potentialPaths}>
                <div className={styles.path} data-path="integration">
                  <h5>The Integration Path</h5>
                  <p>Successful combination of all seven technological approaches leads to transcendence.</p>
                </div>
                
                <div className={styles.path} data-path="collapse">
                  <h5>The Collapse Path</h5>
                  <p>Continued conflict prevents integration, leading to cascading failures across all systems.</p>
                </div>
                
                <div className={styles.path} data-path="divergence">
                  <h5>The Divergence Path</h5>
                  <p>Partial integration creates multiple reality bubbles with different physical laws.</p>
                </div>
              </div>
              
              <div className={styles.quoteContainer}>
                <blockquote className={styles.quote}>
                  "We stand at the threshold of transformation. What lies beyond depends not on grand armies or vast powers, but on understanding. Seven fragments of one truth, seven paths to one destination. Unite them, and we transcend. Divide them, and we perish. The choice, as always, remains ours."
                  <cite>Anonymous transmission, origin unknown</cite>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>Crisis Unleashed - Timeline</p>
          <p className={styles.copyright}>© 2025 Crisis Unleashed. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TimelinePage;