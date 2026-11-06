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
import { SHOE_HOLES_BY_SIZE } from '../components/canvas/shoeHoleConfig.js';

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
  moveCharm: (fromHoleId: HoleId, toHoleId: HoleId) => void;
  updateRotation: (instanceId: string, rotationDeg: number) => void;
  removePlacement: (instanceId: string) => void;
  handlePlacementClick: (instanceId: string) => void;
  findFirstAvailableHole: () => HoleId | null;
  resetCustomizer: () => void;
}

export function useShoeCustomizer(): ShoeCustomizerState {
  const [size, setSize] = useState<CrocSize>('adult');
  const [color, setColor] = useState<CrocColor>(DEFAULT_CROC_COLORS[0]);
  const [activeHole, setActiveHole] = useState<VentHole | null>(null);
  const [placements, setPlacements] = useState<PlacedJibbitz[]>([]);
  const [activeCharmToPlace, setActiveCharmToPlace] = useState<JibbitzItem | null>(null);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(null);

  const clickTrackerRef = useRef<ClickTrackerState>({
    targetId: null,
    clickCount: 0,
    lastClickTime: 0,
  });

  const occupiedHoleIds = useMemo(() => {
    return new Set(placements.map((p) => p.holeId));
  }, [placements]);

  const findFirstAvailableHole = useCallback((): HoleId | null => {
    const sizeHoles = SHOE_HOLES_BY_SIZE[size] ?? SHOE_HOLES_BY_SIZE.adult;
    for (const h of sizeHoles) {
      const id = `HL-${String(h.index).padStart(2, '0')}` as HoleId;
      if (!occupiedHoleIds.has(id)) return id;
    }
    for (const h of sizeHoles) {
      const id = `HR-${String(h.index).padStart(2, '0')}` as HoleId;
      if (!occupiedHoleIds.has(id)) return id;
    }
    return null;
  }, [occupiedHoleIds, size]);

  const placeCharm = useCallback((charm: JibbitzItem, holeId: HoleId, rotationDeg = 0) => {
    const newInstId = `inst-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setPlacements((prev) => {
      const filtered = prev.filter((p) => p.holeId !== holeId);
      const newPlacement: PlacedJibbitz = {
        instanceId: newInstId,
        jibbitId: charm.id,
        holeId,
        rotationDeg,
        placedAt: Date.now(),
        charm,
      };
      return [...filtered, newPlacement];
    });
    setSelectedPlacementId(newInstId);
    setActiveCharmToPlace(null);
  }, []);

  const moveCharm = useCallback((fromHoleId: HoleId, toHoleId: HoleId) => {
    if (fromHoleId === toHoleId) return;
    setPlacements((prev) => {
      const existing = prev.find((p) => p.holeId === fromHoleId);
      if (!existing) return prev;
      const filtered = prev.filter((p) => p.holeId !== toHoleId && p.holeId !== fromHoleId);
      return [...filtered, { ...existing, holeId: toHoleId, placedAt: Date.now() }];
    });
  }, []);

  const updateRotation = useCallback((instanceId: string, rotationDeg: number) => {
    setPlacements((prev) =>
      prev.map((p) => (p.instanceId === instanceId ? { ...p, rotationDeg } : p))
    );
  }, []);

  const removePlacement = useCallback((instanceId: string) => {
    setPlacements((prev) => prev.filter((p) => p.instanceId !== instanceId));
    setSelectedPlacementId((prev) => (prev === instanceId ? null : prev));
  }, []);

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
    moveCharm,
    updateRotation,
    removePlacement,
    handlePlacementClick,
    findFirstAvailableHole,
    resetCustomizer,
  };
}
