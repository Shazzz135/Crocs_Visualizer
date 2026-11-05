# Crocs & Jibbitz Data Ingestion Pipeline

Automated ingestion and background removal asset processor for the Crocs Visualizer catalog.

## Architecture

This pipeline follows a **build-time static catalog architecture**:
1. **Deduplication**: Reads `frontend/public/catalog/jibbitz.json` and skips any existing product SKUs.
2. **Conditional Background Removal**: Inspects image perimeter transparency. If not transparent, uses `rembg` (`u2net`) to strip solid/studio backgrounds.
3. **Bounding-Box Trimming**: Crops redundant transparent padding with a 4px protective margin.
4. **Normalized Dimensions**: Computes aspect ratios and scale factors relative to vent hole dimensions.
5. **Deterministic Vector Embeddings**: Generates 384-dimensional semantic text embeddings so client search can execute instantly in the browser without backend API calls.
6. **Zero-Database Delivery**: Output JSON and PNGs are saved to `frontend/public/catalog/` and served via CDN.

## Requirements

- Python 3.10+
- `pillow`
- `numpy`
- `requests`
- `rembg` (optional for local solid-background removal)
- `pytest` (for tests)

## Running Locally

```bash
# Run pipeline
python data-pipeline/sync_catalog.py
```

## Running Tests

```bash
python -m pytest data-pipeline/tests/
```

## Automated Bi-Weekly Scan

Configured in `.github/workflows/catalog-sync.yml`:
- Runs at `06:00 UTC` on the 1st and 15th of each month.
- Fetches new Crocs Jibbitz arrivals.
- Removes backgrounds for newly found items.
- Automatically commits and deploys updated catalog assets.
