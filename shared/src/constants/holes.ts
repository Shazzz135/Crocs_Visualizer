import type { CrocColor, CrocSize, VentHole } from '../types/crocs.js';

// 13 authentic vent holes on Left Shoe extracted from reference/clog.png (350x786 viewBox)
export const LEFT_SHOE_HOLES: VentHole[] = [
  { id: 'HL-01', side: 'left', index: 1, normalizedX: 0.592, normalizedY: 0.097 },
  { id: 'HL-02', side: 'left', index: 2, normalizedX: 0.405, normalizedY: 0.134 },
  { id: 'HL-03', side: 'left', index: 3, normalizedX: 0.733, normalizedY: 0.157 },
  { id: 'HL-04', side: 'left', index: 4, normalizedX: 0.585, normalizedY: 0.179 },
  { id: 'HL-05', side: 'left', index: 5, normalizedX: 0.276, normalizedY: 0.197 },
  { id: 'HL-06', side: 'left', index: 6, normalizedX: 0.436, normalizedY: 0.211 },
  { id: 'HL-07', side: 'left', index: 7, normalizedX: 0.737, normalizedY: 0.242 },
  { id: 'HL-08', side: 'left', index: 8, normalizedX: 0.577, normalizedY: 0.270 },
  { id: 'HL-09', side: 'left', index: 9, normalizedX: 0.212, normalizedY: 0.274 },
  { id: 'HL-10', side: 'left', index: 10, normalizedX: 0.356, normalizedY: 0.279 },
  { id: 'HL-11', side: 'left', index: 11, normalizedX: 0.730, normalizedY: 0.324 },
  { id: 'HL-12', side: 'left', index: 12, normalizedX: 0.452, normalizedY: 0.328 },
  { id: 'HL-13', side: 'left', index: 13, normalizedX: 0.203, normalizedY: 0.354 },
];

// 13 authentic vent holes on Right Shoe (exact horizontal mirror of Left Shoe: 1 - normalizedX)
export const RIGHT_SHOE_HOLES: VentHole[] = LEFT_SHOE_HOLES.map((hole) => ({
  id: `HR-${String(hole.index).padStart(2, '0')}` as VentHole['id'],
  side: 'right',
  index: hole.index,
  normalizedX: Number((1 - hole.normalizedX).toFixed(3)),
  normalizedY: hole.normalizedY,
}));

// All 26 authentic vent holes across both shoes
export const ALL_VENT_HOLES: VentHole[] = [...LEFT_SHOE_HOLES, ...RIGHT_SHOE_HOLES];

// Relative scale factor for each size category
export const SIZE_SCALE_FACTORS: Record<CrocSize, number> = {
  infant: 0.68,
  kids: 0.80,
  youth: 0.90,
  adult: 1.00,
};

// Standard authentic Crocs Classic Clog colorways (official Crocs colors and codes)
export const DEFAULT_CROC_COLORS: CrocColor[] = [
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'white', name: 'White', hex: '#F9F9F9' },
  { id: 'navy', name: 'Navy', hex: '#242D36' },
  { id: 'bone', name: 'Bone', hex: '#DBD6C6' },
  { id: 'atmosphere', name: 'Atmosphere', hex: '#DDDFDE' },
  { id: 'espresso', name: 'Espresso', hex: '#1A1815' },
  { id: 'slate-grey', name: 'Slate Grey', hex: '#4C4C4C' },
  { id: 'army-green', name: 'Army Green', hex: '#74794E' },
  { id: 'lavender', name: 'Lavender', hex: '#B4A5C0' },
  { id: 'pink-lemonade', name: 'Pink Lemonade', hex: '#F499BD' },
  { id: 'quartz', name: 'Quartz', hex: '#B3A39B' },
  { id: 'emerald', name: 'Emerald', hex: '#205249' },
  { id: 'latte', name: 'Latte', hex: '#A89076' },
  { id: 'elephant', name: 'Elephant', hex: '#BFBFB7' },
  { id: 'starfish', name: 'Starfish', hex: '#DC2B2B' },
  { id: 'varsity-red', name: 'Varsity Red', hex: '#C74C4F' },
  { id: 'blue-bolt', name: 'Blue Bolt', hex: '#1480DD' },
  { id: 'turbo-teal', name: 'Turbo Teal', hex: '#61C7D2' },
  { id: 'blue-frost', name: 'Blue Frost', hex: '#AAB8CB' },
  { id: 'moss', name: 'Moss', hex: '#85957C' },
  { id: 'linen', name: 'Linen', hex: '#D2D3CB' },
  { id: 'butter', name: 'Butter', hex: '#F2E97D' },
];
