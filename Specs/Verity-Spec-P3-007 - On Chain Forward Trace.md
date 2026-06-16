# Verity-Spec-P3-007 — On-Chain Forward Trace + Recovery Backtrace Roadmap

**Project:** Ourox / Verity Phase 3  
**Spec:** Verity-Spec-P3-007  
**Issued from:** Verity-Brief-P3-007  
**Build mode:** Cursor AUTO mode. Comprehensive; split if needed.  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Deepen the Verity agentic investigation's on-chain evidence from a one-line `onchain_exposure` item into a visible, synthetic, deterministic, multi-hop **forward trace**.

Built feature:

```text
Forward trace: theft / victim inflow → multi-hop movement → cash-out VASP
```

Roadmap only:

```text
Recovery-grade backward trace: frozen funds → specific victim attribution
```

The build must honestly demonstrate forward tracing and VASP endpoint identification, while clearly stating that recovery-grade backward tracing is a human-led evidentiary process and is **not built** in this loop.

---

## 1. Build Split Instruction

If too large, split exactly this way:

- **Session A** — Trace data model + hop visualisation
- **Session B** — Co-mingling/method layer + backward-trace roadmap

**This build:** Single session (no split).

---

## 2. Locked IP Gate

Allowed: synthetic deterministic trace, fake addresses, forward visualisation, co-mingling flags, method labels, recovery roadmap panel, governance note, signal-* styling.

Forbidden: real addresses, live chain query, API key, working backward trace, Ops/Arbiter changes, gate/audit/risk math changes, card soup, horizontal scroll, emoji, Kraken/Payward/SignalOS names.

---

## 3. Implementation Summary

### Types (`lib/verity/agent-types.ts`)

- `VerityOnChainTrace`, `VerityOnChainTraceHop`, `VerityCashOutEndpoint`
- Chain, asset, hop type, attribution, tracing method, ledger model types
- `VerityEvidencePack.onChainTrace?` optional field

### Engine (`lib/verity/onchain-trace.ts`)

- `buildOnChainTraceForScenario`, `buildOnChainTrace`
- `getTraceSummary`, `getCashOutEndpoint`, `validateSyntheticTraceAddresses`
- `getOnChainExposureFinding` — updates `onchain_exposure` evidence finding
- Scenario traces: APP Scam (6 hops), Mule Farm (5 hops), Sleeper (5 hops)

### UI (`components/verity/agent/VerityOnChain*.tsx`)

- `VerityOnChainTraceView` — Investigate-stage sub-view
- Summary line, expandable hop list, recovery point, roadmap panel, governance note
- Integrated in `VerityAgentEvidencePack` after compelling evidence, before risk breakdown

### Honesty layer

- Forward trace labelled explicitly
- Recovery backtrace roadmap only — human-led, not auto-run
- No working backtrace functions

---

## 4. Scenario Trace Shapes

| Scenario | Hops | Key traits | Cash-out VASP |
|---|---|---|---|
| APP Scam Cash-out Ring | 6 | fan-out, peel, consolidation, co-mingling (pro-rata) | SYNTH-Exchange-A |
| Onboarding Mule Farm | 5 | many-inflow, cluster consolidation, co-mingling (FIFO) | SYNTH-Exchange-B |
| Sleeper Mule Activation | 5 | dormant activation, peel, bridge, UTXO-aware BTC | SYNTH-Exchange-C |

---

## 5. Acceptance

- Forward trace only (`traceDirection: "forward"`)
- All addresses include SYNTH/DEMO/SYNTHETIC
- Cash-out endpoint marked actionable recovery point
- Co-mingling method labels with defensible judgment-call notes
- UTXO vs account-based awareness visible
- Risk math unchanged
- Human gate / audit / stage flow unchanged
- Ops / Arbiter untouched
- `npm test` passes
- `npm run build` passes
- Working backward trace: **no**
- Live chain query: **no**
