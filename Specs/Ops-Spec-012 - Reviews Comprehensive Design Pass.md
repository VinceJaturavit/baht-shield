# Ops-Spec-012 — Reviews Comprehensive Mock Review + Design Pass

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-012  
**Issued from:** Ops-Brief-012  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Improve the existing Reviews feature without adding new signals, data, or live AI.

This loop does two things:

1. Deepens the deterministic mock copilot review from a short scorecard into a comprehensive review draft usable by both the analyst in a 1:1 and the manager / upper-level reviewer.
2. Improves the Reviews page design so the generated review is readable, confident, and doctrine-aligned.

This is **presentation + mock-output richness only**.

No new metrics. No new analyst data. No new synthetic datasets. No live API. No scoring. No ML. No Verity wiring.

---

## Implementation summary (Ops-Spec-012)

### Mock copilot output (three-part structure)

1. **Compact five-signal scorecard** — workload context, throughput, quality, behaviour, reliability (separate lines, no blended score).
2. **Analyst-facing developmental summary** — what went well, what to improve, workload reassurance, 1–2 focus actions; written to the analyst.
3. **Manager decision summary** — disposition + reason, strongest evidence, main risk/coaching point, 1–2 manager actions, confidence/caveats, human-in-the-loop closing line.

Types: `lib/ops/reviews-copilot-types.ts`  
Generator: `lib/ops/reviews-copilot.ts` (deterministic per analyst, existing review-pack fields only)

### Design pass

- Generated review is the dominant element (copilot panel moved above supporting signal detail).
- Primary **Generate review** button with accessible focus; **Regenerate** and **Clear** when shown.
- Disposition prominent in manager summary with status colour + label (never colour alone).
- Readable hierarchy: 13px body, Montserrat headings, Space Mono metadata.
- Calm structured pack; no card soup; no horizontal scroll.
- Rubric panel and roadmap panel retained as secondary expandable panels.

### Files changed

- `lib/ops/reviews-copilot-types.ts`
- `lib/ops/reviews-copilot.ts`
- `components/ops/reviews/OpsMockCopilotPanel.tsx`
- `components/ops/reviews/OpsReviewPack.tsx`
- `components/ops/reviews/OpsReviewPackHeader.tsx`
- `components/ops/reviews/OpsReviewSignalSection.tsx`
- `components/ops/reviews/OpsReviewsLanding.tsx`
- `components/ops/reviews/OpsReviewAnalystList.tsx`
- `components/ops/reviews/OpsCopilotRubricPanel.tsx`
- `components/ops/reviews/OpsCopilotRoadmapPanel.tsx`
- `tests/ops/ops-reviews-copilot.test.ts`

### Guardrails confirmed

- New signals added? **no**
- New data added? **no**
- Live API built? **no**
- API key used? **no**
- Other Ops screens changed? **no**
- Arbiter scoring/ML changed? **no**

---

## Locked IP gate (unchanged from brief)

Allowed labels: RFR, DSP, LAR, PRO, PRF, Urgent, Fraud Analyst, Junior Analyst.

Forbidden: real customer/employer data, TrueMoney/Kraken/Payward names, SignalOS, legacy Officer/Contractor labels in active surfaces, live Claude API, new signals/metrics, emoji, card soup, horizontal scroll.

---

## Done criteria

- [x] Mock copilot output deepened to three-part structure
- [x] Scorecard retains five separate signals
- [x] Analyst-facing summary with evidence, reassurance, focus actions
- [x] Manager decision summary with disposition, evidence, actions, caveats, human-in-loop line
- [x] Deterministic per analyst; rubric obeyed; hard workload not penalised
- [x] Rubric panel retained
- [x] Roadmap panel retained
- [x] Generate / Regenerate / Clear actions
- [x] Disposition with colour + label
- [x] Design hierarchy improved; generated review dominant when shown
- [x] Tests and build pass
- [x] No commit/push without approval
