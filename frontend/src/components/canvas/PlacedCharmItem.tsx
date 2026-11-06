import React, { useRef } from 'react';
import type { PlacedJibbitz, Point2D } from '@crocs/shared';
import { RotationDial } from './RotationDial.js';
import { useCharmDrag } from '../../context/useCharmDrag.js';

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
  // Doubled from 36px to 72px to match true proportions shown in reference/charm_ref.jpg
  const sizePx = 72;
  const halfSize = sizePx / 2;

  const { dragState, startDrag } = useCharmDrag();
  const pointerStartRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  const isBeingDragged =
    dragState.isDragging && dragState.sourceInstanceId === placement.instanceId;

  const handlePointerDown = (e: React.PointerEvent) => {
    // Stop propagation so canvas zoom/pan doesn't move the screen when dragging charm
    e.stopPropagation();
    if (e.button !== 0) return;
    const target = e.target as Element | null;
    if (target?.closest('[data-rotation-knob="true"]')) return;

    pointerStartRef.current = { x: e.clientX, y: e.clientY, moved: false };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      if (!pointerStartRef.current) return;
      const dx = moveEvt.clientX - pointerStartRef.current.x;
      const dy = moveEvt.clientY - pointerStartRef.current.y;

      if (Math.hypot(dx, dy) > 5 && !pointerStartRef.current.moved) {
        pointerStartRef.current.moved = true;
        if (charm) {
          startDrag(
            charm,
            { x: moveEvt.clientX, y: moveEvt.clientY },
            placement.holeId,
            placement.instanceId
          );
        }
        cleanup();
      }
    };

    const handlePointerUp = () => {
      if (pointerStartRef.current && !pointerStartRef.current.moved) {
        onClick(placement.instanceId);
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      pointerStartRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  return (
    <g
      data-charm-item="true"
      className="pointer-events-auto select-none"
      transform={`translate(${position.x}, ${position.y})`}
      opacity={isBeingDragged ? 0.35 : 1}
    >
      {/* Placed Charm Image Group (with Rotation applied) */}
      <g
        transform={`rotate(${placement.rotationDeg})`}
        onPointerDown={handlePointerDown}
        className="cursor-grab active:cursor-grabbing transition-transform duration-75 active:scale-95 group"
      >
        {/* Invisible comfortable touch target */}
        <circle r={halfSize + 6} fill="transparent" />

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
              ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.9)) drop-shadow(0 8px 14px rgba(0, 0, 0, 0.6))'
              : 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.5))',
          }}
          className="transition-all duration-150 group-hover:scale-105 pointer-events-none"
        />
      </g>

      {/* Rotation Dial Halo (shown when charm is selected and not being dragged) */}
      {isSelected && !isBeingDragged && (
        <RotationDial
          center={{ x: 0, y: 0 }}
          rotationDeg={placement.rotationDeg}
          radius={halfSize + 8}
          onRotate={(deg) => onRotate(placement.instanceId, deg)}
        />
      )}
    </g>
  );
};
