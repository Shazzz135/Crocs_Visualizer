import type { CrocColor, CrocSize, PlacedJibbitz, VentHole } from '@crocs/shared';
import React from 'react';
import { useCanvasZoom } from '../../hooks/useCanvasZoom.js';
import { SHOE_DISPLAY_SIZES } from './shoeHoleConfig.js';
import { SingleShoeSvg } from './SingleShoeSvg.js';

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
}) => {
  const displaySpec = SHOE_DISPLAY_SIZES[size] ?? SHOE_DISPLAY_SIZES.adult;
  const gapPx = size === 'infant' ? 4 : 6;
  const pairWidth = displaySpec.width * 2 + gapPx;
  const pairHeight = displaySpec.height;

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

  const handleContainerClick = (e: React.MouseEvent) => {
    // Only deselect if clicking canvas background, not on interactive shoe parts
    if ((e.target as HTMLElement).tagName === 'DIV' || (e.target as HTMLElement).tagName === 'svg') {
      onCanvasClick?.();
    }
  };

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
      {/* Floating Zoom Controls (Dark Green Crocs HUD) */}
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

      {/* Responsive, Cursor-Zoomable & Pannable Pair Stage */}
      <div
        className={`relative z-10 flex items-center justify-center origin-center ${
          isPanning ? 'transition-none' : 'transition-transform duration-75 ease-out'
        }`}
        style={{
          gap: `${gapPx}px`,
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${effectiveScale})`,
        }}
      >
        {/* Left Shoe */}
        <SingleShoeSvg
          side="left"
          size={size}
          colorHex={color.hex}
          width={displaySpec.width}
          height={displaySpec.height}
          placements={placements}
          occupiedHoleIds={occupiedHoleIds}
          activeSnapHoleId={activeSnapHoleId}
          selectedPlacementId={selectedPlacementId}
          onHoleClick={onHoleClick}
          onCharmClick={onCharmClick}
          onRotateCharm={onRotateCharm}
        />

        {/* Right Shoe (Mirrored Left Shoe) */}
        <SingleShoeSvg
          side="right"
          size={size}
          colorHex={color.hex}
          width={displaySpec.width}
          height={displaySpec.height}
          placements={placements}
          occupiedHoleIds={occupiedHoleIds}
          activeSnapHoleId={activeSnapHoleId}
          selectedPlacementId={selectedPlacementId}
          onHoleClick={onHoleClick}
          onCharmClick={onCharmClick}
          onRotateCharm={onRotateCharm}
        />
      </div>
    </div>
  );
};
