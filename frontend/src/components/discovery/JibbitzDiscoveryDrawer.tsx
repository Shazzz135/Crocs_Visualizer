import React, { useEffect, useState, useMemo } from 'react';
import type { JibbitzCategory, JibbitzItem } from '@crocs/shared';
import { searchJibbitz } from '@crocs/shared';
import { SearchBar } from './SearchBar.js';
import { CategoryFilterDropdown } from './CategoryFilterDropdown.js';
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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

  // Compute item counts per category
  const categoryCounts = useMemo(() => {
    if (!catalog?.items) return {};
    const counts: Record<string, number> = { all: catalog.items.length };
    for (const item of catalog.items) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [catalog]);

  // Multi-select toggle handler for dropdown
  const handleToggleCategory = (cat: string) => {
    if (cat === 'all') {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) => {
      const active = prev.includes(cat);
      if (active) {
        return prev.filter((c) => c !== cat);
      }
      return [...prev.filter((c) => c !== 'all'), cat];
    });
  };

  // Instant semantic hybrid search across multi-select categories
  const displayedItems = useMemo(() => {
    if (!catalog?.items) return [];
    return searchJibbitz(catalog.items, searchQuery, {
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    });
  }, [catalog, searchQuery, selectedCategories]);

  const handleSelectCharm = (charm: JibbitzItem) => {
    setActiveCharm(charm);
    onSelectCharm?.(charm);
  };

  if (!catalog) {
    return (
      <div className="flex items-center justify-center p-6 text-xs text-emerald-400 animate-pulse font-medium">
        Loading Jibbitz charms catalog...
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full w-full gap-2 overflow-hidden">
      {/* Top Filter Bar: Search + Category Dropdown Side-by-Side */}
      <div className="flex items-center gap-2 shrink-0">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          isSemanticActive={searchQuery.trim().length > 0}
        />
        <CategoryFilterDropdown
          categories={catalog.categories}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* Selected Charm Detail Card (if one is chosen) */}
      {activeCharm && (
        <CharmDetailCard
          charm={activeCharm}
          onClose={() => setActiveCharm(null)}
        />
      )}

      {/* Charms Grid with All Charms Always Loaded & Maximum Scroll Height */}
      <CharmGrid
        key={`${searchQuery}-${selectedCategories.slice().sort().join(',')}`}
        items={displayedItems}
        selectedCharmId={activeCharm?.id ?? selectedCharmId}
        onSelectCharm={handleSelectCharm}
      />
    </div>
  );
};
