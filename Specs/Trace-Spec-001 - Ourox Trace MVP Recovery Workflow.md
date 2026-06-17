# Trace-Spec-001 — Ourox Trace MVP Recovery Workflow Layer

**Project:** Ourox Trace  
**Spec:** Trace-Spec-001  
**Issued from:** Trace-Brief-001  
**Build mode:** Cursor AUTO mode  
**Status:** Implemented June 17, 2026

---

# Trace-Brief-001 — Ourox Trace MVP (recovery workflow layer)
**Issued by:** Tower (Opus 4.8)
**Date:** June 16, 2026
**Loop:** Ourox Trace, build loop 1 (new app layer)
**Build mode:** Cursor AUTO model mode. Sizeable; split if needed: structure + data + method panel first, then attribution table + evidence summary + review.
**IP gate:** PASSED — synthetic only; clearly-fake addresses; no real wallet/victim/exchange/vendor data; no real vendor API keys.

---

## Why this exists (and the product boundary)

A new, separate app layer — **Ourox Trace** — distinct from Ops / Verity / Arbiter. It is an **AI-assisted recovery-tracing WORKFLOW layer**, NOT a blockchain-analytics engine. It does NOT replace TRM / Chainalysis Reactor / Elliptic. It sits *after* the investigator has done tracing in a vendor tool: it ingests a synthetic "vendor evidence export," then runs the **recovery workflow** — frozen-pool analysis, co-mingling method comparison, victim attribution, evidence packaging, human review.

This boundary IS the credibility. Real investigators trace in vendor platforms, then do recovery (method selection + attribution + documentation) as a distinct discipline. Demonstrating that you know the division of labour is the senior signal.

**The existing `/verity/agent` on-chain trace stays as-is** (it shows forward-trace fluency). Recovery lives here. Counter accepted: this is a separate `/trace` area.

### Two hard design rulings (do not deviate)
1. **NO zkTLS / MPC-TLS / TLSNotary / TEE / cryptographic-proof layer.** It is overclaiming and not how recovery works; it would damage credibility with a TRM reviewer. Omit entirely.
2. **Scope is an MVP, not the full 12-screen spec.** The heart is the **method-comparison + victim-attribution** workflow on ONE complete synthetic case. Everything else is light scaffolding around it. Do not build the full vision; build the heart well.

Reference docs (in `01 Career/Interview Preparation/TRM/`): `Follow the money perplexity.md`, `Ourox Agentic Trace — Recovery Backtrace Module NotebookLM.md`, `Chat GPT.md`. Use them for methodology accuracy (FIFO/LIFO/LIBR/pro-rata definitions and the worked Alice/Bob/Scammer case) but IGNORE their zkTLS content and their full-scope screen lists.

Design: this is a NEW layer — it may use its own clean enterprise styling, but stay consistent with Ourox brand tokens (obsidian/orange/gold/ink) and the Design Doctrine (`07 Reference`): calm, dense, one dominant workspace, progressive disclosure, status never colour-only, no card soup, no emoji, no horizontal scroll.

## The anchor case (use verbatim — the math is pre-worked and correct)

From the NotebookLM doc, the commingled pool:
- Alice (Victim 1) deposits 10,000 USDT at t1
- Bob (Victim 2) deposits 10,000 USDT at t2
- Scammer deposits 5,000 USDT (dirty) at t3
- Outflow of 12,000 USDT seized at t4 (pool total 25,000 before outflow; 13,000 remains)

Seized-12,000 allocation by method (these numbers are correct — use them):
| | FIFO | LIFO | Pro-rata | LIBR |
|---|---|---|---|---|
| Alice | 10,000 | 0 | 4,800 | 7,000 |
| Bob | 2,000 | 7,000 | 4,800 | 0 |
| Scammer (taint) | 0 | 5,000 | 2,400 | 5,000 |

