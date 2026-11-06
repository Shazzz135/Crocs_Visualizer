import type { CrocColor, CrocSize, HoleId, JibbitzItem, PlacedJibbitz, VentHole } from '@crocs/shared';
import React, { useRef, useEffect } from 'react';
import { useCanvasZoom } from '../../hooks/useCanvasZoom.js';
import { SHOE_DISPLAY_SIZES, SHOE_HOLES_BY_SIZE } from './shoeHoleConfig.js';
import { SHOE_VIEWBOX } from './crocsSvgData.js';
import { SingleShoeSvg } from './SingleShoeSvg.js';
import { useCharmDrag } from '../../context/useCharmDrag.js';

interface ShoeCanvasProps {
  size: CrocSize;
  color: CrocColor;
  placements?: PlacedJibbitz[];
  occupiedHoleIds?: Set<string>;
  activeSnapHoleId?: string | null;
  selectedPlacementId?: string | null;
  onHoleClick?: (hole: VentHole) => void;
  onCharmClick?: (instanceId: string) => void;
  onRotateCharm?: (instanceId: string, deg: number) => void;
  onCanvasClick?: () => void;
  onDropCharm?: (charm: JibbitzItem, holeId: HoleId) => void;
}

export const ShoeCanvas: React.FC<ShoeCanvasProps> = ({
  size,
  color,
  placements = [],
  occupiedHoleIds = new Set(),
  activeSnapHoleId = null,
  selectedPlacementId = null,
  onHoleClick,
  onCharmClick,
  onRotateCharm,
  onCanvasClick,
  onDropCharm,
}) => {
  const displaySpec = SHOE_DISPLAY_SIZES[size] ?? SHOE_DISPLAY_SIZES.adult;
  const gapPx = size === 'infant' ? 4 : 6;
  const pairWidth = displaySpec.width * 2 + gapPx;
  const pairHeight = displaySpec.height;

  const leftSvgRef = useRef<SVGSVGElement>(null);
  const rightSvgRef = useRef<SVGSVGElement>(null);

  const { dragState, updateDragPosition, endDrag } = useCharmDrag();

  const {
    containerRef,
    pan,
    isPanning,
    effectiveScale,
    zoomIn,
    zoomOut,
    resetZoom,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useCanvasZoom({ pairWidth, pairHeight });

  // Handle global drag tracking over the shoes
  useEffect(() => {
    if (!dragState.isDragging) return;

    const sizeHoles = SHOE_HOLES_BY_SIZE[size] ?? SHOE_HOLES_BY_SIZE.adult;

    const findNearestHole = (svg: SVGSVGElement | null, isLeft: boolean, clientX: number, clientY: number): HoleId | null => {
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      if (
        clientX < rect.left - 40 ||
        clientX > rect.right + 40 ||
        clientY < rect.top - 40 ||
        clientY > rect.bottom + 40
      ) {
        return null;
      }

      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const svgPt = pt.matrixTransform(ctm.inverse());

      const prefix = isLeft ? 'HL' : 'HR';
      let nearestHoleId: HoleId | null = null;
      let minDist = 34; // Snapping collision threshold (in SVG coordinate space)

      for (const h of sizeHoles) {
        const hId = `${prefix}-${String(h.index).padStart(2, '0')}` as HoleId;
        if (occupiedHoleIds.has(hId)) continue;

        const hx = isLeft ? h.x : SHOE_VIEWBOX.width - h.x;
        const dist = Math.hypot(svgPt.x - hx, svgPt.y - h.y);
        if (dist < minDist) {
          minDist = dist;
          nearestHoleId = hId;
        }
      }
      return nearestHoleId;
    };

    const handleWindowPointerMove = (e: PointerEvent) => {
      const leftMatch = findNearestHole(leftSvgRef.current, true, e.clientX, e.clientY);
      const rightMatch = leftMatch ? null : findNearestHole(rightSvgRef.current, false, e.clientX, e.clientY);
      const matchedHoleId = leftMatch || rightMatch;

      updateDragPosition({ x: e.clientX, y: e.clientY }, matchedHoleId);
    };

    const handleWindowPointerUp = () => {
      const dropped = endDrag();
      if (dropped && onDropCharm) {
        onDropCharm(dropped.charm, dropped.holeId);
      }
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [dragState.isDragging, endDrag, occupiedHoleIds, onDropCharm, size, updateDragPosition]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'DIV' || (e.target as HTMLElement).tagName === 'svg') {
      onCanvasClick?.();
    }
  };

  const currentSnapHoleId = dragState.activeSnapHoleId ?? activeSnapHoleId;

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-full flex-1 flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-hidden touch-none min-h-0 ${
        isPanning ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Floating Zoom Controls */}
      <div
        data-zoom-hud="true"
        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center gap-1 bg-[#06241a]/95 border border-emerald-900/80 rounded-lg px-2 py-1 backdrop-blur-md shadow-xl cursor-default"
      >
        <button
          type="button"
          onClick={zoomOut}
          aria-label="Zoom out"
          title="Zoom out"
          className="w-6 h-6 flex items-center justify-center rounded text-emerald-300 hover:text-white hover:bg-emerald-900/60 transition-colors text-sm font-bold cursor-pointer"
        >
          −
        </button>
        <button
          type="button"
          onClick={resetZoom}
          aria-label="Reset zoom"
          title="Reset canvas"
          className="px-1.5 py-0.5 text-xs text-emerald-400 hover:text-white hover:bg-emerald-900/60 rounded transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Zoom in"
          title="Zoom in"
          className="w-6 h-6 flex items-center justify-center rounded text-emerald-300 hover:text-white hover:bg-emerald-900/60 transition-colors text-sm font-bold cursor-pointer"
        >
          +
        </button>
      </div>

      {/* Responsive Pair Stage */}
      <div
        className={`relative z-10 flex items-center justify-center origin-center ${
          isPanning ? 'transition-none' : 'transition-transform duration-75 ease-out'
        }`}
        style={{
          gap: `${gapPx}px`,
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${effectiveScale})`,
        }}
      >
        <SingleShoeSvg
          ref={leftSvgRef}
          side="left"
          size={size}
          colorHex={color.hex}
          width={displaySpec.width}
          height={displaySpec.height}
          placements={placements}
          occupiedHoleIds={occupiedHoleIds}
          activeSnapHoleId={currentSnapHoleId}
          selectedPlacementId={selectedPlacementId}
          onHoleClick={onHoleClick}
          onCharmClick={onCharmClick}
          onRotateCharm={onRotateCharm}
        />

        <SingleShoeSvg
          ref={rightSvgRef}
          side="right"
          size={size}
          colorHex={color.hex}
          width={displaySpec.width}
          height={displaySpec.height}
          placements={placements}
          occupiedHoleIds={occupiedHoleIds}
          activeSnapHoleId={currentSnapHoleId}
          selectedPlacementId={selectedPlacementId}
          onHoleClick={onHoleClick}
          onCharmClick={onCharmClick}
          onRotateCharm={onRotateCharm}
        />
      </div>
    </div>
  );
};
