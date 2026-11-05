import type { CrocSize, HoleId } from './crocs.js';

export type JibbitzCategory =
  | 'characters'
  | 'letters-numbers'
  | 'food-drink'
  | 'animals-nature'
  | 'sports'
  | 'symbols-shapes';

export interface JibbitzDimensions {
  widthMm: number;
  heightMm: number;
}

export interface JibbitzItem {
  id: string;
  name: string;
  category: JibbitzCategory;
  imageUrl: string;
  dimensions?: JibbitzDimensions;
  description?: string;
  // Pre-computed vector embedding (optional on client)
  embedding?: number[];
}

export interface PlacedJibbitz {
  instanceId: string;
  jibbitId: string;
  holeId: HoleId;
  rotationDeg: number; // 0 to 359
  placedAt: number; // epoch timestamp
}

export interface CustomizationState {
  version: '1.0.0-beta';
  updatedAt: string;
  size: CrocSize;
  colorId: string;
  placements: PlacedJibbitz[];
}
