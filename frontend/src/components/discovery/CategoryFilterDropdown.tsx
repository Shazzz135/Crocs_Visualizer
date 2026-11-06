import React, { useState, useRef, useEffect } from 'react';
import type { JibbitzCategory } from '@crocs/shared';
import { CATEGORY_LABELS } from '@crocs/shared';

interface CategoryFilterDropdownProps {
  categories: JibbitzCategory[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  categoryCounts?: Record<string, number>;
}

export const CategoryFilterDropdown: React.FC<CategoryFilterDropdownProps> = ({
  categories,
  selectedCategories,
  onToggleCategory,
  categoryCounts = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isAllActive =
    selectedCategories.length === 0 || selectedCategories.includes('all');

  const buttonLabel = isAllActive
    ? `All (${categoryCounts.all ?? 0})`
    : selectedCategories.length === 1
    ? (CATEGORY_LABELS[selectedCategories[0]] ?? selectedCategories[0])
    : `${selectedCategories.length} Categories`;

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Filter by category"
        className={`h-9 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
          !isAllActive
            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/25 ring-1 ring-emerald-400'
            : 'bg-[#02130e]/95 border-emerald-900/80 text-emerald-300 hover:text-white hover:border-emerald-700'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="truncate max-w-[120px]">{buttonLabel}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1.5 w-56 bg-[#06241a] border border-emerald-700/80 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-md flex flex-col gap-1 text-xs"
        >
          {/* Option: All */}
          <button
            type="button"
            role="option"
            aria-selected={isAllActive}
            onClick={() => {
              onToggleCategory('all');
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
              isAllActive
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-emerald-300 hover:bg-emerald-900/60 hover:text-white'
            }`}
          >
            <span>All Categories</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isAllActive ? 'bg-emerald-600/40 text-slate-950 font-bold' : 'bg-emerald-950 text-emerald-400'
              }`}
            >
              {categoryCounts.all ?? 0}
            </span>
          </button>

          <div className="h-px bg-emerald-900/80 my-0.5" />

          {/* Individual Categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat);
            const label = CATEGORY_LABELS[cat] ?? cat;
            const count = categoryCounts[cat];

            return (
              <button
                key={cat}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => onToggleCategory(cat)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/25 border border-emerald-400/50 text-emerald-100 font-semibold'
                    : 'text-emerald-300 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-emerald-800 bg-[#02130e]'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span>{label}</span>
                </div>
                {count !== undefined && (
                  <span className="text-[10px] text-emerald-400/80 font-mono">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
