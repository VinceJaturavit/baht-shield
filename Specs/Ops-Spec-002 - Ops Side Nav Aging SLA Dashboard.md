# Ops-Spec-002 — Ops Side-Nav + Aging/SLA Dashboard

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-002  
**Issued from:** Ops-Brief-002  
**Build mode:** Cursor AUTO mode, one-session scope  
**Status:** Implemented locally — pending review before push

---

## Objective

Add persistent compact left side-nav inside `/ops`, move Queue Board behind workspace toggle (Urgent / By-stream), and build Screen 2: Aging & SLA Dashboard from existing synthetic ops cases. No new data model.

## Delivered scope

- `components/ops/OpsSideNav.tsx` — compact left rail (Queue Board, Aging & SLA, Roster/KPI placeholders)
- `components/ops/OpsWorkspace.tsx` — workspace state, side-nav + main content layout
- `components/ops/OpsQueueWorkspace.tsx` — Queue Board workspace wrapper
- `components/ops/OpsQueueBoard.tsx` — Urgent / By-stream toggle (no vertical stack)
- `lib/ops/aging.ts` — SLA-percent buckets, waiting split, grouping helpers
- `components/ops/OpsAgingDashboard.tsx` + bucket table, group toggle, legend, waiting split
- `tests/ops/ops-aging.test.ts`

## Aging logic

- **SLA elapsed %:** `ageMinutes / rule.durationMinutes` (from existing `slaRuleRef` + `OPS_SLA_RULES`)
- **Buckets:** Fresh 0–25% · Mid 25–75% · At-Risk 75–100% · Breached >100%
- **Waiting split:** `Awaiting external` → external; all other active statuses → on us
- **Closed cases:** excluded from active aging counts
- **Group by:** queue (default) · owner · case type

## Out of scope (deferred)

Roster & Assignment, KPI Board, row expansion drawer, new data generator, Arbiter/scoring changes.

---

See Ops-Brief-002 and `Ourox/Ops Layer/00 Ops Layer Plan.md` for full requirements.
