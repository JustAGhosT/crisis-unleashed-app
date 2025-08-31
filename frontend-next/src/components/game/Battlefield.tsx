"use client";

import clsx from "clsx";
import styles from "./battlefield.module.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { offsetOddRToAxial, axialNeighbors, axialToOffsetOddR, axialDistance } from "@/lib/hex";
import type { BattlefieldUnit, BattlefieldZone, Card, PlayerId } from "@/types/game";
import type { Phase } from "@/components/game/TurnManager";

export interface BattlefieldProps {
  selectedCard: Card | null;
  onCardPlayed: (position: string) => void;
  onUnitSelected?: (unit: BattlefieldUnit) => void;
  onZoneHover?: (position: string | null) => void;
  playerId?: PlayerId;
  enemyId?: PlayerId;
  // Controlled units map: parent is source of truth
  units: Record<string, BattlefieldUnit>;
  // Intents to mutate state are emitted via callbacks
  onMove?: (from: string, to: string) => void;
  onAttack?: (from: string, to: string) => void;
  rows?: number;
  cols?: number;
  // Action economy
  actionsLeft?: number; // if provided, movement/attacks require actionsLeft > 0
  onActionUsed?: () => void; // called when a move or attack consumes an action
  // Optional movement cost function to support terrain/zone/unit modifiers
  movementCostFn?: (unit: BattlefieldUnit, src: BattlefieldZone, dst: BattlefieldZone, dist: number) => number;
  // Optional: current phase to reset transient selection/hover state on change
  currentPhase?: Phase;
}

