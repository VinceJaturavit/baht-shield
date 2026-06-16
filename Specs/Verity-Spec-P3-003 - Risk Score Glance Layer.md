# Verity-Spec-P3-003 — Risk Score + Glance Layer for Agentic Investigation

**Project:** Ourox / Verity Phase 3  
**Spec:** Verity-Spec-P3-003  
**Issued from:** Verity-Brief-P3-003  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Improve the Verity agentic investigation route so it is easier to read at a glance.

Add:

1. A deterministic, transparent **0–100 risk score** derived from Stage 2 evidence.
2. A **risk band** (Critical / High / Medium / Low).
3. A top-level **case dashboard header**.
4. A one-line **headline summary per stage**.
5. Progressive disclosure for dense details.

Readability and explainability pass only. No changes to human-gate logic, stage flow, audit trail, evidence citations, or decision confidence logic.

---

## Implementation Summary (P3-003)

### Risk score (`lib/verity/agent-risk.ts`)

- Category weights: pattern_match 18, onchain_exposure 16, transaction_graph 14, device_ip_funding 12, prior_flags 10, account_history 7
- Confidence multipliers: High 1.0, Medium 0.7, Low 0.4
- Score: `min(100, round(sum(weight × multiplier)))`
- Bands: Critical 80–100, High 60–79, Medium 35–59, Low 0–34
- Attached to `VerityEvidencePack.riskScore` in `runEvidenceAssembly`

### Glance layer

- `VerityAgentCaseDashboardHeader` — case id, scenario pill, risk score+band, current stage, recommendation when Stage 3 exists
- `lib/verity/agent-headlines.ts` — one-line summaries per stage in `VerityAgentStagePanel`

### De-clutter

- `VerityAgentDisclosureSection` — native `<details>` progressive disclosure
- `VerityAgentRiskBreakdown` — on-demand transparent breakdown
- Dense evidence/reasoning/citation/action details collapsed by default; all content retained

### Out of scope (unchanged)

- Human gates, stage unlock, audit trail, evidence citation mechanism
- Ops, Arbiter, live API, ML

---

## Tests

- `tests/verity/verity-agent-risk.test.ts` — 13 tests
- `tests/verity/verity-agent-headlines.test.ts` — 4 tests
- `tests/verity/verity-agent-engine.test.ts` — riskScore integration tests added

---

## Done Criteria

See Verity-Brief-P3-003 for full acceptance checklist. Implemented locally; awaiting push approval.
