import React from 'react';

const TurnManager = ({ currentTurn, activePlayer, onEndTurn }) => {
  const isPlayerTurn = activePlayer === 'player1';
  
  return (
    <div className="turn-manager h-full flex flex-col space-y-4">
      {/* Turn Counter */}
      <div className="text-center border-b border-cyan-400/30 pb-4">
        <div className="text-2xl font-bold text-cyan-400 font-mono">
          TURN {currentTurn}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          Crisis Unleashed Protocol
        </div>
      </div>

      {/* Active Player Indicator */}
      <div className="space-y-3">
        <div className="text-sm font-mono text-gray-400 text-center">
          ACTIVE COMMANDER
        </div>
        
        <div className={`
          p-4 rounded-lg border-2 transition-all duration-500
          ${isPlayerTurn 
            ? 'border-cyan-400 bg-cyan-900/20 shadow-cyan-400/20 shadow-lg' 
            : 'border-red-400 bg-red-900/20 shadow-red-400/20 shadow-lg'
          }
        `}>
          <div className={`
            text-center font-bold text-lg font-mono
            ${isPlayerTurn ? 'text-cyan-400' : 'text-red-400'}
          `}>
            {isPlayerTurn ? 'YOUR TURN' : 'ENEMY TURN'}
          </div>
          
          {isPlayerTurn && (
            <div className="mt-2 text-xs text-gray-300 text-center">
              Deploy units • Cast actions • End turn
            </div>
          )}
        </div>
      </div>

      {/* Phase Indicator */}
      <div className="space-y-2">
        <div className="text-sm font-mono text-gray-400 text-center">
          COMBAT PHASE
        </div>
        
        <div className="space-y-1">
          {['Deploy', 'Attack', 'End'].map((phase, index) => (
            <div key={phase} className={`
              p-2 rounded text-xs font-mono text-center transition-colors
              ${index === 0 && isPlayerTurn 
                ? 'bg-yellow-600/30 text-yellow-400 border border-yellow-400/50' 
                : 'bg-gray-800/50 text-gray-500'
              }
            `}>
              {phase.toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {/* End Turn Button */}
      {isPlayerTurn && (
        <div className="mt-auto pt-4">
          <button
            onClick={onEndTurn}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 
                     text-white font-bold rounded-lg border border-orange-400/50 
                     transition-all duration-300 shadow-lg hover:shadow-orange-400/20
                     active:scale-95"
          >
            <div className="font-mono text-sm">
              END TURN
            </div>
          </button>
        </div>
      )}

      {/* System Status */}
      <div className="space-y-2 pt-4 border-t border-cyan-400/30">
        <div className="text-xs font-mono text-gray-400 text-center">
          SYSTEM STATUS
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Network:</span>
            <span className="text-green-400">ONLINE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Sync:</span>
            <span className="text-cyan-400">LOCKED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">AI Core:</span>
            <span className="text-yellow-400">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Console Access */}
      <div className="text-center pt-2">
        <button className="text-xs text-gray-500 hover:text-cyan-400 transition-colors font-mono">
          [ADMIN_CONSOLE_ACCESS]
        </button>
      </div>
    </div>
  );
};

export default TurnManager;