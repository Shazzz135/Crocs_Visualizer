import {
  DEFAULT_CROC_COLORS,
  processCharmClick,
  type ClickTrackerState,
  type CrocColor,
  type CrocSize,
  type HoleId,
  type JibbitzItem,
  type PlacedJibbitz,
  type VentHole,
} from '@crocs/shared';
import { useCallback, useMemo, useRef, useState } from 'react';

export interface ShoeCustomizerState {
  size: CrocSize;
  color: CrocColor;
  activeHole: VentHole | null;
  placements: PlacedJibbitz[];
  occupiedHoleIds: Set<string>;
  activeCharmToPlace: JibbitzItem | null;
  selectedPlacementId: string | null;
  setSize: (size: CrocSize) => void;
  setColor: (color: CrocColor) => void;
  setActiveHole: (hole: VentHole | null) => void;
  setActiveCharmToPlace: (charm: JibbitzItem | null) => void;
  setSelectedPlacementId: (id: string | null) => void;
  placeCharm: (charm: JibbitzItem, holeId: HoleId, rotationDeg?: number) => void;
  updateRotation: (instanceId: string, rotationDeg: number) => void;
  removePlacement: (instanceId: string) => void;
  handlePlacementClick: (instanceId: string) => void;
  resetCustomizer: () => void;
}

export function useShoeCustomizer(): ShoeCustomizerState {
  const [size, setSize] = useState<CrocSize>('adult');
  const [color, setColor] = useState<CrocColor>(DEFAULT_CROC_COLORS[0]);
  const [activeHole, setActiveHole] = useState<VentHole | null>(null);
  const [placements, setPlacements] = useState<PlacedJibbitz[]>([]);
  const [activeCharmToPlace, setActiveCharmToPlace] = useState<JibbitzItem | null>(null);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(null);

  // 3-click deletion state tracker
  const clickTrackerRef = useRef<ClickTrackerState>({
    targetId: null,
    clickCount: 0,
    lastClickTime: 0,
  });

  const occupiedHoleIds = useMemo(() => {
    return new Set(placements.map((p) => p.holeId));
  }, [placements]);

  const placeCharm = useCallback(
    (charm: JibbitzItem, holeId: HoleId, rotationDeg = 0) => {
      setPlacements((prev) => {
        // Remove any charm already on this hole
        const filtered = prev.filter((p) => p.holeId !== holeId);
        const newPlacement: PlacedJibbitz = {
          instanceId: `inst-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          jibbitId: charm.id,
          holeId,
          rotationDeg,
          placedAt: Date.now(),
          charm,
        };
        return [...filtered, newPlacement];
      });
      setActiveCharmToPlace(null);
    },
    []
  );

  const updateRotation = useCallback((instanceId: string, rotationDeg: number) => {
    setPlacements((prev) =>
      prev.map((p) => (p.instanceId === instanceId ? { ...p, rotationDeg } : p))
    );
  }, []);

  const removePlacement = useCallback((instanceId: string) => {
    setPlacements((prev) => prev.filter((p) => p.instanceId !== instanceId));
    setSelectedPlacementId((prev) => (prev === instanceId ? null : prev));
  }, []);

  // 3-click deletion interaction: click 1 selects, double-click while selected deletes
  const handlePlacementClick = useCallback(
    (instanceId: string) => {
      const now = Date.now();
      const result = processCharmClick(instanceId, clickTrackerRef.current, now);
      clickTrackerRef.current = result.nextState;

      if (result.shouldDelete) {
        removePlacement(instanceId);
      } else if (result.isSelected) {
        setSelectedPlacementId(instanceId);
      }
    },
    [removePlacement]
  );

  const resetCustomizer = useCallback(() => {
    setSize('adult');
    setColor(DEFAULT_CROC_COLORS[0]);
    setActiveHole(null);
    setPlacements([]);
    setActiveCharmToPlace(null);
    setSelectedPlacementId(null);
  }, []);

  return {
    size,
    color,
    activeHole,
    placements,
    occupiedHoleIds,
    activeCharmToPlace,
    selectedPlacementId,
    setSize,
    setColor,
    setActiveHole,
    setActiveCharmToPlace,
    setSelectedPlacementId,
    placeCharm,
    updateRotation,
    removePlacement,
    handlePlacementClick,
    resetCustomizer,
  };
}
