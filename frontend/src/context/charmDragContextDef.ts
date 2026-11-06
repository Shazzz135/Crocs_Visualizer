import { createContext } from 'react';
import type { JibbitzItem, HoleId } from '@crocs/shared';

export interface DragState {
  isDragging: boolean;
  charm: JibbitzItem | null;
  rotationDeg?: number;
  sourceHoleId?: HoleId | null;
  sourceInstanceId?: string | null;
  pointerPos: { x: number; y: number } | null;
  activeSnapHoleId: HoleId | null;
}

export interface CharmDragContextValue {
  dragState: DragState;
  startDrag: (
    charm: JibbitzItem,
    startPos: { x: number; y: number },
    sourceHoleId?: HoleId | null,
    sourceInstanceId?: string | null,
    rotationDeg?: number
  ) => void;
  updateDragPosition: (pos: { x: number; y: number }, snapHoleId?: HoleId | null) => void;
  endDrag: (overrideHoleId?: HoleId | null) => {
    charm: JibbitzItem;
    holeId: HoleId;
    sourceHoleId?: HoleId | null;
    sourceInstanceId?: string | null;
    rotationDeg: number;
  } | null;
  cancelDrag: () => void;
}

export const CharmDragContext = createContext<CharmDragContextValue | null>(null);
