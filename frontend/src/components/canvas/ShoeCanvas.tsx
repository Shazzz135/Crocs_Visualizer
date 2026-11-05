import type { CrocColor, CrocSize, VentHole } from '@crocs/shared';
import React from 'react';
import { SHOE_DISPLAY_SIZES } from './crocsSvgData.js';
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
  const gapPx = size === 'infant' ? 32 : 44;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 select-none min-h-[460px]">
      {/* Background ambient stage lighting */}
      <div
        className="absolute w-[600px] h-[340px] rounded-full pointer-events-none blur-3xl opacity-20 transition-all duration-300"
        style={{ backgroundColor: color.hex }}
      />

      {/* Side-by-Side Pair View (Left and Right Shoes) */}
      <div
        className="relative z-10 flex items-center justify-center transition-all duration-300"
        style={{ gap: `${gapPx}px` }}
      >
        {/* Left Shoe */}
        <SingleShoeSvg
          side="left"
          colorHex={color.hex}
          width={displaySpec.width}
          height={displaySpec.height}
          occupiedHoleIds={occupiedHoleIds}
          activeSnapHoleId={activeSnapHoleId}
          onHoleClick={onHoleClick}
        />

        {/* Right Shoe */}
        <SingleShoeSvg
          side="right"
          colorHex={color.hex}
          width={displaySpec.width}
          height={displaySpec.height}
          occupiedHoleIds={occupiedHoleIds}
          activeSnapHoleId={activeSnapHoleId}
          onHoleClick={onHoleClick}
        />
      </div>

      {/* Dimension & Aspect Ratio Indicator */}
      <div className="mt-4 text-[11px] text-slate-400 font-medium bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-sm">
        Display Scale: {displaySpec.label} • {displaySpec.width}px × {displaySpec.height}px
      </div>
    </div>
  );
};
