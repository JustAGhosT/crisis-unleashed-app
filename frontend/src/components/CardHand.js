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
      description: "Basic infantry unit with enhanced targeting systems"
    },
    {
      id: 2,
      name: "Neural Hack",
      type: "action",
      cost: 2,
      rarity: "rare",
      description: "Disable enemy unit for one turn"
    },
    {
      id: 3,
      name: "Plasma Cannon",
      type: "character",
      cost: 5,
      attack: 4,
      health: 2,
      rarity: "epic",
      description: "Heavy weapons platform with area damage"
    },
    {
      id: 4,
      name: "Data Stream",
      type: "action",
      cost: 1,
      rarity: "common",
      description: "Draw 2 cards from your deck"
    },
    {
      id: 5,
      name: "Quantum Guardian",
      type: "character",
      cost: 7,
      attack: 5,
      health: 6,
      rarity: "legendary",
      description: "Elite defender with phase shield technology"
    }
  ];

  const Card = ({ card, isSelected, onClick }) => {
    const isCharacter = card.type === 'character';
    const rarityColors = {
      common: 'from-gray-600 to-gray-700 border-gray-400',
      rare: 'from-blue-600 to-blue-700 border-blue-300',
      epic: 'from-purple-600 to-purple-700 border-purple-300',
      legendary: 'from-yellow-600 to-yellow-700 border-yellow-300'
    };

    return (
      <div
        className={`
          card relative cursor-pointer transition-all duration-300 select-none
          ${isCharacter ? 'aspect-[3/4] w-24' : 'aspect-[4/3] w-32'}
          ${isSelected ? 'transform -translate-y-6 scale-110 z-20' : 'hover:-translate-y-3 hover:scale-105'}
        `}
        onClick={onClick}
      >
        <div className={`
          h-full w-full rounded-lg border-2 bg-gradient-to-br backdrop-blur-sm
          ${rarityColors[card.rarity]}
          ${isSelected ? 'border-opacity-100 shadow-2xl shadow-yellow-400/30' : 'border-opacity-80 shadow-lg'}
          overflow-hidden
        `}>
          {/* Card Header */}
          <div className="p-1.5 border-b border-white/20 bg-black/40">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-xs truncate">
                  {card.name}
                </h3>
                <div className="text-xs text-gray-300 capitalize">
                  {card.type}
                </div>
              </div>
              <div className="ml-1 flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-cyan-400 text-black text-xs font-bold flex items-center justify-center">
                  {card.cost}
                </div>
              </div>
            </div>
          </div>

          {/* Card Art Placeholder */}
          <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center min-h-[60px]">
            <div className={`text-2xl ${isSelected ? 'animate-pulse' : ''}`}>
              {isCharacter ? '👤' : '⚡'}
            </div>
          </div>

          {/* Card Stats (Character only) */}
          {isCharacter && (
            <div className="px-1.5 py-1 bg-black/60 flex justify-between text-xs font-bold">
              <div className="text-red-400">
                ATK: {card.attack}
              </div>
              <div className="text-green-400">
                HP: {card.health}
              </div>
            </div>
          )}

          {/* Card Description */}
          <div className="p-1.5 bg-black/80">
            <p className="text-xs text-gray-200 line-clamp-2 leading-tight">
              {card.description}
            </p>
          </div>

          {/* Holographic Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 pointer-events-none"></div>
          
          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="hand h-full flex flex-col">
      {/* Hand Header */}
      <div className="flex justify-between items-center p-4 border-b border-cyan-400/30">
        <h2 className="text-cyan-400 font-bold font-mono">
          TACTICAL HAND
        </h2>
        <div className="text-sm text-gray-400">
          Cards: {handCards.length}/7 • Energy Available: 8
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <div className="flex space-x-3 max-w-full overflow-x-auto pb-2">
          {handCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isSelected={selectedCard?.id === card.id}
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

      {/* Selected Card Info */}
      {selectedCard && (
        <div className="px-4 py-2 bg-yellow-900/20 border-t border-yellow-400/30">
          <div className="text-yellow-400 text-sm font-bold">
            {selectedCard.name} selected
          </div>
          <div className="text-xs text-gray-300">
            Click on the battlefield to deploy this {selectedCard.type}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardHand;