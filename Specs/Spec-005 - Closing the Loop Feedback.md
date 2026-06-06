# Spec-005 — Closing the Loop: From Disagreement to Rule Refinement

**Project:** Ourox / Arbiter
**Spec:** Spec-005
**Issued from:** Brief-005
**Build mode:** Cursor AUTO mode, single-session scope
**Target executor:** Cursor
**Write this spec to:** `Specs/Spec-005 - Closing the Loop Feedback.md`
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Add a focused **Feedback — closing the loop** view to Arbiter.

This view demonstrates the Ourox thesis:

> investigation / label outcomes surface model-vs-rule misses → analyst identifies a pattern → proposes a rule refinement → back-tests it → human decides whether to deploy.

This is an analytical demonstration only. The candidate rule is simulated and back-tested. It is **not** written to the live JDM.

---

## 1. Locked IP Gate

Allowed: analysis of existing static ML artifacts, UI display, back-test simulation, guide/roadmap copy update, synthetic labels for evaluation, `_scenario_label` as evaluation/label metadata only.

Forbidden: no live JDM changes, no `/api/arbiter/score` changes, no scoring/rule/weight changes, no data changes, no new ML training, no runtime Python, no live Verity → Arbiter wiring, no SignalOS reintroduction.

`scenario-exclusion.test.ts` must still pass.

---

## 2. Build Results (Spec-005 session)

### Analysis findings (from static artifacts)

| Item | Value |
|------|-------|
| ML-high / rule-low count | **84** (artifact `comparison_type: ML_HIGH_RULE_LOW`) |
| Dominant miss typology | **Sleeper activation** — 50 cases (60%) |
| Second typology | APP scam cash-out — 22 cases (26%) |
| Dominant feature pattern | **Pass-through on dormant account** — withdrawal_after_deposit > 0.5 on account_age_days > 90 |
| Cluster stats (sleeper misses) | Avg withdrawal-after-deposit 0.83; 0% new beneficiary; avg ML prob 99.5%; avg rule score ~35 |

Note: Brief expected 73 misses with APP scam dominance; actual post–Spec-004 artifacts show sleeper_activation as the dominant cluster. Implementation follows actual data.

### Candidate refinement (simulation only)

```
R_SLEEPER_PASS_THROUGH_DORMANT
IF withdrawal_after_deposit > 0.65
AND account_age_days > 90
THEN REVIEW
Reason: SLEEPER_PASS_THROUGH_REVIEW
```

### Back-test results (labelled set, n=353)

| Metric | Baseline | Candidate (simulated) | Delta |
|--------|----------|----------------------|-------|
| Precision | 93.6% | 90.1% | −3.5 pp |
| Recall | 47.7% | 83.0% | +35.3 pp |
| FPR | 2.5% | 7.0% | +4.5 pp |
| F1 | 63.2% | 86.4% | +23.2 pp |
| TP / FP / FN | 73 / 5 / 80 | 127 / 14 / 26 | +54 TP, +9 FP, −54 FN |

| Miss-cluster impact | Value |
|---------------------|-------|
| ML-high / rule-low misses caught | **57 / 84** (67.9%) |
| Added false positives | **9** |

### Files created

- `lib/arbiter/feedback-analysis.ts` — miss grouping helpers
- `lib/arbiter/feedback-backtest.ts` — compound-rule simulation adapter (reuses `metrics.ts`)
- `app/arbiter/feedback/page.tsx`
- `components/arbiter/feedback/*` — 8 workspace panels

### Files modified

- `components/arbiter/ArbiterSectionNav.tsx` — fourth tab
- `app/guide/page.tsx` — roadmap update

### Guardrails

| Check | Result |
|-------|--------|
| Live JDM changed | **no** |
| `/api/arbiter/score` changed | **no** |
| scoring/rules/weights changed | **no** |
| data/arbiter/ml changed | **no** |
| scenario-exclusion.test.ts | **6/6 passed** |
| npm test | **178/178 passed** |
| npm run test:slow | **3/3 passed** |
| npm run build | **clean** |
| SignalOS (app/components) | **none** |
| Arbiter emoji | **none** |

---

## 3. Done Criteria

All done-criteria from Brief-005 verified in this session. Commit deferred pending Principal approval.
