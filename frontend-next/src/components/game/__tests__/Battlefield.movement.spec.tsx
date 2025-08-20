import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Battlefield from "@/components/game/Battlefield";
import type { BattlefieldUnit, BattlefieldZone } from "@/types/game";

// Helper to query zones
const getZone = (container: HTMLElement, pos: string): HTMLElement => {
  const el = container.querySelector(`[data-pos="${pos}"]`);
  if (!el) throw new Error(`Zone ${pos} not found`);
  return el as HTMLElement;
};

const getLegalMoveZones = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll('[data-legal-move="true"]')) as HTMLElement[];

describe("Battlefield movement legality with movementCostFn", () => {
  test("frontline penalized tiles are excluded when cost > moveSpeed", () => {
    // 6x5 grid, frontline rows are 2 and 3
    const rows = 6;
    const cols = 5;
    const unitPos = "4-1"; // player's back rows
    const mover: BattlefieldUnit = {
      id: "u1",
      name: "Scout",
      player: "player1",
      attack: 1,
      health: 2,
      moveSpeed: 2,
    };

    const initialUnits: Record<string, BattlefieldUnit> = {
      [unitPos]: mover,
    };

    const movementCostFn = (unit: BattlefieldUnit, src: BattlefieldZone, dst: BattlefieldZone, dist: number) => {
      // Heavily penalize entering frontline so it exceeds moveSpeed
      const penalty = dst.isFrontline ? 99 : 0;
      return dist + penalty;
    };

    const { container } = render(
      <Battlefield
        selectedCard={null}
        onCardPlayed={() => {}}
        units={initialUnits}
        rows={rows}
        cols={cols}
        movementCostFn={movementCostFn}
      />
    );

    // Click the zone (not the unit div) to select the unit and compute legal moves
    fireEvent.click(getZone(container, unitPos));

    const legal = getLegalMoveZones(container);
    expect(legal.length).toBeGreaterThan(0);

    // Ensure none of the legal tiles are in frontline rows 2 or 3
    legal.forEach((el) => {
      const pos = el.getAttribute("data-pos")!;
      const row = Number(pos.split("-")[0]);
      expect([2, 3]).not.toContain(row);
    });
  });
});
