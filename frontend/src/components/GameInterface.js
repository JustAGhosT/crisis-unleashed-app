import React, { useState } from 'react';
import Battlefield from './Battlefield';
import PlayerHUD from './PlayerHUD';
import CardHand from './CardHand';
import TurnManager from './TurnManager';

const GameInterface = () => {
  const [gameState, setGameState] = useState({
    currentTurn: 1,
    activePlayer: 'player1',
    momentum: 3,
    energy: 7,
    health: 100,
    enemyHealth: 100
  });

  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div className="game-interface min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black relative overflow-hidden">
      {/* Holographic Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid-background"></div>
      </div>
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      {/* Main Game Layout */}
      <div className="relative z-10 h-screen flex flex-col">
        
        {/* Top HUD - Enemy Info */}
        <div className="h-20 border-b border-cyan-400/30 bg-black/40 backdrop-blur-sm">
          <PlayerHUD 
            player="enemy" 
            health={gameState.enemyHealth}
            position="top"
          />
        </div>

        {/* Main Game Area */}
        <div className="flex-1 flex">
          
          {/* Left Panel - Game Status */}
          <div className="w-80 border-r border-cyan-400/30 bg-black/40 backdrop-blur-sm p-4">
            <TurnManager 
              currentTurn={gameState.currentTurn}
              activePlayer={gameState.activePlayer}
              onEndTurn={() => {
                setGameState(prev => ({
                  ...prev,
                  currentTurn: prev.currentTurn + 1,
                  activePlayer: prev.activePlayer === 'player1' ? 'enemy' : 'player1'
                }))
              }}
            />
          </div>

          {/* Center - Battlefield */}
          <div className="flex-1 relative">
            <Battlefield 
              selectedCard={selectedCard}
              onCardPlay={(position) => {
                console.log('Card played at position:', position);
                setSelectedCard(null);
              }}
            />
          </div>

          {/* Right Panel - Resources */}
          <div className="w-80 border-l border-cyan-400/30 bg-black/40 backdrop-blur-sm p-4">
            <PlayerHUD 
              player="player" 
              health={gameState.health}
              momentum={gameState.momentum}
              energy={gameState.energy}
              position="right"
            />
          </div>
        </div>

        {/* Bottom - Player Hand */}
        <div className="h-48 border-t border-cyan-400/30 bg-black/40 backdrop-blur-sm">
          <CardHand 
            selectedCard={selectedCard}
            onCardSelect={setSelectedCard}
          />
        </div>
      </div>

      {/* Console Border Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>
      </div>
    </div>
  );
};

export default GameInterface;