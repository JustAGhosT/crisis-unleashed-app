import React from 'react';

const CardHand = ({ selectedCard, onCardSelect }) => {
  // Mock hand data with different card types
  const handCards = [
    {
      id: 1,
      name: "Cyber Soldier",
      type: "character",
      cost: 3,
      attack: 2,
      health: 3,
      rarity: "common",
      description: "Basic infantry unit with enhanced targeting systems",
      abilities: ["First Strike"]
    },
    {
      id: 2,
      name: "Neural Hack",
      type: "action",
      cost: 2,
      rarity: "rare",
      description: "Disable target enemy unit for one turn",
      abilities: ["Instant", "Disable"]
    },
    {
      id: 3,
      name: "Plasma Cannon",
      type: "character",
      cost: 5,
      attack: 4,
      health: 2,
      rarity: "epic",
      description: "Heavy weapons platform with area damage capabilities",
      abilities: ["Area Damage", "Range 2"]
    },
    {
      id: 4,
      name: "Data Stream",
      type: "action",
      cost: 1,
      rarity: "common",
      description: "Access tactical networks • Draw 2 cards from your deck",
      abilities: ["Draw", "Instant"]
    },
    {
      id: 5,
      name: "Quantum Guardian",
      type: "character",
      cost: 7,
      attack: 5,
      health: 6,
      rarity: "legendary",
      description: "Elite defender with quantum phase shield technology",
      abilities: ["Shield", "Phase", "Guardian"]
    }
  ];

  const Card = ({ card, isSelected, onClick, canAfford = true }) => {
    const isCharacter = card.type === 'character';
    const rarityColors = {
      common: {
        bg: 'from-slate-700 to-slate-800',
        border: 'border-slate-400',
        glow: 'shadow-slate-400/20'
      },
      rare: {
        bg: 'from-blue-700 to-blue-800',
        border: 'border-blue-400',
        glow: 'shadow-blue-400/30'
      },
      epic: {
        bg: 'from-purple-700 to-purple-800',
        border: 'border-purple-400',
        glow: 'shadow-purple-400/30'
      },
      legendary: {
        bg: 'from-yellow-700 to-yellow-800',
        border: 'border-yellow-400',
        glow: 'shadow-yellow-400/40'
      }
    };

    const rarity = rarityColors[card.rarity];

    return (
      <div
        className={`
          card-container relative cursor-pointer transition-all duration-300 select-none
          ${isCharacter ? 'w-24' : 'w-28'}
          ${isSelected ? 'transform -translate-y-6 scale-105 z-30' : 'hover:-translate-y-3 hover:scale-102 z-10'}
          ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => canAfford && onClick()}
      >
        {/* Card Frame - Adjusted Height */}
        <div className={`
          relative h-32 rounded-lg border-2 bg-gradient-to-br backdrop-blur-sm overflow-hidden
          ${rarity.bg} ${rarity.border} ${rarity.glow}
          ${isSelected ? 'border-opacity-100 shadow-2xl ring-2 ring-yellow-400/50' : 'border-opacity-70 shadow-lg'}
          ${!canAfford ? 'grayscale' : ''}
        `}>
          
          {/* Holographic Scan Lines - Reduced */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent"></div>
          </div>

          {/* Compact Card Header */}
          <div className="relative p-1.5 border-b border-white/20 bg-black/50">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-xs truncate font-mono">
                  {card.name}
                </h3>
                <div className="text-xs text-gray-400 capitalize font-mono opacity-70">
                  {card.type}
                </div>
              </div>
              
              {/* Energy Cost - Smaller */}
              <div className="ml-1 flex-shrink-0">
                <div className={`
                  w-5 h-5 rounded-full border text-black text-xs font-bold 
                  flex items-center justify-center font-mono
                  ${canAfford ? 'bg-cyan-400 border-cyan-300' : 'bg-red-400 border-red-300'}
                  ${isSelected ? 'animate-pulse' : ''}
                `}>
                  {card.cost}
                </div>
              </div>
            </div>
          </div>

          {/* Compact Card Art Area */}
          <div className="relative flex-1 bg-gradient-to-br from-slate-900 to-black flex items-center justify-center min-h-[40px]">
            {/* Unit Icon - Smaller */}
            <div className={`
              text-xl z-10 relative
              ${isSelected ? 'animate-bounce' : ''}
              ${isCharacter ? 'text-cyan-400' : 'text-purple-400'}
            `}>
              {isCharacter ? '⚔️' : '⚡'}
            </div>
            
            {/* Rarity Indicator */}
            <div className={`
              absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full
              ${card.rarity === 'legendary' ? 'bg-yellow-400 animate-ping' : ''}
              ${card.rarity === 'epic' ? 'bg-purple-400' : ''}
              ${card.rarity === 'rare' ? 'bg-blue-400' : ''}
              ${card.rarity === 'common' ? 'bg-gray-400' : ''}
            `}></div>
          </div>

          {/* Card Stats (Character only) - Compact */}
          {isCharacter && (
            <div className="px-1.5 py-0.5 bg-black/70 border-t border-white/10">
              <div className="flex justify-between text-xs font-bold font-mono">
                <div className="flex items-center space-x-0.5">
                  <span className="text-red-400">⚔</span>
                  <span className="text-red-300">{card.attack}</span>
                </div>
                <div className="flex items-center space-x-0.5">
                  <span className="text-green-400">❤</span>
                  <span className="text-green-300">{card.health}</span>
                </div>
              </div>
            </div>
          )}

          {/* Compact Card Abilities */}
          <div className="px-1.5 py-0.5 bg-black/80">
            <div className="flex flex-wrap gap-0.5">
              {card.abilities?.slice(0, 1).map((ability, index) => (
                <span key={index} className="text-xs px-1 py-0.5 bg-yellow-600/30 text-yellow-300 rounded font-mono">
                  {ability}
                </span>
              ))}
            </div>
          </div>

          {/* Selection Effects */}
          {isSelected && (
            <>
              <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse"></div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-yellow-400/5 rounded-lg"></div>
            </>
          )}
          
          {/* Affordability Indicator */}
          {!canAfford && (
            <div className="absolute inset-0 bg-red-900/50 rounded-lg flex items-center justify-center">
              <div className="text-red-400 text-xs font-bold font-mono text-center">
                NO<br/>ENERGY
              </div>
            </div>
          )}
        </div>

        {/* Detailed Tooltip (only when selected) */}
        {(isSelected) && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-40">
            <div className="bg-black/95 border border-cyan-400/50 rounded-lg p-2 max-w-xs backdrop-blur-sm">
              <div className="text-cyan-400 font-bold text-xs font-mono mb-1">
                {card.name}
              </div>
              <div className="text-gray-300 text-xs leading-relaxed">
                {card.description}
              </div>
              {card.abilities && (
                <div className="mt-1 pt-1 border-t border-gray-600">
                  <div className="flex flex-wrap gap-1">
                    {card.abilities.map((ability, index) => (
                      <span key={index} className="text-xs px-1 py-0.5 bg-yellow-600/20 text-yellow-300 rounded font-mono">
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const availableEnergy = 7; // This should come from game state

  return (
    <div className="tactical-hand h-full flex flex-col">
      {/* Compact Hand Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-cyan-400/20 bg-gradient-to-r from-black/40 to-black/20">
        <div className="flex items-center space-x-4">
          <h2 className="text-cyan-400 font-bold font-mono text-sm">
            TACTICAL HAND
          </h2>
          <div className="text-xs text-gray-500 font-mono">
            NEURAL LINK
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Hand Info */}
          <div className="text-xs text-gray-400 font-mono">
            <span className="text-cyan-400">{handCards.length}</span>/7
          </div>
          
          {/* Compact Energy Display */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-cyan-400 font-mono">ENERGY:</span>
            <div className="flex space-x-0.5">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-3 rounded-sm ${
                    i < availableEnergy 
                      ? 'bg-cyan-400 shadow-cyan-400/50' 
                      : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-cyan-400 font-bold font-mono text-xs">
              {availableEnergy}
            </span>
          </div>
        </div>
      </div>

      {/* Cards Container - Expanded */}
      <div className="flex-1 flex items-center justify-center px-4 py-3 relative overflow-hidden">
        {/* Background Grid - Subtle */}
        <div className="absolute inset-0 opacity-3">
          <div className="grid-background"></div>
        </div>
        
        <div className="flex space-x-3 max-w-full overflow-x-auto relative z-10">
          {handCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isSelected={selectedCard?.id === card.id}
              canAfford={card.cost <= availableEnergy}
              onClick={() => {
                if (selectedCard?.id === card.id) {
                  onCardSelect(null);
                } else {
                  onCardSelect(card);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Minimal Action Feedback */}
      {selectedCard && (
        <div className="px-4 py-2 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border-t border-yellow-400/20">
          <div className="flex items-center justify-between">
            <div className="text-yellow-400 text-xs font-bold font-mono">
              [{selectedCard.name.toUpperCase()}] → DEPLOY TO BATTLEFIELD
            </div>
            <button 
              onClick={() => onCardSelect(null)}
              className="text-xs text-gray-400 hover:text-gray-200 font-mono transition-colors"
            >
              [CANCEL]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardHand;