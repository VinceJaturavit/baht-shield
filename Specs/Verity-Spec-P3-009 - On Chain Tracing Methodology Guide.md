# Verity-Spec-P3-009 — On-Chain Tracing Methodology Guide

**Project:** Ourox / Verity Phase 3  
**Spec:** Verity-Spec-P3-009  
**Issued from:** Verity-Brief-P3-009  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Add a concise, accurate, public-safe **on-chain tracing methodology guide** inside the Verity agentic investigation experience.

The guide should help a reviewer understand:

- forward vs backward tracing
- co-mingling
- FIFO / LIFO / LIBR / pro-rata
- UTXO vs account-based chains
- method choice as a defensible judgment call
- VASP attribution
- cash-out / recovery endpoint
- freeze → seize → restitution
- synthetic-data boundary

This is **content/documentation only**.

Do not change trace data model, trace data, trace methodology implementation, risk score logic, human gates, stage flow, audit trail, evidence citations, roadmap panel meaning, or forward/backward honesty framing.

---

## Done Criteria

- In-app tracing-methodology guide exists as expandable panel in on-chain trace area
- Guide is reachable from the agent's on-chain trace area without leaving the flow
- Guide covers all required topics (forward/backward, co-mingling, methods, UTXO/account, judgment call, VASP, recovery pathway, synthetic boundary)
- Optional `/guide#on-chain-tracing-methodology` anchor with link from trace panel
- Content smoke tests protect required strings
- No trace data/model, risk, gate, audit, Ops, or Arbiter changes
- No working backward trace, live API, real addresses, forbidden names, or emoji
- `npm test` and `npm run build` pass
