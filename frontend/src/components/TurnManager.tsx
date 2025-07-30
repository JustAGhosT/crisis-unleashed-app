import React, { useCallback, useEffect, useState } from 'react';
import { PlayerId } from '../types/game.types';
import styles from './TurnManager.module.css';

interface TurnManagerProps {
  currentTurn: number;
  activePlayer: PlayerId;
  onEndTurn: () => void;
  phases?: string[];
  currentPhaseIndex?: number;
  className?: string;
}

const TurnManager: React.FC<TurnManagerProps> = ({
  currentTurn,
  activePlayer,
  onEndTurn,
  phases = ['DEPLOY', 'ACTION', 'END'],
  currentPhaseIndex = 0,
  className = '',
}) => {
  const isPlayerTurn = activePlayer === 'player1';
  const [timeRemaining, setTimeRemaining] = useState(105); // 1:45 in seconds
  
  // Reset timer when turn changes
  useEffect(() => {
    setTimeRemaining(105);
  }, [currentTurn]);
  
  // Countdown timer
  useEffect(() => {
    if (!isPlayerTurn) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlayerTurn, currentTurn]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPhaseIndicator = useCallback(
    (phase: string, index: number) => {
      const isActive = index === currentPhaseIndex;
      const isCompleted = index < currentPhaseIndex;
      
      return (
        <div
          key={phase}
          className={`${styles.phaseIndicator} ${
            isActive 
              ? styles.phaseActive 
              : isCompleted 
                ? styles.phaseCompleted 
                : styles.phasePending
          }`}
          title={phase}
        >
          <div className={styles.phaseName}>{phase}</div>
          {isActive && <div className={styles.phasePulse} />}
        </div>
      );
    },
    [currentPhaseIndex]
  );

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Turn Counter */}
      <div className={styles.turnCounter}>
        <h2 className={styles.turnNumber}>TURN {currentTurn}</h2>
        <div className={styles.subtitle}>Crisis Unleashed Protocol</div>
      </div>

      {/* Active Player Indicator */}
      <div className={styles.activePlayerSection}>
        <h3 className={styles.sectionTitle}>ACTIVE COMMANDER</h3>

        <div 
          className={`${styles.activePlayerCard} ${
            isPlayerTurn ? styles.activePlayerCardPlayer : styles.activePlayerCardOpponent
          }`}
        >
          <div 
            className={`${styles.activePlayerText} ${
              isPlayerTurn ? styles.activePlayerTextPlayer : styles.activePlayerTextOpponent
            }`}
          >
            {isPlayerTurn ? 'YOUR TURN' : 'ENEMY TURN'}
          </div>
          
          <div className={styles.turnInfo}>
            <span>Turn {currentTurn}</span>
            <span>Phase {currentPhaseIndex + 1}/{phases.length}</span>
          </div>
        </div>
      </div>

      {/* Turn Phases */}
      <div className={styles.phasesSection}>
        <h3 className={styles.sectionTitle}>TURN PHASES</h3>
        <div className={styles.phasesContainer}>
          {phases.map((phase, index) => renderPhaseIndicator(phase, index))}
        </div>
      </div>

      {/* End Turn Button */}
      <button
        onClick={onEndTurn}
        disabled={!isPlayerTurn}
        className={`${styles.endTurnButton} ${
          isPlayerTurn ? styles.endTurnButtonActive : styles.endTurnButtonInactive
        }`}
      >
        {isPlayerTurn ? 'End Turn' : 'Waiting...'}
      </button>

      {/* Turn Timer */}
      <div className={styles.turnTimer} aria-live="polite">
        Turn timer: {formatTime(timeRemaining)}
      </div>
    </div>
  );
};

export default TurnManager;
