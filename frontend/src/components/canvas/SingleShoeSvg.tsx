import {
  getShoeBounds,
  type CrocSize,
  type ShoeSide,
  type VentHole,
} from '@crocs/shared';
import React, { useMemo } from 'react';
import { getShoePaths } from './shoeGeometry.js';
import { VentHoleSocket } from './VentHoleSocket.js';

interface SingleShoeSvgProps {
  side: ShoeSide;
  size: CrocSize;
  colorHex: string;
  holes: VentHole[];
  occupiedHoleIds?: Set<string>;
  activeSnapHoleId?: string | null;
  onHoleClick?: (hole: VentHole) => void;
}

export const SingleShoeSvg: React.FC<SingleShoeSvgProps> = ({
  side,
  size,
  colorHex,
  holes,
  occupiedHoleIds = new Set(),
  activeSnapHoleId = null,
  onHoleClick,
}) => {
  const bounds = useMemo(() => getShoeBounds(side, size), [side, size]);
  const paths = useMemo(
    () => getShoePaths(side, size, bounds.width, bounds.height),
    [side, size, bounds.width, bounds.height]
  );

  return (
    <g transform={`translate(${bounds.x}, ${bounds.y})`}>
      {/* Drop shadow underneath the shoe */}
      <path
        d={paths.outerShell}
        fill="rgba(0, 0, 0, 0.45)"
        filter="blur(14px)"
        transform="translate(0, 18)"
      />

      {/* Main molded Croslite foam outer body */}
      <path
        d={paths.outerShell}
        fill={colorHex}
        stroke="rgba(0, 0, 0, 0.2)"
        strokeWidth="2"
      />

      {/* Subtle molded toe bumper highlight line */}
      <path
        d={paths.toeBumper}
        fill="none"
        stroke="rgba(255, 255, 255, 0.22)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Footbed collar / entrance opening */}
      <path
        d={paths.footbed}
        fill="rgba(0, 0, 0, 0.35)"
        stroke="rgba(0, 0, 0, 0.5)"
        strokeWidth="2"
      />

      {/* Pivoting heel backstrap */}
      <path
        d={paths.strap}
        fill={colorHex}
        stroke="rgba(0, 0, 0, 0.25)"
        strokeWidth="2"
      />

      {/* Strap pivot rivet (Crocs logo button) */}
      <circle
        cx={paths.strapRivet.x}
        cy={paths.strapRivet.y}
        r={7}
        fill="#111827"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="1.5"
      />

      {/* 13 Vent Hole Sockets */}
      {holes.map((hole) => {
        const localPos = {
          x: Math.round(hole.normalizedX * bounds.width),
          y: Math.round(hole.normalizedY * bounds.height),
        };
        return (
          <VentHoleSocket
            key={hole.id}
            hole={hole}
            position={localPos}
            isOccupied={occupiedHoleIds.has(hole.id)}
            isSnapTarget={activeSnapHoleId === hole.id}
            onSelect={onHoleClick}
          />
        );
      })}
    </g>
  );
};
