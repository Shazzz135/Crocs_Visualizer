import React from 'react';
import type { JibbitzCategory } from '@crocs/shared';
import { CATEGORY_LABELS } from '@crocs/shared';

interface CategoryFilterBarProps {
  categories: JibbitzCategory[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts?: Record<string, number>;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) => {
  const allCategories = ['all', ...categories];

  return (
    <div
      role="tablist"
      aria-label="Filter Jibbitz by category"
      className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent shrink-0"
    >
      {allCategories.map((cat) => {
        const isSelected = selectedCategory === cat;
        const label = CATEGORY_LABELS[cat] ?? cat;
        const count = categoryCounts[cat];

        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isSelected}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`px-2.5 py-1 text-xs rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              isSelected
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25 ring-1 ring-sky-400'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800/80'
            }`}
          >
            <span>{label}</span>
            {count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-sky-600/70 text-white'
                    : 'bg-slate-800 text-slate-400'
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
