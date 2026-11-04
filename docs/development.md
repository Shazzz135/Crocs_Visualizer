# Development Guide: Crocs Visualizer

**Status:** Active  
**Version:** 1.0.0-beta  

---

## 1. Prerequisites

- **Node.js**: v20.x or v22.x LTS
- **Package Manager**: `pnpm` (v9+) or `npm` (v10+)
- **Python**: v3.11+ (required only for running the data ingestion pipeline in `data-pipeline/`)

---

## 2. Getting Started

### Clone and Install Dependencies
```bash
git clone https://github.com/Shazzz135/Crocs_Visualizer.git
cd Crocs_Visualizer

# Install frontend dependencies
cd frontend
pnpm install
```

### Running the Development Server
```bash
pnpm run dev
```
Open `http://localhost:5173` to access the visualizer.

---

## 3. Code Standards & Scripts

- **Linting:** `pnpm run lint` (ESLint 9 flat config)
- **Type Checking:** `pnpm run build` (tsc strict mode)
- **File Length Audit:** `node ../scripts/check-file-length.mjs` (enforces strict 250-line maximum per source file)
- **Formatting:** Prettier formatting rules

---

## 4. Branch & Issue Workflow

All work must follow the issue-driven development process:
1. Every feature or bug fix requires an approved GitHub Issue.
2. Branches must follow standard naming: `feature/<issue-number>-description`, `fix/<issue-number>-description`.
3. Completion requires verification of the 250-line limit and developer approval prior to PR creation.
