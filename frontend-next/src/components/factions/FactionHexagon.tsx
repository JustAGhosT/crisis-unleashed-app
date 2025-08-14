"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Faction } from "@/types/faction";
import { FactionCard } from "./FactionCard";

export type FactionHexagonProps = {
  factions: Faction[]; // must be exactly 7 ordered as: [solaris, primordial, synthetic, infernal, aeonic, neuralis, umbral]
  hoveredFaction?: Faction | null;
  focusedFaction?: Faction | null;
  onHover: (faction: Faction | null) => void;
  onFocus: (faction: Faction) => void;
  onNavigate?: (faction: Faction) => void;
  className?: string;
};

/**
 * Hexagonal layout of the 7 factions with connection lines.
 * Tailwind only (no CSS modules). Uses inline SVG gradients for transitions.
 */
export function FactionHexagon({
  factions,
  hoveredFaction,
  focusedFaction,
  onHover,
  onFocus,
  onNavigate,
  className,
}: FactionHexagonProps) {
  if (factions.length !== 7) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("FactionHexagon requires exactly 7 factions");
    }
    return null;
  }

  const [
    centerFaction, // Solaris (center)
    topFaction, // Primordial
    topRightFaction, // Synthetic
    bottomRightFaction, // Infernal
    bottomFaction, // Aeonic
    bottomLeftFaction, // Neuralis
    topLeftFaction, // Umbral
  ] = factions;

  const getColor = (f: Faction | null | undefined, fallback = "#ffffffcc") =>
    f?.colors?.primary ?? fallback;

  return (
    <div
      className={cn(
        "relative aspect-square w-full max-w-5xl",
        focusedFaction ? "ring-1 ring-foreground/20" : undefined,
        className,
      )}
    >
      {/* Connection lines (SVG overlay) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {/* Center node */}
        <circle
          cx="400"
          cy="400"
          r="8"
          fill={getColor(hoveredFaction || centerFaction)}
          className="opacity-90"
        />

        {/* Radial connections from center */}
        {(
          [
            { x: 400, y: 150, id: topFaction },
            { x: 625, y: 250, id: topRightFaction },
            { x: 625, y: 550, id: bottomRightFaction },
            { x: 400, y: 650, id: bottomFaction },
            { x: 175, y: 550, id: bottomLeftFaction },
            { x: 175, y: 250, id: topLeftFaction },
          ] as const
        ).map((pos, i) => (
          <line
            key={i}
            x1={400}
            y1={400}
            x2={pos.x}
            y2={pos.y}
            stroke={`url(#radial-${i})`}
            className={cn(
              "transition-opacity duration-300",
              hoveredFaction &&
                (hoveredFaction === centerFaction || hoveredFaction === pos.id)
                ? "opacity-80"
                : "opacity-35",
            )}
          />
        ))}

        {/* Outer hexagon connections */}
        {(
          [
            [topLeftFaction, topFaction, 175, 250, 400, 150],
            [topFaction, topRightFaction, 400, 150, 625, 250],
            [topRightFaction, bottomRightFaction, 625, 250, 625, 550],
            [bottomRightFaction, bottomFaction, 625, 550, 400, 650],
            [bottomFaction, bottomLeftFaction, 400, 650, 175, 550],
            [bottomLeftFaction, topLeftFaction, 175, 550, 175, 250],
          ] as const
        ).map(([a, b, x1, y1, x2, y2], i) => (
          <line
            key={`outer-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={`url(#outer-${i})`}
            className={cn(
              "transition-opacity duration-300",
              hoveredFaction && (hoveredFaction === a || hoveredFaction === b)
                ? "opacity-80"
                : "opacity-30",
            )}
          />
        ))}

        {/* Gradients */}
        <defs>
          {(
            [
              [centerFaction, topFaction],
              [centerFaction, topRightFaction],
              [centerFaction, bottomRightFaction],
              [centerFaction, bottomFaction],
              [centerFaction, bottomLeftFaction],
              [centerFaction, topLeftFaction],
            ] as const
          ).map(([a, b], i) => (
            <linearGradient id={`radial-${i}`} key={`radial-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={getColor(a)} />
              <stop offset="100%" stopColor={getColor(b)} />
            </linearGradient>
          ))}

          {(
            [
              [topLeftFaction, topFaction],
              [topFaction, topRightFaction],
              [topRightFaction, bottomRightFaction],
              [bottomRightFaction, bottomFaction],
              [bottomFaction, bottomLeftFaction],
              [bottomLeftFaction, topLeftFaction],
            ] as const
          ).map(([a, b], i) => (
            <linearGradient id={`outer-${i}`} key={`outer-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={getColor(a)} />
              <stop offset="100%" stopColor={getColor(b)} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      {/* Nodes */}
      <div
        className={cn("absolute inset-0")}
        role="presentation"
        aria-hidden
      >
        {/* Center */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          onMouseEnter={() => onHover(centerFaction)}
          onMouseLeave={() => onHover(null)}
          onDoubleClick={() => onNavigate?.(centerFaction)}
        >
          <FactionCard
            faction={centerFaction}
            size="lg"
            onClick={(f) => onFocus(f)}
            interactive
          />
        </div>
        {/* Top */}
        <div
          className="absolute left-1/2 top-[6%] -translate-x-1/2"
          onMouseEnter={() => onHover(topFaction)}
          onMouseLeave={() => onHover(null)}
          onDoubleClick={() => onNavigate?.(topFaction)}
        >
          <FactionCard faction={topFaction} onClick={(f) => onFocus(f)} />
        </div>
        {/* Top-right */}
        <div
          className="absolute right-[6%] top-[30%]"
          onMouseEnter={() => onHover(topRightFaction)}
          onMouseLeave={() => onHover(null)}
          onDoubleClick={() => onNavigate?.(topRightFaction)}
        >
          <FactionCard faction={topRightFaction} onClick={(f) => onFocus(f)} />
        </div>
        {/* Bottom-right */}
        <div
          className="absolute bottom-[6%] right-[6%]"
          onMouseEnter={() => onHover(bottomRightFaction)}
          onMouseLeave={() => onHover(null)}
          onDoubleClick={() => onNavigate?.(bottomRightFaction)}
        >
          <FactionCard faction={bottomRightFaction} onClick={(f) => onFocus(f)} />
        </div>
        {/* Bottom */}
        <div
          className="absolute bottom-[6%] left-1/2 -translate-x-1/2"
          onMouseEnter={() => onHover(bottomFaction)}
          onMouseLeave={() => onHover(null)}
          onDoubleClick={() => onNavigate?.(bottomFaction)}
        >
          <FactionCard faction={bottomFaction} onClick={(f) => onFocus(f)} />
        </div>
        {/* Bottom-left */}
        <div
          className="absolute bottom-[6%] left-[6%]"
          onMouseEnter={() => onHover(bottomLeftFaction)}
          onMouseLeave={() => onHover(null)}
          onDoubleClick={() => onNavigate?.(bottomLeftFaction)}
        >
          <FactionCard faction={bottomLeftFaction} onClick={(f) => onFocus(f)} />
        </div>
        {/* Top-left */}
        <div
          className="absolute left-[6%] top-[30%]"
          onMouseEnter={() => onHover(topLeftFaction)}
          onMouseLeave={() => onHover(null)}
          onDoubleClick={() => onNavigate?.(topLeftFaction)}
        >
          <FactionCard faction={topLeftFaction} onClick={(f) => onFocus(f)} />
        </div>
      </div>
    </div>
  );
}

export default FactionHexagon;
