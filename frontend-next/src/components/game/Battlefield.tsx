"use client";

import { canDisengage, findPath, getAdjacentEnemies, isEngaged } from "@/lib/battlefield-pathfinding";
import { axialDistance, axialNeighbors, axialToOffsetOddR, offsetOddRToAxial } from "@/lib/hex";
import { isInLane } from "@/lib/hex-advanced";
import { EnhancedBattlefieldUnit, Phase } from "@/types/battlefield";
import { BattlefieldUnit, BattlefieldZone, Card, PlayerId } from "@/types/game";
import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./battlefield.module.css";
import { BattlefieldUnitComponent } from "./BattlefieldUnit";
import { BattlefieldZoneComponent } from "./BattlefieldZone";

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

  // Generate battlefield grid with proper zone types and axial coordinates
  const battlefieldGrid = useMemo(() => {
    const grid: BattlefieldZone[] = [];
    const midLow = Math.floor(rows / 2) - 1;
    const midHigh = Math.floor(rows / 2);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const position = `${row}-${col}`;
        const isEnemyZone = row < 3;
        const isPlayerZone = row >= rows - 3;
        const isFrontline = row === midLow || row === midHigh;
        const isBackline = !isFrontline && (isPlayerZone || isEnemyZone);
        const isNeutralZone = !isPlayerZone && !isEnemyZone;

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
          lane: isInLane(axial),
        });
      }
    }

    return grid;
  }, [units, rows, cols]);

  // Get zone by position helper
  const getZoneByPosition = useCallback(
    (pos: string): BattlefieldZone | undefined => {
      return battlefieldGrid.find((z) => z.position === pos);
    },
    [battlefieldGrid]
  );

  // Calculate effective movement cost with ZoC implementation
  const effectiveMoveCost = useCallback(
    (unit: BattlefieldUnit, src: BattlefieldZone, dst: BattlefieldZone, dist: number) => {
      // Use provided movement cost function if available
      if (movementCostFn) return movementCostFn(unit, src, dst, dist);

      // Prevent exiting engaged hexes without Disengage ability
      if (isEngaged(units, unit, src.position) && !canDisengage(unit)) {
        return Infinity; // Cannot move (infinite cost)
      }

      // Default: base distance
      let cost = dist;

      // ZoC implementation - entering hex adjacent to enemy
      const enemiesAdjacentToDst = getAdjacentEnemies(units, unit, dst.position);
      if (enemiesAdjacentToDst.length > 0) {
        cost += (unit as EnhancedBattlefieldUnit).zocCostModifier || 2; // Default ZoC cost
      }

      // Slight friction entering frontline
      if (dst.isFrontline) cost += 1;

      // Cap maximum cost to prevent movement lockouts from stacked modifiers
      return Math.min(cost, dist * 2);
    },
    [movementCostFn, units]
  );

  // Calculate legal moves using A* pathfinding
  const calculateLegalMoves = useCallback(
    (zone: BattlefieldZone, unitPosition: string) => {
      if (!zone.axial) return;

      const unit = units[unitPosition];
      if (!unit) return;

      const speed = unit.moveSpeed ?? 0;
      const legal = new Set<string>();

      // For each potential destination on the grid
      for (let rIdx = 0; rIdx < rows; rIdx++) {
        for (let cIdx = 0; cIdx < cols; cIdx++) {
          const pos = `${rIdx}-${cIdx}`;
          if (pos === unitPosition) continue;

          const dstZone = getZoneByPosition(pos);
          if (!dstZone?.axial || dstZone.unit) continue;

          // Use A* to find path
          const path = findPath(
            zone.axial,
            dstZone.axial,
            unit,
            units,
            battlefieldGrid
          );

          // Calculate path cost
          let pathCost = 0;
          for (let i = 1; i < path.length; i++) {
            const prevOffset = axialToOffsetOddR(path[i - 1]);
            const nextOffset = axialToOffsetOddR(path[i]);
            const prevPos = `${prevOffset.row}-${prevOffset.col}`;
            const nextPos = `${nextOffset.row}-${nextOffset.col}`;
            const srcPos = getZoneByPosition(prevPos);
            const dstPos = getZoneByPosition(nextPos);

            if (srcPos && dstPos) {
              pathCost += effectiveMoveCost(unit, srcPos, dstPos, 1);
            }
          }

          // If path exists and total cost is within unit's speed
          if (path.length > 0 && pathCost <= speed) {
            legal.add(pos);
          }
        }
      }

      setLegalMovePositions(legal);

      // Calculate adjacent enemies for attack highlighting
      const adj = new Set<string>();
      axialNeighbors(zone.axial)
        .map((axial) => axialToOffsetOddR(axial))
        .filter(({ row, col }) => row >= 0 && row < rows && col >= 0 && col < cols)
        .forEach(({ row, col }) => {
          const p = `${row}-${col}`;
          const u = units[p];
          if (u && u.player !== playerId) adj.add(p);
        });

      setAdjacentEnemyPositions(adj);
    },
    [battlefieldGrid, effectiveMoveCost, getZoneByPosition, playerId, rows, cols, units]
  );

  // Handle zone click for unit selection, movement, attacks, and card placement
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
            calculateLegalMoves(zone, newSel);
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
    [
      selectedCard, onCardPlayed, onUnitSelected, selectedUnitPos, legalMovePositions,
      units, playerId, getZoneByPosition, actionsLeft, onActionUsed, onMove, onAttack,
      calculateLegalMoves
    ]
  );

  // Reset selection state on phase change
  useEffect(() => {
    if (!currentPhase) return;

    setSelectedUnitPos(null);
    setLegalMovePositions(new Set());
    setAdjacentEnemyPositions(new Set());
    setNeighborPositions(new Set());
    setHoveredZone(null);
  }, [currentPhase]);

  // Handle zone hover effects
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
        .map((axial) => axialToOffsetOddR(axial))
        .filter(({ row, col }) => row >= 0 && row < rows && col >= 0 && col < cols)
        .map(({ row, col }) => `${row}-${col}`);

      setNeighborPositions(new Set(neighbors));
    },
    [onZoneHover, battlefieldGrid, rows, cols]
  );

  // CSS class helpers for responsive grid layout
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const c = clamp(cols, 3, 7);
  const r = clamp(rows, 2, 6);
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
        {battlefieldGrid.map((zone) => (
          <BattlefieldZoneComponent
            key={zone.position}
            zone={zone}
            isActiveZone={hoveredZone === zone.position && !!selectedCard}
            isNeighbor={neighborPositions.has(zone.position)}
            isLegalMove={legalMovePositions.has(zone.position) && !zone.unit}
            isSelected={selectedUnitPos === zone.position}
            isAdjacentEnemy={Boolean(selectedUnitPos && adjacentEnemyPositions.has(zone.position))}
            onMouseEnter={() => handleZoneHover(zone.position)}
            onMouseLeave={() => handleZoneHover(null)}
            onClick={() => handleZoneClick(zone.position, zone)}
          >
            {zone.unit && (
              <BattlefieldUnitComponent
                unit={zone.unit}
                isPlayerUnit={zone.unit.player === playerId}
                onUnitClick={(e) => {
                  e.stopPropagation();
                  onUnitSelected?.(zone.unit!);
                }}
              />
            )}

            {process.env.NODE_ENV === "development" && (
              <div className="absolute bottom-1 right-1 text-[10px] opacity-60">{zone.position}</div>
            )}
          </BattlefieldZoneComponent>
        ))}
      </div>
    </div>
  );
};

export default Battlefield;