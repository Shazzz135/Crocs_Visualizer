import { describe, expect, it } from 'vitest';
import { ALL_VENT_HOLES, LEFT_SHOE_HOLES, RIGHT_SHOE_HOLES } from '../src/constants/holes.js';
import {
  getAllHolePixelPositions,
  getHolePixelPosition,
  getShoeBounds,
  SHOE_SIZE_SCALES,
} from '../src/utils/sizing.js';

describe('Sizing and Coordinate Math', () => {
  it('should have exactly 26 vent holes across both shoes (13 each)', () => {
    expect(LEFT_SHOE_HOLES).toHaveLength(13);
    expect(RIGHT_SHOE_HOLES).toHaveLength(13);
    expect(ALL_VENT_HOLES).toHaveLength(26);
  });

  it('should reflect distinct length-to-width proportions across size tiers', () => {
    const infant = SHOE_SIZE_SCALES.infant;
    const adult = SHOE_SIZE_SCALES.adult;

    // Infant is significantly stubbier/wider (lower length-to-width)
    expect(infant.scaleY / infant.scaleX).toBeLessThan(adult.scaleY / adult.scaleX);
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

  it('should produce valid bounding boxes for left and right shoes', () => {
    const leftBounds = getShoeBounds('left', 'adult');
    const rightBounds = getShoeBounds('right', 'adult');

    expect(leftBounds.width).toBeGreaterThan(300);
    expect(rightBounds.width).toBeGreaterThan(300);
    expect(leftBounds.x + leftBounds.width).toBeLessThan(rightBounds.x);
  });
});
