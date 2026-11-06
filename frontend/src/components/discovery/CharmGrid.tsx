import React from 'react';
import type { JibbitzItem } from '@crocs/shared';
import type { ScoredJibbitzItem } from '@crocs/shared';

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
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-emerald-400/80 bg-[#02130e]/90 rounded-xl border border-emerald-900/80 my-auto">
        <svg
          className="w-8 h-8 mb-2 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-xs font-semibold text-emerald-200">
          No matching Jibbitz found
        </p>
        <p className="text-[11px] text-emerald-400/70 mt-1 max-w-xs">
          Try a different keyword or toggle more category filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 min-h-0 flex-1">
      {/* Scrollable Grid with All Charms Always Loaded */}
      <div
        tabIndex={0}
        aria-label="Jibbitz charms catalog grid"
        className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-2 overflow-y-auto p-2 bg-[#02130e]/90 rounded-xl border border-emerald-900/80 scrollbar-thin scrollbar-thumb-emerald-800 scrollbar-track-transparent flex-1 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
      >
        {items.map((item) => {
          const isSelected = selectedCharmId === item.id;
          const score =
            'score' in item ? (item as ScoredJibbitzItem).score : undefined;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCharm(item)}
              title={`${item.name} (${item.category})`}
              className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all aspect-square focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer ${
                isSelected
                  ? 'border-emerald-400 bg-emerald-950/90 shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400'
                  : 'border-emerald-950/80 hover:border-emerald-700/70 bg-[#06241a]/70 hover:bg-[#0a3a2b]'
              }`}
            >
              {/* Scaled thumbnail with transparent crisp display */}
              <div className="w-10 h-10 flex items-center justify-center relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain drop-shadow transition-transform duration-150 group-hover:scale-110"
                />
              </div>

              {/* Title label */}
              <span className="text-[10px] text-emerald-300/80 group-hover:text-emerald-100 truncate w-full text-center mt-1 transition-colors">
                {item.name}
              </span>

              {/* Semantic match dot badge if scored */}
              {score !== undefined && score > 0.8 && (
                <span
                  title="Semantic Match"
                  className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-950"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
