import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import Battlefield from '@/features/battlefield/Battlefield';
import PlayerHUD from '@/features/players/PlayerHUD';
import CardHand from '@/features/cards/CardHand';
import TurnManager from '@/features/battlefield/TurnManager';
import OpponentHand from '@/features/players/OpponentHand';
import { GameState, Card, Faction } from '@/types/game.types';
import FactionSelector from './FactionSelector';
import GameHeader from './GameHeader';

// Define TurnPhase type since it's not exported from game.types
type TurnPhase = 'draw' | 'energy' | 'main' | 'combat' | 'end';

// Turn phases in order
const TURN_PHASES: TurnPhase[] = ['draw', 'energy', 'main', 'combat', 'end'];

// Convert turn phases to display format
const DISPLAY_PHASES = ['DRAW', 'ENERGY', 'MAIN', 'COMBAT', 'END'];

const GameInterface: React.FC = () => {
  const { theme, setFaction } = useTheme();
  const [gameState, setGameState] = useState<GameState & { currentPhase: TurnPhase }>({
    currentTurn: 1,
    activePlayer: 'player1',
    currentPhase: 'main', // Default to main phase
    momentum: 3,
    energy: 7,
    health: 100,
    enemyHealth: 100,
  });

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showFactionSelect, setShowFactionSelect] = useState<boolean>(true);
  const [selectedFaction, setSelectedFaction] = useState<Faction>('solaris');

  // Update resources based on phase changes
  useEffect(() => {
    if (gameState.currentPhase === 'energy' && gameState.activePlayer === 'player1') {
      // Replenish energy at the start of energy phase
      setGameState(prev => ({
        ...prev,
        energy: Math.min(prev.currentTurn, 10), // Energy caps at 10
      }));
    }
  }, [gameState.currentPhase, gameState.activePlayer, gameState.currentTurn]);

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
    // Validate if player has enough energy to play the card
    if (card.cost > gameState.energy) {
      console.warn('Not enough energy to play this card');
      return;
    }
    
    setSelectedCard(card);
  };

  // Adjusted to match Battlefield component's expected signature
  const handleCardPlayed = (_position: string) => {
    if (selectedCard) {
      // Deduct energy cost when card is played
      setGameState(prev => ({
        ...prev,
        energy: prev.energy - selectedCard.cost,
      }));
      
      setSelectedCard(null);
    }
  };

  const handleEndTurn = () => {
    setGameState(prevState => ({
      ...prevState,
      currentTurn: prevState.currentTurn + 1,
      activePlayer: prevState.activePlayer === 'player1' ? 'player2' : 'player1',
      currentPhase: 'draw', // Reset to draw phase for next turn
    }));
  };

  const handleFactionSelect = (faction: Faction) => {
    setSelectedFaction(faction);
    setFaction(faction);
    setShowFactionSelect(false);
  };

  if (showFactionSelect) {
    return (
      <FactionSelector 
        factions={['solaris', 'umbral', 'neuralis', 'aeonic', 'infernal', 'primordial']}
        selectedFaction={selectedFaction}
        onFactionSelect={handleFactionSelect}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black bg-[var(--gradient-bg)]">
      {/* Game Header */}
      <GameHeader 
        theme={theme}
        selectedFaction={selectedFaction}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onShowFactionSelect={() => setShowFactionSelect(true)}
      />
      
      {/* Main Game Area */}
      <main className="flex-1 flex flex-col">
        {/* Opponent Area */}
        <div className="flex-1 flex flex-col justify-start pt-4 px-4">
          <OpponentHand cardCount={5} isActive={gameState.activePlayer === 'player2'} />
        </div>
        
        {/* Battlefield */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <Battlefield 
              selectedCard={selectedCard} 
              onCardPlayed={handleCardPlayed}
            />
          </div>
        </div>
        
        {/* Player Area */}
        <div className="flex-1 flex flex-col justify-end pb-4 px-4">
          <div className="mb-4">
            <PlayerHUD 
              health={gameState.health}
              energy={gameState.energy}
              maxEnergy={10}
              momentum={gameState.momentum}
              player="player1"
              isActive={gameState.activePlayer === 'player1'}
            />
          </div>
          
          <div className="mb-4">
            <TurnManager 
              currentTurn={gameState.currentTurn}
              activePlayer={gameState.activePlayer}
              onEndTurn={handleEndTurn}
              currentPhase={gameState.currentPhase}
              phases={DISPLAY_PHASES}
              currentPhaseIndex={TURN_PHASES.indexOf(gameState.currentPhase)}
            />
          </div>
          
          <CardHand 
            onCardSelect={handleCardSelect}
            selectedCard={selectedCard}
            energy={gameState.energy}
          />
        </div>
      </main>
      
      {/* Game Overlay (for modals, etc) */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Add overlay elements here */}
      </div>
    </div>
  );
};

export default GameInterface;