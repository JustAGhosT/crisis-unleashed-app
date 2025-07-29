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
              battlefield-zone relative border transition-all duration-300 cursor-pointer transform-gpu
              ${isPlayerZone ? 'border-cyan-400/50 bg-cyan-900/20' : ''}
              ${isEnemyZone ? 'border-red-400/50 bg-red-900/20' : ''}
              ${isNeutralZone ? 'border-purple-400/50 bg-purple-900/10' : ''}
              ${hoveredZone === position ? 'scale-105 border-opacity-100 shadow-xl -translate-y-3' : ''}
              ${selectedCard && hoveredZone === position && !unit ? 'bg-yellow-400/20' : ''}
            `}
            style={{
              aspectRatio: '1',
              minHeight: '80px',
              transform: hoveredZone === position 
                ? 'translateZ(15px) scale(1.05) translateY(-12px)' 
                : 'translateZ(0px)',
              transformStyle: 'preserve-3d'
            }}
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
    <div className="battlefield h-full flex flex-col justify-center items-center p-4 relative perspective-1000">
      {/* 3D Battlefield Container - Much Larger */}
      <div className="battlefield-3d-container relative transform-gpu transition-all duration-500 hover:scale-102 hover:-translate-y-2">
        {/* Main Battlefield Grid with 3D perspective - Expanded Size */}
        <div 
          className="battlefield-grid grid grid-cols-5 gap-4 w-full max-w-6xl transform-gpu transition-all duration-300"
          style={{
            transform: 'perspective(1200px) rotateX(20deg) rotateY(-3deg)',
            transformStyle: 'preserve-3d',
            minHeight: '400px'
          }}
        >
          {createBattlefieldGrid()}
        </div>

        {/* 3D Base/Platform - Larger */}
        <div 
          className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-800/60 to-black/60 rounded-xl border border-cyan-400/30 shadow-2xl"
          style={{
            transform: 'perspective(1200px) rotateX(20deg) rotateY(-3deg) translateZ(-15px)',
            filter: 'blur(0.5px)'
          }}
        ></div>
      </div>

      {/* Data-Link Visualization (placeholder for synergies) */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500 font-mono">
          DATA-LINK SYSTEM: Active Synergies will appear here
        </div>
      </div>

      {/* Battlefield Status - Repositioned */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-4">
        <div className="text-xs text-cyan-400 font-mono mb-2">BATTLEFIELD STATUS</div>
        <div className="text-xs text-gray-300">
          Player Units: {Object.values(battlefieldUnits).filter(u => u.player === 'player').length}/8<br/>
          Enemy Units: {Object.values(battlefieldUnits).filter(u => u.player === 'enemy').length}/8
        </div>
      </div>
    </div>
  );
};

export default Battlefield;