import React from 'react';
import { Faction } from '@/types/game.types';
import { factionThemes } from '@/theme/factionThemes';

interface FactionSelectorProps {
  factions: Faction[];
  selectedFaction: Faction;
  onFactionSelect: (faction: Faction) => void;
}

const FactionSelector: React.FC<FactionSelectorProps> = ({
  factions,
  selectedFaction,
  onFactionSelect,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
          Crisis Unleashed
        </h1>
        <p className="text-gray-300 text-lg">Choose your faction</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl w-full">
        {factions.map((faction) => {
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
              onClick={() => onFactionSelect(faction)}
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
        onClick={() => onFactionSelect(selectedFaction)}
        className="mt-8 px-6 py-2 bg-primary bg-opacity-20 text-primary border border-primary rounded-full hover:bg-opacity-30 transition-all"
      >
        Continue with {factionThemes[selectedFaction].name}
      </button>
    </div>
  );
};

export default FactionSelector;