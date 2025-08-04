import React, { useState, useEffect } from 'react';
import { Faction } from '@/types/game.types';
import { factionThemes } from '@/theme/factionThemes';
import { getFactionsList, getFactionLongDescription } from '@/utils/factionUtils';
import { DebugDisplay } from '@/components/common/SafeDisplay';
import { logWithDetails } from '@/utils/debugUtils';
import FactionDataDisplay, { SafeFactionDataDisplay } from '@/components/common/FactionDataDisplay';

const DebugObjectPage: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<Faction>('synthetic');
  const [showRaw, setShowRaw] = useState(true);
  const [showSafe, setShowSafe] = useState(true);
  const [debugObjects, setDebugObjects] = useState<Array<{ label: string; value: unknown }>>([]);
  
  // Load potentially problematic objects for inspection
  useEffect(() => {
    // Get the current faction theme
    const theme = factionThemes[selectedFaction];
    const description = getFactionLongDescription(selectedFaction);
    
    // Collect objects that might have rendering issues
    const objectsToDebug = [
      { label: 'Faction Theme', value: theme },
      { label: 'Theme Colors', value: theme.colors },
      { label: 'Theme Card Settings', value: theme.cardTheme },
      { label: 'Description', value: description },
      { 
        label: 'Complex Nested Object', 
        value: {
          id: 1,
          name: 'Test Object',
          metadata: {
            created: new Date(),
            tags: ['test', 'debug'],
            settings: {
              enabled: true,
              priority: 'high'
            }
          }
        } 
      }
    ];
    
    setDebugObjects(objectsToDebug);
    
    // Log to console for additional debugging
    objectsToDebug.forEach(obj => {
      logWithDetails(`Debugging ${obj.label}:`, obj.value);
    });
  }, [selectedFaction]);
  
  return (
    <div className="debug-page">
      <h1>Object Rendering Debug Page</h1>
      <p>
        This page helps identify and debug <code>[object Object]</code> rendering issues 
        in React components.
      </p>
      
      <div className="debug-controls">
        <div>
          <label>
            Select Faction:
            <select 
              value={selectedFaction}
              onChange={e => setSelectedFaction(e.target.value as Faction)}
            >
              {getFactionsList().map(faction => (
                <option key={faction} value={faction}>
                  {factionThemes[faction].name}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={showRaw} 
              onChange={e => setShowRaw(e.target.checked)} 
            />
            Show Raw Component (may show [object Object])
          </label>
        </div>
        
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={showSafe} 
              onChange={e => setShowSafe(e.target.checked)} 
            />
            Show Safe Component (with HOC protection)
          </label>
        </div>
      </div>
      
      <div className="debug-components">
        <h2>Component Comparison</h2>
        
        <div className="component-container">
          {showRaw && (
            <div className="raw-component">
              <h3>Raw Component (Unsafe)</h3>
              <FactionDataDisplay faction={selectedFaction} />
            </div>
          )}
          
          {showSafe && (
            <div className="safe-component">
              <h3>Safe Component (with HOC)</h3>
              <SafeFactionDataDisplay faction={selectedFaction} />
            </div>
          )}
        </div>
      </div>
      
      <div className="debug-objects">
        <h2>Object Inspection</h2>
        
        <div className="object-inspector">
          {debugObjects.map((obj, index) => (
            <div key={index} className="debug-object">
              <DebugDisplay 
                value={obj.value}
                label={obj.label}
                expanded={false}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="debug-tips">
        <h2>Debugging Tips</h2>
        <ul>
          <li>
            Use <code>SafeDisplay</code> component when rendering dynamic values
          </li>
          <li>
            Wrap components with <code>withSafeRendering</code> HOC to protect from object rendering issues
          </li>
          <li>
            Check browser console for detailed object logging from <code>debugUtils</code>
          </li>
          <li>
            Use <code>safeToString</code> utility function when directly converting objects to strings
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DebugObjectPage;