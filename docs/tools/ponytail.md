# Ponytail: Code Simplification & YAGNI Guidelines

**Status:** Active  
**Role:** Development Intelligence Tool & Review Philosophy  

---

## 1. What is Ponytail?

Ponytail is the development intelligence discipline that enforces the **simplest, leanest solution that actually works**. It reflects the mindset of a senior software engineer who avoids unnecessary abstractions, bloated dependencies, and speculative features.

---

## 2. The Ponytail Ladder

Before writing or reviewing any code, evaluate the problem against the ladder and stop at the first rung that holds:

1. **Does this need to exist at all?** (YAGNI — You Aren't Gonna Need It). If speculative, skip it.
2. **Already in this codebase?** Reuse existing utilities, hooks, and types before writing new ones.
3. **Can the standard library or language feature do it?** E.g., `Math.hypot` for distance, native `Array` methods.
4. **Can a native browser/platform feature do it?** E.g., native SVG rotation, native `localStorage`, CSS grid/flexbox.
5. **Does an already-installed dependency cover it?** Never add a new dependency when an existing one or 5 lines of code suffices.
6. **Can it be expressed cleanly in fewer lines?** Keep it short and readable.
7. **Only then:** write the minimum custom code necessary.

---

## 3. Application Rules for Crocs Visualizer

- **No Over-Engineering:** Avoid generic factories or premature multi-layer abstractions where a simple TypeScript function works.
- **Maximum 250 Lines:** Files must remain under 250 lines by extracting cohesive single-responsibility units, not by obfuscating code.
- **Review Phase:** During Phase 3 verification of any issue, an explicit Ponytail review must be performed to identify opportunities for code simplification.
