import React from 'react';

const OpponentHand = () => {
  // Mock opponent's hand - showing card backs
  const opponentCards = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 }
  ];

  const CardBack = ({ cardId }) => {
    return (
      <div className="card-back relative w-8 h-12 cursor-default transition-all duration-300 hover:scale-105 hover:-translate-y-1">
        <div className="h-full w-full rounded border border-red-400/60 bg-gradient-to-br from-red-900/80 to-red-800/80 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-red-400/20">
          
          {/* Card Back Design */}
          <div className="relative h-full flex flex-col">
            
            {/* Top Section */}
            <div className="flex-1 relative bg-gradient-to-br from-red-800/60 to-red-900/60 border-b border-red-400/30">
              {/* Tech Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-2 grid-rows-2 h-full w-full gap-px">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-red-400/30"></div>
                  ))}
                </div>
              </div>
              
              {/* Central Symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border border-red-400/60 rotate-45 bg-red-700/40"></div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="h-3 bg-gradient-to-r from-red-900/80 to-red-800/80 flex items-center justify-center border-t border-red-400/20">
              {/* Small indicators */}
              <div className="flex space-x-0.5">
                <div className="w-1 h-1 bg-red-400/60 rounded-full"></div>
                <div className="w-1 h-1 bg-red-400/40 rounded-full"></div>
                <div className="w-1 h-1 bg-red-400/60 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Holographic Scan Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-400/10 to-transparent animate-pulse opacity-30"></div>
          
          {/* Border Glow on Hover */}
          <div className="absolute inset-0 border border-red-400/0 rounded transition-all duration-300 hover:border-red-400/80 hover:shadow-red-400/20"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="opponent-hand flex flex-col items-center justify-center h-full">
      {/* Compact Header */}
      <div className="mb-2">
        <div className="flex items-center space-x-2">
          <h3 className="text-red-400 font-bold font-mono text-xs">
            ENEMY HAND
          </h3>
          <div className="text-xs text-red-300/60 font-mono">
            [{opponentCards.length}]
          </div>
        </div>
      </div>

      {/* Cards Container - Centered */}
      <div className="flex items-center justify-center">
        <div className="flex space-x-1">
          {opponentCards.map((card) => (
            <CardBack key={card.id} cardId={card.id} />
          ))}
        </div>
      </div>

      {/* Compact Threat Level Indicator */}
      <div className="mt-2">
        <div className="flex items-center space-x-2">
          <div className="text-xs text-red-400 font-mono">
            THREAT:
          </div>
          <div className="flex space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-sm ${
                  i < 3 
                    ? 'bg-red-400 shadow-red-400/50' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpponentHand;