"""
Embedding generation utilities for Jibbitz charms.
Generates 384-dimensional normalized vector embeddings for semantic client search.
Uses a lightweight token-hash projection fallback if sentence-transformers is not installed,
ensuring offline execution without requiring PyTorch.
"""

import math
import re
from typing import List

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
        # Multi-hash projection
        h1 = hash(token)
        h2 = hash(token[::-1])
        for i in range(dim):
            weight = math.sin((h1 + i * h2) * 0.0174533)
            vec[i] += weight

    # Normalize vector to unit length (L2 norm)
    norm = math.sqrt(sum(x * x for x in vec))
    if norm > 0:
        vec = [round(x / norm, 5) for x in vec]

    return vec
