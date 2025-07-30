import React from 'react';

const PlayerHUD = ({ player, health, momentum, energy, position }) => {
  const isEnemy = player === 'enemy';

  const CircularProgress = ({ value, max, size = 80, strokeWidth = 6, color = 'cyan' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = (value / max) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`rgb(var(--color-${color}-900))`}
            strokeWidth={strokeWidth}
            fill="none"
            className="opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`rgb(var(--color-${color}-400))`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px rgb(var(--color-${color}-400)))`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-${color}-400 font-bold text-sm`}>{value}</span>
        </div>
      </div>
    );
  };

  if (position === 'top') {
    // Enemy HUD - simplified top bar
    return (
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="text-red-400 font-bold text-lg font-mono">ENEMY COMMANDER</div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-400 font-mono">HEALTH</div>
            <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                style={{ width: `${health}%` }}
              ></div>
            </div>
            <div className="text-red-400 font-bold text-sm min-w-[3rem]">{health}/100</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Player Info Header */}
      <div className="text-center border-b border-cyan-400/30 pb-3">
        <h3 className="text-cyan-400 font-bold text-lg font-mono">COMMANDER</h3>
        <div className="text-xs text-gray-400 mt-1">Tactical Interface Active</div>
      </div>

      {/* Momentum Gauge - Central Feature */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-sm text-yellow-400 font-mono font-semibold">MOMENTUM</div>
        <CircularProgress value={momentum} max={10} size={100} strokeWidth={8} color="yellow" />
        <div className="text-xs text-gray-400 text-center">Fractal Shards: {momentum}/10</div>
      </div>

      {/* Energy Counter */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-cyan-400 font-mono">ENERGY</span>
          <span className="text-cyan-400 font-bold">{energy}</span>
        </div>
        <div className="flex space-x-1">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-sm ${
                i < energy
                  ? 'bg-cyan-400 shadow-cyan-400/50 shadow-sm'
                  : 'bg-gray-700 border border-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Health */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-green-400 font-mono">HEALTH</span>
          <span className="text-green-400 font-bold">{health}/100</span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-green-400/30">
          <div
            className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
            style={{
              width: `${health}%`,
              boxShadow: 'inset 0 0 10px rgba(34, 197, 94, 0.3)',
            }}
          ></div>
        </div>
      </div>

      {/* Hero Skill (placeholder) */}
      <div className="space-y-2 pt-4 border-t border-cyan-400/30">
        <div className="text-sm text-purple-400 font-mono text-center">HERO SKILL</div>
        <div className="aspect-square bg-gradient-to-br from-purple-900/40 to-purple-700/40 border border-purple-400/50 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
          <div className="text-purple-400 text-2xl">⚡</div>
        </div>
        <div className="text-xs text-gray-400 text-center">Ready to Deploy</div>
      </div>
    </div>
  );
};

export default PlayerHUD;
