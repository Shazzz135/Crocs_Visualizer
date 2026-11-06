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
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60 my-auto">
        <svg
          className="w-8 h-8 mb-2 text-slate-600"
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
        <p className="text-xs font-semibold text-slate-400">
          No matching Jibbitz found
        </p>
        <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
          Try searching for &ldquo;cute puppy&rdquo;, &ldquo;gold alphabet&rdquo;, or &ldquo;retro music&rdquo;.
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
        className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-2 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent flex-1 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
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
              className={`group relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all aspect-square focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                isSelected
                  ? 'border-sky-400 bg-sky-950/50 shadow-md shadow-sky-500/20 ring-1 ring-sky-400'
                  : 'border-slate-800/90 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900/90'
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
              <span className="text-[10px] text-slate-400 group-hover:text-slate-200 truncate w-full text-center mt-1 transition-colors">
                {item.name}
              </span>

              {/* Semantic match dot badge if scored */}
              {score !== undefined && score > 0.8 && (
                <span
                  title="High Semantic Match"
                  className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
