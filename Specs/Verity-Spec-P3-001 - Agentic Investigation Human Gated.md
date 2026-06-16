# Verity-Spec-P3-001 — Agentic Investigation, Full Lifecycle, Human-Gated

**Project:** Ourox / Verity Phase 3  
**Spec:** Verity-Spec-P3-001  
**Issued from:** Verity-Brief-P3-001  
**Build mode:** Cursor AUTO mode  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Build a new Verity sub-route that demonstrates **agentic investigation** as a full case lifecycle:

```text
Intake & scoping → Investigate → Decide → Action
```

The agentic experience must be:

- deterministic now
- no live API call
- no API key
- human-gated at every stage
- evidence-led
- audit-trailed
- public-safe
- built in Verity's existing design system
- additive, not a restructure of Verity

**Core product principle:**

```text
AI compresses the work around a decision, not the decision itself.
```

---

## 1. Build Split Instruction

**Session A** — Stepper + Intake + Investigate  
**Session B** — Decide + Action + Governance Panel

Implemented in a single session (full scope).

---

## 2. Locked IP Gate

**Allowed:** synthetic Verity seed, three scenarios, deterministic mock engine, human gates, audit trail, governance panel.

**Forbidden:** real data, live API, API key, autonomous action, Ops/Arbiter changes, Ops obsidian/orange styling.

---

## 3–43. Implementation Requirements

See Verity-Brief-P3-001 and build log for full acceptance criteria.

**Route:** `/verity/agent`  
**Components:** `components/verity/agent/*`  
**Engine:** `lib/verity/agent-engine.ts`, `lib/verity/agent-types.ts`, `lib/verity/agent-state.ts`  
**Tests:** `tests/verity/verity-agent-engine.test.ts`, `tests/verity/verity-agent-audit.test.ts`

---

## Done Criteria (summary)

- [x] New Verity sub-route at `/verity/agent`
- [x] AppShell + signal-* design system
- [x] Three scenarios supported (MF, SM, APP)
- [x] Four human-gated stages
- [x] Deterministic engine, no live API/key
- [x] Audit trail + How this agent works panel
- [x] Tests pass, build passes
- [x] No Ops/Arbiter changes
