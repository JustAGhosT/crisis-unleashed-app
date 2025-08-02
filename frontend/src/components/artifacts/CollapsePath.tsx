import React, { useEffect, useState } from 'react';
import { Faction } from '@/types/game.types';
import { getFactionTheme } from '@/theme/factionThemes';
import './CollapsePath.css';

interface CollapsePathProps {
  faction?: Faction;
  scale?: number;
  interactable?: boolean;
  onInteract?: () => void;
}

/**
 * Artifact representing the Collapse Path future scenario
 * Displays a visual representation of reality breaking down as Interface fragments destabilize
 */
export const CollapsePath: React.FC<CollapsePathProps> = ({
  faction = 'umbral',
  scale = 1,
  interactable = true,
  onInteract
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [collapseStage, setCollapseStage] = useState(0);
  const theme = getFactionTheme(faction);
  
  useEffect(() => {
    // Show minor instability naturally
    const interval = setInterval(() => {
      const randomFlicker = Math.floor(Math.random() * 3);
      setCollapseStage(randomFlicker);
      
      setTimeout(() => {
        setCollapseStage(0);
      }, 500);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleInteraction = () => {
    if (!interactable || isAnimating) return;
    
    setIsAnimating(true);
    
    // Animate the collapse process
    let stage = 0;
    const collapseInterval = setInterval(() => {
      stage += 1;
      setCollapseStage(stage);
      
      if (stage >= 7) {
        clearInterval(collapseInterval);
        // Reset after full collapse
        setTimeout(() => {
          setCollapseStage(0);
          setIsAnimating(false);
          if (onInteract) onInteract();
        }, 3000);
      }
    }, 800);
  };
  
  return (
    <div 
      className={`collapse-path-artifact ${isAnimating ? 'animating' : ''}`}
      onClick={handleInteraction}
      style={{ transform: `scale(${scale})` }}
    >
      <div className="collapse-path-container">
        <div className="artifact-title" style={{ color: theme.colors.text }}>
          The Collapse Path
        </div>
        
        <div className="collapse-visualization">
          {/* Reality structure */}
          <div className={`reality-grid stage-${collapseStage}`}>
            {Array(16).fill(0).map((_, i) => (
              <div key={i} className="grid-cell"></div>
            ))}
          </div>
          
          {/* Fractures */}
          <div className={`fracture fracture-1 ${collapseStage > 1 ? 'active' : ''}`}></div>
          <div className={`fracture fracture-2 ${collapseStage > 2 ? 'active' : ''}`}></div>
          <div className={`fracture fracture-3 ${collapseStage > 3 ? 'active' : ''}`}></div>
          
          {/* Warning glitches */}
          <div className={`glitch-warning ${collapseStage > 0 ? 'active' : ''}`}></div>
          
          {/* Void elements */}
          <div className={`void-element void-1 ${collapseStage > 4 ? 'active' : ''}`}></div>
          <div className={`void-element void-2 ${collapseStage > 5 ? 'active' : ''}`}></div>
          
          {/* Terminus event - complete collapse */}
          <div className={`terminus-event ${collapseStage >= 7 ? 'active' : ''}`}></div>
        </div>
        
        <div className="artifact-description">
          <p>Continued conflict prevents integration of the Interface fragments, leading to cascading system failures and reality breakdown.</p>
          {collapseStage >= 7 && (
            <p className="terminus-text">Terminus Event initiated. Coherent spacetime dissolving.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollapsePath;