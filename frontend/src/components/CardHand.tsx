import React, { useCallback, useMemo } from 'react';
import { Card, CardRarity } from '../types/game.types';
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
  // Generate mock cards if none are provided
  const handCards = useMemo<Card[]>(() => {
    if (cards.length > 0) return cards;
    
    return [
      {
        id: 1,
        name: 'Cyber Soldier',
        type: 'character',
        cost: 3,
        attack: 2,
        health: 3,
        rarity: 'common' as CardRarity,
        description: 'Basic infantry unit with enhanced targeting systems',
        abilities: ['First Strike'],
      },
      {
        id: 2,
        name: 'Neural Hack',
        type: 'action',
        cost: 2,
        rarity: 'rare' as CardRarity,
        description: 'Disable target enemy unit for one turn',
        abilities: ['Instant', 'Disable'],
        isInstant: true,
        targetType: 'unit',
        effect: () => {},
      },
      {
        id: 3,
        name: 'Plasma Cannon',
        type: 'character',
        cost: 5,
        attack: 4,
        health: 2,
        rarity: 'epic' as CardRarity,
        description: 'Heavy weapons platform with area damage capabilities',
        abilities: ['Area Damage', 'Range 2'],
      },
      {
        id: 4,
        name: 'Data Stream',
        type: 'action',
        cost: 1,
        rarity: 'common' as CardRarity,
        description: 'Access tactical networks • Draw 2 cards from your deck',
        abilities: ['Draw', 'Instant'],
        isInstant: true,
        effect: () => {},
      },
      {
        id: 5,
        name: 'Quantum Guardian',
        type: 'character',
        cost: 7,
        attack: 3,
        health: 8,
        rarity: 'legendary' as CardRarity,
        description: 'Advanced defense unit with damage mitigation',
        abilities: ['Shield', 'Taunt'],
      },
    ];
  }, [cards]);

  const handleCardClick = useCallback((card: Card) => {
    // Only allow selection if player has enough energy
    if (card.cost <= energy) {
      onCardSelect(card);
    }
  }, [energy, onCardSelect]);

  const getRarityColor = (rarity: CardRarity): string => {
    const colors = {
      common: 'border-gray-400',
      uncommon: 'border-green-500',
      rare: 'border-blue-500',
      epic: 'border-purple-500',
      legendary: 'border-yellow-500',
    };
    return colors[rarity] || 'border-gray-400';
  };

  const getCardTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      character: 'bg-blue-900/50',
      action: 'bg-red-900/50',
      upgrade: 'bg-green-900/50',
      tactic: 'bg-purple-900/50',
    };
    return colors[type] || 'bg-gray-800/50';
  };

  const getRarityClass = (rarity: CardRarity): string => {
    const classes = {
      common: styles.rarityCommon,
      uncommon: styles.rarityUncommon,
      rare: styles.rarityRare,
      epic: styles.rarityEpic,
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
        <h3 className={styles.handTitle}>Your Hand</h3>
        <span className={styles.handCount}>
          {handCards.length}/{maxHandSize}
        </span>
      </div>

      <div className={styles.cardsContainer}>
        {handCards.map((card) => {
          const isSelected = selectedCard?.id === card.id;
          const canAfford = card.cost <= energy;
          const rarityClass = getRarityClass(card.rarity);
          const typeClass = getTypeClass(card.type);
          
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`
                ${styles.card}
                ${rarityClass}
                ${typeClass}
                ${isSelected ? styles.selected : ''}
                ${!canAfford ? styles.disabled : ''}
              `}
            >
              <div className={styles.cardHeader}>
                <h4 className={styles.cardName}>{card.name}</h4>
                <span className={styles.cardCost}>
                  {card.cost}⚡
                </span>
              </div>

              <div className={styles.cardArt}>
                <span className={styles.cardArtPlaceholder}>Card Art</span>
              </div>

              <div className={styles.cardType}>
                {card.type}
              </div>

              <p className={styles.cardDescription}>
                {card.description}
              </p>

              {card.abilities && card.abilities.length > 0 && (
                <div className={styles.abilitiesContainer}>
                  <div className={styles.abilitiesList}>
                    {card.abilities.map((ability, index) => (
                      <span 
                        key={index}
                        className={styles.abilityBadge}
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
