import { describe, expect, it } from 'vitest';
import { ALL_VENT_HOLES, LEFT_SHOE_HOLES, RIGHT_SHOE_HOLES } from '../src/constants/holes.js';
import {
  getAllHolePixelPositions,
  getHolePixelPosition,
  getShoeBounds,
} from '../src/utils/sizing.js';

describe('Sizing and Coordinate Math', () => {
  it('should have exactly 26 vent holes across both shoes (13 each)', () => {
    expect(LEFT_SHOE_HOLES).toHaveLength(13);
    expect(RIGHT_SHOE_HOLES).toHaveLength(13);
    expect(ALL_VENT_HOLES).toHaveLength(26);
  });

  it('should mirror X coordinates symmetrically for left and right shoes', () => {
    for (let i = 0; i < 13; i++) {
      const leftHole = LEFT_SHOE_HOLES[i];
      const rightHole = RIGHT_SHOE_HOLES[i];
      expect(leftHole.normalizedY).toBe(rightHole.normalizedY);
      expect(Number((leftHole.normalizedX + rightHole.normalizedX).toFixed(3))).toBe(1.0);
    }
  });

  it('should scale shoe bounding boxes proportionally by size category', () => {
    const adultBounds = getShoeBounds('left', 'adult');
    const infantBounds = getShoeBounds('left', 'infant');

    expect(adultBounds.width).toBeGreaterThan(infantBounds.width);
    expect(adultBounds.height).toBeGreaterThan(infantBounds.height);
    expect(infantBounds.width / adultBounds.width).toBeCloseTo(0.68, 1);
  });

  it('should calculate unique pixel coordinates for all 26 holes', () => {
    const positions = getAllHolePixelPositions(ALL_VENT_HOLES, 'adult');
    const keys = Object.keys(positions);
    expect(keys).toHaveLength(26);

    // Verify left shoe holes are positioned to the left of right shoe holes
    const leftX = positions['HL-01'].x;
    const rightX = positions['HR-01'].x;
    expect(leftX).toBeLessThan(rightX);
  });

  it('should compute valid pixel coordinates for single hole', () => {
    const hole = LEFT_SHOE_HOLES[0];
    const pos = getHolePixelPosition(hole, 'adult');
    expect(pos.x).toBeGreaterThan(0);
    expect(pos.y).toBeGreaterThan(0);
  });
});
