import type { HoleId, VentHole } from '@crocs/shared';
import React from 'react';
import {
  LEFT_COLLAR_PATH,
  LEFT_HOLES_LOCAL,
  LEFT_OUTER_PATH,
  LEFT_STRAP_PATH,
  RIGHT_COLLAR_PATH,
  RIGHT_HOLES_LOCAL,
  RIGHT_OUTER_PATH,
  RIGHT_STRAP_PATH,
} from './crocsSvgData.js';
import { VentHoleSocket } from './VentHoleSocket.js';

interface SingleShoeSvgProps {
  side: 'left' | 'right';
  colorHex: string;
  width: number;
  height: number;
  occupiedHoleIds?: Set<string>;
  activeSnapHoleId?: string | null;
  onHoleClick?: (hole: VentHole) => void;
}

export const SingleShoeSvg: React.FC<SingleShoeSvgProps> = ({
  side,
  colorHex,
  width,
  height,
  occupiedHoleIds = new Set(),
  activeSnapHoleId = null,
  onHoleClick,
}) => {
  const isLeft = side === 'left';
  const outerPath = isLeft ? LEFT_OUTER_PATH : RIGHT_OUTER_PATH;
  const collarPath = isLeft ? LEFT_COLLAR_PATH : RIGHT_COLLAR_PATH;
  const strapPath = isLeft ? LEFT_STRAP_PATH : RIGHT_STRAP_PATH;
  const holes = isLeft ? LEFT_HOLES_LOCAL : RIGHT_HOLES_LOCAL;
  const rivetLeftX = isLeft ? 34 : 398;
  const rivetRightX = isLeft ? 408 : 24;

  return (
    <svg
      viewBox="0 0 432 966"
      preserveAspectRatio="none"
      style={{ width: `${width}px`, height: `${height}px` }}
      className="transition-all duration-300 drop-shadow-2xl overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Footbed depth gradient */}
        <radialGradient id={`fb-depth-${side}`} cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="rgba(0, 0, 0, 0.45)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.65)" />
        </radialGradient>

        {/* Foam highlight gradient */}
        <linearGradient id={`foam-hi-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.22)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.0)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.25)" />
        </linearGradient>
      </defs>

      {/* Ambient floor shadow */}
      <path
        d={outerPath}
        fill="rgba(0, 0, 0, 0.4)"
        filter="blur(16px)"
        transform="translate(0, 24)"
      />

      {/* Main Molded Croslite Foam Outer Shell */}
      <path
        d={outerPath}
        fill={colorHex}
        stroke="rgba(0, 0, 0, 0.3)"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Foam lighting overlay */}
      <path
        d={outerPath}
        fill={`url(#foam-hi-${side})`}
        stroke="none"
      />

      {/* Footbed collar opening (darker recessed foot entrance) */}
      <path
        d={collarPath}
        fill={`url(#fb-depth-${side})`}
        stroke="rgba(0, 0, 0, 0.5)"
        strokeWidth="3"
      />

      {/* Textured footbed massage nubs (concentric dotted rings) */}
      <g stroke="rgba(255, 255, 255, 0.15)" strokeWidth="3" strokeDasharray="2,14" fill="none">
        <ellipse cx="216" cy="650" rx="90" ry="170" />
        <ellipse cx="216" cy="650" rx="65" ry="130" />
        <ellipse cx="216" cy="650" rx="40" ry="85" />
      </g>

      {/* Pivoting Heel Backstrap */}
      <path
        d={strapPath}
        fill={colorHex}
        stroke="rgba(0, 0, 0, 0.35)"
        strokeWidth="3"
      />
      <path
        d={strapPath}
        fill="rgba(0, 0, 0, 0.15)"
      />

      {/* Strap Pivot Rivet Buttons (Crocs mascot logo button) */}
      <g>
        <circle cx={rivetLeftX} cy="592" r="13" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
        <circle cx={rivetLeftX} cy="592" r="7" fill="#0f172a" />
        <circle cx={rivetRightX} cy="592" r="13" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
        <circle cx={rivetRightX} cy="592" r="7" fill="#0f172a" />
      </g>

      {/* 13 Authentic Vent Hole Sockets */}
      <g>
        {holes.map((h) => {
          const holeObj: VentHole = {
            id: h.id as HoleId,
            side,
            index: parseInt(h.id.slice(3), 10),
            normalizedX: h.x / 432,
            normalizedY: h.y / 966,
          };
          return (
            <VentHoleSocket
              key={h.id}
              hole={holeObj}
              position={{ x: h.x, y: h.y }}
              radius={17}
              isOccupied={occupiedHoleIds.has(h.id)}
              isSnapTarget={activeSnapHoleId === h.id}
              onSelect={onHoleClick}
            />
          );
        })}
      </g>
    </svg>
  );
};
