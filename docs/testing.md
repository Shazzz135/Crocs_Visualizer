# Testing Strategy: Crocs Visualizer

**Status:** Active  
**Version:** 1.0.0-beta  

---

## 1. Testing Philosophy

Testing ensures visual stability, mathematical coordinate accuracy, and reliable touch interactions across mobile and desktop browsers.

---

## 2. Test Layers

### 2.1 Unit & Coordinate Math Tests (Vitest)
- **Hole Collision Math:** Verifies distance calculation between dropped coordinates and the 26 vent holes.
- **Size Scaling Formulas:** Verifies that scale factors (Infant $\rightarrow$ Adult) correctly adjust coordinate offsets without distortion.
- **Rotation Calculations:** Verifies degree normalization between $0^\circ$ and $360^\circ$.
- **Storage Serialization:** Verifies that designs serialized to `localStorage` adhere to strict Zod schemas.

### 2.2 Component & Hook Tests (Vitest + React Testing Library)
- **Selection State Machine:** Tests single-click selection and 3-click deletion behavior.
- **Palette Switching:** Verifies that SVG fill color reacts immediately to colorway changes.
- **Drawer Responsiveness:** Verifies mobile drawer vs desktop sidebar rendering.

### 2.3 End-to-End Tests (Playwright)
- Dragging a Jibbit from the panel and dropping it onto a specific vent hole.
- Selecting, rotating, and deleting charms.
- Page reload verification to ensure `localStorage` persists placed charms.
- PNG snapshot export functionality.

---

## 3. Running Tests

```bash
# In frontend/
pnpm run test        # Runs unit and component tests
pnpm run test:e2e    # Runs Playwright E2E suite
```
