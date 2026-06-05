# Arbiter Phase 1 — Rules Engine Documentation

## File: `phase1_decisioning.jdm.json`

This file is a GoRules JDM (JSON Decision Model) executed by `@gorules/zen-engine`.  
**All rule conditions live here. No rule conditions are duplicated in TypeScript.**

---

## Hit Policy: COLLECT

The decision table uses **COLLECT** hit policy. This means every rule whose conditions
match the input is fired and added to the output array. This allows:

1. All relevant rules (both explicit named rules R1–R6 and the score-band catch-all)
   to fire simultaneously.
2. The rules adapter (`lib/arbiter/rules.ts`) to return the **full set of fired rules**
   to the UI for explainability — the user sees every rule that triggered, not just the
   final decision.
3. Precedence to be applied cleanly in the adapter without re-evaluating any conditions.

---

## Precedence: BLOCK > REVIEW > STEP_UP > Score Band

Why BLOCK always wins:

- A BLOCK rule (R2 impossible travel, R3 mule target, R4 new-user cap) represents a
  hard regulatory or fraud-safety constraint. Allowing a transaction when a hard
  constraint fires would create liability regardless of the composite score.
- BLOCK rules are never overridden by a lower score band.

Why REVIEW beats STEP_UP:

- REVIEW requires a human analyst decision. STEP_UP only requests additional authentication.
  REVIEW is the higher-friction outcome and always takes precedence over a score-band STEP_UP.

Why the score band is the catch-all:

- The score band guarantees a decision for every event, even when no explicit rule fires.
- It encodes the aggregate fraud signal when no single deterministic rule is sufficient.

Precedence is applied by `lib/arbiter/rules.ts` as a simple sort/pick on the COLLECT
output array. The adapter does not re-evaluate any conditions — it only orders the JDM's
own output.

---

## Why `_scenario_label` is excluded

The `_scenario_label` field is a synthetic annotation attached to events by the
Mockingbird data generator for QA and demo purposes. It describes what fraud scenario
the event was designed to represent.

If `_scenario_label` entered the rules engine:

- Rules could produce different outcomes for identical financial signals depending
  on how the event was labelled — destroying the independence of the scoring pipeline.
- It would constitute using a synthetic label as a ground-truth signal, which is an
  IP and methodology risk.

The JDM input schema does not include `_scenario_label`. The rules adapter
(`lib/arbiter/rules.ts`) passes only safe fields: event signals, computed features,
and the composite score. `stripScenarioLabel()` in `lib/arbiter/contract.ts` enforces
this at the API layer before any scoring begins.

---

## Rules Summary

| Rule ID     | Condition                                              | Action   | Reason Code              |
|-------------|--------------------------------------------------------|----------|--------------------------|
| R1          | amount_thb > 50000 AND has_facial_scan = false         | STEP_UP  | TH_FACIAL_SCAN_REQUIRED  |
| R2          | geo_velocity > 900 km/h                               | BLOCK    | IMPOSSIBLE_TRAVEL        |
| R3          | beneficiary_risk_tier in [black, dark_grey]            | BLOCK    | MULE_TARGET_PROHIBITED   |
| R4          | account_age_days < 7 AND daily_cumulative_thb > 50000  | BLOCK    | NEW_USER_DAILY_CAP       |
| R5          | withdrawal_after_deposit > 0.9 AND age < 30           | REVIEW   | RAPID_PASS_THROUGH       |
| R6          | device_account_count > 3                              | REVIEW   | DEVICE_SHARING           |
| SCORE_BAND  | score >= 75                                           | BLOCK    | SCORE_HIGH_RISK          |
| SCORE_BAND  | score in [50, 75)                                     | REVIEW   | SCORE_MEDIUM_RISK        |
| SCORE_BAND  | score in [25, 50)                                     | STEP_UP  | SCORE_LOW_RISK           |
| SCORE_BAND  | score < 25                                            | APPROVE  | SCORE_MINIMAL_RISK       |

---

## How to Run Rules Tests (Spec-001b)

### Path A — Vitest (primary)

```bash
npm test
# or, just the rules file:
npx vitest run tests/arbiter/rules.test.ts
```

`@gorules/zen-engine` loads in Vitest's Node environment.
R1–R6 tests use the real JDM. Score-band tests are in a separate `describe` block.

### Path B — Integration harness (secondary, CI-friendly)

```bash
npm run test:arbiter-rules
# or directly:
node tests/arbiter/rules.integration.mjs
```

This is a plain Node.js script that loads `@gorules/zen-engine` directly.
It exits non-zero if the engine fails to load or any assertion fails.
It does not fall back to score-band logic on engine failure.

### Why R1–R6 tests hold score ≤ 24

Each R1–R6 test sets `score = 10`, which falls in the APPROVE score band (< 25).
With no named rule active, the result would be APPROVE.
When the named rule fires, it overrides APPROVE.
If the rule is removed from the JDM, the result falls back to APPROVE and the
`expect(result.action).toBe(...)` assertion fails — proving the test is rule-specific.

### Why fallback tests are separate

Score-band fallback tests (score 80/60/30/10 → BLOCK/REVIEW/STEP_UP/APPROVE) use
clean features with no named-rule-triggering values. They are in a clearly labelled
`describe` block and must not be used as evidence that R1–R6 work.

### Why BLOCK precedence is proven separately

The precedence test uses score = 10 (APPROVE band) + `beneficiary_risk_tier = "black"`.
It asserts `BLOCK` and `not APPROVE`. This proves R3 overrides the score band.

### Why native addon failure must not be masked

If `@gorules/zen-engine` fails to load, the integration harness exits with code 1
and lists options for Tower. It never silently falls back to TypeScript score-band logic,
which would produce the same-looking output but prove nothing about the JDM.

---

## Phase 2 / Extension Notes

- Phase 2 (Tuning Loop) may adjust score-band thresholds or add new rules.
- Threshold changes are made only in this JDM file — no TypeScript changes required.
- New rules follow the same COLLECT + precedence pattern.
