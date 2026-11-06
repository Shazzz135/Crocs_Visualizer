"""
Embedding generation utilities for Jibbitz charms.
Generates 384-dimensional normalized vector embeddings for semantic client search.
Uses deterministic FNV-1a token projection ensuring 100% mathematical consistency
between Python offline ingestion and TypeScript client-side query vector projection.
"""

import math
import re
from typing import List

def fnv1a_hash(s: str, seed: int = 0) -> int:
    """32-bit FNV-1a hash algorithm matching client-side TypeScript implementation."""
    val = (2166136261 ^ seed) & 0xFFFFFFFF
    for ch in s:
        val = ((val ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    return val

def tokenize_and_clean(text: str) -> List[str]:
    """Tokenizes and normalizes text for embedding generation."""
    clean = re.sub(r"[^a-zA-Z0-9\s]", " ", text.lower())
    return [w.strip() for w in clean.split() if len(w.strip()) > 1]

def generate_text_embedding(
    text: str,
    dim: int = 384
) -> List[float]:
    """
    Generates a deterministic, normalized 384-d semantic embedding vector.
    Uses multi-hash pseudo-random projection to ensure consistent cosine distances
    for client-side semantic similarity search without requiring heavy DL models.
    """
    tokens = tokenize_and_clean(text)
    if not tokens:
        return [0.0] * dim

    vec = [0.0] * dim
    for token in tokens:
        h1 = fnv1a_hash(token, 0)
        h2 = fnv1a_hash(token, 2166136261)
        for i in range(dim):
            angle = ((h1 + i * (h2 % 10007)) % 360000) * 0.000017453292519943295
            vec[i] += math.sin(angle)

    # Normalize vector to unit length (L2 norm)
    norm = math.sqrt(sum(x * x for x in vec))
    if norm > 0:
        return [round(x / norm, 5) for x in vec]
    return vec
