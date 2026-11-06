import type { CrocSize, HoleId, PlacedJibbitz, VentHole } from '@crocs/shared';
import { useMemo, forwardRef } from 'react';
import { FOOTBED_NUBS_PATH } from './crocsNubsData.js';
import { CLOG_REGIONS, SHOE_VIEWBOX } from './crocsSvgData.js';
import { computeShoePalette } from './shoeColorUtils.js';
import { SHOE_HOLES_BY_SIZE } from './shoeHoleConfig.js';
import { ShoeSvgDefs } from './ShoeSvgDefs.js';
import { VentHoleSocket } from './VentHoleSocket.js';
import { PlacedCharmItem } from './PlacedCharmItem.js';

interface SingleShoeSvgProps {
  side: 'left' | 'right';
  size: CrocSize;
  colorHex: string;
  width: number;
  height: number;
  placements?: PlacedJibbitz[];
  occupiedHoleIds?: Set<string>;
  activeSnapHoleId?: string | null;
  selectedPlacementId?: string | null;
  onHoleClick?: (hole: VentHole) => void;
  onCharmClick?: (instanceId: string) => void;
  onRotateCharm?: (instanceId: string, deg: number) => void;
}

export const SingleShoeSvg = forwardRef<SVGSVGElement, SingleShoeSvgProps>(
  (
    {
      side,
      size,
      colorHex,
      width,
      height,
      placements = [],
      occupiedHoleIds = new Set(),
      activeSnapHoleId = null,
      selectedPlacementId = null,
      onHoleClick,
      onCharmClick,
      onRotateCharm,
    },
    ref
  ) => {
    const isLeft = side === 'left';
    const palette = useMemo(() => computeShoePalette(colorHex), [colorHex]);
    const sizeHoles = SHOE_HOLES_BY_SIZE[size] ?? SHOE_HOLES_BY_SIZE.adult;
    const prefix = isLeft ? 'HL' : 'HR';

    // Counter-scale so charms and holes maintain exact Adult visual size and 1:1 roundness
    const scaleCorrection = useMemo(
      () => ({
        sx: 210 / width,
        sy: 472 / height,
      }),
      [width, height]
    );

    const placementsByHole = useMemo(() => {
      const map = new Map<string, PlacedJibbitz>();
      for (const p of placements) {
        map.set(p.holeId, p);
      }
      return map;
    }, [placements]);

    return (
      <svg
        ref={ref}
        data-shoe-side={side}
        data-testid={`${side}-shoe-svg`}
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

        {/* Shoe Geometry Group (Height compresses for smaller sizes) */}
        <g
          className="pointer-events-auto"
          transform={
            isLeft ? undefined : `translate(${SHOE_VIEWBOX.width}, 0) scale(-1, 1)`
          }
        >
          <path d={CLOG_REGIONS.bodySilhouette} fill={palette.seamColor} />

          <g clipPath={`url(#shoe-clip-${side})`} filter={`url(#foam-grain-${side})`}>
            <path d={CLOG_REGIONS.mainVamp} fill={`url(#vamp-grad-${side})`} />
            <path d={CLOG_REGIONS.mainVamp} fill={`url(#vamp-sheen-${side})`} />
            <path d={CLOG_REGIONS.footbed} fill={`url(#footbed-grad-${side})`} />
            <path d={CLOG_REGIONS.footbed} fill="none" stroke="rgba(0, 0, 0, 0.25)" strokeWidth="3.5" />
            <path d={FOOTBED_NUBS_PATH} fill={palette.nubHighlight} opacity={0.45} transform="translate(-0.5, -0.6)" />
            <path d={FOOTBED_NUBS_PATH} fill={palette.nubShadow} opacity={0.82} />
            <path d={CLOG_REGIONS.collarRim} fill={`url(#collar-grad-${side})`} fillRule="evenodd" />
            <path d={CLOG_REGIONS.strapOutline} fill={palette.seamColor} />
            <path d={CLOG_REGIONS.strapBody} fill={`url(#strap-grad-${side})`} />
            <path d={CLOG_REGIONS.strapRivets} fill="#111318" />
          </g>
        </g>

        {/* 13 Vent Hole Sockets per shoe */}
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
            const placement = placementsByHole.get(id);

            return (
              <g key={id}>
                <VentHoleSocket
                  hole={holeObj}
                  position={{ x, y: h.y }}
                  radius={h.r}
                  wallColor={palette.seamColor}
                  highlightColor={palette.highlightBright}
                  scaleCorrection={scaleCorrection}
                  isOccupied={occupiedHoleIds.has(id)}
                  isSnapTarget={activeSnapHoleId === id}
                  onSelect={onHoleClick}
                />

                {/* Placed Charm on this Hole Socket */}
                {placement && (
                  <PlacedCharmItem
                    placement={placement}
                    position={{ x, y: h.y }}
                    scaleCorrection={scaleCorrection}
                    isSelected={selectedPlacementId === placement.instanceId}
                    onClick={(instId) => onCharmClick?.(instId)}
                    onRotate={(instId, deg) => onRotateCharm?.(instId, deg)}
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
    );
  }
);

SingleShoeSvg.displayName = 'SingleShoeSvg';
