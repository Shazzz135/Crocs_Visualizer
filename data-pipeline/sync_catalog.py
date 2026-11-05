"""
Main ingestion and catalog synchronization pipeline for Crocs Visualizer.
Execution steps:
1. Load existing `frontend/public/catalog/jibbitz.json` (if present)
2. Fetch new products from verified Crocs CDN / official catalog
3. Remove studio white background via rembg (u2net) with solid matte
4. Tightly outline each charm and cut out excess whitespace/margins
5. Compute 384-dimensional semantic search embeddings
6. Output updated JSON and transparent PNG files into `frontend/public/catalog/`
"""

import io
import json
import os
import sys
from typing import Dict, Any, List
import requests
from PIL import Image

from image_processor import normalize_charm_asset
from embeddings import generate_text_embedding
from official_catalog import load_official_catalog
from asset_generator import render_seed_charm_image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_CATALOG_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "catalog")
OUTPUT_IMAGES_DIR = os.path.join(OUTPUT_CATALOG_DIR, "images")
CATALOG_JSON_PATH = os.path.join(OUTPUT_CATALOG_DIR, "jibbitz.json")

def load_existing_catalog() -> Dict[str, Any]:
    """Loads existing catalog JSON if it exists."""
    if os.path.exists(CATALOG_JSON_PATH):
        try:
            with open(CATALOG_JSON_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[Pipeline] Warning: Could not read existing catalog ({e})")
    return {"version": "1.0.0", "updatedAt": "", "totalCount": 0, "items": []}

def fetch_charm_image(item: Dict[str, Any]) -> Image.Image:
    """Fetches high-resolution charm image from Crocs CDN with procedural fallback."""
    cdn_sku = item.get("cdn_sku") or item.get("id")
    urls_to_try = []
    if item.get("verified_image_url"):
        urls_to_try.append(item["verified_image_url"])
    if cdn_sku:
        urls_to_try.append(f"https://media.crocs.com/images/t_pdphero/f_auto,q_auto/products/{cdn_sku}_001_ALT100/crocs")
    if item.get("raw_image_url"):
        urls_to_try.append(item["raw_image_url"])

    for cdn_url in urls_to_try:
        try:
            resp = requests.get(
                cdn_url,
                timeout=10,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
            )
            if resp.status_code == 200 and len(resp.content) > 1000:
                raw = Image.open(io.BytesIO(resp.content))
                return raw.convert("RGBA") if raw.mode != "RGBA" else raw
        except Exception:
            pass
    return render_seed_charm_image(item, size=128)

def process_and_save_charm(
    item: Dict[str, Any],
    raw_image: Image.Image
) -> Dict[str, Any]:
    """Processes a single charm image and generates metadata + embedding."""
    cleaned_img, aspect_ratio, (w, h) = normalize_charm_asset(raw_image, target_max_size=256)
    
    # Save PNG
    image_filename = f"{item['id']}.png"
    image_rel_path = f"/catalog/images/{image_filename}"
    output_image_path = os.path.join(OUTPUT_IMAGES_DIR, image_filename)
    cleaned_img.save(output_image_path, format="PNG", optimize=True)

    # Generate semantic text embedding from name, description, category, and tags
    searchable_text = f"{item['name']} {item.get('category', '')} {item.get('description', '')} {' '.join(item.get('tags', []))}"
    embedding = generate_text_embedding(searchable_text, dim=384)

    return {
        "id": item["id"],
        "name": item["name"],
        "category": item["category"],
        "price": item.get("price", 4.99),
        "imageUrl": image_rel_path,
        "aspectRatio": aspect_ratio,
        "dimensions": item.get("dimensions", {"widthMm": 26, "heightMm": 26}),
        "description": item.get("description", ""),
        "tags": item.get("tags", []),
        "embedding": embedding,
    }

def run_pipeline(force_refresh: bool = False) -> None:
    """Executes the full catalog synchronization pipeline."""
    os.makedirs(OUTPUT_IMAGES_DIR, exist_ok=True)
    existing_catalog = load_existing_catalog()
    existing_ids = set() if force_refresh else {x["id"] for x in existing_catalog.get("items", [])}
    items_by_id = {} if force_refresh else {x["id"]: x for x in existing_catalog.get("items", [])}

    # If force refresh, remove obsolete procedural seed image files from disk
    if force_refresh and os.path.exists(OUTPUT_IMAGES_DIR):
        for f in os.listdir(OUTPUT_IMAGES_DIR):
            if f.startswith("jib-"):
                try:
                    os.remove(os.path.join(OUTPUT_IMAGES_DIR, f))
                except OSError:
                    pass

    # Source exclusively authentic verified official Crocs Jibbitz
    products = load_official_catalog()
    valid_ids = {p["id"] for p in products}
    items_by_id = {k: v for k, v in items_by_id.items() if k in valid_ids}
    print(f"[Pipeline] Processing {len(products)} authentic official Crocs Jibbitz definitions...")

    from concurrent.futures import ThreadPoolExecutor, as_completed

    to_process = [p for p in products if p["id"] not in existing_ids]
    print(f"[Pipeline] Need to process {len(to_process)} new charms ({len(existing_ids)} cached)...")

    def process_item(product: Dict[str, Any]) -> tuple:
        p_id = product["id"]
        raw_img = fetch_charm_image(product)
        processed = process_and_save_charm(product, raw_img)
        return p_id, processed

    new_count = 0
    with ThreadPoolExecutor(max_workers=8) as executor:
        future_map = {executor.submit(process_item, p): p for p in to_process}
        for future in as_completed(future_map):
            try:
                p_id, processed = future.result()
                items_by_id[p_id] = processed
                new_count += 1
                if new_count % 25 == 0 or new_count == len(to_process):
                    print(f"  * Processed {new_count}/{len(to_process)} charms ({processed['name']})...")
            except Exception as e:
                p = future_map[future]
                print(f"  ! Error processing {p['name']}: {e}")

    # Save sorted catalog
    all_items = sorted(items_by_id.values(), key=lambda x: (x["category"], x["name"]))
    catalog_output = {
        "version": "1.0.0",
        "totalCount": len(all_items),
        "categories": [
            "characters",
            "food-drink",
            "animals-nature",
            "sports",
            "symbols-shapes",
            "letters-numbers",
        ],
        "items": all_items,
    }

    with open(CATALOG_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog_output, f, indent=2)

    # Output Markdown digest for GitHub Actions summary and logging
    from collections import Counter
    counts = Counter(x["category"] for x in all_items)
    digest_lines = [
        "## Crocs Jibbitz Bi-Weekly Ingestion Digest",
        f"- **Total Catalog Items:** {len(all_items)}",
        f"- **New Items Added:** {new_count}",
        "",
        "### Category Breakdown",
        "| Category | Count |",
        "| :--- | :---: |",
    ]
    for cat, cnt in counts.most_common():
        digest_lines.append(f"| {cat} | {cnt} |")
    digest_md = "\n".join(digest_lines) + "\n"

    step_summary = os.getenv("GITHUB_STEP_SUMMARY")
    if step_summary:
        try:
            with open(step_summary, "a", encoding="utf-8") as sf:
                sf.write(digest_md)
        except OSError:
            pass

    print(f"\n[Pipeline] Completed successfully!")
    print(f"  * Total catalog items: {len(all_items)}")
    print(f"  * New items added: {new_count}")
    print(f"  * Saved catalog JSON: {CATALOG_JSON_PATH}")

if __name__ == "__main__":
    force = "--force" in sys.argv
    run_pipeline(force_refresh=force)
