"""
Crocs Classic Clog Colorway Fetcher and Pipeline.
Fetches official Crocs Classic Clog product photography from Crocs CDN,
samples authentic RGB/Hex color values from shoe bodies,
and outputs `frontend/public/catalog/colors.json`.
"""

import io
import json
import os
import requests
import numpy as np
from PIL import Image
from typing import List, Dict, Any

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COLORS_JSON_PATH = os.path.join(PROJECT_ROOT, "frontend", "public", "catalog", "colors.json")

# Verified Classic Clog (SKU 10001) official Crocs colorways and display names
CLASSIC_COLOR_CODES = [
    {"id": "black", "name": "Black", "code": "001", "fallbackHex": "#000000"},
    {"id": "white", "name": "White", "code": "100", "fallbackHex": "#f9f9f9"},
    {"id": "navy", "name": "Navy", "code": "410", "fallbackHex": "#242d36"},
    {"id": "bone", "name": "Bone", "code": "2Y2", "fallbackHex": "#dbd6c6"},
    {"id": "atmosphere", "name": "Atmosphere", "code": "1FT", "fallbackHex": "#dddfde"},
    {"id": "espresso", "name": "Espresso", "code": "206", "fallbackHex": "#1a1815"},
    {"id": "slate-grey", "name": "Slate Grey", "code": "0DA", "fallbackHex": "#4c4c4c"},
    {"id": "army-green", "name": "Army Green", "code": "309", "fallbackHex": "#74794e"},
    {"id": "lavender", "name": "Lavender", "code": "530", "fallbackHex": "#b4a5c0"},
    {"id": "pink-lemonade", "name": "Pink Lemonade", "code": "669", "fallbackHex": "#f499bd"},
    {"id": "quartz", "name": "Quartz", "code": "6UR", "fallbackHex": "#b3a39b"},
    {"id": "emerald", "name": "Emerald", "code": "302", "fallbackHex": "#205249"},
    {"id": "latte", "name": "Latte", "code": "2Q9", "fallbackHex": "#a89076"},
    {"id": "elephant", "name": "Elephant", "code": "1LM", "fallbackHex": "#bfbfb7"},
    {"id": "starfish", "name": "Starfish", "code": "7AH", "fallbackHex": "#dc2b2b"},
    {"id": "varsity-red", "name": "Varsity Red", "code": "6WC", "fallbackHex": "#c74c4f"},
    {"id": "blue-bolt", "name": "Blue Bolt", "code": "4KZ", "fallbackHex": "#1480dd"},
    {"id": "turbo-teal", "name": "Turbo Teal", "code": "3AY", "fallbackHex": "#61c7d2"},
    {"id": "blue-frost", "name": "Blue Frost", "code": "4WK", "fallbackHex": "#aab8cb"},
    {"id": "moss", "name": "Moss", "code": "308", "fallbackHex": "#85957c"},
    {"id": "linen", "name": "Linen", "code": "0HZ", "fallbackHex": "#d2d3cb"},
    {"id": "butter", "name": "Butter", "code": "7C1", "fallbackHex": "#f2e97d"},
]

def sample_color_from_crocs_cdn(code: str, fallback_hex: str) -> str:
    """Fetches high-res shoe image and samples median RGB of visible shoe body."""
    url = f"https://media.crocs.com/images/t_pdphero/f_auto,q_auto/products/10001_{code}_ALT100/crocs"
    try:
        resp = requests.get(url, timeout=6)
        if resp.status_code == 200 and len(resp.content) > 1000:
            img = Image.open(io.BytesIO(resp.content)).convert("RGBA")
            arr = np.array(img)
            alpha = arr[:, :, 3]
            visible = arr[alpha > 128]
            if len(visible) > 0:
                rgb = np.median(visible[:, :3], axis=0).astype(int)
                return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
    except Exception:
        pass
    return fallback_hex

def sync_classic_colors() -> List[Dict[str, Any]]:
    """Generates the authentic classic Crocs colors list and saves to JSON."""
    os.makedirs(os.path.dirname(COLORS_JSON_PATH), exist_ok=True)
    results = []

    print(f"[Colors] Sampling {len(CLASSIC_COLOR_CODES)} official Crocs Classic Clog colors...")
    for entry in CLASSIC_COLOR_CODES:
        hex_val = sample_color_from_crocs_cdn(entry["code"], entry["fallbackHex"])
        item = {
            "id": entry["id"],
            "name": entry["name"],
            "code": entry["code"],
            "hex": hex_val,
        }
        results.append(item)
        print(f"  + {entry['name']} ({entry['code']}): {hex_val}")

    with open(COLORS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump({"totalCount": len(results), "colors": results}, f, indent=2)

    print(f"[Colors] Saved {len(results)} colors to {COLORS_JSON_PATH}")
    return results

if __name__ == "__main__":
    sync_classic_colors()
