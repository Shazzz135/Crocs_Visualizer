import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { JibbitzItem, HoleId } from '@crocs/shared';
import { CharmDragContext, type DragState } from './charmDragContextDef.js';

export const CharmDragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    charm: null,
    rotationDeg: 0,
    sourceHoleId: null,
    sourceInstanceId: null,
    pointerPos: null,
    activeSnapHoleId: null,
  });

  const stateRef = useRef(dragState);
  useEffect(() => {
    stateRef.current = dragState;
  }, [dragState]);

  const startDrag = useCallback(
    (
      charm: JibbitzItem,
      startPos: { x: number; y: number },
      sourceHoleId?: HoleId | null,
      sourceInstanceId?: string | null,
      rotationDeg = 0
    ) => {
      const nextState: DragState = {
        isDragging: true,
        charm,
        rotationDeg,
        sourceHoleId: sourceHoleId ?? null,
        sourceInstanceId: sourceInstanceId ?? null,
        pointerPos: startPos,
        activeSnapHoleId: null,
      };
      stateRef.current = nextState;
      setDragState(nextState);
    },
    []
  );

  const updateDragPosition = useCallback((pos: { x: number; y: number }, snapHoleId?: HoleId | null) => {
    setDragState((prev) => {
      if (!prev.isDragging) return prev;
      const next = {
        ...prev,
        pointerPos: pos,
        activeSnapHoleId: snapHoleId !== undefined ? snapHoleId : prev.activeSnapHoleId,
      };
      stateRef.current = next;
      return next;
    });
  }, []);

  const endDrag = useCallback((overrideHoleId?: HoleId | null) => {
    const current = stateRef.current;
    const targetHoleId = overrideHoleId !== undefined ? overrideHoleId : current.activeSnapHoleId;
    if (current.isDragging && current.charm && targetHoleId) {
      const result = {
        charm: current.charm,
        holeId: targetHoleId,
        sourceHoleId: current.sourceHoleId,
        sourceInstanceId: current.sourceInstanceId,
        rotationDeg: current.rotationDeg ?? 0,
      };
      const resetState: DragState = {
        isDragging: false,
        charm: null,
        rotationDeg: 0,
        sourceHoleId: null,
        sourceInstanceId: null,
        pointerPos: null,
        activeSnapHoleId: null,
      };
      stateRef.current = resetState;
      setDragState(resetState);
      return result;
    }
    const resetState: DragState = {
      isDragging: false,
      charm: null,
      rotationDeg: 0,
      sourceHoleId: null,
      sourceInstanceId: null,
      pointerPos: null,
      activeSnapHoleId: null,
    };
    stateRef.current = resetState;
    setDragState(resetState);
    return null;
  }, []);

  const cancelDrag = useCallback(() => {
    const resetState: DragState = {
      isDragging: false,
      charm: null,
      rotationDeg: 0,
      sourceHoleId: null,
      sourceInstanceId: null,
      pointerPos: null,
      activeSnapHoleId: null,
    };
    stateRef.current = resetState;
    setDragState(resetState);
  }, []);

  return (
    <CharmDragContext.Provider
      value={{
        dragState,
        startDrag,
        updateDragPosition,
        endDrag,
        cancelDrag,
      }}
    >
      {children}

      {/* Floating Drag Overlay: Charm holds rotation angle in the air with no borders or backgrounds */}
      {dragState.isDragging && dragState.charm && dragState.pointerPos && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            left: `${dragState.pointerPos.x}px`,
            top: `${dragState.pointerPos.y}px`,
            width: '72px',
            height: '72px',
          }}
        >
          <img
            src={dragState.charm.imageUrl}
            alt={dragState.charm.name}
            style={{
              transform: `rotate(${dragState.rotationDeg ?? 0}deg)`,
            }}
            className="w-full h-full object-contain filter drop-shadow(0 8px 16px rgba(0,0,0,0.5)) pointer-events-none"
          />
        </div>
      )}
    </CharmDragContext.Provider>
  );
};
