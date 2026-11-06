import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  totalCount?: number;
  isSemanticActive?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  resultCount,
  totalCount,
  isSemanticActive = false,
}) => {
  return (
    <div className="flex flex-col gap-1.5 shrink-0">
      {/* Search Input Container */}
      <div className="relative flex items-center w-full">
        <div className="absolute left-3 text-emerald-500 pointer-events-none flex items-center">
          <svg
            className="w-4 h-4 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Semantic search charms (e.g. cute puppy, gold alphabet)..."
          aria-label="Search Jibbitz charms by keyword or semantic concept"
          className="w-full pl-9 pr-8 py-2 text-xs bg-[#02130e]/95 border border-emerald-900/80 rounded-lg text-emerald-50 placeholder-emerald-600 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all shadow-inner"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="absolute right-2.5 p-1 text-emerald-500 hover:text-emerald-200 rounded-md transition-colors cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Status Bar & Semantic AI Indicator */}
      <div className="flex items-center justify-between text-[11px] px-0.5">
        <div className="flex items-center gap-1.5 text-emerald-400/80 font-medium">
          {resultCount !== undefined && totalCount !== undefined && (
            <span>
              Showing <strong className="text-white font-bold">{resultCount}</strong> of {totalCount}
            </span>
          )}
        </div>

        {isSemanticActive && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-[10px] font-semibold tracking-wide shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Vector Search
          </span>
        )}
      </div>
    </div>
  );
};
