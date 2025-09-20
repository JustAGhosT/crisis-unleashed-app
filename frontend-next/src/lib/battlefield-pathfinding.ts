import { Axial, axialDistance, axialEquals, axialNeighbors } from '@/lib/hex';
import { BASE_COST, PathNode, PriorityQueue, axialToKey, Z_COST_DEFAULT } from '@/lib/hex-advanced';
import { BattlefieldUnit, BattlefieldZone } from '@/types/game';

// Helper function to reconstruct path from goal to start
function reconstructPath(endNode: PathNode): Axial[] {
  const path: Axial[] = [];
  let current: PathNode | null = endNode;
  while (current !== null) {
    path.unshift(current.pos);
    current = current.parent;
  }
  return path;
}

// Get zone by axial coordinates
function findZoneByAxial(battlefieldGrid: BattlefieldZone[], axial: Axial): BattlefieldZone | undefined {
  return battlefieldGrid.find(zone => 
    zone.axial && zone.axial.q === axial.q && zone.axial.r === axial.r
  );
}

// Check if a hex is occupied
function isOccupied(units: Record<string, BattlefieldUnit>, position: string): boolean {
  const unit = units[position];
  if (!unit) return false;
  
  // Check if any non-ethereal unit occupies this position
  const hasNonEtherealUnit = Object.values(units)
    .filter(u => u.position === position)
    .some(u => !u.ethereal);
  
  return hasNonEtherealUnit;
}

// Calculate edge cost between two hexes
function getEdgeCost(
  unit: BattlefieldUnit,
  units: Record<string, BattlefieldUnit>,
  srcZone: BattlefieldZone,
  dstZone: BattlefieldZone,
  battlefieldGrid: BattlefieldZone[],
  terrainCostFn?: (q: number, r: number) => number,
  factionModifierFn?: (unit: BattlefieldUnit, q: number, r: number) => number
): number {
  // Base cost is 1 for adjacent hexes
  let cost = BASE_COST;
  
  // Add terrain cost if provided
  if (terrainCostFn && dstZone.axial) {
    cost += terrainCostFn(dstZone.axial.q, dstZone.axial.r);
  }
  
  // Add faction-specific modifiers if provided
  if (factionModifierFn && dstZone.axial && unit.faction) {
    cost += factionModifierFn(unit, dstZone.axial.q, dstZone.axial.r);
  }
  
  // ZoC implementation - entering hex adjacent to enemy
  const zocCost = unit.zocCostModifier || Z_COST_DEFAULT;
  
  // Check if destination has adjacent enemies (entering ZoC)
  if (dstZone.axial) {
    const enemyAdjacentToDst = getAdjacentEnemies(units, unit, dstZone.position, battlefieldGrid);
    if (enemyAdjacentToDst.length > 0) {
      cost += zocCost;
    }
  }
  
  return cost;
}

// Get adjacent enemies to a position
export function getAdjacentEnemies(
  units: Record<string, BattlefieldUnit>,
  unit: BattlefieldUnit,
  position: string,
  battlefieldGrid?: BattlefieldZone[]
): BattlefieldUnit[] {
  // If battlefieldGrid is provided, find zone by position
  const zone = battlefieldGrid?.find(z => z.position === position);
  if (!zone?.axial) return [];
  
  return axialNeighbors(zone.axial)
    .map(neighbor => {
      const neighborPos = axialToKey(neighbor);
      return units[neighborPos];
    })
    .filter((neighbor): neighbor is BattlefieldUnit => 
      !!neighbor && neighbor.player !== unit.player
    );
}

// Check if unit is engaged (adjacent to enemy)
export function isEngaged(
  units: Record<string, BattlefieldUnit>,
  unit: BattlefieldUnit,
  position: string,
  battlefieldGrid?: BattlefieldZone[]
): boolean {
  const adjacentEnemies = getAdjacentEnemies(units, unit, position, battlefieldGrid);
  return adjacentEnemies.length > 0;
}

// Check if unit can disengage
export function canDisengage(unit: BattlefieldUnit): boolean {
  return unit.abilities?.includes("Disengage") || false;
}

// A* pathfinding implementation
export function findPath(
  start: Axial,
  goal: Axial, 
  unit: BattlefieldUnit,
  units: Record<string, BattlefieldUnit>,
  battlefieldGrid: BattlefieldZone[],
  terrainCostFn?: (q: number, r: number) => number,
  factionModifierFn?: (unit: BattlefieldUnit, q: number, r: number) => number
): Axial[] {
  // Create PriorityQueue with custom comparator
  const open = new PriorityQueue<PathNode>((a, b) => {
    // Tie-breaker as specified in docs: lowest total cost, then lowest q, then lowest r
    if (a.f !== b.f) return a.f - b.f;
    if (a.pos.q !== b.pos.q) return a.pos.q - b.pos.q;
    return a.pos.r - b.pos.r;
  });
  const closed = new Set<string>();
  
  // Initialize with start node
  open.enqueue({ 
    pos: start, 
    g: 0,
    h: axialDistance(start, goal) * BASE_COST,
    f: axialDistance(start, goal) * BASE_COST,
    parent: null 
  });
  
  while (!open.isEmpty()) {
    const current = open.dequeue();
    
    // Check if reached goal
    if (axialEquals(current.pos, goal)) {
      return reconstructPath(current);
    }
    
    closed.add(axialToKey(current.pos));
    
    // Process neighbors
    for (const neighbor of axialNeighbors(current.pos)) {
      const neighborKey = axialToKey(neighbor);
      if (closed.has(neighborKey)) continue;
      
      // Find zone for this neighbor
      const neighborZone = findZoneByAxial(battlefieldGrid, neighbor);
      if (!neighborZone) continue;
      
      // Skip if occupied (unless target is goal)
      const isGoal = axialEquals(neighbor, goal);
      if (!isGoal && isOccupied(units, neighborZone.position)) continue;
      
      // Check for ZoC restriction - can't exit engaged hex without Disengage ability
      const srcZone = findZoneByAxial(battlefieldGrid, current.pos);
      if (srcZone) {
        if (isEngaged(units, unit, srcZone.position, battlefieldGrid) && !canDisengage(unit)) {
          continue; // Can't move out of engaged hex
        }
      }
      
      // Skip calculation if srcZone is undefined
      if (!srcZone) continue;
      
      // Calculate costs
      const edgeCost = getEdgeCost(
        unit, 
        units, 
        srcZone, 
        neighborZone,
        battlefieldGrid,
        terrainCostFn,
        factionModifierFn
      );
      
      const g = current.g + edgeCost;
      const h = axialDistance(neighbor, goal) * BASE_COST;
      const f = g + h;
      
      // Check if better path or not in open set
      const existingNode = open.find(neighborKey);
      if (existingNode && existingNode.g <= g) continue;
      
      // Add to open set
      open.enqueue({
        pos: neighbor,
        g,
        h,
        f,
        parent: current
      });
    }
  }
  
  return []; // No path found
}