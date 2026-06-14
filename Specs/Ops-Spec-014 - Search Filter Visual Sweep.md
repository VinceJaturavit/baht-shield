# Ops-Spec-014 — Search/Filter + Whole-Layer Visual Consistency Sweep

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-014  
**Issued from:** Ops-Brief-014  
**Build mode:** Cursor AUTO mode — single session (search/filter + visual sweep)  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## Implementation summary

### Reusable filter/search pattern

- `lib/ops/filters.ts` — text normalisation, AND-combine helpers, case/member filter functions
- `components/ops/filters/OpsFilterBar.tsx` — shared bar: search, result count, clear-all
- `components/ops/filters/OpsSearchInput.tsx` — keyboard-accessible search input with visible focus
- `components/ops/filters/OpsFilterSelect.tsx` — stream / bucket / role selects
- `components/ops/filters/OpsFilterEmptyState.tsx` — calm no-match states

### Queue Board filters

- Text search on case id, stream, type, urgency reason, priority tier, owner, status, queue
- Stream filter: All / RFR / LAR / PRO / DSP / PRF / Urgent (Urgent = priority tier)
- SLA state filter: All / Fresh / Mid / At-Risk / Breached (aging bucket)
- Result count, clear-all, empty state
- Case selection + SLA drawer preserved (drawer independent of filter state)

### Aging & SLA filters

- Same text + stream + bucket pattern (stream excludes Urgent)
- Filters apply before grouping; waiting-on-us vs external split preserved via grouped totals
- Empty state when no records match

### Roster filters

- Shared member filter bar on: Roster, Weekly Schedule, Fairness, Performance, QA
- Name search + role filter (Fraud Analyst / Junior Analyst)
- Role grouping preserved; formulas unchanged

### Reviews landing filters

- Name search + role filter on analyst list
- Open review action unchanged

### Visual consistency sweep (light)

- Reviews landing type scale aligned to Ops workspace pattern (`text-sm` title, `text-xs` intro)
- Reviews analyst list table border/padding aligned to Roster tables
- Aging intro opacity aligned to Queue (`text-ourox-ink/55`)
- KPI Individual thin-data caption when majority of rows show zero closed-case volume
- Status indicators: no drift fixes needed — `OpsIndicatorLabel` already consistent

### Tests

- `tests/ops/ops-filters.test.ts` — helper and AND-combine coverage
- All existing Ops tests pass

### Guardrails

- No data/model/formula changes
- No non-Ops changes
- No forbidden names, SignalOS, legacy roles, or emoji in active surfaces
