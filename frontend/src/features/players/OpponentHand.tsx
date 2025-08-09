/* eslint-disable react/prop-types */
import React, { useMemo, memo, useCallback } from 'react';
import clsx from 'clsx';
import styles from './OpponentHand.module.css';

type CardPosVars = {
  '--rot'?: string;
  '--x'?: string;
  '--z'?: number;
};

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

const CardBack: React.FC<CardBackProps> = memo(({ cardId: _cardId, isActive = false }) => {
  
  return (
    <div 
      className={clsx(
        'relative w-16 h-24 rounded-lg overflow-hidden transition-all duration-300',
        'transform-gpu shadow-lg',
        'border-2 border-gray-700/50',
        'bg-gradient-to-br from-gray-900/80 to-gray-800/80',
        styles.cardBackgroundVar,
        'flex items-center justify-center',
        {
          'scale-110 -translate-y-3 z-10 shadow-xl': isActive,
          'hover:scale-105 hover:-translate-y-1': !isActive,
          'ring-2 ring-yellow-400': isActive,
          'ring-1 ring-white/20': !isActive,
        }
      )}
      ref={(el) => {
        if (!el) return;
        el.style.setProperty(
          '--card-bg',
          'linear-gradient(145deg, rgba(30, 30, 30, 0.9) 0%, rgba(20, 20, 20, 0.95) 100%), repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0px, rgba(255, 255, 255, 0.02) 1px, transparent 1px, transparent 8px)'
        );
      }}
    >
      {/* Tech Pattern */}
      <div className="absolute inset-0 flex flex-wrap opacity-20">
        {[...Array(16)].map((_, i) => (
          <div 
            key={i}
            className={clsx(
              'w-1/4 h-1/4 border border-white/5',
              i % 2 === 0 ? styles.techPatternCell : styles.techPatternCellAlt
            )}
          />
        ))}
      </div>
      
      {/* Central Symbol */}
      <div className="relative z-10 w-8 h-8 flex items-center justify-center">
        <div 
          className={clsx(
            'w-full h-full rounded-full',
            'flex items-center justify-center text-lg',
            'bg-gradient-to-br from-primary/20 to-secondary/20',
            'border border-white/10',
            'shadow-inner',
            'transform rotate-45',
            'overflow-hidden'
          )}
        >
          <div className="transform -rotate-45">⚡</div>
        </div>
      </div>
      
      {/* Bottom Indicators */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className={clsx(
              'w-1 h-1 rounded-full',
              'transition-all duration-300',
              {
                'bg-yellow-400': isActive,
                'bg-white/30': !isActive,
              }
            )}
          />
        ))}
      </div>
      
      {/* Holographic Effect */}
      <div 
        className={clsx(
          'absolute inset-0 opacity-0 transition-opacity duration-300',
          'bg-gradient-to-r from-transparent via-white/10 to-transparent',
          'transform -skew-x-12',
          'pointer-events-none',
          styles.holographicVar,
          {
            'opacity-100': isActive,
            'group-hover:opacity-30': !isActive,
          }
        )}
        ref={(el) => {
          if (!el) return;
          el.style.setProperty(
            '--holo-bg',
            'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1), transparent)'
          );
        }}
      />
      
      {/* Border Glow */}
      <div 
        className={clsx(
          'absolute -inset-0.5 rounded-lg',
          'transition-all duration-300',
          'pointer-events-none',
          styles.borderGlowVars,
          {
            'bg-gradient-to-br from-primary/60 to-secondary/60': isActive,
            'bg-gradient-to-br from-primary/20 to-secondary/20': !isActive,
          }
        )}
        ref={(el) => {
          if (!el) return;
          el.style.setProperty('--glow-blur', isActive ? '8px' : '4px');
          el.style.setProperty('--glow-opacity', isActive ? '0.8' : '0');
          el.style.setProperty('--glow-z', '-1');
        }}
      />
    </div>
  );
});

CardBack.displayName = 'CardBack';

const OpponentHand: React.FC<OpponentHandProps> = ({
  cardCount = 0,
  maxCards = 10,
  isActive = false,
  className = ''
}) => {
  
  // Generate card placeholders
  const cards = useMemo(() => {
    return Array.from({ length: Math.min(cardCount, maxCards) }, (_, i) => ({
      id: `card-${i}`,
      isActive: isActive && i === cardCount - 1 // Highlight the most recently drawn card
    }));
  }, [cardCount, maxCards, isActive]);

  // Calculate card positions in a fan shape
  const getCardVars = useCallback((index: number, total: number): CardPosVars => {
    if (total <= 1) return {} as CardPosVars;

    const maxRotation = 15;
    const maxOffset = 16;
    const maxZIndex = total + 10;

    const position = (index / (total - 1)) * 2 - 1;
    const rotation = position * maxRotation * -1;
    const offset = position * maxOffset * -1;
    const zIndex = maxZIndex - Math.abs(position) * (maxZIndex / 2);

    return {
      '--rot': `${rotation}deg`,
      '--x': `${offset}px`,
      '--z': Math.floor(zIndex),
    } as CardPosVars;
  }, []);

  return (
    <div className={clsx(
      'relative w-full h-32 flex flex-col items-center',
      'transition-all duration-300',
      className
    )}>
      {/* Active Turn Indicator */}
      {isActive && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center bg-red-900/80 text-red-200 text-xs font-bold px-3 py-1 rounded-full border border-red-600/50">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse mr-2" />
            Opponent&#39;s Turn
          </div>
        </div>
      )}
      
      {/* Cards */}
      <div className="relative w-full h-full flex items-center justify-center">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <div 
              key={card.id}
              className={clsx('absolute transition-all duration-300 origin-bottom', styles.cardPos)}
              ref={(el) => {
                if (!el) return;
                const vars = getCardVars(index, cards.length);
                // Set CSS vars imperatively
                if (vars['--rot']) el.style.setProperty('--rot', vars['--rot']!);
                if (vars['--x']) el.style.setProperty('--x', vars['--x']!);
                if (vars['--z'] !== undefined) el.style.setProperty('--z', String(vars['--z']!));
              }}
            >
              <div className="group">
                <CardBack 
                  cardId={card.id}
                  isActive={card.isActive}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm italic">
            No cards in hand
          </div>
        )}
      </div>
      
      {/* Card Count */}
      <div className={clsx(
        'absolute -bottom-2 left-1/2 transform -translate-x-1/2',
        'px-3 py-1 rounded-full text-xs font-bold',
        'bg-black/50 backdrop-blur-sm border border-white/10',
        'flex items-center space-x-2',
        'transition-all duration-300',
        {
          'text-yellow-400': cardCount >= maxCards - 2,
          'text-gray-300': cardCount < maxCards - 2,
        }
      )}>
        <span>Cards: {cardCount}</span>
        <span className="text-gray-400">/ {maxCards}</span>
      </div>
    </div>
  );
};

export default OpponentHand;
