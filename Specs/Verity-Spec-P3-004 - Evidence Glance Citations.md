# Verity-Spec-P3-004 — Evidence Glance Layer + Scannable Citations

**Project:** Ourox / Verity Phase 3  
**Spec:** Verity-Spec-P3-004  
**Issued from:** Verity-Brief-P3-004  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Improve the Verity agentic investigation evidence presentation so a reviewer can understand the strongest evidence and citations at a glance.

This loop adds:

1. An always-visible **compelling evidence digest** at the top of the Stage 2 evidence pack.
2. A dense, scannable **evidence table** instead of prose-card evidence rows.
3. Per-evidence **risk score contribution** visibility.
4. Compact **confidence chips** across the agent surface.
5. Finding-anchored **Stage 2 evidence citations** in the decision draft.

**Presentation only.** No changes to risk-score math, human-gate logic, stage flow, audit trail, or which evidence is cited.

---

## Implementation Summary (P3-004)

### Evidence display helpers (`lib/verity/agent-evidence-display.ts`)

- `getEvidenceContributionMap`, `getEvidenceContributionForItem`, `getTopCompellingEvidence`
- `sortContributionsByScore`, `getCitedEvidenceRows`, `EVIDENCE_CATEGORY_LABELS`

### Components

- `VerityAgentConfidenceChip` — Low/Med/High with colour + label
- `VerityAgentContributionChip` — +N pts with tone by magnitude
- `VerityAgentEvidencePack` — compelling digest + dense evidence table
- `VerityAgentRiskBreakdown` — contributions ranked descending; math on-demand
- `VerityAgentDecisionDraft` — finding-anchored citations with chips

### Tests

- `tests/verity/verity-agent-evidence-display.test.ts`
- `tests/verity/verity-agent-risk.test.ts` — contribution sort/fields

---

## Done Criteria

- Evidence leads with compelling digest (top 2–3 by contribution/confidence)
- Full evidence is dense table, not prose cards
- Confidence and contribution as chips (never colour-alone)
- Risk breakdown ranked by contribution; multiplier in expanded detail only
- Decision citations finding-anchored with secondary evidence IDs
- Risk math, gates, audit, citation linkage unchanged
