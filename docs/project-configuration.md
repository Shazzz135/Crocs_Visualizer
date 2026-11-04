# Project Configuration & Approved Requirements: Crocs Visualizer

**Status:** Approved by Administrator  
**Version:** 1.0.0-beta  
**Date:** 2026-11-04  
**Project Phase:** Beta Release  

> [!IMPORTANT]
> **Beta Release Status**: This project is in an active **Beta** stage. Features are functional for testing, demonstration, and evaluation, but the application is not yet at its maximum potential. Enhancements, additional Jibbitz collections, and refinements will be introduced incrementally.

---

## 1. Project Overview & Problem Statement

The **Crocs Visualizer** is an independent, responsive, account-free web application that allows users to customize a pair of Classic Crocs in real-time. The application solves the visual friction of imagining how charm (Jibbitz) combinations look on specific Crocs colors and sizes before purchase.

Users can:
- Select Classic Crocs sizes from Infant to Adult.
- Select authentic Crocs colorways.
- Browse and semantically search Jibbitz charms.
- Drag and drop charms onto any of the 26 authentic vent holes (13 per shoe).
- Rotate charms to customize orientation.
- Delete placed charms via a deliberate 3-click interaction (1 click to select + double-tap to delete).
- Persist their designs in local browser storage without requiring an account.
- Export high-resolution image snapshots with clear disclaimers.

---

## 2. In-Store Testing, Legal & Compliance Requirements

Because this application may be demonstrated or tested in real-world retail environments, strict disclaimers and legal disclosures are mandatory:

1. **Non-Affiliation & Trademark Notice**:
   - The application is an independent, non-commercial fan/portfolio project.
   - It is **not affiliated with, endorsed by, or sponsored by Crocs, Inc.**
   - All trademarks (`CROCS`, `JIBBITZ`, `Croslite`) belong to Crocs, Inc.
2. **In-Store Availability & Pricing Disclaimer**:
   - The catalog items, colors, and Jibbitz displayed in this visualizer are for demonstration purposes only.
   - Display in the visualizer **does not guarantee in-store stock, physical inventory, or pricing** at any Crocs retail location or authorized retailer.
3. **No-Account Privacy Protection**:
   - The app collects **zero** personal identifiable information (PII).
   - No tracking cookies, advertising trackers, or external analytics.
   - All design configurations are saved strictly to client-side `localStorage`.
4. **Visual Disclaimers**:
   - A visible disclaimer banner/footer in the UI.
   - Watermarked disclaimers on exported snapshot images.
   - Dedicated in-app `/terms`, `/privacy`, and `/disclaimers` reference pages.

---

## 3. Approved Technology Stack

| Category | Approved Technology | Responsibility |
| :--- | :--- | :--- |
| **Monorepo** | npm / pnpm workspaces | Monorepo structure (`frontend`, `data-pipeline`, `shared`). |
| **Frontend Framework** | React 19 + TypeScript + Vite | Client-side application with fast hot module replacement. |
| **Styling** | Tailwind CSS v4 | Responsive utility styling (Desktop sidebar / Mobile bottom sheet). |
| **2D Interactive Canvas** | Custom SVG Canvas | Vector-sharp top-down rendering, coordinate mapping, and rotation. |
| **Drag & Drop** | `@dnd-kit` (Core + Modifiers) | Touch and mouse drag-and-drop with magnetic snapping to hole coordinates. |
| **Embeddings & Search** | Local vector embeddings index | Instant in-browser semantic similarity search for Jibbitz. |
| **Data Ingestion** | Python CLI / scripts | Batch ingestion from Bright Data, `rembg` background removal, scale normalization. |
| **State & Persistence** | Zustand + `localStorage` | Fast state management with automatic local persistence. |
| **Quality & CI** | ESLint 9 + Prettier + GitHub Actions | Automated linting, type safety, test execution, and 250-line file limits. |
| **Development Intelligence** | Ponytail + Graphify (`graphifyy`) | YAGNI code simplification and automated codebase knowledge graphs. |

---

## 4. 26-Hole Coordinate Layout Specification

The pair view presents both the Left and Right Classic Crocs side-by-side:
- **Left Shoe**: 13 vent holes mapped to relative coordinates `[HL-01 .. HL-13]`.
- **Right Shoe**: 13 vent holes mapped to relative coordinates `[HR-01 .. HR-13]`.
- **Dynamic Sizing**: Hole coordinates scale proportionately based on the chosen size category (Infant, Kids, Youth, Adult).
- **Magnetic Snapping**: A dragged Jibbit snaps to an open hole if released within a 24px radius of that hole coordinate.

---

## 5. Interaction State Machine

```
[Idle] 
  ──(Drag Jibbit)──> [Dragging] 
  ──(Release within hole radius)──> [Snapped & Placed]

[Placed Jibbit]
  ──(Click once)──> [Selected (Rotation Ring active)]
  ──(Drag rotation ring)──> [Rotated]
  ──(Double-tap / double-click while selected)──> [Deleted (Removed from hole)]
  ──(Click empty canvas)──> [Deselected]
```

---

## 6. Versioning & Change Control

Any modification to this configuration must be proposed by the AI, explicitly approved by the administrator, and versioned in this document before code changes occur.
