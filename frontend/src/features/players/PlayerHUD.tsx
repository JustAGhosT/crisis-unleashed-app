/* eslint-disable react/prop-types */
import React, { useMemo, memo } from 'react';
import clsx from 'clsx';
import { PlayerId } from '@/types/game.types';
import styles from './PlayerHUD.module.css';

type ProgressColor = 'red' | 'yellow' | 'blue' | 'green';

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color: ProgressColor;
  label: string;
  showLabel?: boolean;
  className?: string;
}

interface PlayerHUDProps {
  player?: PlayerId;
  health: number;
  momentum: number;
  energy: number;
  maxEnergy?: number;
  position?: 'top' | 'bottom';
  isActive?: boolean;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = memo(({ 
  value, 
  max, 
  size = 80, 
  strokeWidth = 6, 
  color = 'blue',
  label,
  showLabel = true,
  className = ''
}) => {
  
  const { radius, circumference, progress } = useMemo(() => {
    const r = (size - strokeWidth) / 2;
    const c = r * 2 * Math.PI;
    const p = Math.max(0, Math.min(value / max, 1)) * c;
    return { 
      radius: r, 
      circumference: c, 
      progress: p
    };
  }, [value, max, size, strokeWidth]);

  const center = size / 2;
  
  // Color mapping for different progress types
  const colorClasses = useMemo(() => {
    const base = {
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-400 to-yellow-500',
      blue: 'from-blue-400 to-blue-500',
      green: 'from-green-400 to-green-500',
    }[color] || 'from-blue-400 to-blue-500';
    
    const bg = {
      red: 'bg-red-900/30',
      yellow: 'bg-yellow-900/30',
      blue: 'bg-blue-900/30',
      green: 'bg-green-900/30',
    }[color] || 'bg-blue-900/30';
    
    const text = {
      red: 'text-red-400',
      yellow: 'text-yellow-400',
      blue: 'text-blue-400',
      green: 'text-green-400',
    }[color] || 'text-blue-400';
    
    return { base, bg, text };
  }, [color]);

  return (
    <div className={clsx(
      'relative flex flex-col items-center',
      'transition-all duration-300',
      className
    )}>
      <div className="relative">
        {/* Background circle */}
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
          aria-label={`${label}: ${value} out of ${max}`}
          role="img"
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            className={clsx(
              'transition-all duration-300',
              'stroke-current',
              colorClasses.bg.replace('bg-', 'text-').replace('/30', '/20')
            )}
            fill="none"
          />
          
          {/* Progress indicator */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            fill="none"
            className={clsx(
              'transition-all duration-700 ease-in-out',
              'stroke-current',
              `text-gradient-to-r ${colorClasses}`,
              'drop-shadow-glow'
            )}
            stroke={`url(#${color}Gradient)`}
          />
          
          <defs>
            <linearGradient id={`${color}Gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={
                color === 'red' ? '#ef4444' : 
                color === 'yellow' ? '#f59e0b' :
                color === 'green' ? '#10b981' :
                '#60a5fa'
              } />
              <stop offset="100%" stopColor={
                color === 'red' ? '#dc2626' : 
                color === 'yellow' ? '#d97706' :
                color === 'green' ? '#059669' :
                '#3b82f6'
              } />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center text */}
        <div className={clsx(
          'absolute inset-0 flex flex-col items-center justify-center',
          'text-center select-none',
          'transition-all duration-300'
        )}>
          <span className={clsx(
            'font-bold leading-none',
            'bg-clip-text text-transparent',
            `bg-gradient-to-r ${colorClasses}`,
            {
              'text-2xl': size > 60,
              'text-lg': size <= 60,
            }
          )}>
            {value}
          </span>
          {showLabel && (
            <span className={clsx(
              'text-xs font-medium mt-0.5',
              'text-gray-400',
              'uppercase tracking-wider',
              'transition-all duration-300'
            )}>
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

const PlayerHUD: React.FC<PlayerHUDProps> = ({
  player = 'player1',
  health = 0,
  momentum = 0,
  energy = 0,
  maxEnergy = 10,
  position = 'bottom',
  isActive = false,
  className = ''
}) => {
  const isEnemy = player === 'enemy';
  
  // Calculate health percentage for gradient effect
  const healthPercentage = useMemo(() => {
    return Math.max(0, Math.min(health, 100)) / 100;
  }, [health]);

  return (
    <div className={clsx(
      'relative w-full max-w-3xl mx-auto p-4 rounded-xl',
      'backdrop-blur-sm border border-opacity-20',
      'transition-all duration-300',
      'flex flex-col',
      'shadow-lg',
      {
        'bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/30': isActive,
        'bg-gray-900/50 border-gray-700/50': !isActive,
        'mb-4': position === 'top',
        'mt-4': position === 'bottom',
        'ring-2 ring-yellow-400/50': isActive && !isEnemy,
        'ring-2 ring-red-400/50': isActive && isEnemy,
      },
      className
    )}>
      {/* Header */}
      <div className={clsx(
        'flex justify-between items-center mb-4',
        'border-b border-white/10 pb-2'
      )}>
        <h2 className={clsx(
          'text-sm font-bold uppercase tracking-wider',
          'flex items-center',
          {
            'text-red-400': isEnemy,
            'text-blue-400': !isEnemy,
          }
        )}>
          <span className={clsx(
            'w-2 h-2 rounded-full mr-2',
            'transition-all duration-300',
            {
              'bg-red-400': isEnemy,
              'bg-blue-400': !isEnemy,
              'ring-2 ring-offset-2 ring-offset-gray-900': isActive,
              'ring-red-400/50': isActive && isEnemy,
              'ring-blue-400/50': isActive && !isEnemy,
            }
          )} />
          {isEnemy ? 'Opponent' : 'Your'}
        </h2>
        
        {isActive && (
          <span className={clsx(
            'text-xs font-bold px-2 py-0.5 rounded-full',
            'animate-pulse',
            {
              'bg-red-900/50 text-red-300 border border-red-500/30': isEnemy,
              'bg-blue-900/50 text-blue-300 border border-blue-500/30': !isEnemy,
            }
          )}>
            {isEnemy ? 'THEIR TURN' : 'YOUR TURN'}
          </span>
        )}
      </div>
      
      {/* Stats */}
      <div className={clsx(
        'grid grid-cols-3 gap-4',
        'relative z-10'
      )}>
        {/* Health */}
        <div className={clsx(
          'flex flex-col items-center',
          'p-3 rounded-lg',
          'transition-all duration-300',
          'bg-gradient-to-br from-gray-900/50 to-gray-800/50',
          'border border-white/5',
          'hover:bg-gray-800/30',
          'relative overflow-hidden',
          'group'
        )}>
          <div 
            className={clsx(
              'absolute inset-0 -z-10',
              'transition-all duration-500',
              'opacity-30',
              styles.clipVar,
              {
                'bg-gradient-to-r from-red-900/30 to-red-600/30': healthPercentage > 0.5,
                'bg-gradient-to-r from-yellow-900/30 to-red-900/30': healthPercentage <= 0.5 && healthPercentage > 0.25,
                'bg-gradient-to-r from-red-900/30 to-red-900/50': healthPercentage <= 0.25,
              }
            )}
            ref={(el) => {
              if (!el) return;
              el.style.setProperty('--clip', `polygon(0 0, ${healthPercentage * 100}% 0, ${healthPercentage * 100}% 100%, 0 100%)`);
            }}
          />
          <CircularProgress 
            value={health} 
            max={100} 
            color="red" 
            label="HP"
            size={70}
            strokeWidth={6}
            className="mb-2"
          />
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{health}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Health</div>
          </div>
        </div>
        
        {/* Energy */}
        <div className={clsx(
          'flex flex-col items-center',
          'p-3 rounded-lg',
          'transition-all duration-300',
          'bg-gradient-to-br from-gray-900/50 to-gray-800/50',
          'border border-white/5',
          'hover:bg-gray-800/30',
          'group',
          'relative overflow-hidden'
        )}>
          <div 
            className={clsx(
              'absolute inset-0 -z-10',
              'transition-all duration-500',
              'opacity-30',
              'bg-gradient-to-r from-yellow-900/30 to-yellow-600/30',
              styles.clipVar,
              {
                'animate-pulse': energy === maxEnergy
              }
            )}
            ref={(el) => {
              if (!el) return;
              el.style.setProperty('--clip', `polygon(0 0, ${(energy / maxEnergy) * 100}% 0, ${(energy / maxEnergy) * 100}% 100%, 0 100%)`);
            }}
          />
          <CircularProgress 
            value={energy} 
            max={maxEnergy} 
            color="yellow" 
            label="Energy"
            size={70}
            strokeWidth={6}
            className="mb-2"
          />
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {energy}<span className="text-sm text-yellow-600">/{maxEnergy}</span>
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Energy</div>
          </div>
        </div>
        
        {/* Momentum */}
        <div className={clsx(
          'flex flex-col items-center',
          'p-3 rounded-lg',
          'transition-all duration-300',
          'bg-gradient-to-br from-gray-900/50 to-gray-800/50',
          'border border-white/5',
          'hover:bg-gray-800/30',
          'group',
          'relative overflow-hidden'
        )}>
          <div 
            className={clsx(
              'absolute inset-0 -z-10',
              'transition-all duration-500',
              'opacity-30',
              styles.clipVar,
              {
                'bg-gradient-to-r from-blue-900/30 to-blue-600/30': momentum >= 8
              }
            )}
            ref={(el) => {
              if (!el) return;
              el.style.setProperty('--clip', `polygon(0 0, ${(momentum / 10) * 100}% 0, ${(momentum / 10) * 100}% 100%, 0 100%)`);
            }}
          />
          <CircularProgress 
            value={momentum} 
            max={10} 
            color="blue" 
            label="Momentum"
            size={70}
            strokeWidth={6}
            className="mb-2"
          />
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{momentum}<span className="text-sm text-blue-600">/10</span></div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Momentum</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerHUD;

// Display names for memoized components
CircularProgress.displayName = 'CircularProgress';
PlayerHUD.displayName = 'PlayerHUD';
