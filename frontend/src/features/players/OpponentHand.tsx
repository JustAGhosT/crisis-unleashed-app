import React, { useMemo, memo, useCallback } from 'react';
import styles from './OpponentHand.module.css';

interface OpponentHandProps {
  cardCount?: number;
  maxCards?: number;
  isActive?: boolean;
  className?: string;
}

interface CardBackProps {
  cardId: string | number;
  isActive?: boolean;
}

const CardBack: React.FC<CardBackProps> = memo(({ cardId, isActive = false }) => (
  <div className={`${styles.cardBack} ${isActive ? styles.cardActive : ''}`}>
    <div className={styles.cardBackInner}>
      {/* Card Back Design */}
      <div className={styles.cardTopSection}>
        {/* Tech Pattern */}
        <div className={styles.techPattern}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.techPatternCell} />
          ))}
        </div>

        {/* Central Symbol */}
        <div className={styles.centralSymbol}>
          <div className={styles.symbol} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.cardBottomSection}>
        <div className={styles.indicators}>
          <div className={styles.indicator} />
          <div className={styles.indicator} />
          <div className={styles.indicator} />
        </div>
      </div>

      {/* Holographic Scan Effect */}
      <div className={styles.holographicEffect} />

      {/* Border Glow on Hover/Active */}
      <div 
        className={`${styles.borderGlow} ${isActive ? styles.borderGlowActive : ''}`}
      />
      
      {/* Card ID (for debugging) */}
      <div className={styles.cardId}>
        {cardId}
      </div>
    </div>
  </div>
));

CardBack.displayName = 'CardBack';

const OpponentHand: React.FC<OpponentHandProps> = ({
  cardCount = 0,
  maxCards = 10,
  isActive = false,
  className = ''
}) => {
  // Generate array of card placeholders
  const cardPlaceholders = useMemo(() => {
    return Array.from({ length: Math.min(cardCount, maxCards) }, (_, i) => ({
      id: `opponent-card-${i + 1}`,
      isActive: isActive && i === 0 // First card is active if it's the opponent's turn
    }));
  }, [cardCount, maxCards, isActive]);

  // Calculate card spread
  const getCardClass = useCallback((index: number, total: number) => {
    if (total <= 1) return '';
    
    const centerIndex = (total - 1) / 2;
    const distanceFromCenter = index - centerIndex;
    const isLeft = distanceFromCenter < 0;
    const isRight = distanceFromCenter > 0;
    
    if (isLeft) {
      return styles.cardSpreadLeft;
    } else if (isRight) {
      return styles.cardSpreadRight;
    }
    
    return '';
  }, []);

  if (cardCount <= 0) {
    return (
      <div className={`${styles.opponentHand} ${className}`}>
        <div className={styles.emptyState}>
          Opponent's hand is empty
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.opponentHand} ${className}`}>
      <div className={styles.cardsContainer}>
        <div className={styles.cardsWrapper}>
          {cardPlaceholders.map((card, index) => (
            <div 
              key={card.id}
              className={`${styles.cardWrapper} ${getCardClass(index, cardPlaceholders.length)}`}
            >
              <CardBack 
                cardId={index + 1} 
                isActive={card.isActive}
              />
            </div>
          ))}
          
          {/* Card count indicator if we're not showing all cards */}
          {cardCount > maxCards && (
            <div className={styles.cardCount}>
              +{cardCount - maxCards}
            </div>
          )}
        </div>
        
        {/* Turn indicator */}
        {isActive && (
          <div className={styles.turnIndicator}>
            Opponent's Turn
          </div>
        )}
      </div>
    </div>
  );
};

export default OpponentHand;
