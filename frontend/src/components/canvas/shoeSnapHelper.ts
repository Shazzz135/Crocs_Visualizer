import type { HoleId } from '@crocs/shared';
import { SHOE_VIEWBOX } from './crocsSvgData.js';
import type { LocalHoleSpec } from './shoeHoleConfig.js';

interface SnapParams {
  svg: SVGSVGElement | null;
  isLeft: boolean;
  clientX: number;
  clientY: number;
  sizeHoles: LocalHoleSpec[];
  occupiedHoleIds: Set<string>;
  sourceHoleId?: HoleId | null;
}

export function findHoleOnShoe({
  svg,
  isLeft,
  clientX,
  clientY,
  sizeHoles,
  occupiedHoleIds,
  sourceHoleId,
}: SnapParams): HoleId | null {
  if (!svg) return null;
  const rect = svg.getBoundingClientRect();

  // Generous margin around the shoe SVG
  if (
    clientX < rect.left - 60 ||
    clientX > rect.right + 60 ||
    clientY < rect.top - 60 ||
    clientY > rect.bottom + 60
  ) {
    return null;
  }

  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const svgPt = pt.matrixTransform(ctm.inverse());

  const prefix = isLeft ? 'HL' : 'HR';
  let nearestHoleId: HoleId | null = null;
  let minDist = 75; // Snapping collision radius in SVG viewBox space

  for (const h of sizeHoles) {
    const hId = `${prefix}-${String(h.index).padStart(2, '0')}` as HoleId;
    if (occupiedHoleIds.has(hId) && hId !== sourceHoleId) continue;

    const hx = isLeft ? h.x : SHOE_VIEWBOX.width - h.x;
    const dist = Math.hypot(svgPt.x - hx, svgPt.y - h.y);
    if (dist < minDist) {
      minDist = dist;
      nearestHoleId = hId;
    }
  }

  // Fallback: If cursor is within shoe bounding box, snap to closest available hole
  if (
    !nearestHoleId &&
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  ) {
    let fallbackMin = Infinity;
    for (const h of sizeHoles) {
      const hId = `${prefix}-${String(h.index).padStart(2, '0')}` as HoleId;
      if (occupiedHoleIds.has(hId) && hId !== sourceHoleId) continue;
      const hx = isLeft ? h.x : SHOE_VIEWBOX.width - h.x;
      const dist = Math.hypot(svgPt.x - hx, svgPt.y - h.y);
      if (dist < fallbackMin) {
        fallbackMin = dist;
        nearestHoleId = hId;
      }
    }
  }

  return nearestHoleId;
}
