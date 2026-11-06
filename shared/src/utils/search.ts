import type { JibbitzItem, JibbitzCategory } from '../types/jibbitz.js';

export interface ScoredJibbitzItem extends JibbitzItem {
  score: number;
  cosineSimilarity: number;
  textScore: number;
}

export interface SearchOptions {
  category?: JibbitzCategory | 'all';
  categories?: (JibbitzCategory | string)[];
  limit?: number;
  minScoreThreshold?: number;
}

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  characters: 'Characters',
  'food-drink': 'Food & Drink',
  'animals-nature': 'Animals',
  sports: 'Sports',
  'symbols-shapes': 'Symbols',
  'letters-numbers': 'Letters',
};

/**
 * 32-bit FNV-1a hash algorithm matching Python offline embeddings generation.
 */
export function fnv1aHash(str: string, seed = 0): number {
  let val = (2166136261 ^ seed) >>> 0;
  for (let i = 0; i < str.length; i++) {
    val = Math.imul(val ^ str.charCodeAt(i), 16777619) >>> 0;
  }
  return val;
}

/**
 * Generates a normalized 384-dimensional query embedding vector on the client.
 */
export function generateQueryEmbedding(query: string, dim = 384): number[] {
  const clean = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = clean.split(/\s+/).filter((w) => w.length > 1);
  if (tokens.length === 0) {
    return new Array(dim).fill(0);
  }

  const vec = new Float64Array(dim);
  for (const token of tokens) {
    const h1 = fnv1aHash(token, 0);
    const h2 = fnv1aHash(token, 2166136261);
    for (let i = 0; i < dim; i++) {
      const angle =
        ((h1 + i * (h2 % 10007)) % 360000) * 0.000017453292519943295;
      vec[i] += Math.sin(angle);
    }
  }

  let sumSq = 0;
  for (let i = 0; i < dim; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq);
  if (norm <= 0) return new Array(dim).fill(0);

  const normalized = new Array<number>(dim);
  for (let i = 0; i < dim; i++) {
    normalized[i] = Number((vec[i] / norm).toFixed(5));
  }
  return normalized;
}

/**
 * Computes cosine similarity between two unit vectors (dot product).
 */
export function cosineSimilarity(
  vecA?: number[],
  vecB?: number[]
): number {
  if (!vecA || !vecB || vecA.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }
  let dot = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return dot;
}

/**
 * Computes multi-token text relevance score.
 */
export function calculateTextScore(
  tokens: string[],
  item: JibbitzItem
): number {
  if (tokens.length === 0) return 1.0;

  const name = item.name.toLowerCase();
  const desc = (item.description ?? '').toLowerCase();
  const tags = (item.tags ?? []).join(' ').toLowerCase();
  const cat = (item.category ?? '').toLowerCase();

  let score = 0;
  for (const token of tokens) {
    if (name.includes(token)) score += 0.6;
    if (tags.includes(token)) score += 0.35;
    if (desc.includes(token)) score += 0.25;
    if (cat.includes(token)) score += 0.2;
  }

  return score;
}

/**
 * Hybrid search combining client-side vector similarity and token matching.
 * Supports multi-select category filter sets.
 */
export function searchJibbitz(
  items: JibbitzItem[],
  query: string,
  options: SearchOptions = {}
): ScoredJibbitzItem[] {
  const { category = 'all', categories, limit, minScoreThreshold = 0.0 } = options;
  const trimmed = query.trim();

  // Multi-select category filtering support
  const activeCatSet =
    categories && categories.length > 0 && !categories.includes('all')
      ? new Set(categories)
      : category && category !== 'all'
      ? new Set([category])
      : null;

  const matchesCategory = (item: JibbitzItem): boolean => {
    if (!activeCatSet) return true;
    return activeCatSet.has(item.category);
  };

  // If no search query, filter by categories only and preserve default order
  if (!trimmed) {
    const filtered = activeCatSet ? items.filter(matchesCategory) : items;

    return filtered.map((item) => ({
      ...item,
      score: 1.0,
      cosineSimilarity: 0,
      textScore: 1.0,
    }));
  }

  const queryVec = generateQueryEmbedding(trimmed);
  const clean = trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = clean.split(/\s+/).filter((w) => w.length > 0);

  const results: ScoredJibbitzItem[] = [];

  for (const item of items) {
    if (!matchesCategory(item)) {
      continue;
    }

    const cos = cosineSimilarity(queryVec, item.embedding);
    const textScore = calculateTextScore(tokens, item);

    // Hybrid formula: weighted average of text match and semantic cosine distance
    const combinedScore =
      textScore > 0
        ? textScore * 0.5 + Math.max(0, cos) * 0.5
        : Math.max(0, cos) * 0.7;

    if (combinedScore >= minScoreThreshold) {
      results.push({
        ...item,
        score: combinedScore,
        cosineSimilarity: cos,
        textScore,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return limit ? results.slice(0, limit) : results;
}
