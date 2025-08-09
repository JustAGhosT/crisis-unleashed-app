import { useTheme } from '@/theme/ThemeProvider';
import { BattlefieldUnit, BattlefieldZone, Card, PlayerId } from '@/types/game.types';
import clsx from 'clsx';
import React, { useCallback, useMemo, useState } from 'react';
import styles from './Battlefield.module.css';

interface BattlefieldProps {
  selectedCard: Card | null;
  onCardPlayed: (position: string) => void;
  onUnitSelected?: (unit: BattlefieldUnit) => void;
  onZoneHover?: (position: string | null) => void;
  playerId?: PlayerId;
  enemyId?: PlayerId;
  initialUnits?: Record<string, BattlefieldUnit>;
  rows?: number;
  cols?: number;
}

const Battlefield: React.FC<BattlefieldProps> = ({
  selectedCard,
  onCardPlayed,
  onUnitSelected,
  onZoneHover,
  playerId = 'player1',
  enemyId = 'enemy',
  initialUnits = {},
  rows = 3,
  cols = 5,
}) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [battlefieldUnits, setBattlefieldUnits] = useState<Record<string, BattlefieldUnit>>(initialUnits);

  const { theme } = useTheme();

  // Create battlefield grid with zones
  const battlefieldGrid = useMemo(() => {
    const grid: BattlefieldZone[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const position = `${row}-${col}`;
        const isPlayerZone = row === rows - 1;
        const isEnemyZone = row === 0;
        const isFrontline = row === 1 || row === rows - 2;
        const isBackline = isPlayerZone || isEnemyZone;
        const isNeutralZone = !isPlayerZone && !isEnemyZone;

        grid.push({
          position,
          unit: battlefieldUnits[position] || null,
          isPlayerZone,
          isEnemyZone,
          isNeutralZone,
          isFrontline,
          isBackline,
        });
      }
    }

    return grid;
  }, [battlefieldUnits, rows, cols]);

  const handleZoneClick = useCallback((position: string, zone: BattlefieldZone) => {
    if (zone.unit) {
      // If there's a unit in the zone, select it
      onUnitSelected?.(zone.unit);
    } else if (selectedCard) {
      // If a card is selected, play it to this zone
      onCardPlayed(position);
    }
  }, [selectedCard, onCardPlayed, onUnitSelected]);

  const handleZoneHover = useCallback((position: string | null) => {
    setHoveredZone(position);
    onZoneHover?.(position);
  }, [onZoneHover]);

  const renderUnit = (unit: BattlefieldUnit) => {
    if (!unit) return null;

    const isPlayerUnit = unit.player === playerId;
    const isHovered = hoveredZone && battlefieldUnits[hoveredZone]?.id === unit.id;

    // Determine unit classes using CSS Modules
    const unitClasses = [
      styles.unitCard,
      isPlayerUnit ? styles.player : styles.enemy,
      unit.type ? styles[unit.type] : styles.normal,
      isHovered ? styles.hovered : ''
    ].filter(Boolean).join(' ');

    return (
      <div className={unitClasses} onClick={(e) => {
        e.stopPropagation();
        onUnitSelected?.(unit);
      }}>
        <div className={styles.unitName}>
          {unit.name}
        </div>
        <div className={styles.unitStats}>
          <span>⚔️{unit.attack}</span>
          <span>❤️{unit.health}</span>
        </div>
        {unit.abilities && unit.abilities.length > 0 && (
          <div className={styles.unitAbility}>
            {unit.abilities.map((ability, idx) => (
              <span
                key={idx}
                className={styles.abilityBadge}
                title={ability}
              >
                {ability[0]}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Compute helper classes for grid sizing instead of inline styles
  const { colsClass, rowsClass } = useMemo(() => {
    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
    const c = clamp(cols, 3, 7);
    const r = clamp(rows, 2, 6);
    return {
      colsClass: styles[`cols${c}` as keyof typeof styles] as string,
      rowsClass: styles[`rows${r}` as keyof typeof styles] as string,
    };
  }, [cols, rows]);

  return (
    <div className={styles.container}>
      <div className={[styles.grid, colsClass, rowsClass].filter(Boolean).join(' ')}>
        {battlefieldGrid.map((zone) => {
          const isActiveZone = hoveredZone === zone.position && selectedCard;
          const isPlayableZone = isActiveZone &&
            (zone.isPlayerZone || (zone.isNeutralZone && !zone.unit));

          return (
            <div
              key={zone.position}
              className={clsx(
                'relative flex items-center justify-center rounded-lg transition-all duration-200',
                'border-2 border-opacity-30',
                {
                  'bg-blue-900 bg-opacity-20 border-blue-500': zone.isPlayerZone,
                  'bg-red-900 bg-opacity-20 border-red-500': zone.isEnemyZone,
                  'bg-gray-900 bg-opacity-20 border-gray-600': zone.isNeutralZone,
                  'ring-2 ring-offset-2 ring-offset-gray-900 ring-primary': isActiveZone,
                  'cursor-pointer hover:bg-opacity-40': isPlayableZone,
                  'bg-gradient-to-br from-primary/10 to-transparent': zone.isFrontline,
                }
              )}
              onMouseEnter={() => handleZoneHover(zone.position)}
              onMouseLeave={() => handleZoneHover(null)}
              onClick={() => handleZoneClick(zone.position, zone)}
            >
              {/* Zone background effects */}
              <div
                className={clsx(
                  'absolute inset-0 rounded-lg opacity-20 transition-opacity',
                  {
                    'bg-blue-500': zone.isPlayerZone,
                    'bg-red-500': zone.isEnemyZone,
                    'bg-gray-600': zone.isNeutralZone,
                  }
                )}
              />

              {/* Grid pattern overlay */}
              <div className="absolute inset-0 bg-grid-pattern opacity-5 rounded-lg" />
              {zone.unit && renderUnit(zone.unit)}
              {/* Zone position indicator (debug) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute bottom-1 right-1 text-2xs opacity-30">
                  {zone.position}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Battlefield;