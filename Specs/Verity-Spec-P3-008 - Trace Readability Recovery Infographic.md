# Verity-Spec-P3-008 — Trace Readability + Recovery-Chain Infographic

**Project:** Ourox / Verity Phase 3  
**Spec:** Verity-Spec-P3-008  
**Issued from:** Verity-Brief-P3-008  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Polish the existing Verity on-chain forward trace presentation so it is easier to understand at a glance.

Presentation only:

1. De-clutter the trace hop list into one scannable primary line per hop.
2. Tighten wording across the trace sub-view.
3. Replace the plain `freeze → seize → restitution` text with a compact recovery-chain infographic.

Do not change trace data model, methodology, forward/backward honesty framing, recovery backtrace roadmap panel, human gates, audit trail, or risk score logic.

---

## Done Criteria

- Hop list de-cluttered with connected flow treatment
- One scannable primary line per hop
- Secondary details preserved on expand
- Co-mingling glance flag + method note on demand
- Trace wording tightened
- Recovery-chain infographic with glosses and explanatory-only caveat
- Trace data model unchanged
- Methodology unchanged
- Gates/audit/risk/Ops/Arbiter unchanged
- Tests and build pass
