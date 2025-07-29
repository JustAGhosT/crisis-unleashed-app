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
      common: 'from-gray-600 to-gray-700 border-gray-500',
      rare: 'from-blue-600 to-blue-700 border-blue-400',
      epic: 'from-purple-600 to-purple-700 border-purple-400',
      legendary: 'from-yellow-600 to-yellow-700 border-yellow-400'
    };

    return (
      <div
        className={`
          card relative cursor-pointer transition-all duration-300 select-none
          ${isCharacter ? 'aspect-[3/4]' : 'aspect-[4/3]'}
          ${isSelected ? 'transform -translate-y-4 scale-110 z-20' : 'hover:-translate-y-2 hover:scale-105'}
        `}
        onClick={onClick}
      >
        <div className={`
          h-full w-full rounded-lg border-2 bg-gradient-to-br backdrop-blur-sm
          ${rarityColors[card.rarity]}
          ${isSelected ? 'border-opacity-100 shadow-2xl' : 'border-opacity-60 shadow-lg'}
          overflow-hidden
        `}>
          {/* Card Header */}
          <div className="p-2 border-b border-white/20">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm truncate">
                  {card.name}
                </h3>
                <div className="text-xs text-gray-300 capitalize">
                  {card.type}
                </div>
              </div>
              <div className="ml-2 flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-cyan-400 text-black text-xs font-bold flex items-center justify-center">
                  {card.cost}
                </div>
              </div>
            </div>
          </div>

          {/* Card Art Placeholder */}
          <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-4xl text-gray-600">
              {isCharacter ? '👤' : '⚡'}
            </div>
          </div>

          {/* Card Stats (Character only) */}
          {isCharacter && (
            <div className="px-2 py-1 bg-black/40 flex justify-between text-xs">
              <div className="text-red-400 font-bold">
                ATK: {card.attack}
              </div>
              <div className="text-green-400 font-bold">
                HP: {card.health}
              </div>
            </div>
          )}

          {/* Card Description */}
          <div className="p-2 bg-black/60">
            <p className="text-xs text-gray-300 line-clamp-2">
              {card.description}
            </p>
          </div>

          {/* Holographic Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 pointer-events-none"></div>
          
          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
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
        <div className="flex space-x-2 max-w-full overflow-x-auto">
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