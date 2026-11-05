import type { CrocSize } from '@crocs/shared';
import React from 'react';

interface SizeSelectorProps {
  selectedSize: CrocSize;
  onSelectSize: (size: CrocSize) => void;
}

const SIZE_OPTIONS: Array<{ id: CrocSize; label: string; badge: string }> = [
  { id: 'infant', label: 'Infant / Toddler', badge: 'C1–C9' },
  { id: 'kids', label: 'Kids', badge: 'C10–J3' },
  { id: 'youth', label: 'Youth', badge: 'J4–J6' },
  { id: 'adult', label: 'Adult', badge: 'M4/W6+' },
];

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  selectedSize,
  onSelectSize,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Shoe Size & Proportion
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SIZE_OPTIONS.map((opt) => {
          const isSelected = selectedSize === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectSize(opt.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg border text-xs transition-all ${
                isSelected
                  ? 'bg-sky-500/15 border-sky-400 text-sky-200 font-semibold shadow-md shadow-sky-500/10'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-500'
              }`}
            >
              <span>{opt.label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{opt.badge}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
