import { axialDistance, axialNeighbors, axialToOffsetOddR, offsetOddRToAxial, type Axial } from "@/lib/hex";

describe("hex.ts utilities", () => {
  test("axialNeighbors returns 6 neighbors", () => {
    const n = axialNeighbors({ q: 0, r: 0 });
    expect(n).toHaveLength(6);
    // neighbors should be unique
    const key = (a: Axial) => `${a.q},${a.r}`;
    const uniq = new Set(n.map(key));
    expect(uniq.size).toBe(6);
  });

  test("axialDistance basic cases", () => {
    expect(axialDistance({ q: 0, r: 0 }, { q: 0, r: 0 })).toBe(0);
    expect(axialDistance({ q: 0, r: 0 }, { q: 1, r: 0 })).toBe(1);
    expect(axialDistance({ q: 0, r: 0 }, { q: 1, r: -1 })).toBe(1);
    expect(axialDistance({ q: 0, r: 0 }, { q: -1, r: 1 })).toBe(1);
    expect(axialDistance({ q: 0, r: 0 }, { q: 2, r: -1 })).toBe(2);
  });

  test("offsetOddRToAxial <-> axialToOffsetOddR round-trip", () => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const axial = offsetOddRToAxial(row, col);
        const { row: rr, col: cc } = axialToOffsetOddR(axial);
        expect(rr).toBe(row);
        expect(cc).toBe(col);
      }
    }
  });
});
