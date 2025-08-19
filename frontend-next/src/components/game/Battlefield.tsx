"use client";

import clsx from "clsx";
import styles from "./battlefield.module.css";
import React, { useCallback, useMemo, useState } from "react";
import type { BattlefieldUnit, BattlefieldZone, Card, PlayerId } from "@/types/game";

export interface BattlefieldProps {
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

export const Battlefield: React.FC<BattlefieldProps> = ({
  selectedCard,
  onCardPlayed,
  onUnitSelected,
  onZoneHover,
  playerId = "player1",
  initialUnits = {},
  rows = 3,
  cols = 5,
}) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [battlefieldUnits] = useState<Record<string, BattlefieldUnit>>(initialUnits);

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

  const handleZoneClick = useCallback(
    (position: string, zone: BattlefieldZone) => {
      if (zone.unit) {
        onUnitSelected?.(zone.unit);
      } else if (selectedCard) {
        onCardPlayed(position);
      }
    },
    [selectedCard, onCardPlayed, onUnitSelected]
  );

  const handleZoneHover = useCallback(
    (position: string | null) => {
      setHoveredZone(position);
      onZoneHover?.(position);
    },
    [onZoneHover]
  );

  const renderUnit = (unit: BattlefieldUnit) => {
    if (!unit) return null;
    const isPlayerUnit = unit.player === playerId;
    return (
      <div
        className={clsx(
          "rounded-md px-2 py-1 text-sm shadow-md",
          isPlayerUnit ? "bg-blue-900/60 border border-blue-500/30" : "bg-red-900/60 border border-red-500/30"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onUnitSelected?.(unit);
        }}
      >
        <div className="font-semibold">{unit.name}</div>
        <div className="flex gap-2 text-xs opacity-90">
          <span>⚔️{unit.attack}</span>
          <span>❤️{unit.health}</span>
        </div>
        {unit.abilities?.length ? (
          <div className="mt-1 flex gap-1 text-[10px]">
            {unit.abilities.map((a, i) => (
              <span key={i} className="rounded bg-black/30 px-1 py-0.5">
                {a[0]}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const c = clamp(cols, 3, 7);
  const r = clamp(rows, 2, 6);
  // Use CSS variables for grid sizing to avoid dynamic Tailwind class purging
  const gridStyle: React.CSSProperties & { ["--bf-cols"]?: number; ["--bf-rows"]?: number; ["--bf-row-h"]?: string } = {
    ["--bf-cols"]: c,
    ["--bf-rows"]: r,
    ["--bf-row-h"]: "80px",
  };

  return (
    <div className="w-full">
      <div
        className={clsx(
          styles.grid,
          "bg-gray-950/30 rounded-xl border border-gray-700/40"
        )}
        /* Using CSS variables inline to drive module-defined grid; minimal, intentional inline style */
        // eslint-disable-next-line
        style={gridStyle}
      >
        {battlefieldGrid.map((zone) => {
          const isActiveZone = hoveredZone === zone.position && !!selectedCard;
          const isPlayableZone = isActiveZone && (zone.isPlayerZone || (zone.isNeutralZone && !zone.unit));
          return (
            <div
              key={zone.position}
              className={clsx(
                "relative flex items-center justify-center rounded-lg transition-all duration-200",
                "border-2 border-opacity-30",
                {
                  "bg-blue-900/20 border-blue-500/60": zone.isPlayerZone,
                  "bg-red-900/20 border-red-500/60": zone.isEnemyZone,
                  "bg-gray-800/30 border-gray-600/80": zone.isNeutralZone,
                  "ring-2 ring-offset-2 ring-offset-gray-900 ring-primary": isActiveZone,
                  "cursor-pointer hover:bg-opacity-40": isPlayableZone,
                }
              )}
              onMouseEnter={() => handleZoneHover(zone.position)}
              onMouseLeave={() => handleZoneHover(null)}
              onClick={() => handleZoneClick(zone.position, zone)}
            >
              <div className="absolute inset-0 rounded-lg opacity-20 transition-opacity" />
              <div className="absolute inset-0 bg-grid-pattern opacity-5 rounded-lg" />
              {zone.unit && renderUnit(zone.unit)}
              {process.env.NODE_ENV === "development" && (
                <div className="absolute bottom-1 right-1 text-[10px] opacity-40">{zone.position}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Battlefield;
