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
          {/** Faction style maps to avoid inline styles **/}
          {/** Background/border **/}
          {/** Title color **/}
          {/** Keep duplication minimal and readable **/}
          {/** These are approximate visual matches to factionThemes **/}
          {/** Solaris, Umbral, Neuralis, Aeonic, Infernal, Primordial, Synthetic **/}
          {/** Using Tailwind arbitrary colors for gradients **/}
          {/** Consider centralizing if reused elsewhere **/}
          {FACTIONS.map((faction) => {
            const factionTheme = factionThemes[faction];
            const bgBorderClass: Record<Faction, string> = {
              solaris: 'bg-gradient-to-br from-[#0A0A1A] to-[#1A1A3A] border-[#FFD700]/25',
              umbral: 'bg-gradient-to-br from-[#0A0A0A] to-[#1A0A1A] border-[#9B59B6]/25',
              neuralis: 'bg-gradient-to-br from-[#001A1A] to-[#003333] border-[#00CED1]/25',
              aeonic: 'bg-gradient-to-br from-[#0A0A1A] to-[#1A0A2A] border-[#9370DB]/25',
              infernal: 'bg-gradient-to-br from-[#1A0A0A] to-[#3A0A0A] border-[#FF4500]/25',
              primordial: 'bg-gradient-to-br from-[#0A1A0A] to-[#0A2A0A] border-[#32CD32]/25',
              synthetic: 'bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border-[#C0C0C0]/25',
            };
            const titleColor: Record<Faction, string> = {
              solaris: 'text-[#FFD700]',
              umbral: 'text-[#9B59B6]',
              neuralis: 'text-[#00CED1]',
              aeonic: 'text-[#9370DB]',
              infernal: 'text-[#FF4500]',
              primordial: 'text-[#32CD32]',
              synthetic: 'text-[#C0C0C0]',
            };
            const baseButton = 'p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center border';
            return (
              <button
                key={faction}
                onClick={() => handleFactionSelect(faction)}
                className={`${baseButton} ${bgBorderClass[faction]} ${
                  selectedFaction === faction ? 'ring-4 ring-primary/70' : ''
                }`}
              >
                <div className="text-4xl mb-2">
                  {faction === 'solaris' && '☀️'}
                  {faction === 'umbral' && '🌑'}
                  {faction === 'neuralis' && '🧠'}
                  {faction === 'aeonic' && '⏳'}
                  {faction === 'infernal' && '🔥'}
                  {faction === 'primordial' && '🌱'}
                  {faction === 'synthetic' && ''}
                </div>
                <h3 className={`text-xl font-bold mb-1 ${titleColor[faction]}`}>
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
    <div className="min-h-screen flex flex-col bg-[var(--gradient-bg)]">
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
