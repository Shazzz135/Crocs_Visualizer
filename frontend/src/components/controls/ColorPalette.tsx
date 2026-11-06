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
      <div className="grid grid-cols-7 sm:grid-cols-8 gap-2 p-1.5 bg-slate-950/60 rounded-xl border border-slate-800">
        {DEFAULT_CROC_COLORS.map((color) => {
          const isSelected = selectedColorId === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelectColor(color)}
              title={`${color.name} (${color.hex})`}
              className={`w-8 h-8 rounded-full border-2 transition-transform duration-150 hover:scale-110 focus:outline-none cursor-pointer mx-auto ${
                isSelected
                  ? 'border-emerald-400 ring-2 ring-emerald-400/60 scale-110 shadow-lg shadow-emerald-500/25'
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
