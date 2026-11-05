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

// Aspect ratio adjustments reflecting real-world anatomy:
// Infant is stubby and blocky (width preserved/widened while length is compressed)
export const SHOE_SIZE_SCALES: Record<
  CrocSize,
  { scaleX: number; scaleY: number; label: string }
> = {
  infant: { scaleX: 1.08, scaleY: 0.74, label: 'Infant (Blocky & Wide)' },
  kids: { scaleX: 0.96, scaleY: 0.84, label: 'Kids (Transitional)' },
  youth: { scaleX: 0.98, scaleY: 0.92, label: 'Youth (Streamlined)' },
  adult: { scaleX: 1.00, scaleY: 1.00, label: 'Adult (Classic 1:1)' },
};

// Base bounding box from 1000x1000 high-res reference
const BASE_LEFT_BBOX = { x: 37, y: 21, width: 431, height: 966 };
const BASE_RIGHT_BBOX = { x: 504, y: 20, width: 431, height: 966 };
const CANVAS_CENTER_Y = 500;

/**
 * Computes bounding box for left or right shoe adjusted by size proportions.
 */
export function getShoeBounds(side: ShoeSide, size: CrocSize): BoundingBox {
  const { scaleX, scaleY } = SHOE_SIZE_SCALES[size] ?? SHOE_SIZE_SCALES.adult;
  const base = side === 'left' ? BASE_LEFT_BBOX : BASE_RIGHT_BBOX;

  const width = Math.round(base.width * scaleX);
  const height = Math.round(base.height * scaleY);
  const y = Math.round(CANVAS_CENTER_Y - height / 2);

  // Position relative to canvas center (500)
  const x =
    side === 'left'
      ? Math.round(485 - width)
      : Math.round(515);

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
