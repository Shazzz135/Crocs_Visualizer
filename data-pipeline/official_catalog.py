"""
Official Crocs Jibbitz catalog loader.
Loads 40+ authentic official Crocs Jibbitz definitions with direct CDN image endpoints.
"""

import json
import os
from typing import List, Dict, Any

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(CURRENT_DIR, "official_catalog.json")

def load_official_catalog() -> List[Dict[str, Any]]:
    """Loads official Jibbitz catalog definitions from JSON."""
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

OFFICIAL_JIBBITZ_CATALOG: List[Dict[str, Any]] = load_official_catalog()
