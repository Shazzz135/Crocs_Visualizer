export type CrocSize = 'infant' | 'kids' | 'youth' | 'adult';

export type ShoeSide = 'left' | 'right';

export type LeftHoleId =
  | 'HL-01' | 'HL-02' | 'HL-03' | 'HL-04' | 'HL-05'
  | 'HL-06' | 'HL-07' | 'HL-08' | 'HL-09' | 'HL-10'
  | 'HL-11' | 'HL-12' | 'HL-13';

export type RightHoleId =
  | 'HR-01' | 'HR-02' | 'HR-03' | 'HR-04' | 'HR-05'
  | 'HR-06' | 'HR-07' | 'HR-08' | 'HR-09' | 'HR-10'
  | 'HR-11' | 'HR-12' | 'HR-13';

export type HoleId = LeftHoleId | RightHoleId;

export interface VentHole {
  id: HoleId;
  side: ShoeSide;
  index: number; // 1 to 13
  // Normalized offset (0.0 to 1.0) relative to the shoe's bounding box
  normalizedX: number;
  normalizedY: number;
}

export interface CrocColor {
  id: string;
  name: string;
  hex: string;
  secondaryHex?: string; // For strap accent or marbling
}

export interface ShoeDimensions {
  width: number;
  height: number;
  scale: number;
}
