import React, { useState } from 'react';
import Battlefield from './Battlefield';
import PlayerHUD from './PlayerHUD';
import CardHand from './CardHand';
import TurnManager from './TurnManager';
import OpponentHand from './OpponentHand';

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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.log('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.log('Error attempting to exit fullscreen:', err);
      });
    }
  };

  return (
    <div className="game-interface min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black relative overflow-hidden">
      {/* Holographic Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid-background"></div>
      </div>
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/70 border border-cyan-400/50 rounded-lg backdrop-blur-sm hover:bg-cyan-900/40 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center group"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <svg className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5m11 11v4.5m0-4.5h4.5m0 0l-4.5 4.5M15 3h6v6M9 21H3v-6" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>

      {/* Main Game Layout */}
      <div className="relative z-10 h-screen flex flex-col">
        
        {/* Top HUD - Enemy Info with Centered Opponent Hand */}
        <div className="h-20 border-b border-cyan-400/30 bg-black/40 backdrop-blur-sm flex">
          <div className="flex-1">
            <PlayerHUD 
              player="enemy" 
              health={gameState.enemyHealth}
              position="top"
            />
          </div>
          
          {/* Centered Opponent Hand */}
          <div className="w-96 flex items-center justify-center">
            <OpponentHand />
          </div>
          
          <div className="flex-1">
            {/* Right side space for balance */}
          </div>
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

        {/* Bottom - Player Hand (Expands on hover to push toolbar down) */}
        <div className="card-hand-container h-64 border-t border-cyan-400/30 bg-black/40 backdrop-blur-sm transition-all duration-500 hover:h-80 group">
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