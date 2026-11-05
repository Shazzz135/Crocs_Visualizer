import React from 'react';

export const InStoreBanner: React.FC = () => {
  return (
    <aside
      aria-label="Retail and trademark disclaimers"
      className="w-full bg-slate-900/95 border-b border-slate-800 px-4 py-2 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 z-20 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2">
        <span className="bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded text-[10px] border border-amber-500/30">
          Beta Testing
        </span>
        <span>
          Independent visualizer. Not affiliated with Crocs, Inc. Colors & Jibbitz do not guarantee in-store availability.
        </span>
      </div>

      <nav aria-label="Legal documents" className="flex items-center gap-3 text-slate-400">
        <a
          href="/docs/legal/DISCLAIMERS.md"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-200 underline underline-offset-2"
        >
          Disclaimers
        </a>
        <span>•</span>
        <a
          href="/docs/legal/PRIVACY.md"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-200 underline underline-offset-2"
        >
          Zero-PII Privacy
        </a>
      </nav>
    </aside>
  );
};
