import { SIZE_SCALE_FACTORS } from '../constants/holes.js';
import type { CrocSize, ShoeSide, VentHole } from '../types/crocs.js';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PixelCoordinate {
  x: number;
  y: number;
}

// Base unscaled shoe dimensions on a reference 1000x650 viewport
const BASE_SHOE_WIDTH = 340;
const BASE_SHOE_HEIGHT = 540;
const CANVAS_CENTER_X = 500;
const CANVAS_CENTER_Y = 325;
const SHOE_GAP = 60; // Gap between left and right shoes

/**
 * Computes the pixel bounding box for a single shoe based on size and side.
 */
export function getShoeBounds(side: ShoeSide, size: CrocSize): BoundingBox {
  const scale = SIZE_SCALE_FACTORS[size] ?? 1.0;
  const width = Math.round(BASE_SHOE_WIDTH * scale);
  const height = Math.round(BASE_SHOE_HEIGHT * scale);
  const halfGap = Math.round((SHOE_GAP * scale) / 2);

  const y = Math.round(CANVAS_CENTER_Y - height / 2);
  const x =
    side === 'left'
      ? Math.round(CANVAS_CENTER_X - halfGap - width)
      : Math.round(CANVAS_CENTER_X + halfGap);

  return { x, y, width, height };
}

/**
 * Converts a normalized hole definition to canvas pixel coordinates.
 */
export function getHolePixelPosition(hole: VentHole, size: CrocSize): PixelCoordinate {
  const bounds = getShoeBounds(hole.side, size);
  return {
    x: Math.round(bounds.x + hole.normalizedX * bounds.width),
    y: Math.round(bounds.y + hole.normalizedY * bounds.height),
  };
}

/**
 * Returns pixel positions for all 26 holes mapped by HoleId.
 */
export function getAllHolePixelPositions(
  holes: VentHole[],
  size: CrocSize
): Record<string, PixelCoordinate> {
  const result: Record<string, PixelCoordinate> = {};
  for (const hole of holes) {
    result[hole.id] = getHolePixelPosition(hole, size);
  }
  return result;
}
