# Graphify: Codebase Knowledge Graph

**Status:** Active  
**Engine:** `graphifyy` (AST / Tree-sitter Code Parser)  

---

## 1. Purpose of Graphify

Graphify extracts a structured, multi-dimensional knowledge graph from the codebase. It maps relationships between:
- Source files and modules
- Components and hooks
- Coordinate schemas and canvas rendering units
- Shared data types and consumers
- Tests and the units they validate

This prevents context drift and ensures that the AI developer understands all interdependencies before modifying any module.

---

## 2. Installation & Execution

Graphify is powered by the Python CLI engine `graphifyy`:

```bash
# Global installation via uv or pipx
uv tool install graphifyy
# or
pipx install graphifyy
```

### Generating the Graph
Run Graphify from the project root:

```bash
graphify .
```

This generates the `graphify-out/` directory containing:
- `graph.json` — Machine-readable node and edge graph.
- `GRAPH_REPORT.md` — High-level summary of clusters, dependencies, and complex nodes.
- `graph.html` — Interactive visual relationship diagram.

> [!NOTE]
> `graphify-out/` is an ephemeral generated artifact and is excluded from git version control via `.gitignore`.

---

## 3. Dynamic Knowledge Lifecycle

1. **Pre-Implementation:** Inspect `graphify-out/GRAPH_REPORT.md` to identify callers and connected dependencies.
2. **Post-Implementation:** Regenerate the graph to verify that no broken references or circular dependencies were introduced.
