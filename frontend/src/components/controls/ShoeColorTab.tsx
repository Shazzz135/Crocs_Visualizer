import React from 'react';
import type { CrocColor, CrocSize } from '@crocs/shared';
import { DEFAULT_CROC_COLORS } from '@crocs/shared';
import { SizeSelector } from './SizeSelector.js';
import { ColorPalette } from './ColorPalette.js';

interface ShoeColorTabProps {
  size: CrocSize;
  color: CrocColor;
  onSelectSize: (size: CrocSize) => void;
  onSelectColor: (color: CrocColor) => void;
  onNavigateToCharms?: () => void;
}

export const ShoeColorTab: React.FC<ShoeColorTabProps> = ({
  size,
  color,
  onSelectSize,
  onSelectColor,
  onNavigateToCharms,
}) => {
  return (
    <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-emerald-900 scrollbar-track-transparent">
      {/* Size Bracket Selector */}
      <div className="flex flex-col gap-1.5">
        <SizeSelector selectedSize={size} onSelectSize={onSelectSize} />
      </div>

      {/* 22 Official Croc Colorways */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Croc Colorway ({DEFAULT_CROC_COLORS.length})
          </label>
          <span className="text-xs font-semibold text-emerald-200 bg-[#02130e] px-2 py-0.5 rounded border border-emerald-800/80">
            {color.name}
          </span>
        </div>
        <ColorPalette selectedColorId={color.id} onSelectColor={onSelectColor} />
      </div>

      {/* Action button to jump to Charms */}
      {onNavigateToCharms && (
        <div className="pt-2 mt-auto">
          <button
            type="button"
            onClick={onNavigateToCharms}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
          >
            <span>Next: Browse &amp; Add Jibbitz™ Charms</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
