import React, { useState, useCallback, useMemo } from 'react';
import { Card, BattlefieldUnit, BattlefieldZone, PlayerId } from '../types/game.types';
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

  // Create battlefield grid with zones
  const battlefieldGrid = useMemo(() => {
    const grid: BattlefieldZone[] = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const position = `${row}-${col}`;
        const isPlayerZone = row === rows - 1;
        const isEnemyZone = row === 0;
        const isNeutralZone = !isPlayerZone && !isEnemyZone;
        
        grid.push({
          position,
          unit: battlefieldUnits[position] || null,
          isPlayerZone,
          isEnemyZone,
          isNeutralZone,
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
      <div className={unitClasses}>
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

  // Set CSS custom properties for grid layout
  const gridStyle = useMemo(() => ({
    '--battlefield-cols': cols,
    '--battlefield-rows': rows,
  } as React.CSSProperties), [cols, rows]);

  return (
    <div className={styles.container}>
      <div 
        className={styles.grid}
        style={gridStyle}
      >
        {battlefieldGrid.map((zone) => {
          const isHovered = hoveredZone === zone.position;
          const canPlayCard = selectedCard && !zone.unit;
          
          // Determine zone classes using CSS Modules
          const zoneClasses = [
            styles.zone,
            zone.isPlayerZone ? styles.playerZone : '',
            zone.isEnemyZone ? styles.enemyZone : '',
            zone.isNeutralZone ? styles.neutralZone : '',
            isHovered && canPlayCard ? styles.highlighted : ''
          ].filter(Boolean).join(' ');
          
          return (
            <div
              key={zone.position}
              className={zoneClasses}
              onMouseEnter={() => handleZoneHover(zone.position)}
              onMouseLeave={() => handleZoneHover(null)}
              onClick={() => handleZoneClick(zone.position, zone)}
            >
              {zone.unit ? (
                renderUnit(zone.unit)
              ) : (
                <div className={styles.unitPlaceholder}>
                  {zone.isPlayerZone && '👥'}
                  {zone.isEnemyZone && '👤'}
                  {zone.isNeutralZone && '⚔️'}
                </div>
              )}
              
              <div className={styles.zonePosition}>
                {zone.position}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={styles.overlay}>
        <div className={styles.centerLine}></div>
        <div className={styles.enemySide}></div>
        <div className={styles.playerSide}></div>
      </div>
    </div>
  );
};

export default Battlefield;
