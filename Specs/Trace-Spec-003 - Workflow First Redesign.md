# Trace-Spec-003 — Workflow First Redesign

**Project:** Ourox Trace  
**Spec:** Trace-Spec-003  
**Issued from:** Trace-Brief-003  
**Build mode:** Cursor AUTO mode  
**Status:** Implemented locally — report before push

See full spec in user brief. This file records the implementation scope for Trace-Spec-003.

## Objective

Refactor Ourox Trace from equal-weight tabs into a workflow-first recovery workspace while preserving `TraceCaseWorkspace` state logic (method-save gates attribution, review status, audit events).

## Implementation scope

- Workflow stepper (8 action-first steps) replacing `TraceTabs` UX
- Case story card + mini trace infographic (≤6 nodes)
- Compact boundary banner + IS/IS-NOT drawer
- Four key-screen action-first refinements
- Header/logo polish
- 3–4 learning explainers
- Landing reorder + locked preview cards TRACE-CASE-002/003
- Tests for workflow, landing, boundary

## Safe refactor constraints

- No changes to method math, attribution logic, audit/review gates, or AI-assist behaviour
- No proof-layer content, big fake graph, real data/API/key
- No Ops/Verity/Arbiter changes
