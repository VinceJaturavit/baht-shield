# Verity-Spec-P3-005 — Fix Constant Agentic Risk Score

**Project:** Ourox / Verity Phase 3  
**Spec:** Verity-Spec-P3-005  
**Issued from:** Verity-Brief-P3-005  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Fix the Verity agentic investigation risk-score bug where every seed case scored **68 / High** because `buildEvidenceItems` in `lib/verity/agent-engine.ts` generated identical evidence categories with identical confidence levels for every scenario.

---

## 1. Root Cause

Under P3-003 risk math (`category weight × confidence multiplier = contribution`), the identical evidence profile always summed to 68:

| Category | Weight | Confidence | Contribution |
|---|---|---|---|
| account_history | 7 | High | 7 |
| transaction_graph | 14 | Medium | 9.8 |
| device_ip_funding | 12 | High | 12 |
| onchain_exposure | 16 | Medium | 11.2 |
| prior_flags | 10 | High | 10 |
| pattern_match | 18 | High | 18 |
| **Total** | | | **68** |

---

## 2. Fix

Differentiate deterministic evidence profiles by scenario in `buildEvidenceItems`:

### APP Scam Cash-out Ring (CASE_APP_001) — highest

| Category | Confidence |
|---|---|
| account_history | Medium |
| transaction_graph | High |
| device_ip_funding | High |
| onchain_exposure | High |
| prior_flags | High |
| pattern_match | High |

**Score:** 75 / High

### Onboarding Mule Farm (CASE_MF_001) — mid-high

| Category | Confidence |
|---|---|
| account_history | Low |
| transaction_graph | Medium |
| device_ip_funding | High |
| onchain_exposure | Low |
| prior_flags | Medium |
| pattern_match | High |

**Score:** 56 / Medium

### Sleeper Mule Activation (CASE_SM_001) — lowest

| Category | Confidence |
|---|---|
| account_history | Medium |
| transaction_graph | Low |
| device_ip_funding | Medium |
| onchain_exposure | Low |
| prior_flags | Low |
| pattern_match | Medium |

**Score:** 42 / Medium

---

## 3. Risk Normalisation

**Changed?** No — evidence profile differentiation alone achieves meaningful score spread. Existing formula preserved:

```
risk score = sum(category weight × confidence multiplier), capped at 100
Critical = 80–100, High = 60–79, Medium = 35–59, Low = 0–34
```

`RISK_RULE_SUMMARY` unchanged.

---

## 4. Out of Scope (unchanged)

- Glance layer, evidence table, chips, citations
- Human gates, audit trail, stage flow
- Ops, Arbiter
- No ML, randomness, or live API

---

## 5. Acceptance

- [x] Three scenarios produce different scores (75, 56, 42)
- [x] Scores span at least two bands (High + Medium)
- [x] APP > Mule Farm > Sleeper ordering
- [x] Deterministic same-case scoring
- [x] P3-004 contribution breakdown differs by scenario
- [x] Tests and build pass
- [x] No forbidden names, emoji, or live API
