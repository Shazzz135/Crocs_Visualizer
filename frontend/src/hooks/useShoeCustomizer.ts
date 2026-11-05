import {
  DEFAULT_CROC_COLORS,
  type CrocColor,
  type CrocSize,
  type VentHole,
} from '@crocs/shared';
import { useCallback, useState } from 'react';

export interface ShoeCustomizerState {
  size: CrocSize;
  color: CrocColor;
  activeHole: VentHole | null;
  setSize: (size: CrocSize) => void;
  setColor: (color: CrocColor) => void;
  setActiveHole: (hole: VentHole | null) => void;
  resetCustomizer: () => void;
}

export function useShoeCustomizer(): ShoeCustomizerState {
  const [size, setSize] = useState<CrocSize>('adult');
  const [color, setColor] = useState<CrocColor>(DEFAULT_CROC_COLORS[0]);
  const [activeHole, setActiveHole] = useState<VentHole | null>(null);

  const resetCustomizer = useCallback(() => {
    setSize('adult');
    setColor(DEFAULT_CROC_COLORS[0]);
    setActiveHole(null);
  }, []);

  return {
    size,
    color,
    activeHole,
    setSize,
    setColor,
    setActiveHole,
    resetCustomizer,
  };
}
