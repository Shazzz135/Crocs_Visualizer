import React from 'react';
import type { CrocSize } from '@crocs/shared';

interface CustomizerHeaderProps {
  size: CrocSize;
  onReset: () => void;
  onExportPng: () => void;
  isExporting?: boolean;
}

export const CustomizerHeader: React.FC<CustomizerHeaderProps> = ({
  size,
  onReset,
  onExportPng,
  isExporting = false,
}) => {
  return (
    <header className="flex items-center justify-between pb-1.5 border-b border-emerald-900/60 shrink-0">
      <div>
        <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
          CROCS CUSTOMIZER
        </h1>
        <p className="text-[11px] text-emerald-400/80">
          Design your pair with authentic Jibbitz
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          data-testid="size-badge"
          className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded-full"
        >
          {size}
        </span>

        {/* Export PNG Snapshot Button */}
        <button
          type="button"
          onClick={onExportPng}
          disabled={isExporting}
          data-testid="export-png-btn"
          title="Export high-resolution PNG snapshot with disclaimers"
          className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 hover:text-white bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-600/60 rounded-full transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
        >
          {isExporting ? (
            <svg className="w-3 h-3 animate-spin text-emerald-300" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          )}
          <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        </button>

        {/* Quick Reset Canvas & Placements Button */}
        <button
          type="button"
          onClick={onReset}
          data-testid="reset-customizer-btn"
          title="Quick Reset: Clear placed charms and reset canvas"
          className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 hover:text-white bg-emerald-950 hover:bg-red-950/80 border border-emerald-700/60 hover:border-red-500/60 rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
};
