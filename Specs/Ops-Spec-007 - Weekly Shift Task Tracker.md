# Ops-Spec-007 — Weekly Shift & Task-Assignment Tracker

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-007  
**Issued from:** Ops-Brief-007  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## Objective

Add a **Weekly Schedule** section to the Ops Roster screen showing shift codes, queue/task tags, per-day coverage (Covered/Gap), and read-only cell detail on click.

Read-only workforce-management view. No drag-and-drop, editing, KPI changes, scoring, ML, or Verity wiring.

---

## Deliverables

| Area | Path |
|------|------|
| Types | `lib/ops/weekly-schedule-types.ts` |
| Synthetic data | `data/ops/ops-weekly-schedule.ts` |
| Logic | `lib/ops/weekly-schedule.ts` |
| Grid UI | `components/ops/OpsWeeklyScheduleGrid.tsx` |
| Legend | `components/ops/OpsWeeklyScheduleLegend.tsx` |
| Coverage summary | `components/ops/OpsWeeklyCoverageSummary.tsx` |
| Cell detail | `components/ops/OpsWeeklyCellDetail.tsx` |
| Cell helper | `components/ops/OpsScheduleCell.tsx` |
| Roster integration | `components/ops/OpsRosterWorkspace.tsx` |
| Tests | `tests/ops/ops-weekly-schedule.test.ts` |

---

## Layout

- Full-width below existing roster tables, daily queue ownership, and shift coverage
- Rows = people (Fraud Analysts group, then Junior Analysts group)
- Columns = Mon–Sun (7 fixed columns) + person name
- Cells: compact `D · RFR` / `OFF` / `LEAVE` — no sentences in cells
- Legend above grid
- Per-day coverage summary below grid
- Click cell → read-only detail drawer

---

## Coverage Logic

**Covered** = at least one working Fraud Analyst with decision authority + at least one working Junior Analyst.

**Gap** = missing decision authority or missing intake coverage.

Working = shift code not OFF or LEAVE, attendance Present.

Handoff count = assignments with `taskTag = Handoff` for that day.

---

## Guardrails

- Synthetic only, no real/customer/employer data
- No TrueMoney/Kraken/Payward/SignalOS
- No Officer/Contractor role labels
- No emoji, no card soup, no horizontal page scroll
- No KPI/scoring/ML/Arbiter/Verity changes

---

## Done Criteria

See Ops-Brief-007 full acceptance checklist. Verified locally via `npm test` and `npm run build` before push approval.
