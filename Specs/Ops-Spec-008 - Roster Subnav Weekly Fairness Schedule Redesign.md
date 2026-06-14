# Ops-Spec-008 — Roster Sub-Nav, Weekly Fairness, Schedule Redesign

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-008  
**Issued from:** Ops-Brief-008  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Improve the Roster experience by breaking the current long scroll into focused sub-views and adding a new **Weekly Fairness** view.

This loop builds:

1. Roster sub-nav: Roster · Daily Ownership · Weekly Schedule · Fairness
2. New Fairness view: weighted difficulty only, role-aware comparison, read-only imbalance signal
3. Weekly Schedule redesign: cleaner doctrine-aligned presentation, same underlying data
4. Forward note: QA/performance loop will later use volume and SLA-pickup as distinct signals — build none of that now

**Presentation, structure, and derived fairness analysis only.** No live swap, drag-and-drop, editing, QA dashboard, performance dashboard, scoring, ML, or Verity wiring.

---

## 1. Deliverables

| Area | Path |
|------|------|
| Sub-nav | `components/ops/OpsRosterSubNav.tsx` |
| Workspace refactor | `components/ops/OpsRosterWorkspace.tsx` |
| Fairness types | `lib/ops/fairness-types.ts` |
| Fairness logic | `lib/ops/fairness.ts` |
| Fairness view | `components/ops/OpsRosterFairnessView.tsx` |
| Fairness table | `components/ops/OpsFairnessTable.tsx` |
| Fairness summary | `components/ops/OpsFairnessSummary.tsx` |
| Fairness bar | `components/ops/OpsFairnessBar.tsx` |
| Fairness legend | `components/ops/OpsFairnessLegend.tsx` |
| Schedule redesign | `OpsWeeklyScheduleGrid.tsx`, `OpsWeeklyScheduleLegend.tsx`, `OpsWeeklyCoverageSummary.tsx`, `OpsScheduleCell.tsx` |
| Tests | `tests/ops/ops-fairness.test.ts` |

---

## 2. Roster Sub-Nav

Local state `OpsRosterSubView`: `roster` | `dailyOwnership` | `weeklySchedule` | `fairness` (default: Roster).

Sub-nav styled like main Ops side-nav (compact horizontal tabs). Main Ops side-nav unchanged.

| Sub-view | Content |
|----------|---------|
| Roster | Fraud/Junior analyst tables + protected capacity note |
| Daily Ownership | Queue ownership table + shift coverage grid |
| Weekly Schedule | Weekly grid + legend + per-day coverage + cell detail |
| Fairness | Weekly weighted-difficulty fairness (new) |

---

## 3. Weekly Fairness

**Metric:** weighted difficulty ONLY — sum each analyst's weekly assigned-case complexity from weekly schedule per-day task tags.

**Weights (from existing KPI config):**

- RFR ×2.5 · LAR ×2.25 · PRO ×1.75 · DSP ×1.0 · PRF ×0.8
- Urgent = 2.5 · QA = 2.25 · Handoff = 1.5 · Off = 0

**Role-aware:** Fraud Analyst vs Fraud Analyst; Junior Analyst vs Junior Analyst.

**Load tags (±20% from role average):**

- Under-loaded: >20% below average
- At role average: within ±20%
- Over-loaded: >20% above average

**Team status per role:**

- Balanced: no more than one over-loaded and no extreme spread
- Imbalanced: max > 1.4× role average OR min < 0.6× role average OR >1 over-loaded

**Caption:** Fairness = no one handed disproportionately harder work; separate from volume/performance. Read-only — flag imbalance, don't reassign.

---

## 4. Weekly Schedule Redesign

- Rows = people × Mon–Sun
- Compact shift-code + queue-tag cells (`D · RFR`, `OFF`, `LEAVE`)
- Click-for-detail preserved
- No horizontal scroll
- Tighter row height, role group separators, inline legend, muted secondary text
- No data model changes

---

## 5. Forward Note (Ops-Brief-009)

Forward note for Ops-Brief-009: QA / agent-performance should treat **volume** and **SLA-pickup** as separate signals from fairness. Volume measures how many cases an analyst handled. SLA-pickup behaviour measures whether an analyst takes urgent or tight-SLA work, or leaves pressure to others. Neither signal should be mixed into the fairness calculation in Ops-Spec-008.

Do not build volume dashboard, SLA-pickup dashboard, QA dashboard, or performance dashboard in this loop.

---

## 6. Out of Scope

Live schedule editing, drag-and-drop, fairness simulation, QA/performance dashboards, new KPI metrics, Verity wiring, Arbiter integration, scoring, ML, report export.

---

## 7. Guardrails

- Synthetic data only
- Allowed labels: RFR, DSP, LAR, PRO, PRF, Urgent, Fraud Analyst, Junior Analyst
- Forbidden: Officer, Contractor, TrueMoney, Kraken, Payward, SignalOS
- No emoji, no card soup, no horizontal page scroll
- Queue Board, Aging, KPI unchanged
