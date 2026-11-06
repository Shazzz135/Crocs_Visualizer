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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SHOE_HOLES_BY_SIZE } from '../components/canvas/shoeHoleConfig.js';
import {
  clearPersistedCustomizerState,
  loadPersistedCustomizerState,
  useCustomizerPersistence,
} from './useCustomizerPersistence.js';

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
  swapOrMoveCharm: (fromHoleId: HoleId, toHoleId: HoleId) => void;
  updateRotation: (instanceId: string, rotationDeg: number) => void;
  removePlacement: (instanceId: string) => void;
  removePlacementByHole: (holeId: HoleId) => void;
  handlePlacementClick: (instanceId: string) => void;
  findFirstAvailableHole: () => HoleId | null;
  resetCustomizer: () => void;
}

export function useShoeCustomizer(): ShoeCustomizerState {
  const initial = useMemo(() => loadPersistedCustomizerState(), []);

  const [size, setSize] = useState<CrocSize>(initial.size);
  const [color, setColor] = useState<CrocColor>(initial.color);
  const [activeHole, setActiveHole] = useState<VentHole | null>(null);
  const [placements, setPlacements] = useState<PlacedJibbitz[]>(initial.placements);
  const [activeCharmToPlace, setActiveCharmToPlace] = useState<JibbitzItem | null>(null);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(null);
  const deselectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-persist changes to localStorage with schema validation
  useCustomizerPersistence({ size, colorHex: color.hex, placements });

  const clickTrackerRef = useRef<ClickTrackerState>({
    targetId: null,
    clickCount: 0,
    lastClickTime: 0,
  });

  const occupiedHoleIds = useMemo(() => {
    return new Set(placements.map((p) => p.holeId));
  }, [placements]);

  // Automatically deselect / remove green outline after 1 second of inactivity
  const selectPlacement = useCallback((id: string | null) => {
    if (deselectTimerRef.current) {
      clearTimeout(deselectTimerRef.current);
      deselectTimerRef.current = null;
    }
    setSelectedPlacementId(id);
    if (id) {
      deselectTimerRef.current = setTimeout(() => {
        setSelectedPlacementId(null);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (deselectTimerRef.current) clearTimeout(deselectTimerRef.current);
    };
  }, []);

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

  const placeCharm = useCallback(
    (charm: JibbitzItem, holeId: HoleId, rotationDeg = 0) => {
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
      selectPlacement(newInstId);
      setActiveCharmToPlace(null);
    },
    [selectPlacement]
  );

  const swapOrMoveCharm = useCallback(
    (fromHoleId: HoleId, toHoleId: HoleId) => {
      if (fromHoleId === toHoleId) return;
      let targetInstId: string | null = null;
      setPlacements((prev) => {
        const sourcePlacement = prev.find((p) => p.holeId === fromHoleId);
        if (!sourcePlacement) return prev;
        targetInstId = sourcePlacement.instanceId;

        const targetPlacement = prev.find((p) => p.holeId === toHoleId);
        if (targetPlacement) {
          // Swap both charms while preserving their respective rotations
          return prev.map((p) => {
            if (p.instanceId === sourcePlacement.instanceId) {
              return { ...p, holeId: toHoleId, placedAt: Date.now() };
            }
            if (p.instanceId === targetPlacement.instanceId) {
              return { ...p, holeId: fromHoleId, placedAt: Date.now() };
            }
            return p;
          });
        }

        // Empty hole target -> regular move
        return prev.map((p) =>
          p.instanceId === sourcePlacement.instanceId
            ? { ...p, holeId: toHoleId, placedAt: Date.now() }
            : p
        );
      });
      if (targetInstId) {
        selectPlacement(targetInstId);
      }
    },
    [selectPlacement]
  );

  const updateRotation = useCallback(
    (instanceId: string, rotationDeg: number) => {
      setPlacements((prev) =>
        prev.map((p) => (p.instanceId === instanceId ? { ...p, rotationDeg } : p))
      );
      selectPlacement(instanceId);
    },
    [selectPlacement]
  );

  const removePlacement = useCallback(
    (instanceId: string) => {
      setPlacements((prev) => prev.filter((p) => p.instanceId !== instanceId));
      selectPlacement(null);
    },
    [selectPlacement]
  );

  const removePlacementByHole = useCallback(
    (holeId: HoleId) => {
      setPlacements((prev) => prev.filter((p) => p.holeId !== holeId));
      selectPlacement(null);
    },
    [selectPlacement]
  );

  const handlePlacementClick = useCallback(
    (instanceId: string) => {
      const now = Date.now();
      const result = processCharmClick(instanceId, clickTrackerRef.current, now);
      clickTrackerRef.current = result.nextState;

      if (result.shouldDelete) {
        removePlacement(instanceId);
      } else if (result.isSelected) {
        selectPlacement(instanceId);
      }
    },
    [removePlacement, selectPlacement]
  );

  const resetCustomizer = useCallback(() => {
    clearPersistedCustomizerState();
    setSize('adult');
    setColor(DEFAULT_CROC_COLORS[0]);
    setActiveHole(null);
    setPlacements([]);
    setActiveCharmToPlace(null);
    selectPlacement(null);
  }, [selectPlacement]);

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
    setSelectedPlacementId: selectPlacement,
    placeCharm,
    swapOrMoveCharm,
    updateRotation,
    removePlacement,
    removePlacementByHole,
    handlePlacementClick,
    findFirstAvailableHole,
    resetCustomizer,
  };
}
