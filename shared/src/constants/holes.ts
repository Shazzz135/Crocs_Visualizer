import type { CrocColor, CrocSize, VentHole } from '../types/crocs.js';

// 13 authentic vent holes on Left Shoe measured from high-res top-down reference
export const LEFT_SHOE_HOLES: VentHole[] = [
  { id: 'HL-01', side: 'left', index: 1, normalizedX: 0.610, normalizedY: 0.076 },
  { id: 'HL-02', side: 'left', index: 2, normalizedX: 0.427, normalizedY: 0.109 },
  { id: 'HL-03', side: 'left', index: 3, normalizedX: 0.756, normalizedY: 0.141 },
  { id: 'HL-04', side: 'left', index: 4, normalizedX: 0.603, normalizedY: 0.158 },
  { id: 'HL-05', side: 'left', index: 5, normalizedX: 0.292, normalizedY: 0.172 },
  { id: 'HL-06', side: 'left', index: 6, normalizedX: 0.455, normalizedY: 0.188 },
  { id: 'HL-07', side: 'left', index: 7, normalizedX: 0.763, normalizedY: 0.227 },
  { id: 'HL-08', side: 'left', index: 8, normalizedX: 0.218, normalizedY: 0.253 },
  { id: 'HL-09', side: 'left', index: 9, normalizedX: 0.594, normalizedY: 0.256 },
  { id: 'HL-10', side: 'left', index: 10, normalizedX: 0.371, normalizedY: 0.259 },
  { id: 'HL-11', side: 'left', index: 11, normalizedX: 0.471, normalizedY: 0.313 },
  { id: 'HL-12', side: 'left', index: 12, normalizedX: 0.754, normalizedY: 0.313 },
  { id: 'HL-13', side: 'left', index: 13, normalizedX: 0.213, normalizedY: 0.340 },
];

// 13 authentic vent holes on Right Shoe measured from high-res top-down reference
export const RIGHT_SHOE_HOLES: VentHole[] = [
  { id: 'HR-01', side: 'right', index: 1, normalizedX: 0.432, normalizedY: 0.069 },
  { id: 'HR-02', side: 'right', index: 2, normalizedX: 0.615, normalizedY: 0.105 },
  { id: 'HR-03', side: 'right', index: 3, normalizedX: 0.290, normalizedY: 0.137 },
  { id: 'HR-04', side: 'right', index: 4, normalizedX: 0.443, normalizedY: 0.152 },
  { id: 'HR-05', side: 'right', index: 5, normalizedX: 0.747, normalizedY: 0.170 },
  { id: 'HR-06', side: 'right', index: 6, normalizedX: 0.589, normalizedY: 0.183 },
  { id: 'HR-07', side: 'right', index: 7, normalizedX: 0.288, normalizedY: 0.223 },
  { id: 'HR-08', side: 'right', index: 8, normalizedX: 0.824, normalizedY: 0.246 },
  { id: 'HR-09', side: 'right', index: 9, normalizedX: 0.452, normalizedY: 0.249 },
  { id: 'HR-10', side: 'right', index: 10, normalizedX: 0.673, normalizedY: 0.254 },
  { id: 'HR-11', side: 'right', index: 11, normalizedX: 0.295, normalizedY: 0.306 },
  { id: 'HR-12', side: 'right', index: 12, normalizedX: 0.571, normalizedY: 0.306 },
  { id: 'HR-13', side: 'right', index: 13, normalizedX: 0.826, normalizedY: 0.335 },
];

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
  { id: 'juice', name: 'Juice Red (Classic)', hex: '#E53E3E' },
  { id: 'black', name: 'Black', hex: '#1C1D1F' },
  { id: 'white', name: 'White', hex: '#F3F4F6' },
  { id: 'navy', name: 'Navy Blue', hex: '#1A2942' },
  { id: 'lime-zest', name: 'Lime Zest', hex: '#A3D933' },
  { id: 'digital-violet', name: 'Digital Violet', hex: '#6D4C8C' },
  { id: 'ballerina-pink', name: 'Ballerina Pink', hex: '#F9C5D1' },
  { id: 'atmosphere', name: 'Atmosphere Gray', hex: '#A0AEC0' },
];
