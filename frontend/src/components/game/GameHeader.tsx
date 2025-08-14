import React from 'react';
import { Faction } from '@/types/game.types';
import { FactionTheme } from '@/theme/factionThemes';

interface GameHeaderProps {
  theme: FactionTheme;
  selectedFaction: Faction;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onShowFactionSelect: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  theme,
  selectedFaction,
  isFullscreen,
  onToggleFullscreen,
  onShowFactionSelect,
}) => {
  return (
    <header className="bg-black bg-opacity-50 backdrop-blur-sm p-2 border-b border-opacity-20 border-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={onShowFactionSelect}
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
            onClick={onToggleFullscreen}
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
  );
};

export default GameHeader;