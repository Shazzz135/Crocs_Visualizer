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
    <div className="flex flex-col gap-5 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
      {/* Active Selection Hero Banner */}
      <div className="flex items-center gap-3.5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl shadow-inner">
        <div
          className="w-12 h-12 rounded-xl border-2 border-white/20 shadow-md shrink-0 transition-all duration-300 flex items-center justify-center font-bold text-xs"
          style={{ backgroundColor: color.hex }}
        >
          <span
            className="px-1 py-0.5 rounded text-[10px] font-bold drop-shadow"
            style={{
              color: color.hex === '#FFFFFF' || color.hex === '#F9F5EA' || color.hex === '#FFF0B8' ? '#0f172a' : '#ffffff',
            }}
          >
            {size.toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-sky-400">
            Active Croc Colorway
          </span>
          <h3 className="text-sm font-bold text-white truncate">{color.name}</h3>
          <p className="text-[11px] text-slate-400 font-mono">{color.hex.toUpperCase()}</p>
        </div>
      </div>

      {/* Size Bracket Selector */}
      <div className="flex flex-col gap-2">
        <SizeSelector selectedSize={size} onSelectSize={onSelectSize} />
      </div>

      {/* 22 Official Croc Colorways */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Official Colorway Swatches ({DEFAULT_CROC_COLORS.length})
          </label>
        </div>
        <ColorPalette selectedColorId={color.id} onSelectColor={onSelectColor} />
      </div>

      {/* Call-to-action button to jump to Charms */}
      {onNavigateToCharms && (
        <div className="pt-2 mt-auto">
          <button
            type="button"
            onClick={onNavigateToCharms}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold text-xs transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>Next: Browse & Add Jibbitz™ Charms</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
