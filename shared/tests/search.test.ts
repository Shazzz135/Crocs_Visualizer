import { describe, it, expect } from 'vitest';
import {
  fnv1aHash,
  generateQueryEmbedding,
  cosineSimilarity,
  calculateTextScore,
  searchJibbitz,
  type JibbitzItem,
} from '../src/index.js';

describe('Search and Embedding Utilities', () => {
  it('computes deterministic FNV-1a hashes matching cross-platform values', () => {
    const h1 = fnv1aHash('puppy');
    const h2 = fnv1aHash('puppy');
    expect(h1).toBe(h2);
    expect(h1).toBe(1241138949);
    expect(fnv1aHash('cute')).toBe(1873402962);
  });

  it('generates a normalized 384-d vector embedding with L2 norm ~1.0', () => {
    const vec = generateQueryEmbedding('cute golden retriever puppy');
    expect(vec.length).toBe(384);

    let sumSq = 0;
    for (const v of vec) {
      sumSq += v * v;
    }
    const norm = Math.sqrt(sumSq);
    expect(norm).toBeGreaterThan(0.99);
    expect(norm).toBeLessThan(1.01);
  });

  it('computes cosine similarity accurately', () => {
    const vecA = generateQueryEmbedding('retro music');
    const vecB = generateQueryEmbedding('retro music');
    const vecC = generateQueryEmbedding('delicious pizza slice');

    const simSelf = cosineSimilarity(vecA, vecB);
    expect(simSelf).toBeCloseTo(1.0, 3);

    const simOther = cosineSimilarity(vecA, vecC);
    expect(simOther).toBeLessThan(simSelf);
  });

  it('calculates text relevance scores across name, tags, and description', () => {
    const mockItem: JibbitzItem = {
      id: 'jib-dog-1',
      name: 'Golden Puppy',
      category: 'animals-nature',
      imageUrl: '/catalog/images/test.png',
      description: 'Cute golden puppy for dog lovers',
      tags: ['puppy', 'dog', 'pet', 'cute'],
    };

    const score = calculateTextScore(['cute', 'puppy'], mockItem);
    expect(score).toBeGreaterThan(1.0);

    const zeroScore = calculateTextScore(['basketball', 'nba'], mockItem);
    expect(zeroScore).toBe(0);
  });

  it('hybrid searches and ranks items properly by query and category', () => {
    const puppyEmbed = generateQueryEmbedding('cute golden puppy dog');
    const pizzaEmbed = generateQueryEmbedding('delicious hot cheese pizza');

    const items: JibbitzItem[] = [
      {
        id: '1',
        name: 'Golden Puppy',
        category: 'animals-nature',
        imageUrl: '/test1.png',
        tags: ['cute', 'puppy'],
        embedding: puppyEmbed,
      },
      {
        id: '2',
        name: 'Pepperoni Pizza',
        category: 'food-drink',
        imageUrl: '/test2.png',
        tags: ['pizza', 'cheese'],
        embedding: pizzaEmbed,
      },
      {
        id: '3',
        name: 'Soccer Ball',
        category: 'sports',
        imageUrl: '/test3.png',
      },
    ];

    const results = searchJibbitz(items, 'cute puppy');
    expect(results.length).toBe(3);
    expect(results[0].id).toBe('1');
    expect(results[0].score).toBeGreaterThan(results[1].score);

    // Test multi-category filter
    const multiFilter = searchJibbitz(items, '', { categories: ['animals-nature', 'sports'] });
    expect(multiFilter.length).toBe(2);
    const ids = multiFilter.map((i) => i.id);
    expect(ids).toContain('1');
    expect(ids).toContain('3');
    expect(ids).not.toContain('2');
  });
});
