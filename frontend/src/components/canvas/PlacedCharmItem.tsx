import React from 'react';
import type { PlacedJibbitz, Point2D } from '@crocs/shared';
import { RotationDial } from './RotationDial.js';

interface PlacedCharmItemProps {
  placement: PlacedJibbitz;
  position: Point2D;
  isSelected: boolean;
  onClick: (instanceId: string) => void;
  onRotate: (instanceId: string, deg: number) => void;
}

export const PlacedCharmItem: React.FC<PlacedCharmItemProps> = ({
  placement,
  position,
  isSelected,
  onClick,
  onRotate,
}) => {
  const charm = placement.charm;
  const imageUrl = charm?.imageUrl ?? `/catalog/images/${placement.jibbitId}.png`;
  const sizePx = 36;
  const halfSize = sizePx / 2;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(placement.instanceId);
  };

  return (
    <g
      className="pointer-events-auto select-none"
      transform={`translate(${position.x}, ${position.y})`}
    >
      {/* Placed Charm Image Group (with Rotation applied) */}
      <g
        transform={`rotate(${placement.rotationDeg})`}
        onClick={handleClick}
        className="cursor-pointer transition-transform duration-75 active:scale-95 group"
      >
        {/* Invisible comfortable touch target */}
        <circle r={halfSize + 4} fill="transparent" />

        {/* Charm Transparent PNG image */}
        <image
          href={imageUrl}
          x={-halfSize}
          y={-halfSize}
          width={sizePx}
          height={sizePx}
          preserveAspectRatio="xMidYMid meet"
          style={{
            filter: isSelected
              ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.8)) drop-shadow(0 8px 12px rgba(0, 0, 0, 0.6))'
              : 'drop-shadow(0 6px 8px rgba(0, 0, 0, 0.5))',
          }}
          className="transition-all duration-150 group-hover:scale-105"
        />
      </g>

      {/* Rotation Dial Halo (shown when charm is selected) */}
      {isSelected && (
        <RotationDial
          center={{ x: 0, y: 0 }}
          rotationDeg={placement.rotationDeg}
          radius={halfSize + 6}
          onRotate={(deg) => onRotate(placement.instanceId, deg)}
        />
      )}
    </g>
  );
};
