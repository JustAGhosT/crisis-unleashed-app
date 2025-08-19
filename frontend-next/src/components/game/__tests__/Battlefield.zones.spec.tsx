import React from "react";
import { render, screen } from "@testing-library/react";
import Battlefield from "@/components/game/Battlefield";

describe("Battlefield zone invariants (6 rows x 5 cols)", () => {
  const renderField = () =>
    render(
      <Battlefield
        selectedCard={null}
        onCardPlayed={() => {}}
        initialUnits={{}}
        rows={6}
        cols={5}
      />
    );

  test("rows 0–2 enemy, 3–5 player; frontline rows 2 and 3 only", () => {
    renderField();

    const zones = document.querySelectorAll("[data-pos]");
    expect(zones.length).toBe(6 * 5);

    zones.forEach((z) => {
      const pos = z.getAttribute("data-pos")!;
      const [rowStr] = pos.split("-");
      const row = Number(rowStr);
      const isEnemy = z.getAttribute("data-enemy-zone") === "true";
      const isPlayer = z.getAttribute("data-player-zone") === "true";
      const isFrontline = z.getAttribute("data-frontline") === "true";

      if (row <= 2) {
        expect(isEnemy).toBe(true);
        expect(isPlayer).toBe(false);
      } else {
        expect(isPlayer).toBe(true);
        expect(isEnemy).toBe(false);
      }

      if (row === 2 || row === 3) {
        expect(isFrontline).toBe(true);
      } else {
        expect(isFrontline).toBe(false);
      }
    });
  });
});
