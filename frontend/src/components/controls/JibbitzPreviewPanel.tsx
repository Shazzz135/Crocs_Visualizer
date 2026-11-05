import React, { useEffect, useState, useMemo } from 'react';
import type { JibbitzCategory, JibbitzItem } from '@crocs/shared';

interface CatalogResponse {
  version: string;
  totalCount: number;
  categories: JibbitzCategory[];
  items: JibbitzItem[];
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  characters: 'Characters',
  'food-drink': 'Food & Drink',
  'animals-nature': 'Animals',
  sports: 'Sports',
  'symbols-shapes': 'Symbols',
  'letters-numbers': 'Letters',
};

export const JibbitzPreviewPanel: React.FC = () => {
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCharm, setSelectedCharm] = useState<JibbitzItem | null>(null);

  useEffect(() => {
    fetch('/catalog/jibbitz.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CatalogResponse | null) => {
        if (data?.items) {
          setCatalog(data);
        }
      })
      .catch((err) => console.error('[JibbitzPreview] Fetch error:', err));
  }, []);

  const filteredItems = useMemo(() => {
    if (!catalog?.items) return [];
    return catalog.items.filter((item) => {
      const matchCat =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [catalog, selectedCategory, searchQuery]);

  if (!catalog) {
    return (
      <div className="flex items-center justify-center p-4 text-xs text-slate-500">
        Loading Jibbitz catalog...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 border-t border-slate-800/80 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">
            Jibbitz™ Charms Catalog
          </h2>
          <p className="text-xs text-slate-400">
            {catalog.totalCount} transparent charms ingested
          </p>
        </div>
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Filter charms..."
        aria-label="Filter charms by name or description"
        className="w-full px-3 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
      />

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {['all', ...catalog.categories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 text-xs rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-sky-500 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {/* Grid of Ingested Charms */}
      <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800/60 scrollbar-thin">
        {filteredItems.map((item) => {
          const isSelected = selectedCharm?.id === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedCharm(item)}
              title={`${item.name} (${item.category})`}
              className={`relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all aspect-square group ${
                isSelected
                  ? 'border-sky-400 bg-sky-950/40 shadow-sm shadow-sky-500/20'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/80'
              }`}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-10 h-10 object-contain drop-shadow group-hover:scale-110 transition-transform"
                loading="lazy"
              />
              <span className="text-[10px] text-slate-400 truncate w-full text-center mt-1">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Charm Detail Card */}
      {selectedCharm && (
        <div className="flex items-center gap-3 p-2.5 bg-slate-800/40 border border-slate-800 rounded-lg">
          <img
            src={selectedCharm.imageUrl}
            alt={selectedCharm.name}
            className="w-10 h-10 object-contain drop-shadow shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-200 truncate">
              {selectedCharm.name}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              {selectedCharm.description}
            </p>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-sky-400">
              <span>
                {selectedCharm.dimensions?.widthMm}×
                {selectedCharm.dimensions?.heightMm} mm
              </span>
              <span>•</span>
              <span className="uppercase">{selectedCharm.category}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
