import React from 'react';
import type { DrawerPosition } from '../../hooks/useMobileDrawerDrag.js';

interface MobileDrawerHandleProps {
  drawerPos: DrawerPosition;
  isDragging: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onToggle: () => void;
}

export const MobileDrawerHandle: React.FC<MobileDrawerHandleProps> = ({
  drawerPos,
  isDragging,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onToggle,
}) => {
  return (
    <div
      data-testid="mobile-drawer-handle"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={onToggle}
      className="md:hidden flex flex-col items-center justify-center py-1 cursor-grab active:cursor-grabbing select-none shrink-0"
    >
      <div
        className={`w-12 h-1.5 rounded-full transition-colors ${
          isDragging ? 'bg-emerald-400' : 'bg-emerald-700/80'
        }`}
      />
      <span className="text-[10px] text-emerald-400/80 font-medium mt-0.5">
        {drawerPos === 'collapsed'
          ? 'Drag up for charms'
          : drawerPos === 'expanded'
          ? 'Drag down for shoe preview'
          : 'Drag up or down'}
      </span>
    </div>
  );
};
