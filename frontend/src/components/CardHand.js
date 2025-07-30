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
          card-container relative cursor-pointer transition-all duration-500 select-none
          ${isCharacter ? 'w-24' : 'w-28'}
          ${isSelected ? 'transform -translate-y-8 scale-125 z-50' : 'hover:scale-140 hover:-translate-y-6 hover:z-40 z-10'}
          ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}
          group-hover:scale-120 group-hover:-translate-y-4
        `}
        style={{
          transformOrigin: 'bottom center'
        }}
        onClick={() => canAfford && onClick()}
      >
      >
        {/* Card Frame - Maintains proportions, grows uniformly */}
        <div className={`
          relative h-32 rounded-lg border-2 bg-gradient-to-br backdrop-blur-sm overflow-visible transition-all duration-500
          ${rarity.bg} ${rarity.border} ${rarity.glow}
          ${isSelected ? 'border-opacity-100 shadow-2xl ring-2 ring-yellow-400/50' : 'border-opacity-70 shadow-lg'}
          ${!canAfford ? 'grayscale' : ''}
        `}>
          
          {/* Holographic Scan Lines */}
          <div className="absolute inset-0 opacity-10 group-hover:opacity-15 hover:opacity-20 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent"></div>
          </div>

          {/* Card Header */}
          <div className="relative p-1.5 border-b border-white/20 bg-black/50 group-hover:p-2 hover:p-2.5 transition-all duration-500">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-xs truncate font-mono group-hover:text-sm hover:text-base transition-all duration-500">
                  {card.name}
                </h3>
                <div className="text-xs text-gray-400 capitalize font-mono opacity-70 group-hover:opacity-85 hover:opacity-100 transition-all duration-500">
                  {card.type}
                </div>
              </div>
              
              {/* Energy Cost */}
              <div className="ml-1 flex-shrink-0">
                <div className={`
                  w-5 h-5 rounded-full border text-black text-xs font-bold 
                  flex items-center justify-center font-mono transition-all duration-500
                  group-hover:w-6 group-hover:h-6 hover:w-7 hover:h-7 hover:text-sm
                  ${canAfford ? 'bg-cyan-400 border-cyan-300' : 'bg-red-400 border-red-300'}
                  ${isSelected ? 'animate-pulse' : ''}
                `}>
                  {card.cost}
                </div>
              </div>
            </div>
          </div>

          {/* Card Art Area */}
          <div className="relative flex-1 bg-gradient-to-br from-slate-900 to-black flex items-center justify-center min-h-[40px] transition-all duration-500">
            {/* Unit Icon */}
            <div className={`
              text-xl z-10 relative transition-all duration-500 group-hover:text-2xl hover:text-3xl
              ${isSelected ? 'animate-bounce text-3xl' : ''}
              ${isCharacter ? 'text-cyan-400' : 'text-purple-400'}
            `}>
              {isCharacter ? '⚔️' : '⚡'}
            </div>
            
            {/* Rarity Indicator */}
            <div className={`
              absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full transition-all duration-500
              group-hover:w-2 group-hover:h-2 hover:w-2.5 hover:h-2.5
              ${card.rarity === 'legendary' ? 'bg-yellow-400 animate-ping' : ''}
              ${card.rarity === 'epic' ? 'bg-purple-400' : ''}
              ${card.rarity === 'rare' ? 'bg-blue-400' : ''}
              ${card.rarity === 'common' ? 'bg-gray-400' : ''}
            `}></div>
          </div>

          {/* Card Stats */}
          {isCharacter && (
            <div className="px-1.5 py-0.5 bg-black/70 border-t border-white/10 group-hover:py-1 hover:py-1.5 hover:px-2 transition-all duration-500">
              <div className="flex justify-between text-xs font-bold font-mono group-hover:text-sm hover:text-base transition-all duration-500">
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

          {/* Card Abilities */}
          <div className="px-1.5 py-0.5 bg-black/80 group-hover:py-1 hover:py-1.5 hover:px-2 transition-all duration-500">
            <div className="flex flex-wrap gap-0.5 group-hover:gap-1 hover:gap-1.5 transition-all duration-500">
              {card.abilities?.slice(0, 1).map((ability, index) => (
                <span key={index} className="text-xs px-1 py-0.5 bg-yellow-600/30 text-yellow-300 rounded font-mono group-hover:px-1.5 hover:px-2 hover:text-sm transition-all duration-500">
                  {ability}
                </span>
              ))}
            </div>
          </div>

          {/* Selection Effects */}
          {isSelected && (
            <>
              <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-yellow-400/5 rounded-lg"></div>
            </>
          )}
          
          {/* Affordability Indicator */}
          {!canAfford && (
            <div className="absolute inset-0 bg-red-900/50 rounded-lg flex items-center justify-center">
              <div className="text-red-400 text-xs font-bold font-mono text-center group-hover:text-sm hover:text-base transition-all duration-500">
                NO<br/>ENERGY
              </div>
            </div>
          )}
        </div>

        {/* Enhanced tooltip for hovered card */}
        {isSelected && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
            <div className="bg-black/95 border border-cyan-400/50 rounded-lg p-3 max-w-xs backdrop-blur-sm">
              <div className="text-cyan-400 font-bold text-sm font-mono mb-2">
                {card.name}
              </div>
              <div className="text-gray-300 text-xs leading-relaxed mb-2">
                {card.description}
              </div>
              {card.abilities && (
                <div className="pt-2 border-t border-gray-600">
                  <div className="text-yellow-400 text-xs font-bold font-mono mb-1">
                    ABILITIES:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {card.abilities.map((ability, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded font-mono">
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
      {/* Cards Container - Expands to accommodate larger cards */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 relative overflow-visible group-hover:py-6 transition-all duration-500">
        {/* Background Grid - Subtle */}
        <div className="absolute inset-0 opacity-3">
          <div className="grid-background"></div>
        </div>
        
        <div className="flex space-x-3 max-w-full overflow-x-auto overflow-y-visible relative z-10 group-hover:space-x-4 transition-all duration-500">
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

        {/* Floating Hand Info - Top Right Corner */}
        <div className="absolute top-2 right-4 text-xs text-gray-400 font-mono opacity-60 group-hover:opacity-80 transition-opacity duration-500">
          <span className="text-cyan-400">{handCards.length}</span>/7
        </div>
      </div>

      {/* Energy Bar - Fixed, no expansion */}
      <div className="px-4 py-2 bg-gradient-to-r from-black/60 to-black/40 border-t border-cyan-400/20">
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-cyan-400 font-mono">ENERGY:</span>
          <div className="flex space-x-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-4 rounded-sm transition-all duration-300 ${
                  i < availableEnergy 
                    ? 'bg-cyan-400 shadow-cyan-400/50 shadow-sm scale-110' 
                    : 'bg-gray-700 border border-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-cyan-400 font-bold font-mono text-sm">
            {availableEnergy}/10
          </span>
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