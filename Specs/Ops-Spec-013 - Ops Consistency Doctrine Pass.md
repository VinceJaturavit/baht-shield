# Ops-Spec-013 — Ops Consistency / Doctrine Pass

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-013  
**Issued from:** Ops-Brief-013  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Run a narrow Ops visual-consistency pass.

The main fix is to remove the “card soup” presentation from the per-analyst Review Pack signal sections (Workload, Performance, Quality, Behaviour, Reliability).

These currently render as separate bordered cards in a grid. They should instead read as a calm, sectioned/table-style review pack consistent with the rest of Ops.

This is **not a redesign**.

No new features. No new data. No new screens. No information architecture changes. No new design language. No functional logic changes.

---

## Implementation summary (Ops-Spec-013)

### Review Pack signal sections de-carded

- `OpsReviewPack.tsx`: replaced 2-column card grid with single full-width stacked container (`border border-ourox-obsidianMid/70 bg-ourox-obsidian/20`).
- `OpsReviewSignalSection.tsx`: removed per-signal bordered boxes; stacked sections with light dividers; aligned metric rows to label/value grid; bumped caption and caveat type scale from faint `text-[11px]/55` to `text-xs/60`.

All content retained: title, caption, metric rows, read indicator + tone, caveat, analyst-controlled vs rostering-controlled clarity (via existing captions).

### Light consistency sweep

- `OpsReviewAnalystList.tsx`: table header/cell padding and header casing aligned to Queue/Aging/Roster pattern (`text-[10px] uppercase tracking-wider`, `px-2.5 py-2`).

### Screens left unchanged (already matching)

- Queue Board, Aging & SLA, Roster sub-views, KPI, Guide, `OpsIndicatorLabel` shared component.

### Files changed

- `components/ops/reviews/OpsReviewSignalSection.tsx`
- `components/ops/reviews/OpsReviewPack.tsx`
- `components/ops/reviews/OpsReviewAnalystList.tsx`

### Guardrails confirmed

- New features added? **no**
- New data added? **no**
- New screens added? **no**
- Functional logic changed? **no**
- Shared component changed? **no** (`OpsIndicatorLabel` untouched)
- Non-Ops touched? **no**

---

## Locked IP gate

Allowed labels: RFR, DSP, LAR, PRO, PRF, Urgent, Fraud Analyst, Junior Analyst.

Forbidden: real customer/employer data, TrueMoney/Kraken/Payward names, SignalOS, legacy Officer/Contractor labels in active surfaces, emoji, card soup, horizontal scroll.

---

## Done criteria

- [x] Review Pack signal sections no longer render as boxed-card grid
- [x] Review Pack uses calmer sectioned/table style
- [x] All existing Review Pack content retained
- [x] Status indicators consistent (no shared component change needed)
- [x] Type scale drift fixed in Reviews signal sections and analyst list table
- [x] Table/section style drift fixed in Reviews only
- [x] Matching screens left alone
- [x] No new features, data, screens, signals, or IA changes
- [x] Tests and build pass (see Build Log entry)
