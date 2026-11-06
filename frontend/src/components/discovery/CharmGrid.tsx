import React, { useRef } from 'react';
import type { JibbitzItem } from '@crocs/shared';
import type { ScoredJibbitzItem } from '@crocs/shared';
import { useCharmDrag } from '../../context/useCharmDrag.js';

interface CharmGridProps {
  items: (JibbitzItem | ScoredJibbitzItem)[];
  selectedCharmId?: string;
  onSelectCharm: (charm: JibbitzItem) => void;
}

export const CharmGrid: React.FC<CharmGridProps> = ({
  items,
  selectedCharmId,
  onSelectCharm,
}) => {
  const { startDrag } = useCharmDrag();
  const pointerStartRef = useRef<{ x: number; y: number; item: JibbitzItem; moved: boolean } | null>(null);

  const handlePointerDown = (item: JibbitzItem, e: React.PointerEvent) => {
    // Only respond to main button
    if (e.button !== 0) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY, item, moved: false };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      if (!pointerStartRef.current) return;
      const dx = moveEvt.clientX - pointerStartRef.current.x;
      const dy = moveEvt.clientY - pointerStartRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 5 && !pointerStartRef.current.moved) {
        pointerStartRef.current.moved = true;
        startDrag(item, { x: moveEvt.clientX, y: moveEvt.clientY });
        cleanup();
      }
    };

    const handlePointerUp = () => {
      if (pointerStartRef.current && !pointerStartRef.current.moved) {
        onSelectCharm(item);
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

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-emerald-400/80 bg-[#02130e]/90 rounded-xl border border-emerald-900/80 my-auto">
        <p className="text-xs font-semibold text-emerald-200">No matching Jibbitz found</p>
        <p className="text-[11px] text-emerald-400/70 mt-1 max-w-xs">
          Try a different keyword or toggle more category filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full">
      <div
        tabIndex={0}
        aria-label="Jibbitz charms catalog grid"
        style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-2 overflow-y-auto overscroll-contain touch-pan-y p-2 bg-[#02130e]/90 rounded-xl border border-emerald-900/80 scrollbar-thin scrollbar-thumb-emerald-800 scrollbar-track-transparent flex-1 min-h-0 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
      >
        {items.map((item) => {
          const isSelected = selectedCharmId === item.id;
          const score = 'score' in item ? (item as ScoredJibbitzItem).score : undefined;

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onPointerDown={(e) => handlePointerDown(item, e)}
              title={`${item.name} (${item.category}) - Drag onto shoe or click to place`}
              className={`group relative flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl border transition-all aspect-square focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-grab active:cursor-grabbing select-none ${
                isSelected
                  ? 'border-emerald-400 bg-emerald-950/90 shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400'
                  : 'border-emerald-950/80 hover:border-emerald-700/70 bg-[#06241a]/70 hover:bg-[#0a3a2b]'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center relative pointer-events-none">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  draggable={false}
                  className="max-w-full max-h-full object-contain drop-shadow transition-transform duration-150 group-hover:scale-110 pointer-events-none"
                />
              </div>

              <span className="text-[10px] text-emerald-300/80 group-hover:text-emerald-100 truncate w-full text-center mt-1 transition-colors pointer-events-none">
                {item.name}
              </span>

              {score !== undefined && score > 0.8 && (
                <span
                  title="Semantic Match"
                  className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-950 pointer-events-none"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
