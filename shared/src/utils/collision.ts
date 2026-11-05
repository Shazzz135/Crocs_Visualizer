import type { CrocSize, VentHole } from '../types/crocs.js';
import { getHolePixelPosition, type PixelCoordinate } from './sizing.js';

export interface NearestHoleMatch {
  hole: VentHole;
  distance: number;
  position: PixelCoordinate;
}

const DEFAULT_SNAP_RADIUS_PX = 28;

/**
 * Calculates Euclidean distance between two pixel coordinates.
 */
export function calculateDistance(p1: PixelCoordinate, p2: PixelCoordinate): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

/**
 * Finds the nearest vacant vent hole within the snapping radius.
 * If no vacant hole is within the radius, returns null.
 */
export function findNearestVacantHole(
  dropPos: PixelCoordinate,
  allHoles: VentHole[],
  size: CrocSize,
  occupiedHoleIds: string[] | Set<string>,
  maxRadiusPx: number = DEFAULT_SNAP_RADIUS_PX
): NearestHoleMatch | null {
  const occupiedSet =
    occupiedHoleIds instanceof Set ? occupiedHoleIds : new Set(occupiedHoleIds);

  let closestMatch: NearestHoleMatch | null = null;
  let minDistance = Infinity;

  for (const hole of allHoles) {
    if (occupiedSet.has(hole.id)) {
      continue;
    }

    const holePos = getHolePixelPosition(hole, size);
    const distance = calculateDistance(dropPos, holePos);

    if (distance <= maxRadiusPx && distance < minDistance) {
      minDistance = distance;
      closestMatch = {
        hole,
        distance: Number(distance.toFixed(2)),
        position: holePos,
      };
    }
  }

  return closestMatch;
}
