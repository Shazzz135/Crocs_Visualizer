import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  totalCount?: number;
  isSemanticActive?: boolean;
}

const SUGGESTIONS = [
  'cute puppy',
  'retro music',
  'gold alphabet',
  'sweet dessert',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  resultCount,
  totalCount,
  isSemanticActive = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Search Input Container */}
      <div className="relative flex items-center w-full">
        <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
          <svg
            className="w-4 h-4"
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
          placeholder="Semantic search (e.g. cute puppy, retro music)..."
          aria-label="Search Jibbitz charms by keyword or semantic concept"
          className="w-full pl-9 pr-8 py-2 text-xs bg-slate-950/90 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-inner"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="absolute right-2.5 p-1 text-slate-400 hover:text-white rounded-md transition-colors"
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

      {/* Status Bar & Semantic Indicator */}
      <div className="flex items-center justify-between text-[11px] px-0.5">
        <div className="flex items-center gap-1.5 text-slate-400">
          {resultCount !== undefined && totalCount !== undefined && (
            <span>
              Showing <strong className="text-slate-200">{resultCount}</strong> of {totalCount}
            </span>
          )}
        </div>

        {isSemanticActive && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            AI Vector Search
          </span>
        )}
      </div>

      {/* Suggested Search Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0 font-medium">
          Try:
        </span>
        {SUGGESTIONS.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onChange(term)}
            className={`text-[11px] px-2 py-0.5 rounded-md border transition-all shrink-0 ${
              value.toLowerCase() === term.toLowerCase()
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-medium'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};
