# Ops-Spec-001 — Ourox Ops Shell + Queue Board

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-001  
**Issued from:** Ops-Brief-001  
**Build mode:** Cursor AUTO mode, single-session scope  
**Status:** Implemented locally — pending review before push

---

## Objective

First Ourox Ops MVP screen: `/ops` route, shell/nav, synthetic ops cases, SLA config, Queue Board with Urgent overlay, and SLA breakdown drawer. Post-alert operations only — no scoring/ML.

## Delivered scope

- `/ops` route with `OuroxShell`, breadcrumb **Ops**, platform nav entry
- Ops logos in `public/logos/ourox-ops-horizontal.svg` and `ourox-ops-icon.svg`
- Synthetic-data banner and intro line
- `lib/ops/` types, streams, SLA rules, SLA helpers
- `data/ops/ops-cases.ts` — 56 synthetic cases across RFR/LAR/PRO/DSP/PRF
- Queue Board grouped by stream, Urgent overlay, priority-then-SLA-pressure sort
- SLA breakdown drawer with cost-of-delay teaching copy
- `tests/ops/ops-sla.test.ts`

## Out of scope (deferred)

Aging/SLA Dashboard, Roster & Assignment, KPI Board, QA workflow, Verity wiring, Arbiter/scoring changes.

---

See Ops-Brief-001 and `Ourox/Ops Layer/00 Ops Layer Plan.md` for full requirements.
