# ADR 0001: Monorepo Structure & 2D SVG Canvas Selection

**Date:** 2026-11-04  
**Status:** Approved  
**Deciders:** Administrator, AI Senior Software Engineer  

---

## Context
We need to provide an interactive visualizer for Classic Crocs footwear allowing color selection, size scaling, charm placement on 26 vent holes, rotation, and deletion. The application requires an authentic Crocs catalog ingestion pipeline and high performance on mobile devices.

---

## Decision
1. **Monorepo Architecture:** Use npm/pnpm workspaces with `frontend/`, `data-pipeline/`, and `shared/` to separate concerns while sharing TypeScript coordinate types.
2. **2D SVG Canvas over 3D WebGL:** Choose a custom 2D SVG canvas over Three.js/3D because:
   - A bird's-eye view is inherently top-down.
   - SVG delivers pixel-sharp vector scaling from Infant to Adult sizes.
   - Hole coordinates map directly to native SVG circle elements, making drag-and-drop hit testing and rotation transforms lightweight and mobile battery-friendly.
3. **No-Account Local Storage:** Avoid server-side user accounts, using `localStorage` for privacy, instant loading, and zero hosting costs.

---

## Consequences
- High performance on all mobile and desktop browsers.
- Low operational complexity.
- Clear separation between the offline Python ingestion pipeline and the client-side SPA.
