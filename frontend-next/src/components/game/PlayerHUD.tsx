"use client";

import clsx from "clsx";
import styles from "./playerhud.module.css";
import React, { useMemo, useId } from "react";

/**
 * Inline style usage policy: We avoid inline styles per Option A. The only exception here is setting the
 * CSS variable `--clip` to drive a `clip-path` defined in `playerhud.module.css`. The TSX sets only the
 * variable value; all styling logic remains in CSS.
 */

export interface PlayerHUDProps {
  player?: "player1" | "enemy" | string;
  health: number; // 0..100
  momentum: number; // 0..10
  energy: number; // 0..maxEnergy
  maxEnergy?: number; // default 10
  position?: "top" | "bottom";
  isActive?: boolean;
  className?: string;
}

const Circular: React.FC<{
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color: "red" | "yellow" | "blue" | "green";
  label: string;
  className?: string;
}> = ({ value, max, size = 70, strokeWidth = 6, color, label, className }) => {
  const gradId = useId();
  const { radius, circumference, progress } = useMemo(() => {
    const r = (size - strokeWidth) / 2;
    const c = r * 2 * Math.PI;
    const p = Math.max(0, Math.min(value / max, 1)) * c;
    return { radius: r, circumference: c, progress: p };
  }, [value, max, size, strokeWidth]);
  const center = size / 2;
  const colorStops = {
    red: ["#ef4444", "#dc2626"],
    yellow: ["#f59e0b", "#d97706"],
    blue: ["#60a5fa", "#3b82f6"],
    green: ["#10b981", "#059669"],
  }[color];
  const bgClass = {
    red: "text-red-900/30",
    yellow: "text-yellow-900/30",
    blue: "text-blue-900/30",
    green: "text-green-900/30",
  }[color];
  const textClass = {
    red: "text-red-400",
    yellow: "text-yellow-400",
    blue: "text-blue-400",
    green: "text-green-400",
  }[color];
  return (
    <div className={clsx("relative flex flex-col items-center", className)}>
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={center} cy={center} r={radius} strokeWidth={strokeWidth} className={clsx("transition-all", "stroke-current", bgClass)} fill="none" />
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            fill="none"
            stroke={`url(#${gradId})`}
            className="transition-all"
          />
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorStops[0]} />
              <stop offset="100%" stopColor={colorStops[1]} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <span className={clsx("font-bold leading-none", textClass)}>{value}</span>
          <span className="text-[10px] text-gray-400 uppercase">{label}</span>
        </div>
      </div>
    </div>
  );
};

export const PlayerHUD: React.FC<PlayerHUDProps> = ({
  player = "player1",
  health = 0,
  momentum = 0,
  energy = 0,
  maxEnergy = 10,
  position = "bottom",
  isActive = false,
  className = "",
}) => {
  const isEnemy = player === "enemy";
  const healthPct = useMemo(() => Math.max(0, Math.min(health, 100)) / 100, [health]);
  // Typed CSS variable for clip-path without using `any` or invalid lint suppressions
  const clipStyle: React.CSSProperties & { ["--clip"]?: string } = {
    ["--clip"]: `polygon(0 0, ${healthPct * 100}% 0, ${healthPct * 100}% 100%, 0 100%)`,
  };
  return (
    <div
      className={clsx(
        "relative w-full max-w-3xl mx-auto p-4 rounded-xl backdrop-blur-sm border border-opacity-20 shadow-lg",
        isActive ? "bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/30" : "bg-gray-900/50 border-gray-700/50",
        position === "top" ? "mb-4" : "mt-4",
        isActive && (isEnemy ? "ring-2 ring-red-400/50" : "ring-2 ring-yellow-400/50"),
        className
      )}
    >
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
        <h2 className={clsx("text-sm font-bold uppercase tracking-wider flex items-center", isEnemy ? "text-red-400" : "text-blue-400")}
        >
          <span className={clsx("w-2 h-2 rounded-full mr-2", isEnemy ? "bg-red-400" : "bg-blue-400")} />
          {isEnemy ? "Opponent" : "Your"}
        </h2>
        {isActive && (
          <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-full animate-pulse", isEnemy ? "bg-red-900/50 text-red-300 border border-red-500/30" : "bg-blue-900/50 text-blue-300 border border-blue-500/30")}
          >
            {isEnemy ? "THEIR TURN" : "YOUR TURN"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className={"flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/5"}>
          <div
            className={clsx("absolute -z-10 opacity-30", styles.healthClip)}
            // Using a CSS variable to drive clip-path; minimal inline style per guidelines
            // eslint-disable-next-line
            style={clipStyle}
          />
          <Circular value={health} max={100} color="red" label="HP" className="mb-2" />
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{health}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Health</div>
          </div>
        </div>

        <div className={"flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/5"}>
          <Circular value={energy} max={maxEnergy} color="yellow" label="Energy" className="mb-2" />
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{energy}<span className="text-sm text-yellow-600">/{maxEnergy}</span></div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Energy</div>
          </div>
        </div>

        <div className={"flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/5"}>
          <Circular value={momentum} max={10} color="blue" label="Momentum" className="mb-2" />
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
