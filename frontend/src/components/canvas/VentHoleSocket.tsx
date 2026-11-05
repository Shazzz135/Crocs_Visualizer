import type { PixelCoordinate, VentHole } from '@crocs/shared';
import React from 'react';

interface VentHoleSocketProps {
  hole: VentHole;
  position: PixelCoordinate;
  isOccupied: boolean;
  isHovered?: boolean;
  isSnapTarget?: boolean;
  radius?: number;
  onSelect?: (hole: VentHole) => void;
}

export const VentHoleSocket: React.FC<VentHoleSocketProps> = ({
  hole,
  position,
  isOccupied,
  isHovered = false,
  isSnapTarget = false,
  radius = 9,
  onSelect,
}) => {
  return (
    <g
      className="cursor-pointer transition-transform duration-150"
      transform={`translate(${position.x}, ${position.y})`}
      onClick={() => onSelect?.(hole)}
      role="button"
      tabIndex={0}
      aria-label={`Vent hole ${hole.id}${isOccupied ? ' (occupied)' : ' (empty)'}`}
    >
      {/* Target glow ring when snapping or hovered */}
      {(isHovered || isSnapTarget) && (
        <circle
          r={radius + 6}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          className="animate-pulse opacity-90"
        />
      )}

      {/* Beveled molded outer rim */}
      <circle
        r={radius + 1.5}
        fill="rgba(0, 0, 0, 0.25)"
      />

      {/* Inner vent hole core */}
      <circle
        r={radius}
        fill="#0b0d11"
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth="1"
      />

      {/* Inner shadow/depth crescent */}
      <ellipse
        cx={-radius * 0.2}
        cy={-radius * 0.2}
        rx={radius * 0.7}
        ry={radius * 0.5}
        fill="rgba(0, 0, 0, 0.4)"
      />
    </g>
  );
};
