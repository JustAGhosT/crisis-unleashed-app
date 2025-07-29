import React, { useState } from 'react';

const Battlefield = ({ selectedCard, onCardPlay }) => {
  const [hoveredZone, setHoveredZone] = useState(null);
  
  // Mock battlefield units - commanders and deployed units
  const [battlefieldUnits, setBattlefieldUnits] = useState({
    // Enemy units (top row)
    '0-2': { name: 'Enemy Commander', type: 'commander', health: 100, attack: 3, player: 'enemy' },
    '0-1': { name: 'Cyber Drone', type: 'unit', health: 2, attack: 1, player: 'enemy' },
    '0-3': { name: 'Assault Bot', type: 'unit', health: 3, attack: 2, player: 'enemy' },
    
    // Player units (bottom row)
    '2-2': { name: 'Your Commander', type: 'commander', health: 100, attack: 3, player: 'player' },
  });
  
  // Create a 5x3 battlefield grid
  const createBattlefieldGrid = () => {
    const grid = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const position = `${row}-${col}`;
        const isPlayerZone = row === 2;
        const isEnemyZone = row === 0;
        const isNeutralZone = row === 1;
        const unit = battlefieldUnits[position];
        
        grid.push(
          <div
            key={position}
            className={`
              battlefield-zone relative aspect-square border transition-all duration-300 cursor-pointer
              ${isPlayerZone ? 'border-cyan-400/50 bg-cyan-900/20' : ''}
              ${isEnemyZone ? 'border-red-400/50 bg-red-900/20' : ''}
              ${isNeutralZone ? 'border-purple-400/50 bg-purple-900/10' : ''}
              ${hoveredZone === position ? 'scale-105 border-opacity-100 shadow-lg' : ''}
              ${selectedCard && hoveredZone === position && !unit ? 'bg-yellow-400/20' : ''}
            `}
            onMouseEnter={() => setHoveredZone(position)}
            onMouseLeave={() => setHoveredZone(null)}
            onClick={() => {
              if (selectedCard && !unit) {
                // Deploy card to this position
                setBattlefieldUnits(prev => ({
                  ...prev,
                  [position]: {
                    name: selectedCard.name,
                    type: selectedCard.type,
                    health: selectedCard.health || 1,
                    attack: selectedCard.attack || 1,
                    player: 'player'
                  }
                }));
                onCardPlay(position);
              }
            }}
          >
            {/* Grid Coordinates */}
            <div className="absolute top-1 left-1 text-xs text-gray-400 font-mono">
              {position}
            </div>
            
            {/* Unit Display */}
            {unit && (
              <div className={`
                absolute inset-1 rounded border-2 flex flex-col items-center justify-center text-center
                ${unit.player === 'player' 
                  ? 'border-cyan-400 bg-cyan-900/40 text-cyan-100' 
                  : 'border-red-400 bg-red-900/40 text-red-100'
                }
                ${unit.type === 'commander' ? 'border-4 shadow-lg' : ''}
              `}>
                {/* Unit Icon */}
                <div className="text-2xl mb-1">
                  {unit.type === 'commander' ? '👑' : '⚔️'}
                </div>
                
                {/* Unit Name */}
                <div className="text-xs font-bold truncate w-full px-1">
                  {unit.name}
                </div>
                
                {/* Unit Stats */}
                <div className="flex justify-between w-full px-1 text-xs mt-1">
                  <span className="text-red-300">{unit.attack}</span>
                  <span className="text-green-300">{unit.health}</span>
                </div>
              </div>
            )}
            
            {/* Holographic Grid Effect */}
            {!unit && (
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-400/5 to-transparent"></div>
            )}
            
            {/* Zone Indicators */}
            {!unit && (
              <>
                {isPlayerZone && (
                  <div className="absolute bottom-1 right-1 text-xs text-cyan-400 font-semibold">
                    ALLY
                  </div>
                )}
                {isEnemyZone && (
                  <div className="absolute bottom-1 right-1 text-xs text-red-400 font-semibold">
                    ENEMY
                  </div>
                )}
                {isNeutralZone && (
                  <div className="absolute bottom-1 right-1 text-xs text-purple-400 font-semibold">
                    NEUTRAL
                  </div>
                )}
              </>
            )}
            
            {/* Placement Indicator */}
            {selectedCard && hoveredZone === position && !unit && (
              <div className="absolute inset-2 border-2 border-yellow-400 border-dashed animate-pulse rounded">
                <div className="absolute inset-0 bg-yellow-400/10"></div>
              </div>
            )}
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <div className="battlefield h-full flex flex-col justify-center items-center p-8">
      {/* Battlefield Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-cyan-400 font-mono tracking-wider mb-2">
          TACTICAL BATTLEFIELD
        </h2>
        <div className="text-sm text-gray-400">
          Deploy units strategically • Control the battlefield • Victory awaits
        </div>
      </div>

      {/* Main Battlefield Grid */}
      <div className="battlefield-grid grid grid-cols-5 gap-2 max-w-4xl w-full">
        {createBattlefieldGrid()}
      </div>

      {/* Data-Link Visualization (placeholder for synergies) */}
      <div className="mt-6 text-center">
        <div className="text-xs text-gray-500 font-mono">
          DATA-LINK SYSTEM: Active Synergies will appear here
        </div>
      </div>

      {/* Battlefield Status */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-3">
        <div className="text-xs text-cyan-400 font-mono mb-1">BATTLEFIELD STATUS</div>
        <div className="text-xs text-gray-300">
          Active Units: 0/15<br/>
          Control Points: 0
        </div>
      </div>
    </div>
  );
};

export default Battlefield;