import { PlayerId } from '@/types/game.types';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './TurnManager.module.css';

interface TurnManagerProps {
  currentTurn: number;
  activePlayer: PlayerId;
  onEndTurn: () => void;
  phases?: string[];
  currentPhaseIndex?: number;
  currentPhase: string;
  className?: string;
}

const TurnManager: React.FC<TurnManagerProps> = ({
  currentTurn,
  activePlayer,
  onEndTurn,
  phases = ['DEPLOY', 'ACTION', 'END'],
  currentPhaseIndex = 0,
  currentPhase: _currentPhase = '',
  className = '',
}) => {
  const isPlayerTurn = activePlayer === 'player1';
  const [timeRemaining, setTimeRemaining] = useState(105); // 1:45 in seconds
  const progressRef = useRef<HTMLDivElement | null>(null);
  
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
  }, [isPlayerTurn]);

  // Apply CSS vars for phase progress without inline style prop
  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    const progress = `${((currentPhaseIndex + 1) / phases.length) * 100}%`;
    el.style.setProperty('--phase-progress', progress);
    el.style.setProperty('--phase-opacity', isPlayerTurn ? '1' : '0.5');
  }, [currentPhaseIndex, phases.length, isPlayerTurn]);
  
  const isLastPhase = currentPhaseIndex >= phases.length - 1;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPhaseIndicator = useCallback(
    (phase: string, index: number) => {
      const isActive = index === currentPhaseIndex;
      const isCompleted = index < currentPhaseIndex;
      const isUpcoming = index > currentPhaseIndex;
      
      return (
        <div 
          key={phase}
          className={clsx(
            'relative flex flex-col items-center group',
            'transition-all duration-200',
            {
              'opacity-100': isActive || isCompleted,
              'opacity-50': isUpcoming,
            }
          )}
        >
          <div 
            className={clsx(
              'w-3 h-3 rounded-full border-2 mb-1 transition-all',
              'flex items-center justify-center',
              {
                'bg-primary border-primary': isCompleted,
                'bg-transparent border-primary animate-pulse': isActive,
                'bg-transparent border-gray-600': isUpcoming,
              }
            )}
          >
            {isActive && (
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </div>
          <span 
            className={clsx(
              'text-xs font-medium transition-all',
              {
                'text-primary': isActive || isCompleted,
                'text-gray-400': isUpcoming,
              }
            )}
          >
            {phase}
          </span>
          {isActive && (
            <div className="absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {phase} Phase
            </div>
          )}
        </div>
      );
    },
    [currentPhaseIndex, isPlayerTurn]
  );

  return (
    <div className={clsx(
      'relative p-4 rounded-xl backdrop-blur-sm border border-opacity-20',
      'transition-all duration-300',
      {
        'bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/30': isPlayerTurn,
        'bg-gray-900/50 border-gray-700/50': !isPlayerTurn,
      },
      className
    )}>
      <div className="flex flex-col items-center">
        {/* Turn and Timer */}
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-sm font-mono font-bold bg-black/30 px-3 py-1 rounded-full border border-opacity-20">
              TURN {currentTurn}
            </div>
            <div className={clsx(
              'text-sm font-bold px-3 py-1 rounded-full flex items-center',
              {
                'bg-green-900/30 text-green-400 border border-green-500/30': isPlayerTurn,
                'bg-red-900/30 text-red-400 border border-red-500/30': !isPlayerTurn,
              }
            )}>
              <span className={clsx(
                'w-2 h-2 rounded-full mr-2',
                {
                  'bg-green-400 animate-pulse': isPlayerTurn,
                  'bg-red-400': !isPlayerTurn,
                }
              )} />
              {isPlayerTurn ? 'YOUR TURN' : "OPPONENT'S TURN"}
            </div>
          </div>
          
          {isPlayerTurn && (
            <div className={clsx(
              'flex items-center text-sm font-mono font-bold px-3 py-1 rounded-full',
              'transition-colors',
              {
                'text-yellow-400 bg-yellow-900/30 border border-yellow-500/30': timeRemaining > 30,
                'text-red-400 bg-red-900/30 border border-red-500/30 animate-pulse': timeRemaining <= 30,
              }
            )}>
              ⏱ {formatTime(timeRemaining)}
            </div>
          )}
        </div>
        
        {/* Phase Indicators */}
        <div className="w-full mb-3">
          <div className="relative">
            {/* Progress bar */}
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={clsx(
                  styles.phaseProgress,
                  'h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out'
                )}
                ref={progressRef}
              />
            </div>
            
            {/* Phase indicators */}
            <div className="flex justify-between mt-2">
              {phases.map((phase, index) => renderPhaseIndicator(phase, index))}
            </div>
          </div>
        </div>
        
        {/* End Turn Button */}
        {isPlayerTurn && (
          <button 
            onClick={onEndTurn}
            className={clsx(
              'mt-2 px-6 py-2 rounded-full font-bold text-sm tracking-wider uppercase',
              'transition-all duration-200 transform hover:scale-105 active:scale-95',
              'bg-gradient-to-r from-primary to-secondary text-white',
              'shadow-lg hover:shadow-xl hover:shadow-primary/20',
              'border-2 border-white border-opacity-10',
              'flex items-center space-x-2',
              {
                'animate-pulse': isLastPhase,
              }
            )}
          >
            <span>End {isLastPhase ? 'Round' : 'Turn'}</span>
            <span className="text-xs opacity-80">
              {isLastPhase ? '⏭️' : '↪️'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TurnManager;
