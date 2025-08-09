import React, { useCallback, useMemo } from 'react';
import { Card, CardRarity, CardType } from '@/types/game.types';
import { MOCK_CARDS } from '@/constants/mockCards';
import clsx from 'clsx';
import styles from './CardHand.module.css';

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
  const handCards = useMemo<Card[]>(() => {
    const src = cards.length > 0 ? cards : MOCK_CARDS;
    return src.slice(0, maxHandSize);
  }, [cards, maxHandSize]);

  const handleCardClick = useCallback(
    (card: Card) => {
      if (card.cost <= energy) onCardSelect(card);
    },
    [energy, onCardSelect]
  );

  const getCardTypeColor = (type: CardType): string => {
    const colors: Record<CardType, string> = {
      [CardType.Character]: 'bg-blue-900/50 border-blue-500/50',
      [CardType.Action]: 'bg-red-900/50 border-red-500/50',
      [CardType.Upgrade]: 'bg-green-900/50 border-green-500/50',
      [CardType.Tactic]: 'bg-purple-900/50 border-purple-500/50',
    };
    return colors[type] ?? 'bg-gray-900/50 border-gray-600/50';
  };

  const getRarityGradient = (rarity: CardRarity): string => {
    const gradients: Record<CardRarity, string> = {
      [CardRarity.Common]: 'from-gray-600/50 to-gray-700/50',
      [CardRarity.Uncommon]: 'from-green-600/50 to-green-800/50',
      [CardRarity.Rare]: 'from-blue-600/50 to-blue-800/50',
      [CardRarity.Epic]: 'from-purple-600/50 to-indigo-800/50',
      [CardRarity.Legendary]: 'from-yellow-500/50 to-orange-600/50',
    };
    return gradients[rarity] ?? 'from-gray-600/50 to-gray-700/50';
  };

  const getTypeIcon = (type: CardType): string => {
    const icons: Record<CardType, string> = {
      [CardType.Character]: '👤',
      [CardType.Action]: '⚡',
      [CardType.Upgrade]: '⬆️',
      [CardType.Tactic]: '🎯',
    };
    return icons[type] ?? '❓';
  };

  if (handCards.length === 0) {
    return (
      <div className="w-full py-6 text-center text-sm text-gray-400">
        No cards in hand
      </div>
    );
  }

  return (
    <div className="relative w-full h-56 select-none">
      <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 px-4">
        {handCards.map((card, index) => {
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
                'flex flex-col overflow-hidden transform-gpu border-2 hover:shadow-2xl',
                'origin-bottom bg-gradient-to-br from-[#1e1e1e]/90 to-[#141414]/95',
                styles.cardTransform,
                styles.cardLayer,
                getCardTypeColor(card.type),
                {
                  'scale-110 -translate-y-10 z-50 shadow-2xl': isSelected,
                  'opacity-60 grayscale': !canAfford,
                  'hover:scale-105 hover:-translate-y-2': !isSelected && canAfford,
                  'ring-2 ring-yellow-400': isPlayable,
                  'ring-2 ring-white/30': !isPlayable && !isSelected,
                }
              )}
              ref={(el) => {
                if (!el) return;
                el.style.setProperty('--rot', `${rotation}deg`);
                el.style.setProperty('--y', `${yOffset}px`);
                el.style.setProperty('--scale', String(scale));
                el.style.setProperty('--z', String(zIndex));
              }}
              onClick={() => handleCardClick(card)}
            >
              <div
                className={clsx(
                  'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
                  getRarityGradient(card.rarity)
                )}
              />

              <div className="flex justify-between items-center p-2 pb-1">
                <div className="text-xs font-bold text-white truncate">{card.name}</div>
                <div
                  className={clsx(
                    'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border',
                    canAfford
                      ? 'bg-yellow-900/50 border-yellow-500/50 text-yellow-400'
                      : 'bg-gray-900/50 border-gray-600/50 text-gray-500'
                  )}
                >
                  {card.cost}
                </div>
              </div>

              <div className="relative flex-1 m-1.5 rounded bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
                  {getTypeIcon(card.type)}
                </div>
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="px-2 py-1 text-2xs text-gray-300 h-12 overflow-hidden">
                {card.description}
              </div>

              <div className="flex justify-between items-center px-2 py-1 text-2xs border-t border-white/5">
                <div className="capitalize text-gray-400">{card.type}</div>
                <div className="text-[10px] uppercase tracking-wide text-gray-500">
                  {card.rarity}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardHand;
