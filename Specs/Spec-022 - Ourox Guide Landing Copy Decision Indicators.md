# Spec-022 — Ourox Guide + Landing Copy + Arbiter Decision Indicators

**Project:** Ourox / baht-shield app
**Spec:** Spec-022
**Issued from:** Brief-022
**Target executor:** Cursor
**Reference doctrine:** `07 Reference/Design Doctrine/Design Doctrine — Google-Inspired Enterprise UX for AI-Built Products.md`
**Push discipline:** Execute locally, run build/tests, report before push. Do not push without approval.

---

## 0. Objective

Improve the public-facing Ourox experience before Phase 3 ML.

1. Tighten the landing attribution so it is project-led, not overly personal.
2. Replace remaining Arbiter decision-pill emoji with professional indicators.
3. Add a comprehensive living Ourox guide so reviewers can understand the platform, products, workflow, boundaries, and roadmap.

This is **copy, content, and styling only**.

---

## 1. Locked IP Gate

May change: landing copy, guide content, guide route/layout, navigation/link placement, decision-pill styling, icon/indicator styling, visual hierarchy, spacing, typography.

Must not change: scoring logic, feature logic, rule logic, JDM, weights, synthetic data, Mockingbird data, `/api/arbiter/score`, Phase 3 ML, SHAP, calibration, Verity functionality, Arbiter functionality.

All public copy must remain separation-compliant.

---

## 2. Out of Scope

No scoring/rules/JDM/weights/data changes, no `/api/arbiter/score` change, no Phase 3 ML, no new fraud typology, no new Verity/Arbiter feature, no marketing splash, no animation, no decorative guide gimmicks, no employer-specific storytelling.

---

## 3. Implementation Summary (Build Node record)

### Part 1 — Landing Attribution

**File:** `app/page.tsx`

Replaced attribution block with spec-approved copy:
- Project-led framing: "Ourox is an argument for treating analyst-curated intelligence as a first-class fraud-detection layer."
- Removed personal-narrative lines: "most of it in the investigations seat", "working cases, not tuning the score", "I'm teaching myself to own".
- Synthetic-data honesty line preserved.
- LinkedIn and GitHub links preserved using existing URL constants.
- Added calm guide entry block above product entries with "Read the guide" CTA linking to `/guide`.

### Part 2 — Arbiter Decision Indicators

**Files changed:**
- `lib/arbiter/scenario.ts` — zeroed `icon` field in `DECISION_META` (was emoji: ⛔ ✅ 🔐 🔍)
- `components/arbiter/ArbiterDecisionBadge.tsx` — new reusable badge: small SVG dot + text label, dark-theme safe, color never alone
- `components/arbiter/ArbiterEventTable.tsx` — replaced local `DecisionChip` with `ArbiterDecisionBadge`
- `components/arbiter/ArbiterExplainabilityDrawer.tsx` — replaced local `DecisionBadge` and fired-rules inline chip with `ArbiterDecisionBadge`

**Decision color semantics preserved:**
- BLOCK = red
- REVIEW = amber
- STEP_UP = blue
- APPROVE = green

### Part 3 — Ourox Guide

**Files changed:**
- `app/guide/page.tsx` — new dedicated `/guide` route, 8 sections
- `components/ourox/OuroxShell.tsx` — added "Guide" to nav

**Guide sections:**
1. What Ourox is
2. The two products
3. Verity — features & functions
4. Arbiter — features & functions
5. How they connect — the loop
6. Typologies demonstrated
7. Synthetic data & boundaries
8. Roadmap (Current / Next / Later)

---

## 4. Done Criteria Checklist

- [x] Spec written to repo Specs area
- [x] Design Doctrine read before implementation
- [x] Landing attribution replaced with Part 1 copy
- [x] Personal-narrative / "teaching myself" lines removed
- [x] LinkedIn/GitHub links preserved
- [x] Landing copy separation-compliant
- [x] Guide link prominent from landing
- [x] Comprehensive `/guide` route exists
- [x] Guide covers all eight required sections
- [x] Guide includes living roadmap section
- [x] Synthetic-data boundary visible
- [x] Arbiter decision emoji replaced with professional indicators
- [x] Decision indicators include marker/glyph + text
- [x] Color is never the only status cue
- [x] No emoji remain in Arbiter surfaces
- [x] No scoring logic changed
- [x] No rules/JDM changed
- [x] No weights changed
- [x] No data changed
- [x] `/api/arbiter/score` unchanged
- [x] No Phase 3 ML implemented
- [x] No SignalOS reintroduced
