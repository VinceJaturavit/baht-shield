# Ops-Spec-004 — Layout Fix + KPI Board

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-004  
**Issued from:** Ops-Brief-004  
**Build mode:** Cursor AUTO mode, one-session scope  
**Status:** Implemented locally — pending review before push

---

## Objective

Complete the Ourox Ops MVP by fixing layout overflow across all `/ops` workspaces and building Screen 4: **KPI Board**. No new data model, no new generated cases, no live simulation, scoring, or ML.

## Part 1 — Layout fix (no horizontal scroll)

### Roster

- `OpsRosterWorkspace.tsx` — Officers, Contractors, and Daily queue ownership stack vertically full-width (removed side-by-side grid)
- `OpsRosterTable.tsx` — condensed columns: role under name, shift + attendance in Status, compact streams, compact load bar; removed `min-w-[720px]`
- `OpsRosterLoadBar.tsx` — compact mode (`6 / 8`, protected count, shorter bar)
- `OpsQueueOwnershipTable.tsx` — shortened headers, `table-fixed`, removed `min-w-[800px]`

### Queue Board

- `OpsQueueList.tsx` — removed `min-w-[980px]` and `overflow-x-auto`; combined SLA status + remaining into one column; shortened headers

### Aging & SLA

- `OpsAgingBucketTable.tsx` — shortened bucket/waiting headers, `table-fixed`, removed `min-w-[880px]`

### KPI

- Dense tables with `table-fixed` / full-width layout; no card soup

## Part 2 — KPI data logic

### Types & config

- `lib/ops/kpi-types.ts` — `OpsKpiView`, team/individual/queue-health interfaces
- `data/ops/ops-kpi-config.ts` — `OPS_STREAM_COMPLEXITY_WEIGHTS` (RFR ×2.5, LAR ×2.25, PRO ×1.75, DSP ×1.0, PRF ×0.8)
- `data/ops/ops-kpi-quality.ts` — synthetic illustrative officer/contractor quality scores by member id
- `lib/ops/kpi.ts` — weight helpers, team summary, individual KPIs, queue health

### Derivation rules

- **Throughput:** closed cases count raw; weighted sum uses stream complexity weights
- **Team SLA:** active (non-closed) cases; breached bucket counts against compliance; at-risk is warning only
- **Officers:** owned closed cases for throughput; SLA on active decision streams (RFR/LAR/PRO); QA quality + escalation accuracy from synthetic quality config
- **Contractors:** closed intake cases (DSP/PRF) attributed round-robin among stream-eligible contractors; intake SLA on attributed active intake; evidence completeness + SOP adherence from synthetic quality config
- **Queue health:** per-stream open backlog, at-risk/breached counts, SLA compliance, weighted backlog

### Fairness copy (visible in UI)

- Ranking on cases-closed punishes hard, slow, high-stakes work
- Officers and contractors measured differently by role

## Part 3 — KPI UI

- `OpsSideNav.tsx` — KPI activated (removed Coming placeholder)
- `OpsWorkspace.tsx` — KPI workspace wired
- `OpsKpiWorkspace.tsx` — header, fairness captions, view toggle, weighting note
- `OpsKpiViewToggle.tsx` — Team / Individual / Queue health
- `OpsKpiTeamView.tsx` — team rollup metrics
- `OpsKpiIndividualView.tsx` — role-grouped dense table
- `OpsKpiQueueHealthView.tsx` — per-stream health table
- `OpsKpiWeightingNote.tsx` — complexity weight legend
- `OpsKpiMetricBadge.tsx` — indicator + label status

## Tests

- `tests/ops/ops-kpi.test.ts` — weights, throughput, role metrics, team/queue health
- `tests/ops/ops-roster.test.ts` — KPI nav active
- Existing ops tests unchanged and passing

## Guardrails

- Synthetic only; existing `ops-cases.ts` + `ops-team.ts` reused
- No new case fields or data model
- No TrueMoney/Kraken/Payward on public surfaces
- No user-visible SignalOS reintroduced
- No emoji in Ops UI
- No Arbiter scoring/ML/JDM changes

## No side-scroll check

- Queue Board: compact grid, no min-width overflow
- Aging & SLA: table-fixed, shortened headers
- Roster: stacked full-width sections, condensed columns
- KPI: table-fixed dense panels
