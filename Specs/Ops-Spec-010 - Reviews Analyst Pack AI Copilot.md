# Ops-Spec-010 — Reviews: Analyst Review Pack + Mock AI Copilot

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-010  
**Issued from:** Ops-Brief-010  
**Build mode:** Cursor AUTO mode. Scope is large; split into two AUTO sessions if needed.  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Build a new top-level Ops side-nav item: **Reviews**.

The Reviews tool lets a fraud-ops manager:

1. Pick an analyst from a grouped analyst list.
2. Open a compact per-analyst review pack.
3. See Workload, Performance, Quality, Behaviour, and Reliability in one place.
4. Generate a deterministic mock AI-assisted review draft.
5. See the exact review rubric used by the mock copilot.
6. See the future real-API roadmap without building a live API call now.

This is the Phase 1.5 capstone for the people-management suite.

---

## Implementation summary

Implemented in baht-shield-app:

- **Nav:** Reviews top-level item between Roster and KPI
- **Landing:** analysts grouped by Fraud Analyst / Junior Analyst with headline + Open review
- **Review pack:** five separate signal sections assembled from existing fairness, performance, QA, and weekly-schedule helpers
- **Mock copilot:** deterministic generator in `lib/ops/reviews-copilot.ts`; no API call
- **Rubric:** verbatim constant in `lib/ops/reviews-copilot-rubric.ts`; displayed in expandable panel
- **Roadmap:** expandable panel describing future Claude API upgrade

### Files added

```text
lib/ops/reviews-types.ts
lib/ops/reviews.ts
lib/ops/reviews-copilot-rubric.ts
lib/ops/reviews-copilot-types.ts
lib/ops/reviews-copilot.ts
components/ops/reviews/OpsReviewsWorkspace.tsx
components/ops/reviews/OpsReviewsLanding.tsx
components/ops/reviews/OpsReviewAnalystList.tsx
components/ops/reviews/OpsReviewPack.tsx
components/ops/reviews/OpsReviewPackHeader.tsx
components/ops/reviews/OpsReviewSignalSection.tsx
components/ops/reviews/OpsMockCopilotPanel.tsx
components/ops/reviews/OpsCopilotRubricPanel.tsx
components/ops/reviews/OpsCopilotRoadmapPanel.tsx
tests/ops/ops-reviews.test.ts
tests/ops/ops-reviews-copilot.test.ts
```

### Files modified

```text
components/ops/OpsSideNav.tsx
components/ops/OpsWorkspace.tsx
```

---

## 24. Record Roadmap in Spec

Mock now. Real API later. Future implementation would add a server API route, use an Anthropic API key as a server env var, send the same rubric as system context plus structured analyst data, and return a generated review. Ops-Spec-010 does not build the API route, does not use a key, and does not call a live model.

---

## Done criteria (verified)

- Reviews top-level side-nav item
- Landing lists all analysts grouped by role with headline and Open review
- Per-analyst pack: Workload, Performance, Quality, Behaviour, Reliability — five distinct signals, no collapsed score
- Workload labelled as distribution, not performance; hard work never penalised
- Performance shows raw volume + weighted throughput + role extras
- Quality shows QA score, pass/fail samples, defect, low-sample caveat (n<5)
- Behaviour shows urgent pickup vs role-expected share
- Reliability shows assigned/leave/off days, handoffs, attendance summary
- Mock copilot: deterministic, five-line scorecard, disposition label, manager actions, human-in-loop closing line
- Rubric displayed verbatim in expandable panel
- Roadmap panel visible; no API route, no key, no live call
- Read-only; dense dark UI; no emoji; no card soup; no horizontal scroll
- `npm test` pass · `npm run build` pass · guardrails clean
