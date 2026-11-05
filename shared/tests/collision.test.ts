import { describe, expect, it } from 'vitest';
import { ALL_VENT_HOLES, LEFT_SHOE_HOLES } from '../src/constants/holes.js';
import { calculateDistance, findNearestVacantHole } from '../src/utils/collision.js';
import { getHolePixelPosition } from '../src/utils/sizing.js';

describe('Collision & Snapping Engine', () => {
  it('should correctly calculate Euclidean distance', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 3, y: 4 };
    expect(calculateDistance(p1, p2)).toBe(5);
  });

  it('should snap to exact hole coordinate when dropped directly on it', () => {
    const targetHole = LEFT_SHOE_HOLES[0];
    const targetPos = getHolePixelPosition(targetHole, 'adult');

    const match = findNearestVacantHole(targetPos, ALL_VENT_HOLES, 'adult', []);
    expect(match).not.toBeNull();
    expect(match?.hole.id).toBe(targetHole.id);
    expect(match?.distance).toBe(0);
  });

  it('should snap to hole within snapping radius', () => {
    const targetHole = LEFT_SHOE_HOLES[2];
    const targetPos = getHolePixelPosition(targetHole, 'adult');
    const droppedPos = { x: targetPos.x + 10, y: targetPos.y + 10 };

    const match = findNearestVacantHole(droppedPos, ALL_VENT_HOLES, 'adult', [], 28);
    expect(match).not.toBeNull();
    expect(match?.hole.id).toBe(targetHole.id);
    expect(match?.distance).toBeCloseTo(14.14, 1);
  });

  it('should return null when drop location is beyond snapping radius', () => {
    const farOffPoint = { x: 0, y: 0 };
    const match = findNearestVacantHole(farOffPoint, ALL_VENT_HOLES, 'adult', [], 28);
    expect(match).toBeNull();
  });

  it('should ignore occupied holes and snap to next nearest vacant hole', () => {
    const hole1 = LEFT_SHOE_HOLES[0];
    const hole2 = LEFT_SHOE_HOLES[1];
    const pos1 = getHolePixelPosition(hole1, 'adult');
    const pos2 = getHolePixelPosition(hole2, 'adult');

    // Drop closer to hole1, but hole1 is occupied
    const midPoint = {
      x: Math.round(pos1.x * 0.7 + pos2.x * 0.3),
      y: Math.round(pos1.y * 0.7 + pos2.y * 0.3),
    };

    const match = findNearestVacantHole(midPoint, ALL_VENT_HOLES, 'adult', [hole1.id], 150);
    expect(match).not.toBeNull();
    expect(match?.hole.id).toBe(hole2.id);
  });
});
