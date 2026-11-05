import type { CrocSize, HoleId, VentHole } from '@crocs/shared';
import React, { useMemo } from 'react';
import { FOOTBED_NUBS_PATH } from './crocsNubsData.js';
import { CLOG_REGIONS, SHOE_VIEWBOX } from './crocsSvgData.js';
import { computeShoePalette } from './shoeColorUtils.js';
import { SHOE_HOLES_BY_SIZE } from './shoeHoleConfig.js';
import { ShoeSvgDefs } from './ShoeSvgDefs.js';
import { VentHoleSocket } from './VentHoleSocket.js';

interface SingleShoeSvgProps {
  side: 'left' | 'right';
  size: CrocSize;
  colorHex: string;
  width: number;
  height: number;
  occupiedHoleIds?: Set<string>;
  activeSnapHoleId?: string | null;
  onHoleClick?: (hole: VentHole) => void;
}

export const SingleShoeSvg: React.FC<SingleShoeSvgProps> = ({
  side,
  size,
  colorHex,
  width,
  height,
  occupiedHoleIds = new Set(),
  activeSnapHoleId = null,
  onHoleClick,
}) => {
  const isLeft = side === 'left';
  const palette = useMemo(() => computeShoePalette(colorHex), [colorHex]);
  const sizeHoles = SHOE_HOLES_BY_SIZE[size] ?? SHOE_HOLES_BY_SIZE.adult;
  const prefix = isLeft ? 'HL' : 'HR';

  return (
    <svg
      viewBox={`0 0 ${SHOE_VIEWBOX.width} ${SHOE_VIEWBOX.height}`}
      preserveAspectRatio="none"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'transparent',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 14px 18px rgba(0, 0, 0, 0.48))',
      }}
      className="transition-all duration-300 overflow-visible block"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ShoeSvgDefs side={side} palette={palette} />

      {/* Shoe Geometry Group (Right shoe is the Left shoe mirrored horizontally) */}
      <g
        className="pointer-events-auto"
        transform={
          isLeft ? undefined : `translate(${SHOE_VIEWBOX.width}, 0) scale(-1, 1)`
        }
      >
        {/* Structural Silhouette & Seam Grooves */}
        <path
          d={CLOG_REGIONS.bodySilhouette}
          fill={palette.seamColor}
        />

        {/* Molded Croslite Foam Interior Regions Strictly Clipped to Body Silhouette */}
        <g clipPath={`url(#shoe-clip-${side})`} filter={`url(#foam-grain-${side})`}>
          {/* 1. Unified Domed Upper Vamp (Spans seamlessly to the outer edge) */}
          <path
            d={CLOG_REGIONS.mainVamp}
            fill={`url(#vamp-grad-${side})`}
          />
          <path
            d={CLOG_REGIONS.mainVamp}
            fill={`url(#vamp-sheen-${side})`}
          />

          {/* 2. Recessed Concave Footbed */}
          <path
            d={CLOG_REGIONS.footbed}
            fill={`url(#footbed-grad-${side})`}
          />
          <path
            d={CLOG_REGIONS.footbed}
            fill="none"
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth="3.5"
          />

          {/* 3. 3D Embossed Footbed Circulation Nubs (Highlight + Shadow) */}
          <path
            d={FOOTBED_NUBS_PATH}
            fill={palette.nubHighlight}
            opacity={0.45}
            transform="translate(-0.5, -0.6)"
          />
          <path
            d={FOOTBED_NUBS_PATH}
            fill={palette.nubShadow}
            opacity={0.82}
          />

          {/* 4. Seamless 360-Degree Raised Tubular Collar Cuff */}
          <path
            d={CLOG_REGIONS.collarRim}
            fill={`url(#collar-grad-${side})`}
            fillRule="evenodd"
          />

          {/* 5. Upright Backstrap & Authentic Side Pivot Rivets */}
          <path
            d={CLOG_REGIONS.strapOutline}
            fill={palette.seamColor}
          />
          <path
            d={CLOG_REGIONS.strapBody}
            fill={`url(#strap-grad-${side})`}
          />
          <path
            d={CLOG_REGIONS.strapRivets}
            fill="#111318"
          />
        </g>
      </g>

      {/* 13 Authentic Vent Hole Sockets (Mirrored automatically for Right Shoe) */}
      <g data-shoe-interactive="true" className="pointer-events-auto">
        {sizeHoles.map((h) => {
          const id = `${prefix}-${String(h.index).padStart(2, '0')}` as HoleId;
          const x = isLeft ? h.x : Number((SHOE_VIEWBOX.width - h.x).toFixed(1));
          const holeObj: VentHole = {
            id,
            side,
            index: h.index,
            normalizedX: Number((x / SHOE_VIEWBOX.width).toFixed(3)),
            normalizedY: Number((h.y / SHOE_VIEWBOX.height).toFixed(3)),
          };
          return (
            <VentHoleSocket
              key={id}
              hole={holeObj}
              position={{ x, y: h.y }}
              radius={h.r}
              wallColor={palette.seamColor}
              highlightColor={palette.highlightBright}
              isOccupied={occupiedHoleIds.has(id)}
              isSnapTarget={activeSnapHoleId === id}
              onSelect={onHoleClick}
            />
          );
        })}
      </g>
    </svg>
  );
};
