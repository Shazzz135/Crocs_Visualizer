import React from 'react';
import type { DrawerPosition } from '../../hooks/useMobileDrawerDrag.js';

interface MobileDrawerHandleProps {
  drawerPos: DrawerPosition;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  onClick: (e: React.MouseEvent) => void;
}

export const MobileDrawerHandle: React.FC<MobileDrawerHandleProps> = ({
  drawerPos,
  isDragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onClick,
}) => {
  return (
    <div
      data-testid="mobile-drawer-handle"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onClick}
      style={{ touchAction: 'none' }}
      className="md:hidden flex flex-col items-center justify-center py-2.5 -mt-1 cursor-grab active:cursor-grabbing select-none shrink-0"
    >
      <div
        className={`w-14 h-1.5 rounded-full transition-colors ${
          isDragging ? 'bg-emerald-400' : 'bg-emerald-700/80'
        }`}
      />
      <span className="text-[10px] text-emerald-400/80 font-medium mt-1">
        {drawerPos === 'collapsed'
          ? 'Drag up for charms'
          : drawerPos === 'expanded'
          ? 'Drag down for shoe preview'
          : 'Drag up or down'}
      </span>
    </div>
  );
};