export const Battlefield: React.FC<BattlefieldProps> = ({
  selectedCard,
  onCardPlayed,
  onUnitSelected,
  onZoneHover,
  playerId = "player1",
  units,
  onMove,
  onAttack,
  rows = 6,
  cols = 5,
  actionsLeft,
  onActionUsed,
  movementCostFn,
  currentPhase,
}) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [neighborPositions, setNeighborPositions] = useState<Set<string>>(new Set());
  const [selectedUnitPos, setSelectedUnitPos] = useState<string | null>(null);
  const [legalMovePositions, setLegalMovePositions] = useState<Set<string>>(new Set());
  const [adjacentEnemyPositions, setAdjacentEnemyPositions] = useState<Set<string>>(new Set());

  const battlefieldGrid = useMemo(() => {
    const grid: BattlefieldZone[] = [];
    const midLow = Math.floor(rows / 2) - 1; // for 6 rows -> 2
    const midHigh = Math.floor(rows / 2);     // for 6 rows -> 3
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const position = `${row}-${col}`;
        const isEnemyZone = row < 3;            // top 3 rows
        const isPlayerZone = row >= rows - 3;   // bottom 3 rows
        const isFrontline = row === midLow || row === midHigh; // central band
        const isBackline = !isFrontline && (isPlayerZone || isEnemyZone);
        const isNeutralZone = false; // base config: no neutral rows
        const axial = offsetOddRToAxial(row, col);
        grid.push({
          position,
          unit: units[position] || null,
          zoneType: isPlayerZone ? "player" : isEnemyZone ? "enemy" : "neutral",
          zonePosition: isFrontline ? "frontline" : isBackline ? "backline" : "middle",
          isPlayerZone,
          isEnemyZone,
          isNeutralZone,
          isFrontline,
          isBackline,
          axial,
        });
      }
    }
    return grid;
  }, [units, rows, cols]);

  const getZoneByPosition = useCallback((pos: string): BattlefieldZone | undefined => {
    return battlefieldGrid.find((z) => z.position === pos);
  }, [battlefieldGrid]);

  const effectiveMoveCost = useCallback((unit: BattlefieldUnit, src: BattlefieldZone, dst: BattlefieldZone, dist: number) => {
    if (movementCostFn) return movementCostFn(unit, src, dst, dist);
    // Default: base distance
    let cost = dist;
    // Slight friction entering frontline
    if (dst.isFrontline) cost += 1;
    // Simple ZOC: if unit has zoc and is leaving adjacency to an enemy, add +1
    if (unit.zoc && src.axial) {
      const leavingEnemyAdj = axialNeighbors(src.axial)
        .map(axialToOffsetOddR)
        .some(({ row, col }) => {
          const p = `${row}-${col}`;
          const u = units[p];
          return !!u && u.player !== unit.player;
        });
      if (leavingEnemyAdj) cost += 1;
    }
    // Cap maximum cost to prevent movement lockouts from stacked modifiers
    return Math.min(cost, dist * 2);
  }, [movementCostFn, units]);

  const handleZoneClick = useCallback(
    (position: string, zone: BattlefieldZone) => {
      // Helper to check action availability
      const canAct = (actionsLeft === undefined) || (actionsLeft > 0);

      // If a unit is selected and clicking a unit -> attempt attack (respect friendlyFire)
      if (selectedUnitPos && zone.unit) {
        const srcZone = getZoneByPosition(selectedUnitPos);
        const attacker = units[selectedUnitPos];
        const target = zone.unit;
        if (!attacker || !target || !srcZone?.axial || !zone.axial) return;
        
        if (canAct) {
          const dist = axialDistance(srcZone.axial, zone.axial);
          const isFriendly = target.player === attacker.player;
          if (isFriendly && !attacker.friendlyFire) {
            console.warn("Cannot attack friendly units without friendlyFire enabled");
            return;
          } else {
            // Determine attack ranges from unit attributes
            const meleeOnly = attacker.meleeOnly === true;
            const rangeMin = meleeOnly ? 1 : (attacker.rangeMin ?? (attacker.type === "ranged" ? 2 : 1));
            const rangeMax = meleeOnly ? 1 : (attacker.rangeMax ?? (attacker.type === "ranged" ? 3 : 1));
            const inRange = dist >= rangeMin && dist <= rangeMax && dist > 0;
            if (inRange) {
              onAttack?.(selectedUnitPos, position);
              onActionUsed?.();
              // Keep selection to allow follow-up moves/attacks if actions remain
              return;
            }
          }
        }
      }

      // If a legal empty target is clicked while a unit is selected: move
      if (selectedUnitPos && legalMovePositions.has(position) && !zone.unit && canAct) {
        onMove?.(selectedUnitPos, position);
        setSelectedUnitPos(null);
        setLegalMovePositions(new Set());
        setAdjacentEnemyPositions(new Set());
        onActionUsed?.();
        return;
      }

      // Clicking a unit selects it (only player's units moveable in this demo)
      if (zone.unit) {
        onUnitSelected?.(zone.unit);
        const isPlayerUnit = zone.unit.player === playerId;
        if (isPlayerUnit) {
          // Toggle selection
          const newSel = selectedUnitPos === position ? null : position;
          setSelectedUnitPos(newSel);
          if (newSel) {
            // Compute legal moves by axial distance and occupancy
            const src = zone.axial!;
            const speed = zone.unit.moveSpeed ?? 0;
            const legal = new Set<string>();
            for (let rIdx = 0; rIdx < rows; rIdx++) {
              for (let cIdx = 0; cIdx < cols; cIdx++) {
                const pos = `${rIdx}-${cIdx}`;
                if (pos === position) continue;
                const targetAxial = offsetOddRToAxial(rIdx, cIdx);
                // Only consider within speed and empty tiles
                const d = axialDistance(src, targetAxial);
                const srcZone = getZoneByPosition(position);
                const dstZone = getZoneByPosition(pos);
                if (srcZone && dstZone) {
                  const mover = units[position]!;
                  const cost = effectiveMoveCost(mover, srcZone, dstZone, d);
                  if (cost <= speed && !units[pos]) {
                    legal.add(pos);
                  }
                }
              }
            }
            setLegalMovePositions(legal);
            // Compute adjacent enemies (for melee targeting cues)
            const adj = new Set<string>();
            axialNeighbors(src)
              .map(axialToOffsetOddR)
              .filter(({ row, col }) => row >= 0 && row < rows && col >= 0 && col < cols)
              .forEach(({ row, col }) => {
                const p = `${row}-${col}`;
                const u = units[p];
                if (u && u.player !== playerId) adj.add(p);
              });
            setAdjacentEnemyPositions(adj);
          } else {
            setLegalMovePositions(new Set());
            setAdjacentEnemyPositions(new Set());
          }
        }
        return;
      }

      // Otherwise, card play logic
      if (selectedCard) {
        onCardPlayed(position);
      }
    },
    [selectedCard, onCardPlayed, onUnitSelected, selectedUnitPos, legalMovePositions, units, playerId, rows, cols, actionsLeft, getZoneByPosition, effectiveMoveCost, onActionUsed, onMove, onAttack]
  );

  useEffect(() => {
    if (!currentPhase) return;
    setSelectedUnitPos(null);
    setLegalMovePositions(new Set());
    setAdjacentEnemyPositions(new Set());
    setNeighborPositions(new Set());
    setHoveredZone(null);
  }, [currentPhase]);

  const handleZoneHover = useCallback(
    (position: string | null) => {
      setHoveredZone(position);
      onZoneHover?.(position);
      if (!position) {
        setNeighborPositions(new Set());
        return;
      }
      // Find hovered zone, compute axial neighbors, map back to row/col positions within bounds
      const zone = battlefieldGrid.find((z) => z.position === position);
      if (!zone || !zone.axial) {
        setNeighborPositions(new Set());
        return;
      }
      const neighbors = axialNeighbors(zone.axial)
        .map(axialToOffsetOddR)
        .filter(({ row, col }) => row >= 0 && row < rows && col >= 0 && col < cols)
        .map(({ row, col }) => `${row}-${col}`);
      setNeighborPositions(new Set(neighbors));
    },
    [onZoneHover, battlefieldGrid, rows, cols]
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
  // Map to CSS module helper classes to avoid inline style usage
  const colClass = (styles as Record<string, string>)[`cols-${c}`] || styles["cols-5"];
  const rowClass = (styles as Record<string, string>)[`rows-${r}`] || styles["rows-3"];
  const rowHClass = styles["rowh-80"]; // default height

  return (
    <div className="w-full">
      <div
        className={clsx(
          styles.grid,
          "bg-gray-950/30 rounded-xl border border-gray-700/40",
          colClass,
          rowClass,
          rowHClass
        )}
      >
        {battlefieldGrid.map((zone) => {
          const isActiveZone = hoveredZone === zone.position && !!selectedCard;
          const isPlayableZone = isActiveZone && (zone.isPlayerZone || (zone.isNeutralZone && !zone.unit));
          const isNeighbor = neighborPositions.has(zone.position);
          const isLegalMove = legalMovePositions.has(zone.position) && !zone.unit;
          const isSelected = selectedUnitPos === zone.position;
          return (
            <div
              key={zone.position}
              className={clsx(
                "relative flex items-center justify-center transition-all duration-200",
                styles.hex,
                "border-2 border-opacity-30",
                {
                  "bg-blue-900/20 border-blue-500/60": zone.isPlayerZone,
                  "bg-red-900/20 border-red-500/60": zone.isEnemyZone,
                  "bg-gray-800/30 border-gray-600/80": zone.isNeutralZone,
                  "ring-2 ring-offset-2 ring-offset-gray-900 ring-primary": isActiveZone,
                  "outline outline-1 outline-yellow-400/60": isNeighbor && process.env.NODE_ENV === "development",
                  "cursor-pointer hover:bg-opacity-40": isPlayableZone || isLegalMove || isSelected,
                  "ring-2 ring-emerald-400/70": isLegalMove,
                  "ring-2 ring-cyan-400/70": isSelected,
                  "outline outline-2 outline-red-500/70": selectedUnitPos && adjacentEnemyPositions.has(zone.position),
                }
              )}
              onMouseEnter={() => handleZoneHover(zone.position)}
              onMouseLeave={() => handleZoneHover(null)}
              onClick={() => handleZoneClick(zone.position, zone)}
              data-pos={zone.position}
              data-player-zone={zone.isPlayerZone ? "true" : "false"}
              data-enemy-zone={zone.isEnemyZone ? "true" : "false"}
              data-frontline={zone.isFrontline ? "true" : "false"}
              data-backline={zone.isBackline ? "true" : "false"}
              data-legal-move={isLegalMove ? "true" : "false"}
            >
              <div className="absolute inset-0 rounded-lg opacity-20 transition-opacity" />
              <div className="absolute inset-0 bg-grid-pattern opacity-5" />
              {zone.unit && renderUnit(zone.unit)}
              {process.env.NODE_ENV === "development" && (
                <div className="absolute bottom-1 right-1 text-[10px] opacity-60">{zone.position}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Battlefield;
