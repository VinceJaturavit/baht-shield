# Ops-Spec-009 — QA & Performance Views

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-009  
**Issued from:** Ops-Brief-009  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Add **QA** and **Performance** views to the existing Roster sub-nav.

This loop completes the people-management suite by showing three distinct management signals:

1. **Fairness** — is hard work distributed evenly?
2. **Performance** — how much work did the analyst get through?
3. **QA** — was the work done correctly, and does the analyst take their share of urgent/tight-SLA work?

The core requirement is that these signals must stay separate. Do not collapse them into one “cases closed” ranking or one blended score.

This is a **read-only synthetic demonstration**.

No live editing. No reassignment. No QA workflow engine. No scoring. No ML. No Verity wiring.

---

## Implementation summary

See Ops-Spec-009 sections 4–36 for full acceptance criteria. Implemented in baht-shield-app roster workspace.
