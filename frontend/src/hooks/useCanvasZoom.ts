import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;
const ZOOM_STEP = 0.15;

interface UseCanvasZoomOptions {
  pairWidth: number;
  pairHeight: number;
}

export interface PanOffset {
  x: number;
  y: number;
}

export interface CanvasZoomState {
  containerRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
  pan: PanOffset;
  isPanning: boolean;
  fitScale: number;
  effectiveScale: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: () => void;
}

const getTouchDistance = (t: React.TouchList): number =>
  Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

const getTouchMidpoint = (t: React.TouchList): PanOffset => ({
  x: (t[0].clientX + t[1].clientX) / 2,
  y: (t[0].clientY + t[1].clientY) / 2,
});

export function useCanvasZoom({ pairWidth, pairHeight }: UseCanvasZoomOptions): CanvasZoomState {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<PanOffset>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [fitScale, setFitScale] = useState<number>(1);

  const stateRef = useRef({ zoom: 1, pan: { x: 0, y: 0 } });
  useEffect(() => {
    stateRef.current = { zoom, pan };
  }, [zoom, pan]);

  const dragStartRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originPanX: number;
    originPanY: number;
    hasMoved: boolean;
  } | null>(null);

  const pinchStartRef = useRef<{
    dist: number;
    startZoom: number;
    startPan: PanOffset;
    midX: number;
    midY: number;
  } | null>(null);

  const clampZoom = useCallback(
    (val: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(val.toFixed(3)))),
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateFitScale = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const availW = Math.max(180, rect.width - 20);
      const availH = Math.max(220, rect.height - 64);
      const nextFit = Math.min(1, availW / pairWidth, availH / pairHeight);
      setFitScale(Math.max(0.35, Number(nextFit.toFixed(3))));
    };

    updateFitScale();
    const observer = new ResizeObserver(updateFitScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [pairWidth, pairHeight]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cursorX = e.clientX - (rect.left + rect.width / 2);
      const cursorY = e.clientY - (rect.top + rect.height / 2);

      const { zoom: oldZoom, pan: oldPan } = stateRef.current;
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const newZoom = clampZoom(oldZoom * factor);
      if (newZoom === oldZoom) return;

      const ratio = newZoom / oldZoom;
      setZoom(newZoom);
      setPan({
        x: Number((cursorX - (cursorX - oldPan.x) * ratio).toFixed(2)),
        y: Number((cursorY - (cursorY - oldPan.y) * ratio).toFixed(2)),
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [clampZoom]);

  // Click-and-drag pan (ignoring HUD buttons, charms, and hole sockets)
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const target = e.target as Element | null;
    if (
      target?.closest('[data-zoom-hud="true"]') ||
      target?.closest('[data-charm-item="true"]') ||
      target?.closest('[data-hole-socket="true"]') ||
      target?.closest('[data-rotation-knob="true"]')
    ) {
      return;
    }

    dragStartRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originPanX: stateRef.current.pan.x,
      originPanY: stateRef.current.pan.y,
      hasMoved: false,
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStartRef.current;
    if (!drag || drag.pointerId !== e.pointerId || pinchStartRef.current) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.hasMoved && Math.hypot(dx, dy) > 3) {
      drag.hasMoved = true;
      setIsPanning(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (drag.hasMoved) {
      setPan({
        x: Math.round(drag.originPanX + dx),
        y: Math.round(drag.originPanY + dy),
      });
    }
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current?.pointerId === e.pointerId) {
      dragStartRef.current = null;
      setIsPanning(false);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      dragStartRef.current = null;
      setIsPanning(false);
      const mid = getTouchMidpoint(e.touches);
      pinchStartRef.current = {
        dist: getTouchDistance(e.touches),
        startZoom: stateRef.current.zoom,
        startPan: stateRef.current.pan,
        midX: mid.x,
        midY: mid.y,
      };
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      const pinch = pinchStartRef.current;
      if (e.touches.length !== 2 || !pinch || !el || pinch.dist <= 0) return;

      const rect = el.getBoundingClientRect();
      const mid = getTouchMidpoint(e.touches);
      const focusX = mid.x - (rect.left + rect.width / 2);
      const focusY = mid.y - (rect.top + rect.height / 2);

      const newZoom = clampZoom(pinch.startZoom * (getTouchDistance(e.touches) / pinch.dist));
      const ratio = newZoom / pinch.startZoom;

      setZoom(newZoom);
      setPan({
        x: Number((focusX - (focusX - pinch.startPan.x) * ratio + (mid.x - pinch.midX)).toFixed(2)),
        y: Number((focusY - (focusY - pinch.startPan.y) * ratio + (mid.y - pinch.midY)).toFixed(2)),
      });
    },
    [clampZoom]
  );

  const handleTouchEnd = useCallback(() => {
    pinchStartRef.current = null;
  }, []);

  const zoomIn = useCallback(() => setZoom((z) => clampZoom(z + ZOOM_STEP)), [clampZoom]);
  const zoomOut = useCallback(() => setZoom((z) => clampZoom(z - ZOOM_STEP)), [clampZoom]);
  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  return {
    containerRef,
    zoom,
    pan,
    isPanning,
    fitScale,
    effectiveScale: Number((zoom * fitScale).toFixed(3)),
    zoomIn,
    zoomOut,
    resetZoom,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
