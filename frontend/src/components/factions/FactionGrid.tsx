import React, { ReactNode, useMemo } from 'react';
import { ConnectionLines } from './ConnectionLines';
import styles from './FactionGrid.module.css';

interface FactionGridProps {
  children: ReactNode;
  showConnections?: boolean;
  hoveredFaction?: string | null;
}

interface FactionPositionProps {
  children: ReactNode;
  position: 'center' | 'top' | 'topRight' | 'bottomRight' | 'bottom' | 'bottomLeft' | 'topLeft';
}

export const FactionPosition = ({ children, position }: FactionPositionProps) => {
  const positionClass = styles[`${position}Faction`];
  
  return (
    <div className={positionClass}>
      {children}
    </div>
  );
};

export const FactionGrid = ({ children, showConnections = true, hoveredFaction }: FactionGridProps) => {
  // Define connection points for the hexagonal layout
  const connectionData = useMemo(() => {
    const gridWidth = 800;
    const gridHeight = 700;
    const centerX = gridWidth / 2;
    const centerY = gridHeight / 2;

    const connections = [
      // Center to all outer positions
      { from: { x: centerX, y: centerY, color: '#FFD700' }, to: { x: centerX, y: 50, color: '#32CD32' }, active: hoveredFaction === 'solaris' },
      { from: { x: centerX, y: centerY, color: '#FFD700' }, to: { x: gridWidth - 50, y: gridHeight * 0.15, color: '#C0C0C0' }, active: hoveredFaction === 'solaris' },
      { from: { x: centerX, y: centerY, color: '#FFD700' }, to: { x: gridWidth - 50, y: gridHeight * 0.85, color: '#FF4500' }, active: hoveredFaction === 'solaris' },
      { from: { x: centerX, y: centerY, color: '#FFD700' }, to: { x: centerX, y: gridHeight - 50, color: '#1E90FF' }, active: hoveredFaction === 'solaris' },
      { from: { x: centerX, y: centerY, color: '#FFD700' }, to: { x: 50, y: gridHeight * 0.85, color: '#00CED1' }, active: hoveredFaction === 'solaris' },
      { from: { x: centerX, y: centerY, color: '#FFD700' }, to: { x: 50, y: gridHeight * 0.15, color: '#9370DB' }, active: hoveredFaction === 'solaris' },
    ];

    const centerNode = { x: centerX, y: centerY, color: '#FFD700' };

    return { connections, centerNode };
  }, [hoveredFaction]);

  return (
    <div className={styles.factionGrid}>
      {children}
      {showConnections && (
        <ConnectionLines 
          connections={connectionData.connections}
          centerNode={connectionData.centerNode}
        />
      )}
    </div>
  );
};