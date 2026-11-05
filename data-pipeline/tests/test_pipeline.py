"""
Unit tests for data pipeline utilities:
- Image transparency analysis
- Image trimming
- Normalization aspect ratio
- Embedding generation and determinism
- Individual charm verification (filtering multi-packs)
- Classic Croc colors palette definition
"""

import os
import sys
import numpy as np
import pytest
from PIL import Image

# Ensure data-pipeline directory is in sys.path
PIPELINE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PIPELINE_DIR not in sys.path:
    sys.path.insert(0, PIPELINE_DIR)

from image_processor import (
    analyze_alpha_transparency,
    trim_transparent_padding,
    normalize_charm_asset,
)
from embeddings import generate_text_embedding
from filters import is_individual_charm
from fetch_crocs_colors import CLASSIC_COLOR_CODES

def test_transparency_detection():
    solid = Image.new("RGBA", (100, 100), (255, 0, 0, 255))
    assert not analyze_alpha_transparency(solid)

    transparent = Image.new("RGBA", (100, 100), (0, 0, 0, 0))
    for y in range(40, 60):
        for x in range(40, 60):
            transparent.putpixel((x, y), (255, 0, 0, 255))
    assert analyze_alpha_transparency(transparent)

def test_trim_transparent_padding():
    img = Image.new("RGBA", (100, 100), (0, 0, 0, 0))
    for y in range(30, 70):
        for x in range(30, 70):
            img.putpixel((x, y), (255, 200, 0, 255))

    trimmed = trim_transparent_padding(img, padding_px=2)
    w, h = trimmed.size
    assert w == 44
    assert h == 44

def test_normalize_charm_asset():
    img = Image.new("RGBA", (100, 50), (0, 0, 0, 0))
    for y in range(10, 40):
        for x in range(10, 90):
            img.putpixel((x, y), (0, 255, 0, 255))

    normalized, aspect_ratio, (w, h) = normalize_charm_asset(img, target_max_size=200)
    assert aspect_ratio > 1.0
    assert w <= 200
    assert h <= 200

def test_deterministic_embedding_generation():
    text = "mickey mouse disney cartoon"
    vec1 = generate_text_embedding(text, dim=384)
    vec2 = generate_text_embedding(text, dim=384)

    assert len(vec1) == 384
    assert vec1 == vec2
    norm = np.linalg.norm(vec1)
    assert pytest.approx(norm, 0.01) == 1.0

def test_is_individual_charm_filtering():
    assert is_individual_charm("Disney Frozen 2 Elsa") is True
    assert is_individual_charm("Mickey Mouse Head") is True
    assert is_individual_charm("Classic French Fries") is True

    # Multipacks and 3D objects must be rejected
    assert is_individual_charm("Disney Frozen 5-Pack Jibbitz") is False
    assert is_individual_charm("Foodie 3-Pack Charms") is False
    assert is_individual_charm("Marvel Superhero Set") is False
    assert is_individual_charm("Holiday Charm Bundle") is False
    assert is_individual_charm("3D Silly Goose") is False
    assert is_individual_charm("Squish Filled Soda Pop") is False
    assert is_individual_charm("Flower Shaker") is False

def test_classic_croc_colors_coverage():
    assert len(CLASSIC_COLOR_CODES) >= 15
    color_ids = {c["id"] for c in CLASSIC_COLOR_CODES}
    assert "black" in color_ids
    assert "white" in color_ids
    assert "navy" in color_ids
    assert "butter" in color_ids
