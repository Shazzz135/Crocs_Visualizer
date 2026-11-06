import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { JibbitzItem, HoleId } from '@crocs/shared';
import { CharmDragContext, type DragState } from './charmDragContextDef.js';

export const CharmDragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    charm: null,
    pointerPos: null,
    activeSnapHoleId: null,
  });

  const stateRef = useRef(dragState);
  useEffect(() => {
    stateRef.current = dragState;
  }, [dragState]);

  const startDrag = useCallback((charm: JibbitzItem, startPos: { x: number; y: number }) => {
    setDragState({
      isDragging: true,
      charm,
      pointerPos: startPos,
      activeSnapHoleId: null,
    });
  }, []);

  const updateDragPosition = useCallback((pos: { x: number; y: number }, snapHoleId?: HoleId | null) => {
    setDragState((prev) => {
      if (!prev.isDragging) return prev;
      return {
        ...prev,
        pointerPos: pos,
        activeSnapHoleId: snapHoleId !== undefined ? snapHoleId : prev.activeSnapHoleId,
      };
    });
  }, []);

  const endDrag = useCallback(() => {
    const current = stateRef.current;
    if (current.isDragging && current.charm && current.activeSnapHoleId) {
      const result = { charm: current.charm, holeId: current.activeSnapHoleId };
      setDragState({
        isDragging: false,
        charm: null,
        pointerPos: null,
        activeSnapHoleId: null,
      });
      return result;
    }
    setDragState({
      isDragging: false,
      charm: null,
      pointerPos: null,
      activeSnapHoleId: null,
    });
    return null;
  }, []);

  const cancelDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      charm: null,
      pointerPos: null,
      activeSnapHoleId: null,
    });
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

      {/* Floating Drag Overlay following Cursor / Finger */}
      {dragState.isDragging && dragState.charm && dragState.pointerPos && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 select-none"
          style={{
            left: `${dragState.pointerPos.x}px`,
            top: `${dragState.pointerPos.y}px`,
          }}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center p-1 transition-all ${
              dragState.activeSnapHoleId
                ? 'scale-125 bg-emerald-500/30 ring-2 ring-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]'
                : 'scale-110 drop-shadow-2xl'
            }`}
          >
            <img
              src={dragState.charm.imageUrl}
              alt={dragState.charm.name}
              className="w-full h-full object-contain filter drop-shadow(0 8px 12px rgba(0,0,0,0.6))"
            />
          </div>
        </div>
      )}
    </CharmDragContext.Provider>
  );
};
