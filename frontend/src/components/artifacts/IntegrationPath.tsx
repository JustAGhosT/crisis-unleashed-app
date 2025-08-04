import React, { useEffect, useState } from 'react';
import { Faction } from '@/types/game.types';
import { getFactionTheme } from '@/theme/factionThemes';
import './IntegrationPath.css';

interface IntegrationPathProps {
  faction?: Faction;
  scale?: number;
  interactable?: boolean;
  onInteract?: () => void;
}

/**
 * Artifact representing the Integration Path future scenario
 * Displays a visual representation of all seven faction technologies unifying
 */
export const IntegrationPath: React.FC<IntegrationPathProps> = ({
  faction = 'solaris',
  scale = 1,
  interactable = true,
  onInteract
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [syncLevel, setSyncLevel] = useState(0);
  const theme = getFactionTheme(faction);
  
  useEffect(() => {
    // Start with a natural pulsing animation
    const interval = setInterval(() => {
      setSyncLevel(prev => (prev + 1) % 8);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleInteraction = () => {
    if (!interactable || isAnimating) return;
    
    setIsAnimating(true);
    
    // Animate the integration process
    let level = 0;
    const integrationInterval = setInterval(() => {
      level += 1;
      setSyncLevel(level);
      
      if (level >= 7) {
        clearInterval(integrationInterval);
        setTimeout(() => {
          setIsAnimating(false);
          if (onInteract) onInteract();
        }, 2000);
      }
    }, 800);
  };

  return (
    <div 
      className={`integration-path-artifact ${isAnimating ? 'animating' : ''}`}
      onClick={handleInteraction}
      style={{ transform: `scale(${scale})` }}
    >
      <div className="integration-path-container">
        <div className="artifact-title" style={{ color: theme.colors.text }}>
          The Integration Path
        </div>
        
        <div className="integration-core">
          {/* Central unification point */}
          <div className="unity-core"></div>
          
          {/* Faction energy streams */}
          <div className={`faction-stream solaris ${syncLevel > 0 ? 'active' : ''}`}></div>
          <div className={`faction-stream umbral ${syncLevel > 1 ? 'active' : ''}`}></div>
          <div className={`faction-stream aeonic ${syncLevel > 2 ? 'active' : ''}`}></div>
          <div className={`faction-stream infernal ${syncLevel > 3 ? 'active' : ''}`}></div>
          <div className={`faction-stream primordial ${syncLevel > 4 ? 'active' : ''}`}></div>
          <div className={`faction-stream neuralis ${syncLevel > 5 ? 'active' : ''}`}></div>
          <div className={`faction-stream synthetic ${syncLevel > 6 ? 'active' : ''}`}></div>
          
          {/* Transcendence aura - only visible when fully integrated */}
          <div className={`transcendence-aura ${syncLevel >= 7 ? 'active' : ''}`}></div>
        </div>
        
        <div className="artifact-description">
          <p>Successful integration of all seven technological approaches leads to transformation of reality according to the complete Universal Program.</p>
          {syncLevel >= 7 && (
            <p className="transcendence-text">Transcendence achieved. Unified consciousness established.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationPath;