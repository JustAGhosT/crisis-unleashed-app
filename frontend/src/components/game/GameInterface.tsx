import React, { useState, useCallback } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import Battlefield from '@/features/battlefield/Battlefield';
import PlayerHUD from '@/features/players/PlayerHUD';
import CardHand from '@/features/cards/CardHand';
import TurnManager from '@/features/battlefield/TurnManager';
import OpponentHand from '@/features/players/OpponentHand';
import { GameState, Card, Faction } from '@/types/game.types';
import { factionThemes } from '@/theme/factionThemes';

// Faction selection for demo purposes
const FACTIONS: Faction[] = ['solaris', 'umbral', 'neuralis', 'aeonic', 'infernal', 'primordial'];

const GameInterface: React.FC = () => {
  const { theme, setFaction } = useTheme();
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
  const [showFactionSelect, setShowFactionSelect] = useState<boolean>(true);
  const [selectedFaction, setSelectedFaction] = useState<Faction>('solaris');

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

  const handleFactionSelect = (faction: Faction) => {
    setSelectedFaction(faction);
    setFaction(faction);
    setShowFactionSelect(false);
  };

  if (showFactionSelect) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
            Crisis Unleashed
          </h1>
          <p className="text-gray-300 text-lg">Choose your faction</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl w-full">
          {FACTIONS.map((faction) => {
            const factionTheme = factionThemes[faction];
            return (
              <button
                key={faction}
                onClick={() => handleFactionSelect(faction)}
                className={`p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center ${
                  selectedFaction === faction ? 'ring-4 ring-primary ring-opacity-70' : ''
                }`}
                style={{
                  background: `linear-gradient(135deg, ${factionTheme.colors.background} 0%, ${factionTheme.colors.secondary}20 100%)`,
                  border: `1px solid ${factionTheme.colors.primary}40`,
                }}
              >
                <div className="text-4xl mb-2">
                  {faction === 'solaris' && '☀️'}
                  {faction === 'umbral' && '🌑'}
                  {faction === 'neuralis' && '🧠'}
                  {faction === 'aeonic' && '⏳'}
                  {faction === 'infernal' && '🔥'}
                  {faction === 'primordial' && '🌱'}
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ color: factionTheme.colors.primary }}>
                  {factionTheme.name}
                </h3>
                <p className="text-xs text-gray-300 text-center">
                  {faction === 'solaris' && 'Radiant energy and solar mastery'}
                  {faction === 'umbral' && 'Darkness and void manipulation'}
                  {faction === 'neuralis' && 'Psionic networks and mind control'}
                  {faction === 'aeonic' && 'Time manipulation and destiny weaving'}
                  {faction === 'infernal' && 'Chaos and destruction'}
                  {faction === 'primordial' && 'Nature and life essence'}
                </p>
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => handleFactionSelect(selectedFaction)}
          className="mt-8 px-6 py-2 bg-primary bg-opacity-20 text-primary border border-primary rounded-full hover:bg-opacity-30 transition-all"
        >
          Continue with {factionThemes[selectedFaction].name}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.gradient }}>
      {/* Game Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-sm p-2 border-b border-opacity-20 border-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFactionSelect(true)}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
              aria-label="Change faction"
            >
              {selectedFaction === 'solaris' && '☀️'}
              {selectedFaction === 'umbral' && '🌑'}
              {selectedFaction === 'neuralis' && '🧠'}
              {selectedFaction === 'aeonic' && '⏳'}
              {selectedFaction === 'infernal' && '🔥'}
              {selectedFaction === 'primordial' && '🌱'}
            </button>
            <h1 className="text-xl font-bold text-white">
              {theme.name}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors text-white"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? '⤵️' : '⤴️'}
            </button>
            <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors text-white">
              ⚙️
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Game Area */}
      <main className="flex-1 flex flex-col">
        {/* Opponent Area */}
        <div className="flex-1 flex flex-col justify-start pt-4 px-4">
          <OpponentHand cardCount={5} isActive={gameState.activePlayer === 'player2'} />
        </div>
        
        {/* Battlefield */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <Battlefield selectedCard={selectedCard} onCardPlayed={() => setSelectedCard(null)} />
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
            />
          </div>
          
          <div className="mb-4">
            <TurnManager 
              currentTurn={gameState.currentTurn}
              activePlayer={gameState.activePlayer}
              onEndTurn={handleEndTurn}
            />
          </div>
          
          <CardHand 
            onCardSelect={handleCardSelect}
            selectedCard={selectedCard}
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
