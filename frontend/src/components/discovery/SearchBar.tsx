import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isSemanticActive?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  isSemanticActive = false,
}) => {
  const handleBlur = () => {
    // Reset any vertical or horizontal viewport offset caused by mobile keyboard
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative flex-1 min-w-0 flex items-center">
      <div className="absolute left-2.5 text-emerald-500 pointer-events-none flex items-center">
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
        onBlur={handleBlur}
        placeholder="Semantic search charms..."
        aria-label="Search Jibbitz charms by keyword or semantic concept"
        className="w-full h-9 pl-8 pr-7 text-base md:text-xs bg-[#02130e]/95 border border-emerald-900/80 rounded-lg text-emerald-50 placeholder-emerald-600 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all shadow-inner"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 p-1 text-emerald-500 hover:text-emerald-200 rounded-md transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {isSemanticActive && !value && (
        <span className="absolute right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};
