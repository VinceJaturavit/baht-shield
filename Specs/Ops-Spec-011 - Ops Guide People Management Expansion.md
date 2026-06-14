# Ops-Spec-011 — Ops Guide People-Management Expansion

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-011  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## 0. Objective

Update the existing `/ops/guide` page so it reflects the full Ops Phase 1.5 people-management suite built in Ops-Spec-008 through Ops-Spec-010.

This loop is **guide content and documentation only**. No functional Ops screen changes.

---

## 1. Locked IP Gate

**Allowed:** `/ops/guide` copy and section structure, sticky section index, main `/guide` Ops summary update, public-safe product framing.

**Forbidden:** real data, customer/employer data, TrueMoney/Kraken/Payward/SignalOS names, prototype lineage on public surfaces, Ops functional screen changes, new Ops data model, live wiring, emoji, card soup, horizontal page scroll.

Use only non-identifying stream labels: RFR, DSP, LAR, PRO, PRF.  
Use current Ops role names: Fraud Analyst, Junior Analyst.

---

## 2. Out of Scope

Queue Board, Aging/SLA, Roster, Performance, QA, Reviews, KPI functionality, case data, roster data, scoring, ML, guide charts, simulations, exports, interactive workflow, Verity integration, Arbiter integration.

---

## 3. Deliverables

### `/ops/guide` — expanded to thirteen sections

1. What Ops is — includes Phase 1.5 people-management suite framing
2. The five intake streams — unchanged
3. Queues & priority — unchanged
4. SLA & aging — unchanged
5. Roster sub-views — overview of six Roster tabs + Reviews as top-level nav; roles and protected capacity
6. Weekly schedule & coverage — Mon–Sun grid, shift codes, per-day coverage, handoff discipline
7. Fairness — weighted-difficulty distribution within role; equity not performance; read-only
8. Performance — raw volume vs weighted throughput; role-appropriate metrics; not cases-closed rank
9. QA & behaviour — quality sampling/defects; SLA-pickup as distinct behavioural signal
10. The four signals — fairness/performance/quality/behaviour kept distinct; analyst-controlled vs rostering-controlled
11. Reviews — per-analyst pack; mock AI copilot as decision-support; embedded fairness rubric; human-in-the-loop; real API on roadmap
12. How it connects — unchanged
13. Synthetic boundary — updated to mention fairness, QA, and review data

### Main `/guide`

- Ops section summary expanded to cover people-management suite, four signals, and Reviews.
- Three-pillar Ops card blurb updated.
- Roadmap Current band updated to Ops Phase 1.5 scope.

---

## 4. Files

**Created**

- `Specs/Ops-Spec-011 - Ops Guide People Management Expansion.md`

**Modified**

- `components/ops/guide/ops-guide-sections.ts` — thirteen sections
- `components/ops/guide/OpsGuidePage.tsx` — expanded prose
- `app/guide/page.tsx` — Ops summary and roadmap
- `tests/ops/ops-guide.test.ts` — section count and topic coverage

**Unchanged (functional)**

- Queue Board, Aging & SLA, Roster, Reviews, KPI workspaces and lib/ops logic

---

## 5. Verification

Run before push:

```bash
npm test
npm run build
```

Guardrail greps for forbidden names (Officer, Contractor, TrueMoney, Kraken, SignalOS), legacy roles, emoji.  
Confirm no functional Ops screen or Arbiter scoring/ML diffs.

Do not push without approval.

---

## 6. Done criteria

- [x] `/ops/guide` has thirteen sections with sticky index in sync
- [x] All Phase 1.5 people-management topics covered in calm prose
- [x] Main `/guide` Ops summary reflects expanded scope
- [x] Public-safe wording; Fraud Analyst / Junior Analyst naming
- [x] No functional Ops screen changes
- [x] `npm test` pass
- [x] `npm run build` pass
- [x] Guardrails clean
