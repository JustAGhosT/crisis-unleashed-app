import React from 'react';
import { Faction } from '@/types/game.types';
import { factionThemes } from '@/theme/factionThemes';
import { getFactionLongDescription, getFactionTechnology, getFactionPhilosophy } from '@/utils/factionUtils';
import { SafeDisplay, DebugDisplay } from './SafeDisplay';
import withSafeRendering from './withSafeRendering';interface FactionDataDisplayProps extends Record<string, unknown> {
faction: Faction;
showDebug?: boolean;
}

/**
 * Component that displays faction data - potentially vulnerable to [object Object] issues
 * without proper safeguards
 */
export const FactionDataDisplay: React.FC<FactionDataDisplayProps> = ({ 
  faction, 
  showDebug = false 
}) => {
  const theme = factionThemes[faction];
  const description = getFactionLongDescription(faction);
  const technology = getFactionTechnology(faction);
  const philosophy = getFactionPhilosophy(faction);

  // Combine data as an object (this could cause [object Object] if rendered directly)
  const factionData = {
    name: theme.name,
    colors: theme.colors,
    description,
    technology,
    philosophy
  };

  return (
    <div className="faction-data-display">
      <h2 className="faction-name">{theme.name}</h2>
      
      {showDebug ? (
        // Debug view with expandable details
        <div className="faction-debug">
          <DebugDisplay value={factionData} label="Faction Data" expanded={true} />
        </div>
      ) : (
        // Normal view with safe display
        <div className="faction-details">
          <div className="faction-description">
            <h3>Description</h3>
            <p>{description}</p>
          </div>
          
          <div className="faction-attributes">
            <div className="attribute">
              <strong>Technology:</strong> <SafeDisplay value={technology} />
            </div>
            <div className="attribute">
              <strong>Philosophy:</strong> <SafeDisplay value={philosophy} />
            </div>
            <div className="attribute">
              <strong>Primary Color:</strong> <SafeDisplay value={theme.colors.primary} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Export a safe version that protects all props
 */
export const SafeFactionDataDisplay = withSafeRendering<FactionDataDisplayProps>(FactionDataDisplay);

export default FactionDataDisplay;