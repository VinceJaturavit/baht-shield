# Verity-Spec-P3-002 — Scenario Colour Fix + Comprehensive Reviewer Guide

**Project:** Ourox / Verity Phase 3  
**Spec:** Verity-Spec-P3-002  
**Issued from:** Verity-Brief-P3-002  
**Build mode:** Cursor AUTO mode. Split if needed: colour fix first, guide second.  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

This loop has two narrow goals:

1. Fix the Verity scenario colour bug in `lib/scenario-utils.ts`.
2. Expand the main `/guide` into a comprehensive public-safe reviewer overview of the whole Ourox platform.

This is not a feature build. No new data. No new workflows. No live API. No agent functionality changes. No Ops/Arbiter functional changes.

---

## 1. Build Split Instruction

Single AUTO session preferred. If split:

- **Session A:** SCENARIO_COLORS fix, PATTERN_FAMILY_COLORS check, usage verification, tests/build report.
- **Session B:** main `/guide` reviewer overview, sticky index, navigation map, public-safe copy, tests/build report.

---

## 2. Locked IP Gate

**Allowed:** scenario colour token fix; pattern family colour fix only if same white-on-dark bug; main `/guide` content expansion; guide sticky index update; links to existing product pages; public-safe platform explanation; synthetic-data boundary statement; build log update; tests/build.

**Forbidden:** real/customer/employer data; Kraken/Payward/SignalOS names; production claims; live API; new agentic functionality; Verity route restructuring; Ops/Arbiter functional changes; new screens except guide expansion; new design language; card soup; emoji; horizontal scroll.

---

## PART 1 — Scenario Colour Fix

### Fix `SCENARIO_COLORS`

Update `lib/scenario-utils.ts`. Replace identical `bg-white text-signal-body` pills with distinct dark-appropriate tinted pills:

| Scenario | Mapping |
|----------|---------|
| Onboarding Mule Farm | `border border-risk-high/40 bg-risk-high/10 text-risk-high` |
| Sleeper Mule Activation | `border border-signal-amberBorder bg-signal-amberSubtle text-signal-amber` |
| APP Scam Cash-out Ring | `border border-risk-critical/40 bg-risk-critical/10 text-risk-critical` |
| Background | `border border-signal-border bg-signal-muted text-signal-secondary` |

Verify usages: Verity dashboard (`app/verity/page.tsx`), agent selector/components (`VerityAgentCaseSelector`, `VerityAgentStagePanel`, `VerityAgentDecisionDraft`).

### Check `PATTERN_FAMILY_COLORS`

Fix only if same `bg-white text-signal-body` bug exists. Otherwise leave unchanged.

---

## PART 2 — Comprehensive Ourox Reviewer Guide

Update `app/guide/page.tsx` — add Reviewer overview near top; expand Arbiter / Verity / Ops; add Agentic investigation, AI philosophy, Synthetic boundary, Where to click; update sticky index.

**Sticky index anchors:** reviewer-overview, what-ourox-is, lifecycle-loop, arbiter, verity, agentic-investigation, ops, ai-philosophy, synthetic-boundary, where-to-click (+ typologies, technical-architecture, roadmap).

**Required content:** what Ourox is; three pillars + lifecycle loop; Arbiter summary (transparent scoring, rules, tuning, ML second-opinion, feedback); Verity summary (investigation, patterns, scenarios); agentic investigation at `/verity/agent` (human-gated four-stage flow, deterministic evidence, audit trail, decision-support not verdict); Ops summary linking `/ops/guide`; AI philosophy ("AI compresses the work around a decision, not the decision"); synthetic-data boundary; where-to-click map.

---

## PART 3 — Tests and Guardrails

- `tests/verity/scenario-utils.test.ts` — distinct colours, no bg-white for real scenarios.
- `tests/guide/main-guide.test.ts` — key strings and links.
- No forbidden names (Kraken/Payward/SignalOS).
- No emoji in guide/verity surfaces.
- No live API added.
- Ops and Arbiter functional paths untouched.

---

## PART 4 — Local QA

Run `npm test`, `npm run build`. Update `Ourox/Verity Phase 3/Build Log.md`. Report before push; do not push without approval.

---

## Done Criteria

* Spec written to repo Specs area.
* SCENARIO_COLORS distinct and dark-appropriate for all four scenario types.
* PATTERN_FAMILY_COLORS checked; fixed only if necessary.
* Main `/guide` is authoritative reviewer overview with sticky index.
* Public-safe; no forbidden names; no live API; no functional agent/Ops/Arbiter changes.
* `npm test` and `npm run build` pass.
