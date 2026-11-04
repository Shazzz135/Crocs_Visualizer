---
name: Refactoring & Technical Debt
about: Propose code simplification, debt reduction, or Ponytail review
title: '[REFACTOR] '
labels: ['refactor']
assignees: ''
---

## Objective
What code area is being simplified or restructured?

## Ponytail Evaluation
1. What unnecessary abstraction or duplicate logic is being removed?
2. How does this simplify the codebase without changing public behavior?

## Scope & Affected Modules
- Files to touch:

## Acceptance Criteria
- [ ] Code simplified and unnecessary dependencies/abstractions removed
- [ ] No regression in public interfaces or functionality
- [ ] All source files strictly <= 250 lines
- [ ] All automated tests pass
