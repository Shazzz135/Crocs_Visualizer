import React from 'react';
import type { JibbitzCategory } from '@crocs/shared';
import { CATEGORY_LABELS } from '@crocs/shared';

interface CategoryFilterBarProps {
  categories: JibbitzCategory[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  categoryCounts?: Record<string, number>;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  categories,
  selectedCategories,
  onToggleCategory,
  categoryCounts = {},
}) => {
  const allCategories = ['all', ...categories];
  const isAllActive =
    selectedCategories.length === 0 || selectedCategories.includes('all');

  return (
    <div
      role="group"
      aria-label="Filter Jibbitz charms by category set"
      className="flex flex-wrap gap-1.5 shrink-0"
    >
      {allCategories.map((cat) => {
        const isSelected = cat === 'all' ? isAllActive : selectedCategories.includes(cat);
        const label = CATEGORY_LABELS[cat] ?? cat;
        const count = categoryCounts[cat];

        return (
          <button
            key={cat}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggleCategory(cat)}
            className={`px-2.5 py-1 text-xs rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/30 ring-1 ring-emerald-400'
                : 'bg-[#02130e]/90 text-emerald-300/90 hover:text-white hover:bg-[#06241a] border border-emerald-900/80'
            }`}
          >
            <span>{label}</span>
            {count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isSelected
                    ? 'bg-emerald-600/40 text-slate-950'
                    : 'bg-emerald-950 text-emerald-400/90 border border-emerald-900/60'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