Plus one **ambiguous victim claim** marked "insufficient evidence" (a small inflow whose origin can't be established) to demonstrate that "insufficient evidence" is a valid, first-class outcome.

(DIFO from the source doc can be omitted or included as a defense-argument toggle — builder's choice, low priority. FIFO/LIFO/LIBR/pro-rata are the required four.)

## App structure (smallest credible)

Route `/trace`. MVP pages:
- `/trace` — case dashboard (lists the one synthetic case; room for more later).
- `/trace/cases/[caseId]` — the case workspace, containing the workflow as sections/sub-views (NOT 12 separate routes for MVP):
  1. Vendor evidence (imported packet, read-only)
  2. Frozen pool & co-mingling ledger
  3. **Method comparison panel (the heart)**
  4. Victim attribution table
  5. Evidence package summary
  6. Review & approval + audit trail

Keep it to these two routes for MVP; sub-views can be tabs/sections within the case workspace.

## Core screens (MVP)

### 1. Vendor evidence (import, read-only)
- A synthetic "vendor evidence packet" — what an investigator would export from TRM/Reactor/Elliptic. Fields: vendorName (e.g. "Synthetic Vendor Export"), caseReference, exportTimestamp, seedAddress (fake), chain, asset, a few trace hops (hop#, from/to fake addr, service/cluster label, attribution confidence), VASP cash-out endpoint, notes, analystImportedBy.
- Clearly captioned: "Synthetic vendor export — represents evidence an investigator would bring FROM a vendor tracing platform. Ourox Trace does not perform the trace."
- Read-only; this is the input to the recovery workflow.

### 2. Frozen pool & co-mingling ledger
- The frozen pool: total frozen balance, the VASP it's held at, freeze context.
- The co-mingling ledger for the pool: the ordered deposits (Alice/Bob/Scammer) + the seized outflow, as a clear table (tx, time, depositor, direction, amount, running balance).
- Flag the pool as co-mingled; show why attribution is non-trivial.

### 3. Method comparison panel (THE HEART — build this best)
- Side-by-side comparison of **FIFO / LIFO / LIBR / pro-rata** on the SAME pool, each showing: the assumption (one line), the resulting victim allocation (Alice/Bob/Scammer numbers from the table above), amount attributed per victim, the weakness/risk, why it may be defensible, and a confidence/uncertainty note.
- The whole point: the same frozen pool yields DIFFERENT victim outcomes by method — visible at a glance. (E.g. LIFO gives Alice 0, FIFO gives Alice 10,000 — the "LIFO trailing trap.")
- Then the human action: **investigator selects a method + enters a rationale**; this is human-owned, not auto-chosen. The selection feeds the attribution table and is logged.
- A caption: method choice is a defensible judgment call, not automatic; different methods produce different victim outcomes; the choice must be justified and may face legal scrutiny.

### 4. Victim attribution table
- Per victim: victimId, victimNameSynthetic, depositTx, depositAmount, methodUsed, attributedAmount (from the selected method), confidence, evidenceCount, gaps, status (attributed / partial / insufficient-evidence / rejected).
- Includes the **insufficient-evidence** row — a claim that can't be substantiated, marked as such, NOT forced into an attribution. This is a credibility highlight.

### 5. Evidence package summary
- A read-only assembled summary: case summary, source vendor evidence, frozen-pool details, method selected + rationale, victim attribution table, uncertainty/limitations, reviewer approval, audit log.
- Clearly marked: "Synthetic demonstration package — not legal advice, not a real recovery filing."
- A simple "view package" assembly is enough for MVP; PDF/markdown export is V2.

### 6. Review & approval + audit trail
- A senior-reviewer gate: approve / reject the method choice and the victim attribution (human-owned, mirrors the agent's gate pattern).
- Audit trail: every step + AI suggestion + human decision (method chosen, rationale, approval), timestamped. Exam-ready.

## AI assistant behaviour (decision-support only)
A modest AI-assist presence (deterministic mock, no live API, no key), consistent with the rest of Ourox:
- AI CAN: summarise the imported vendor evidence; flag missing evidence / gaps; present the FIFO/LIFO/LIBR/pro-rata comparison; draft a method-rationale starting point; draft the victim-attribution narrative; draft the evidence-package outline; raise reviewer questions.
- AI CANNOT: perform real tracing; choose the final method without human approval; approve attribution; claim legal certainty; suppress uncertainty; fabricate vendor evidence.
- UI copy must make the AI's role explicitly decision-support, human-owned final calls.

## Honesty / positioning (must be visible)
Ourox Trace IS: synthetic demo; recovery-workflow assistant; evidence organiser; method-comparison layer; recovery documentation workspace; human-in-the-loop analyst aid.
Ourox Trace IS NOT: a replacement for Reactor/TRM/Elliptic; an automated tracing engine; a legal attribution engine; a real recovery product; a tool that independently decides victim ownership.
State this boundary on the `/trace` landing and the case workspace.

## Out of scope (MVP)
- zkTLS/MPC-TLS/TEE/cryptographic proofs — entirely.
- Real vendor API / live blockchain data / real addresses / real victims.
- PDF/markdown export (V2); interactive graph viz (V2 — structured tables first); multiple cases (V2); real auth/security.
- The full 12-screen spec — MVP is the one case + the six sections above.

## Acceptance criteria
1. New `/trace` layer (separate from Ops/Verity/Arbiter): landing + one case workspace, with the IS/IS-NOT boundary stated.
2. Vendor-evidence packet shown as read-only input, captioned that Ourox Trace does not perform the trace.
3. Frozen-pool co-mingling ledger renders the Alice/Bob/Scammer pool clearly.
4. Method-comparison panel shows FIFO/LIFO/LIBR/pro-rata side-by-side with the correct per-victim numbers (per the table), assumptions, weaknesses, defensibility, and uncertainty; the same pool visibly yields different outcomes.
5. Human selects method + enters rationale (not auto-chosen); selection drives the attribution table and is logged.
6. Victim attribution table includes an insufficient-evidence outcome as a first-class status.
7. Evidence package summary assembles the case read-only, marked synthetic/not-legal.
8. Reviewer approve/reject gate + exam-ready audit trail of AI suggestions + human decisions.
9. AI is deterministic mock (no live API/key), explicitly decision-support; cannot choose method/approve attribution.
10. NO zkTLS/proof layer anywhere. Synthetic only; clearly-fake addresses; no Kraken/Payward/SignalOS strings. Ourox brand + doctrine; no card soup; no horizontal scroll; no emoji.
11. `npm run build` clean; `npm test` passes.

## Handoff path
GPT → Trace-Spec-001 → Cursor (AUTO, split if needed) → Principal reviews → push. V2 backlog (parked): graph viz, export, multiple cases, richer audit, vendor-packet upload.

---
*Logged copy. Chat version identical.*
