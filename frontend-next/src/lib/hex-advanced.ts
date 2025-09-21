import { Axial, axialDistance, axialEquals, axialNeighbors } from './hex';

// Lane definition as specified in game-algorithms.md
export type Lane = "L" | "C" | "R";

// Implementation of the isInLane function
export function isInLane(hex: Axial): Lane {
  // Using q coordinate to determine lane membership
  // For a standard 5-column battlefield:
  if (hex.q < -1) return "L";
  if (hex.q > 1) return "R";
  return "C";
  
  // Alternative implementation for varying width battlefields:
  // const totalCols = getBattlefieldWidth();
  // const laneWidth = Math.ceil(totalCols / 3);
  // const normalizedQ = hex.q + Math.floor(totalCols/2);
  // if (normalizedQ < laneWidth) return "L";
  // if (normalizedQ >= laneWidth * 2) return "R";
  // return "C";
}

// Constants for pathfinding
export const BASE_COST = 1;
export const Z_COST_DEFAULT = 2; // Default Zone of Control movement cost

// For A* pathfinding
export interface PathNode {
  pos: Axial;
  g: number;  // cost from start
  h: number;  // heuristic (estimated cost to goal)
  f: number;  // total cost (g + h)
  parent: PathNode | null;
}

// Priority queue for A* pathfinding
export class PriorityQueue<T> {
  private items: T[] = [];
  private compareFn: (a: T, b: T) => number;

  constructor(compareFn?: (a: T, b: T) => number) {
    this.compareFn = compareFn || ((a: any, b: any) => a.f - b.f);
  }

  enqueue(item: T, customCompareFn?: (a: T, b: T) => number): void {
    this.items.push(item);
    this.items.sort(customCompareFn || this.compareFn);
  }

  dequeue(): T {
    if (this.isEmpty()) throw new Error("Queue is empty");
    return this.items.shift()!;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  find(key: string): T | undefined {
    return this.items.find((item: any) => `${item.pos.q},${item.pos.r}` === key);
  }
}

// Generate a unique key for an axial coordinate
export function axialToKey(hex: Axial): string {
  return `${hex.q},${hex.r}`;
}

// Cube coordinates for distance calculation (more accurate for game logic)
export interface Cube {
  x: number;
  y: number;
  z: number;
}

// Convert axial to cube coordinates
export function axialToCube(hex: Axial): Cube {
  return {
    x: hex.q,
    z: hex.r,
    y: -hex.q - hex.r
  };
}

// Get cube distance between two axial coordinates
export function cubeDistance(a: Axial, b: Axial): number {
  const ac = axialToCube(a);
  const bc = axialToCube(b);
  return Math.max(
    Math.abs(ac.x - bc.x),
    Math.abs(ac.y - bc.y),
    Math.abs(ac.z - bc.z)
  );
}