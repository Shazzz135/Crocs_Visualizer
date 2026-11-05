import {
  ALL_VENT_HOLES,
  getHolePixelPosition,
  SHOE_SIZE_SCALES,
  type CrocColor,
  type CrocSize,
  type VentHole,
} from '@crocs/shared';
import React, { useMemo } from 'react';
import { VentHoleSocket } from './VentHoleSocket.js';

interface ShoeCanvasProps {
  size: CrocSize;
  color: CrocColor;
  occupiedHoleIds?: Set<string>;
  activeSnapHoleId?: string | null;
  onHoleClick?: (hole: VentHole) => void;
  svgRef?: React.Ref<SVGSVGElement>;
}

// Compute CSS color filter based on target colorway relative to classic red base
function getColorFilter(colorId: string): string {
  switch (colorId) {
    case 'black':
      return 'brightness(0.2) contrast(1.4) saturate(0)';
    case 'white':
      return 'brightness(2.2) contrast(0.9) grayscale(1)';
    case 'navy':
      return 'hue-rotate(220deg) brightness(0.35) contrast(1.2) saturate(1.4)';
    case 'lime-zest':
      return 'hue-rotate(85deg) brightness(1.25) saturate(1.8)';
    case 'digital-violet':
      return 'hue-rotate(260deg) brightness(0.65) saturate(1.2)';
    case 'ballerina-pink':
      return 'brightness(1.5) hue-rotate(330deg) saturate(0.8)';
    case 'atmosphere':
      return 'grayscale(1) brightness(0.85) contrast(0.9)';
    case 'juice':
    default:
      return 'none';
  }
}

export const ShoeCanvas: React.FC<ShoeCanvasProps> = ({
  size,
  color,
  occupiedHoleIds = new Set(),
  activeSnapHoleId = null,
  onHoleClick,
  svgRef,
}) => {
  const scale = SHOE_SIZE_SCALES[size] ?? SHOE_SIZE_SCALES.adult;
  const colorFilter = useMemo(() => getColorFilter(color.id), [color.id]);

  // Compute exact coordinates for all 26 holes for current size
  const holePositions = useMemo(() => {
    return ALL_VENT_HOLES.map((hole) => ({
      hole,
      pos: getHolePixelPosition(hole, size),
    }));
  }, [size]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 select-none">
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1000"
        className="w-full max-h-[75vh] object-contain drop-shadow-2xl transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.08)" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
          </radialGradient>
        </defs>

        {/* Ambient floor glow */}
        <ellipse cx="500" cy="500" rx="480" ry="460" fill="url(#stageGlow)" />

        {/* Shoe pair image container with size transformation */}
        <g
          transform={`translate(500, 500) scale(${scale.scaleX}, ${scale.scaleY}) translate(-500, -500)`}
          className="transition-transform duration-300 origin-center"
        >
          {/* Authentic High-Res Crocs Pair (with dynamic color filter) */}
          <image
            href="/assets/classic-crocs-pair.png"
            x="0"
            y="0"
            width="1000"
            height="1000"
            preserveAspectRatio="xMidYMid meet"
            style={{
              filter: colorFilter,
              transition: 'filter 250ms ease-in-out',
            }}
          />
        </g>

        {/* 26 Interactive Vent Hole Sockets */}
        <g>
          {holePositions.map(({ hole, pos }) => (
            <VentHoleSocket
              key={hole.id}
              hole={hole}
              position={pos}
              radius={11}
              isOccupied={occupiedHoleIds.has(hole.id)}
              isSnapTarget={activeSnapHoleId === hole.id}
              onSelect={onHoleClick}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
