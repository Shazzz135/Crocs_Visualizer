import React, { useEffect, useState, useMemo } from 'react';
import type { JibbitzCategory, JibbitzItem } from '@crocs/shared';
import { searchJibbitz, type ScoredJibbitzItem } from '@crocs/shared';
import { SearchBar } from './SearchBar.js';
import { CategoryFilterBar } from './CategoryFilterBar.js';
import { CharmGrid } from './CharmGrid.js';
import { CharmDetailCard } from './CharmDetailCard.js';

interface CatalogResponse {
  version: string;
  totalCount: number;
  categories: JibbitzCategory[];
  items: JibbitzItem[];
}

interface JibbitzDiscoveryDrawerProps {
  onSelectCharm?: (charm: JibbitzItem) => void;
  selectedCharmId?: string;
}

export const JibbitzDiscoveryDrawer: React.FC<JibbitzDiscoveryDrawerProps> = ({
  onSelectCharm,
  selectedCharmId,
}) => {
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCharm, setActiveCharm] = useState<JibbitzItem | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch('/catalog/jibbitz.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CatalogResponse | null) => {
        if (data?.items) {
          setCatalog(data);
        }
      })
      .catch((err) => console.error('[JibbitzDrawer] Fetch error:', err));
  }, []);

  // Compute item counts per category for the filter pills
  const categoryCounts = useMemo(() => {
    if (!catalog?.items) return {};
    const counts: Record<string, number> = { all: catalog.items.length };
    for (const item of catalog.items) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [catalog]);

  // Instant semantic hybrid search
  const displayedItems = useMemo(() => {
    if (!catalog?.items) return [];
    return searchJibbitz(catalog.items, searchQuery, {
      category: selectedCategory as JibbitzCategory | 'all',
    });
  }, [catalog, searchQuery, selectedCategory]);

  const handleSelectCharm = (charm: JibbitzItem) => {
    setActiveCharm(charm);
    onSelectCharm?.(charm);
  };

  if (!catalog) {
    return (
      <div className="flex items-center justify-center p-6 text-xs text-slate-500 animate-pulse">
        Loading Jibbitz charms catalog...
      </div>
    );
  }

  const selectedScore =
    activeCharm && 'score' in (activeCharm as ScoredJibbitzItem)
      ? (activeCharm as ScoredJibbitzItem).score
      : undefined;

  const drawerContent = (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>Jibbitz™ Charms</span>
            <span className="text-[11px] font-normal text-slate-400">
              ({catalog.totalCount})
            </span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Natural-language semantic vector search
          </p>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close discovery sheet"
          className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Semantic Search Input */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        resultCount={displayedItems.length}
        totalCount={catalog.totalCount}
        isSemanticActive={searchQuery.trim().length > 0}
      />

      {/* Category Pills */}
      <CategoryFilterBar
        categories={catalog.categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* Detail Card if a charm is selected */}
      {activeCharm && (
        <CharmDetailCard
          charm={activeCharm}
          similarityScore={selectedScore}
          onClose={() => setActiveCharm(null)}
        />
      )}

      {/* Charms Grid */}
      <CharmGrid
        key={`${searchQuery}-${selectedCategory}`}
        items={displayedItems}
        selectedCharmId={activeCharm?.id ?? selectedCharmId}
        onSelectCharm={handleSelectCharm}
      />
    </div>
  );

  return (
    <>
      {/* Desktop View: Fixed Side Panel Integration (>= 768px / md:) */}
      <section
        aria-label="Jibbitz discovery catalog"
        className="hidden md:flex flex-col flex-1 min-h-0 border-t border-slate-800/80 pt-4"
      >
        {drawerContent}
      </section>

      {/* Mobile View: Collapsible Bottom Sheet (< 768px / md:hidden) */}
      <div className="md:hidden">
        {/* Mobile Peek Bar Button (fixed at bottom when collapsed) */}
        {!isMobileOpen && (
          <div className="fixed inset-x-0 bottom-0 z-30 p-2 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md shadow-2xl">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl border border-slate-700/80 transition-all shadow-lg active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span className="text-xs font-semibold">Browse Jibbitz™ Charms</span>
                <span className="text-[10px] text-slate-400">({catalog.totalCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-sky-400 text-xs font-medium">
                <span>Open Drawer</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* Mobile Backdrop Overlay */}
        {isMobileOpen && (
          <div
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
          />
        )}

        {/* Mobile Slide-Up Bottom Sheet Drawer */}
        <section
          aria-label="Mobile Jibbitz discovery drawer"
          className={`fixed inset-x-0 bottom-0 z-50 bg-slate-900 border-t border-slate-700/80 rounded-t-2xl shadow-2xl p-4 flex flex-col transition-transform duration-300 ease-out max-h-[85vh] h-[80vh] ${
            isMobileOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Mobile Drag Handle */}
          <div
            onClick={() => setIsMobileOpen(false)}
            className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-3 cursor-pointer hover:bg-slate-500 transition-colors shrink-0"
            title="Tap or drag down to close"
          />
          {drawerContent}
        </section>
      </div>
    </>
  );
};
