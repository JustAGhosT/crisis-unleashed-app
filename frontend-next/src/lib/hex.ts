// Hex grid helpers (axial coordinates, odd-r offset layout)
// Using axial coordinates (q, r). For rendering we often use odd-r offset (row, col).

export type Axial = { q: number; r: number };

// Neighbor directions for axial coords (pointy-top orientation)
// Directions: E, NE, NW, W, SW, SE
export const AXIAL_DIRS: ReadonlyArray<Axial> = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export const axialAdd = (a: Axial, b: Axial): Axial => ({ q: a.q + b.q, r: a.r + b.r });

export const axialNeighbors = (a: Axial): Axial[] => AXIAL_DIRS.map((d) => axialAdd(a, d));

// Conversion between odd-r offset (row, col) and axial
// See: https://www.redblobgames.com/grids/hex-grids/
export const offsetOddRToAxial = (row: number, col: number): Axial => {
  const q = col - ((row & 1) === 1 ? (row - 1) / 2 : row / 2);
  const r = row;
  return { q, r };
};

export const axialToOffsetOddR = (a: Axial): { row: number; col: number } => {
  const row = a.r;
  const col = a.q + ((row & 1) === 1 ? (row - 1) / 2 : row / 2);
  return { row, col };
};

export const axialEquals = (a: Axial, b: Axial): boolean => a.q === b.q && a.r === b.r;

export const axialDistance = (a: Axial, b: Axial): number => {
  // Convert to cube for distance
  const ax = { x: a.q, z: a.r, y: -a.q - a.r };
  const bx = { x: b.q, z: b.r, y: -b.q - b.r };
  return Math.max(Math.abs(ax.x - bx.x), Math.abs(ax.y - bx.y), Math.abs(ax.z - bx.z));
};
