import React, { useCallback, useMemo } from 'react';
import { Card, CardRarity } from '@/types/game.types';
import { MOCK_CARDS } from '@/constants/mockCards';
import { useTheme } from '@/theme/ThemeProvider';
import clsx from 'clsx';

interface CardHandProps {
  selectedCard: Card | null;
  onCardSelect: (card: Card) => void;
  cards?: Card[];
  maxHandSize?: number;
  energy?: number;
}

const CardHand: React.FC<CardHandProps> = ({
  selectedCard,
  onCardSelect,
  cards = [],
  maxHandSize = 7,
  energy = 0,
}) => {
  const { theme } = useTheme();
  
  // Use provided cards or fall back to mock cards
  const handCards = useMemo<Card[]>(() => 
    cards.length > 0 ? cards : MOCK_CARDS
  , [cards]);

  const handleCardClick = useCallback((card: Card) => {
    // Only allow selection if player has enough energy
    if (card.cost <= energy) {
      onCardSelect(card);
    }
  }, [energy, onCardSelect]);



  const getCardTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      character: 'bg-blue-900/50 border-blue-500/50',
      action: 'bg-red-900/50 border-red-500/50',
      upgrade: 'bg-green-900/50 border-green-500/50',
      tactic: 'bg-purple-900/50 border-purple-500/50',
    };
    return colors[type] || 'bg-gray-900/50 border-gray-600/50';
  };

  const getRarityGradient = (rarity: CardRarity): string => {
    const gradients: Record<CardRarity, string> = {
      common: 'from-gray-600/50 to-gray-700/50',
      uncommon: 'from-green-600/50 to-green-800/50',
      rare: 'from-blue-600/50 to-blue-800/50',
      epic: 'from-purple-600/50 to-indigo-800/50',
      legendary: 'from-yellow-500/50 to-orange-600/50',
    };
    return gradients[rarity] || 'from-gray-600/50 to-gray-700/50';
  };

  const getTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      character: '👤',
      action: '⚡',
      upgrade: '⬆️',
      tactic: '🎯',
    };
    return icons[type] || '❓';
  };
      legendary: styles.rarityLegendary,
    };
    return classes[rarity] || styles.rarityCommon;
  };

  const getTypeClass = (type: string): string => {
    const classes: Record<string, string> = {
      character: styles.typeCharacter,
      action: styles.typeAction,
      upgrade: styles.typeUpgrade,
      tactic: styles.typeTactic,
    };
    return classes[type] || '';
  };

  if (handCards.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>No cards in hand</p>
      </div>
    );
  }

  return (
    <div className={styles.handContainer}>
      <div className={styles.handHeader}>
          const isSelected = selectedCard?.id === card.id;
          const canAfford = card.cost <= energy;
          const isPlayable = canAfford && !isSelected;
          const rotation = (index - (handCards.length - 1) / 2) * 3;
          const yOffset = isSelected ? -40 : 0;
          const zIndex = isSelected ? 100 : 10 + index;
          const scale = isSelected ? 1.1 : 1;
          
          return (
            <div
              key={card.id}
              className={clsx(
                'relative w-32 h-48 rounded-lg transition-all duration-300 cursor-pointer shadow-xl',
                'flex flex-col overflow-hidden',
                'transform-gpu',
                'border-2',
                'hover:shadow-2xl hover:z-50',
                getCardTypeColor(card.type).split(' '),
                {
                  'scale-110 -translate-y-10 z-50 shadow-2xl': isSelected,
                  'opacity-60 grayscale': !canAfford,
                  'hover:scale-105 hover:-translate-y  -2': !isSelected && canAfford,
                  'ring-2 ring-yellow-400': isPlayable,
                  'ring-2 ring-white/30': !isPlayable && !isSelected,
                }
              )}
              style={{
                transform: `rotate(${rotation}deg) translateY(${yOffset}px) scale(${scale})`,
                zIndex,
                transformOrigin: 'bottom center',
                background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.9) 0%, rgba(20, 20, 20, 0.95) 100%)',
              }}
              onClick={() => handleCardClick(card)}
            >
              {/* Card Rarity Accent */}
              <div 
                className={clsx(
                  'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
                  getRarityGradient(card.rarity)
                )}
              />
              
              {/* Card Header */}
              <div className="flex justify-between items-center p-2 pb-1">
                <div className="text-xs font-bold text-white truncate">
                  {card.name}
                </div>
                <div className={clsx(
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                  'border',
                  canAfford 
                    ? 'bg-yellow-900/50 border-yellow-500/50 text-yellow-400'
                    : 'bg-gray-900/50 border-gray-600/50 text-gray-500'
                )}>
                  {card.cost}
                </div>
              </div>
              
              {/* Card Art */}
              <div className="relative flex-1 m-1.5 rounded bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
                  {getTypeIcon(card.type)}
                </div>
                {card.imageUrl && (
                  <img 
                    src={card.imageUrl} 
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {/* Card Description */}
              <div className="px-2 py-1 text-2xs text-gray-300 h-12 overflow-hidden">
                {card.description}
              </div>
              
              {/* Card Footer */}
              <div className="flex justify-between items-center px-2 py-1 text-2xs border-t border-white/5">
                <div className="capitalize text-gray-400">
                  {card.type}
                        aria-label={`Ability: ${ability}`}
                        title={ability}
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.hoverEffect}></div>
            </div>
          );
        })}
      </div>

      <div className={styles.cardBack}></div>
    </div>
  );
};

export default CardHand;
