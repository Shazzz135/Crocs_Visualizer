import { DEFAULT_CROC_COLORS, type CrocColor } from '@crocs/shared';
import React from 'react';

interface ColorPaletteProps {
  selectedColorId: string;
  onSelectColor: (color: CrocColor) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColorId,
  onSelectColor,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Colorway
        </label>
        <span className="text-xs text-slate-300 font-medium">
          {DEFAULT_CROC_COLORS.find((c) => c.id === selectedColorId)?.name || 'Custom'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5 items-center">
        {DEFAULT_CROC_COLORS.map((color) => {
          const isSelected = selectedColorId === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelectColor(color)}
              title={`${color.name} (${color.hex})`}
              className={`w-8 h-8 rounded-full border-2 transition-transform duration-150 hover:scale-110 focus:outline-none ${
                isSelected
                  ? 'border-sky-400 ring-2 ring-sky-400/50 scale-110 shadow-lg'
                  : 'border-slate-600/80 hover:border-slate-400'
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={`Select color ${color.name}`}
            />
          );
        })}
      </div>
    </div>
  );
};
