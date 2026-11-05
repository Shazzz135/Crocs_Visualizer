import type { CrocColor, CrocSize, RightHoleId, VentHole } from '../types/crocs.js';

// 13 holes for the Left Shoe on normalized (0..1) shoe bounding box
export const LEFT_SHOE_HOLES: VentHole[] = [
  // Toe row (front)
  { id: 'HL-01', side: 'left', index: 1, normalizedX: 0.38, normalizedY: 0.22 },
  { id: 'HL-02', side: 'left', index: 2, normalizedX: 0.52, normalizedY: 0.20 },
  { id: 'HL-03', side: 'left', index: 3, normalizedX: 0.66, normalizedY: 0.23 },

  // Mid-toe row
  { id: 'HL-04', side: 'left', index: 4, normalizedX: 0.28, normalizedY: 0.33 },
  { id: 'HL-05', side: 'left', index: 5, normalizedX: 0.44, normalizedY: 0.32 },
  { id: 'HL-06', side: 'left', index: 6, normalizedX: 0.60, normalizedY: 0.32 },
  { id: 'HL-07', side: 'left', index: 7, normalizedX: 0.74, normalizedY: 0.35 },

  // Mid-vamp row
  { id: 'HL-08', side: 'left', index: 8, normalizedX: 0.26, normalizedY: 0.46 },
  { id: 'HL-09', side: 'left', index: 9, normalizedX: 0.42, normalizedY: 0.45 },
  { id: 'HL-10', side: 'left', index: 10, normalizedX: 0.58, normalizedY: 0.45 },
  { id: 'HL-11', side: 'left', index: 11, normalizedX: 0.74, normalizedY: 0.47 },

  // Instep / collar row (near strap)
  { id: 'HL-12', side: 'left', index: 12, normalizedX: 0.36, normalizedY: 0.58 },
  { id: 'HL-13', side: 'left', index: 13, normalizedX: 0.64, normalizedY: 0.58 },
];

// 13 holes for the Right Shoe (mirrored X along the center axis)
export const RIGHT_SHOE_HOLES: VentHole[] = LEFT_SHOE_HOLES.map((hole) => {
  const rightId = hole.id.replace('HL-', 'HR-') as RightHoleId;
  return {
    id: rightId,
    side: 'right',
    index: hole.index,
    normalizedX: Number((1.0 - hole.normalizedX).toFixed(3)),
    normalizedY: hole.normalizedY,
  };
});

// All 26 authentic vent holes across both shoes
export const ALL_VENT_HOLES: VentHole[] = [...LEFT_SHOE_HOLES, ...RIGHT_SHOE_HOLES];

// Relative scale factor for each size category
export const SIZE_SCALE_FACTORS: Record<CrocSize, number> = {
  infant: 0.68,
  kids: 0.80,
  youth: 0.90,
  adult: 1.00,
};

// Standard authentic Crocs colorways
export const DEFAULT_CROC_COLORS: CrocColor[] = [
  { id: 'black', name: 'Black', hex: '#1C1D1F' },
  { id: 'white', name: 'White', hex: '#F3F4F6' },
  { id: 'navy', name: 'Navy', hex: '#1A2942' },
  { id: 'lime-zest', name: 'Lime Zest', hex: '#A3D933' },
  { id: 'digital-violet', name: 'Digital Violet', hex: '#6D4C8C' },
  { id: 'juice', name: 'Juice Red', hex: '#E53E3E' },
  { id: 'ballerina-pink', name: 'Ballerina Pink', hex: '#F9C5D1' },
  { id: 'atmosphere', name: 'Atmosphere Gray', hex: '#A0AEC0' },
];
