import React from 'react';
import type { JibbitzItem } from '@crocs/shared';
import { CATEGORY_LABELS } from '@crocs/shared';

interface CharmDetailCardProps {
  charm: JibbitzItem;
  onClose: () => void;
}

export const CharmDetailCard: React.FC<CharmDetailCardProps> = ({
  charm,
  onClose,
}) => {
  const categoryLabel = CATEGORY_LABELS[charm.category] ?? charm.category;
  const priceFormatted = charm.price ? `$${charm.price.toFixed(2)}` : '$4.99';

  return (
    <div className="relative p-3 bg-slate-900/90 border border-emerald-500/30 rounded-xl shadow-lg backdrop-blur-md flex flex-col gap-2 transition-all shrink-0">
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Deselect charm"
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Main Charm Info */}
      <div className="flex items-start gap-3">
        {/* Scaled thumbnail with transparent crisp display */}
        <div className="w-12 h-12 rounded-lg bg-slate-950/80 border border-slate-800 p-1 flex items-center justify-center shrink-0 shadow-inner">
          <img
            src={charm.imageUrl}
            alt={charm.name}
            className="w-full h-full object-contain drop-shadow"
          />
        </div>

        <div className="flex-1 min-w-0 pr-5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              {categoryLabel}
            </span>
          </div>

          <h3 className="text-xs font-bold text-white truncate mt-1">
            {charm.name}
          </h3>

          <p className="text-[11px] text-slate-400 font-medium">
            {priceFormatted}
          </p>
        </div>
      </div>

      {/* Description */}
      {charm.description && (
        <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
          {charm.description}
        </p>
      )}

      {/* Dimensions & Tags */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
        <span>
          {charm.dimensions?.widthMm ?? 26} ×{' '}
          {charm.dimensions?.heightMm ?? 26} mm
        </span>
        {charm.tags && charm.tags.length > 0 && (
          <span className="truncate max-w-[140px] text-slate-400">
            {charm.tags.slice(0, 3).join(', ')}
          </span>
        )}
      </div>
    </div>
  );
};
