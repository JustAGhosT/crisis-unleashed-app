import React, { useState, useCallback } from 'react';
import Battlefield from './Battlefield';
import PlayerHUD from './PlayerHUD';
import CardHand from './CardHand';
import TurnManager from './TurnManager';
import OpponentHand from './OpponentHand';
import { GameState, Card } from '../types/game.types';
import styles from './GameInterface.module.css';

const GameInterface: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentTurn: 1,
    activePlayer: 'player1',
    momentum: 3,
    energy: 7,
    health: 100,
    enemyHealth: 100,
  });

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Add proper type for the card parameter
  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  const handleEndTurn = () => {
    setGameState(prevState => ({
      ...prevState,
      currentTurn: prevState.currentTurn + 1,
      activePlayer: prevState.activePlayer === 'player1' ? 'player2' : 'player1',
      energy: 7, // Reset energy at the start of turn
    }));
  };

  return (
    <div className={styles.container}>
      {/* Holographic Grid Background */}
      <div className={styles.gridBackground}></div>

      {/* Game Layout */}
      <div className={styles.layout}>
        {/* Opponent Area */}
        <div className={styles.opponentArea}>
          <OpponentHand 
            cardCount={5} // Default number of cards in opponent's hand
            isActive={gameState.activePlayer === 'player2'}
          />
        </div>

        {/* Battlefield */}
        <div className={styles.battlefieldArea}>
          <Battlefield 
            selectedCard={selectedCard}
            onCardPlayed={() => setSelectedCard(null)}
          />
        </div>

        {/* Player Area */}
        <div className={`${styles.playerArea} ${gameState.activePlayer === 'player1' ? styles.activePlayer : ''}`}>
          <PlayerHUD 
            health={gameState.health}
            energy={gameState.energy}
            momentum={gameState.momentum}
            isActive={gameState.activePlayer === 'player1'}
          />
          
          <CardHand 
            onCardSelect={handleCardSelect}
            selectedCard={selectedCard}
          />
          
          <TurnManager 
            currentTurn={gameState.currentTurn}
            onEndTurn={handleEndTurn}
            activePlayer={gameState.activePlayer}
          />
        </div>
      </div>

      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className={styles.fullscreenButton}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </button>
    </div>
  );
};

export default GameInterface;
