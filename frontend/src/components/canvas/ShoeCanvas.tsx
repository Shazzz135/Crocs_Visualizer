import {
  LEFT_SHOE_HOLES,
  RIGHT_SHOE_HOLES,
  type CrocSize,
  type VentHole,
} from '@crocs/shared';
import React from 'react';
import { SingleShoeSvg } from './SingleShoeSvg.js';

interface ShoeCanvasProps {
  size: CrocSize;
  colorHex: string;
  occupiedHoleIds?: Set<string>;
  activeSnapHoleId?: string | null;
  onHoleClick?: (hole: VentHole) => void;
  svgRef?: React.Ref<SVGSVGElement>;
}

export const ShoeCanvas: React.FC<ShoeCanvasProps> = ({
  size,
  colorHex,
  occupiedHoleIds = new Set(),
  activeSnapHoleId = null,
  onHoleClick,
  svgRef,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 select-none">
      <svg
        ref={svgRef}
        viewBox="0 0 1000 650"
        className="w-full max-h-[72vh] object-contain drop-shadow-2xl transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle canvas background gradient */}
          <radialGradient id="canvasGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(30, 41, 59, 0.4)" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
          </radialGradient>
        </defs>

        {/* Ambient floor glow */}
        <ellipse cx="500" cy="325" rx="460" ry="290" fill="url(#canvasGlow)" />

        {/* Left Shoe (13 Holes) */}
        <SingleShoeSvg
          side="left"
          size={size}
          colorHex={colorHex}
          holes={LEFT_SHOE_HOLES}
          occupiedHoleIds={occupiedHoleIds}
          activeSnapHoleId={activeSnapHoleId}
          onHoleClick={onHoleClick}
        />

        {/* Right Shoe (13 Holes) */}
        <SingleShoeSvg
          side="right"
          size={size}
          colorHex={colorHex}
          holes={RIGHT_SHOE_HOLES}
          occupiedHoleIds={occupiedHoleIds}
          activeSnapHoleId={activeSnapHoleId}
          onHoleClick={onHoleClick}
        />
      </svg>
    </div>
  );
};
