import React, { useMemo } from 'react';
import styles from './ConnectionLines.module.css';

interface ConnectionPoint {
  x: number;
  y: number;
  color: string;
}

interface ConnectionLinesProps {
  connections: Array<{
    from: ConnectionPoint;
    to: ConnectionPoint;
    active?: boolean;
  }>;
  centerNode?: ConnectionPoint;
}

export const ConnectionLines = ({ connections, centerNode }: ConnectionLinesProps) => {
  const lines = useMemo(() => {
    return connections.map((connection, index) => (
      <line
        key={index}
        x1={connection.from.x}
        y1={connection.from.y}
        x2={connection.to.x}
        y2={connection.to.y}
        stroke={connection.from.color}
        className={`${styles.connectionLine} ${connection.active ? styles.active : ''}`}
      />
    ));
  }, [connections]);

  return (
    <svg className={styles.connectionLines}>
      {lines}
      {centerNode && (
        <circle
          cx={centerNode.x}
          cy={centerNode.y}
          r="8"
          fill={centerNode.color}
          className={styles.centerNode}
        />
      )}
    </svg>
  );
}