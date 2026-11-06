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

  // Instant semantic hybrid search across all charms
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

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full w-full gap-3">
      {/* Search Bar with AI Semantic Indicator */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        resultCount={displayedItems.length}
        totalCount={catalog.totalCount}
        isSemanticActive={searchQuery.trim().length > 0}
      />

      {/* Category Pills with Instant Filtering */}
      <CategoryFilterBar
        categories={catalog.categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* Selected Charm Detail Card */}
      {activeCharm && (
        <CharmDetailCard
          charm={activeCharm}
          similarityScore={selectedScore}
          onClose={() => setActiveCharm(null)}
        />
      )}

      {/* Charms Grid with All Charms Always Loaded */}
      <CharmGrid
        key={`${searchQuery}-${selectedCategory}`}
        items={displayedItems}
        selectedCharmId={activeCharm?.id ?? selectedCharmId}
        onSelectCharm={handleSelectCharm}
      />
    </div>
  );
};
