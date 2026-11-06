import type { PixelCoordinate, VentHole } from '@crocs/shared';
import React from 'react';

interface VentHoleSocketProps {
  hole: VentHole;
  position: PixelCoordinate;
  isOccupied: boolean;
  isHovered?: boolean;
  isSnapTarget?: boolean;
  radius?: number;
  wallColor?: string;
  highlightColor?: string;
  scaleCorrection?: { sx: number; sy: number };
  onSelect?: (hole: VentHole) => void;
}

export const VentHoleSocket: React.FC<VentHoleSocketProps> = ({
  hole,
  position,
  isOccupied,
  isHovered = false,
  isSnapTarget = false,
  radius = 11,
  wallColor = '#141820',
  highlightColor = 'rgba(255, 255, 255, 0.25)',
  scaleCorrection = { sx: 1, sy: 1 },
  onSelect,
}) => {
  return (
    <g
      data-testid="hole-socket"
      data-hole-id={hole.id}
      data-occupied={isOccupied}
      className="cursor-pointer transition-transform duration-150"
      transform={`translate(${position.x}, ${position.y}) scale(${scaleCorrection.sx}, ${scaleCorrection.sy})`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(hole);
      }}
      role="button"
      tabIndex={0}
      aria-label={`Vent hole ${hole.id}${isOccupied ? ' (occupied)' : ' (empty)'}`}
    >
      {/* Generous hit target for click & touch (r=24) */}
      <circle r={radius + 13} fill="transparent" pointerEvents="all" />

      {/* Target glow ring when snapping or hovered */}
      {(isHovered || isSnapTarget) && (
        <circle
          r={radius + 6}
          fill="rgba(16, 185, 129, 0.25)"
          stroke="#10b981"
          strokeWidth="2.5"
          className="animate-pulse"
        />
      )}

      {/* Lower-right rim light catching the beveled hole edge */}
      <circle
        cx={0.4}
        cy={0.8}
        r={radius + 1.1}
        fill={highlightColor}
        opacity={0.45}
      />

      {/* Molded Croslite foam hole wall thickness */}
      <circle
        r={radius + 0.6}
        fill={wallColor}
      />

      {/* Deep recessed interior hole cavity */}
      <circle
        cx={0.3}
        cy={0.4}
        r={radius - 0.2}
        fill="#020806"
      />
    </g>
  );
};
