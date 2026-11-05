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

// Proportional dimensions reflecting real-world length-to-width ratios:
// Infant: ~1.40:1 (stubby, blocky, rounded wide bean)
// Kids: ~1.58:1 (transitional)
// Youth: ~1.75:1 (streamlining)
// Adult: ~1.84:1 (classic elongated anatomical profile)
export const SHOE_SIZE_DIMENSIONS: Record<
  CrocSize,
  { width: number; height: number; ratio: number }
> = {
  infant: { width: 250, height: 350, ratio: 1.40 },
  kids: { width: 260, height: 410, ratio: 1.58 },
  youth: { width: 280, height: 490, ratio: 1.75 },
  adult: { width: 310, height: 570, ratio: 1.84 },
};

const CANVAS_CENTER_X = 500;
const CANVAS_CENTER_Y = 325;
const BASE_SHOE_GAP = 50;

/**
 * Computes the pixel bounding box for a single shoe based on size and side.
 */
export function getShoeBounds(side: ShoeSide, size: CrocSize): BoundingBox {
  const dims = SHOE_SIZE_DIMENSIONS[size] ?? SHOE_SIZE_DIMENSIONS.adult;
  const { width, height } = dims;

  const y = Math.round(CANVAS_CENTER_Y - height / 2);
  const halfGap = Math.round(BASE_SHOE_GAP / 2);

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
