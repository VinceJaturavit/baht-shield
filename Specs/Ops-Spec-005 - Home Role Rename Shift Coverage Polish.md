# Ops-Spec-005 — Home Page, Role Rename, Shift Coverage, Ops Consistency Polish

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-005  
**Issued from:** Ops-Brief-005  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Status:** Implemented locally — pending review before push

---

## 0. Objective

Polish Ourox Ops Phase 1.5. Four deliverables:

1. Add **Ops** to the home page as the first product.
2. Rename Ops roles: `Officer` → **Fraud Analyst**, `Contractor` → **Junior Analyst**.
3. Add a **Shift Coverage** grid to the Roster screen.
4. Align Queue Board / Roster / KPI visual patterns.

Presentation, structure, and synthetic roster content only. No scoring, ML, Verity wiring, live reassignment, or Ops guide.

---

## 1. Locked IP Gate

**Allowed:** home copy, Ops UI label rename, synthetic roster extension, shift coverage derived from roster fields, dense-table consistency polish, tests.

**Forbidden:** real data, scoring/ML, Arbiter changes, new KPI metrics, shift scheduling engine, Ops guide, emoji, card soup, horizontal page scroll.

---

## 2. Part 1 — Home Page

- `app/page.tsx` — Ops first in `PRODUCTS`, CTA `Enter Ops`, lifecycle intro (Ops → Verity → Arbiter).

---

## 3. Part 2 — Role Rename

- `lib/ops/roster-types.ts` — `OpsTeamRole = "Fraud Analyst" | "Junior Analyst"`, `decisionAuthority`, `OpsShiftName`
- `data/ops/ops-team.ts` — renamed roles, extended roster (6 FA, 9 JA)
- `data/ops/ops-queue-ownership.ts` — new ownership copy
- `data/ops/ops-kpi-quality.ts` — renamed quality score types
- `lib/ops/roster.ts`, `lib/ops/kpi.ts` — role logic updated
- Ops components — all user-facing labels updated

---

## 4. Part 3 — Shift Coverage

- `lib/ops/shift-coverage.ts` — `getShiftCoverage`, `getShiftCoverageStatus`, `getShiftHandoffCount`
- `components/ops/OpsShiftCoverageGrid.tsx` — full-width grid below roster + daily ownership
- Coverage rule: Covered = present Fraud Analyst with decision authority + present Junior Analyst

---

## 5. Part 4 — Consistency Polish

- `components/ops/OpsIndicatorLabel.tsx` — shared indicator + label component
- `OpsKpiMetricBadge.tsx` — refactored to use `OpsIndicatorLabel`
- Dense table patterns aligned across Roster, Queue ownership, Shift Coverage, KPI

---

## 6. Tests

- `tests/ops/ops-roster.test.ts` — role rename guards
- `tests/ops/ops-kpi.test.ts` — role-appropriate metrics
- `tests/ops/ops-shift-coverage.test.ts` — coverage rules

---

## 7. Done Criteria

- Home lists Ops first with `/ops` link and `Enter Ops` CTA
- Active Ops UI/data uses Fraud Analyst / Junior Analyst only
- Shift Coverage grid on Roster with Day / Evening / Night-or-on-call
- No legacy role labels in active app/components/lib/data
- `npm test` and `npm run build` pass
- No Arbiter scoring/ML changes
- Ops guide deferred
