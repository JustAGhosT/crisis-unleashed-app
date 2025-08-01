import React, { useMemo, memo } from 'react';
import styles from './PlayerHUD.module.css';

type ProgressColor = 'cyan' | 'red' | 'green' | 'yellow' | 'blue' | 'purple' | 'pink';

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: ProgressColor;
  label: string;
}

interface PlayerHUDProps {
  player?: 'player1' | 'player2' | 'enemy';
  health: number;
  momentum: number;
  energy: number;
  position?: 'top' | 'bottom';
  isActive?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = memo(({ 
  value, 
  max, 
  size = 80, 
  strokeWidth = 6, 
  color = 'cyan',
  label 
}) => {
  const { radius, circumference, progress } = useMemo(() => {
    const r = (size - strokeWidth) / 2;
    const c = r * 2 * Math.PI;
    const p = Math.max(0, Math.min(value / max, 1)) * c;
    return { radius: r, circumference: c, progress: p };
  }, [value, max, size, strokeWidth]);

  const center = size / 2;
  const textColor = `text-${color}-400`;
  const strokeColor = `rgb(var(--color-${color}-400))`;
  const bgColor = `rgb(var(--color-${color}-900))`;

  // Determine the appropriate CSS classes based on color
  const progressBgClass = useMemo(() => {
    switch (color) {
      case 'red':
        return styles.progressBgRed;
      case 'blue':
        return styles.progressBgBlue;
      case 'green':
        return styles.progressBgGreen;
      default:
        return styles.progressBgBlue;
    }
  }, [color]);

  const progressStrokeClass = useMemo(() => {
    switch (color) {
      case 'red':
        return styles.progressStrokeRed;
      case 'blue':
        return styles.progressStrokeBlue;
      case 'green':
        return styles.progressStrokeGreen;
      default:
        return styles.progressStrokeBlue;
    }
  }, [color]);

  const valueClass = useMemo(() => {
    switch (color) {
      case 'red':
        return styles.healthColor;
      case 'blue':
        return styles.momentumColor;
      case 'green':
        return styles.energyColor;
      default:
        return '';
    }
  }, [color]);

  return (
    <div className={styles.circularProgressContainer}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          className={`${progressBgClass}`}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          fill="none"
          className={`${progressStrokeClass} transition-all duration-500 ease-in-out`}
        />
      </svg>
      <div className={styles.circularText}>
        <span className={`${styles.value} ${valueClass}`}>
          {value}
        </span>
        <span className={styles.label}>
          {label}
        </span>
      </div>
    </div>
  );
});

const PlayerHUD: React.FC<PlayerHUDProps> = ({
  player = 'player1',
  health = 0,
  momentum = 0,
  energy = 0,
  position = 'bottom',
  isActive = false
}) => {
  const isEnemy = player === 'enemy';
  const isTopPosition = position === 'top';
  const borderColor = isActive ? 'border-blue-500' : 'border-transparent';
  const bgColor = isEnemy ? 'bg-red-900/30' : 'bg-blue-900/30';

  // Determine container classes based on player type and active state
  const containerClasses = [
    styles.container,
    isEnemy ? styles.enemyContainer : styles.playerContainer,
    isActive ? (isEnemy ? styles.enemyContainerActive : styles.playerContainerActive) : '',
    isActive ? styles.activePulse : '',
    isTopPosition ? styles.topPosition : styles.bottomPosition
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {isEnemy ? 'Enemy' : 'Player'}
        </h2>
        {isActive && (
          <span className={styles.activeBadge}>
            Your Turn
          </span>
        )}
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <CircularProgress 
            value={health} 
            max={100} 
            color="red" 
            label="HP"
          />
        </div>
        
        <div className={styles.statItem}>
          <CircularProgress 
            value={momentum} 
            max={10} 
            color="blue" 
            label="Momentum"
          />
        </div>
        
        <div className={styles.statItem}>
          <CircularProgress 
            value={energy} 
            max={10} 
            color="green" 
            label="Energy"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerHUD;
