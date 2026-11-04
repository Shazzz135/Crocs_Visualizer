# Contributing Guidelines: Crocs Visualizer

All contributions must follow the **AI Full-Stack Development Workspace — Master Instructions**.

---

## 1. Issue-Driven Workflow

1. Every code change must be linked to an approved GitHub Issue.
2. Changes must stay strictly within the approved issue scope.
3. No PR may be created without explicit developer approval.

---

## 2. Hard Limits & Code Rules

1. **250-Line Maximum per Source File:** Strictly enforced by automated checks (`scripts/check-file-length.mjs`). Any file exceeding 250 lines will fail CI.
2. **Ponytail Discipline:** Prefer the simplest solution that works. Avoid speculative abstractions. Centralize repeated logic.
3. **Graphify Updates:** Consult `graphify-out/GRAPH_REPORT.md` before making changes to understand existing dependencies, and update the graph after modifying files.
4. **Security & Secrets:** Never commit API keys or private tokens.

---

## 3. Pull Request Requirements

Every pull request must:
- Reference its closing issue (`Closes #...`).
- Pass linting, type-checking, tests, and the 250-line file audit.
- Include an explicit completion report.
- Await manual developer merge.
