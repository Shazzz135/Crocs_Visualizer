import type { CrocColor, CrocSize, VentHole } from '@crocs/shared';
import React from 'react';
import { useCanvasZoom } from '../../hooks/useCanvasZoom.js';
import { SHOE_DISPLAY_SIZES } from './shoeHoleConfig.js';
import { SingleShoeSvg } from './SingleShoeSvg.js';

interface ShoeCanvasProps {
  size: CrocSize;
  color: CrocColor;
  occupiedHoleIds?: Set<string>;
  activeSnapHoleId?: string | null;
  onHoleClick?: (hole: VentHole) => void;
}

export const ShoeCanvas: React.FC<ShoeCanvasProps> = ({
  size,
  color,
  occupiedHoleIds = new Set(),
  activeSnapHoleId = null,
  onHoleClick,
}) => {
  const displaySpec = SHOE_DISPLAY_SIZES[size] ?? SHOE_DISPLAY_SIZES.adult;
  const gapPx = size === 'infant' ? 4 : 6;
  const pairWidth = displaySpec.width * 2 + gapPx;
  const pairHeight = displaySpec.height;

  const {
    containerRef,
    zoom,
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

  return (
    <div
      ref={containerRef}
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
      {/* Floating Zoom & Reset Controls */}
      <div
        data-zoom-hud="true"
        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-lg px-2 py-1 backdrop-blur-md shadow-lg cursor-default"
      >
        <button
          type="button"
          onClick={zoomOut}
          aria-label="Zoom out"
          className="w-6 h-6 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-bold cursor-pointer"
        >
          −
        </button>
        <button
          type="button"
          onClick={resetZoom}
          title="Reset zoom and position"
          className="px-1.5 text-[11px] font-mono text-slate-300 hover:text-sky-400 transition-colors cursor-pointer"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Zoom in"
          className="w-6 h-6 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-bold cursor-pointer"
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
          occupiedHoleIds={occupiedHoleIds}
          activeSnapHoleId={activeSnapHoleId}
          onHoleClick={onHoleClick}
        />

        {/* Right Shoe (Mirrored Left Shoe) */}
        <SingleShoeSvg
          side="right"
          size={size}
          colorHex={color.hex}
          width={displaySpec.width}
          height={displaySpec.height}
          occupiedHoleIds={occupiedHoleIds}
          activeSnapHoleId={activeSnapHoleId}
          onHoleClick={onHoleClick}
        />
      </div>

      {/* Dimension, Aspect Ratio & Gesture Hint */}
      <div
        data-zoom-hud="true"
        className="mt-3 z-20 text-[10px] sm:text-[11px] text-slate-400 font-medium bg-slate-900/70 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-sm text-center cursor-default"
      >
        {displaySpec.label} • Scroll at cursor to zoom • Click &amp; drag anywhere to pan
      </div>
    </div>
  );
};
