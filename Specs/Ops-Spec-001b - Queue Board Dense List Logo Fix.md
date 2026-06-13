# Ops-Spec-001b — Queue Board Dense List + Logo Fix

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-001b  
**Issued from:** Ops-Brief-001b  
**Build mode:** Cursor AUTO mode, one-session revision  
**Target executor:** Cursor  
**Status:** Implemented locally — pending review before push

---

## Objective

Revise `/ops` Queue Board presentation and Ops logo assets. No data-model change, no new screens, no scoring/ML.

## Part 1 — Ops logo

- Copy vault assets from `07 Reference/LOGO/Ourox Ops LOGO/` into `public/logos/`
- Render `ourox-ops-horizontal.svg` in `/ops` workspace header
- Render `ourox-ops-icon.svg` in `OuroxShell` Ops breadcrumb (not default Ourox ring)

## Part 2 — Dense queue list

Replace card grid with dense ranked list/table:

- **Urgent overlay** — cross-stream urgent cases, dense list at top
- **Main queue** — unified list excluding urgent cases, stream filter (All / RFR / LAR / PRO / DSP / PRF)
- **Columns:** Priority, Case ID, Stream, Type/reason, SLA status, SLA due, Remaining, Age, Owner, Status
- **Sort:** priority tier then SLA pressure (`sortOpsCases`)
- **Interaction:** row click opens existing `OpsSlaDrawer`
- **Styling:** dark doctrine, indicator + label (not color alone), no card soup

## Files

| Area | Path |
|------|------|
| Queue board | `components/ops/OpsQueueBoard.tsx` |
| Dense list | `components/ops/OpsQueueList.tsx` |
| Queue helpers | `lib/ops/queue.ts` |
| Workspace header | `components/ops/OpsWorkspace.tsx` |
| Shell breadcrumb | `components/ourox/OuroxShell.tsx` (unchanged — already Ops icon) |
| Logos | `public/logos/ourox-ops-horizontal.svg`, `ourox-ops-icon.svg` |
| Tests | `tests/ops/ops-sla.test.ts` |

## Out of scope

Aging dashboard, roster, KPI, QA, Verity, Arbiter/scoring, ML, new data generation, other Ops screens.

## Guardrails

Synthetic only · non-identifying stream labels · no TrueMoney/Kraken/Payward · no SignalOS · no emoji · no Arbiter changes
