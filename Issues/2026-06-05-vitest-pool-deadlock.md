# Issue — npm test deadlocks (vitest pool starved by large seed imports)

**Date:** 2026-06-05
**Spec context:** Spec-018 (Ourox platform shell + Verity rename)
**Status:** Build passing; tests pass but suite is slow. Permanent fix specified below, not yet committed.
**Severity:** Medium — blocks fast feedback, not correctness. Did not block the push decision (see Decision).

---

## Symptom

`npm test` (vitest run) hangs indefinitely with zero output after `RUN v4.1.8` — no results, no exit code. Reproducible before and after Spec-018.

## Root cause (confirmed)

Vitest's default `forks` pool spawned ~14 file workers simultaneously. Each worker imports the full ~49MB seed (`lib/seed-data.ts` + `data/arbiter/mockingbird-history.json`), ~118s per worker. Fourteen concurrent workers all importing the same large JSON starve macOS resources → deadlock, no output.

Evidence: running with capped concurrency prints output immediately and the fast files (150+ tests) pass; the genuinely heavy file `score-distribution.test.ts` needs ~124s alone (118s import + ~5s tests) and passed on the June 4 run (exit 0). Full suite confirmed exit 0 ×2 when allowed to run to completion (~5 min).

## Temporary patch currently in repo

`vitest.config.ts` was set to `pool: 'vmForks'`, `poolOptions.vmForks.maxForks: 4`. This unblocks the deadlock but is not the preferred permanent config (see Decision).

---

## Decision (Tower / lead-eng review, 2026-06-05)

1. **Use `forks` with `maxForks: 2`, not `vmForks`.** `vmForks` runs tests in Node `vm` contexts — weaker isolation and the riskier choice when the suite loads a **native addon** (`@gorules/zen-engine`). The deadlock was caused by worker concurrency, not pool type, so capping concurrency fixes it without the weaker isolation.
2. **Keep `npm test` fast (< 60s) and keep the IP-gate test inside it.** `tests/arbiter/scenario-exclusion.test.ts` (the `_scenario_label` exclusion proof) must always run in the main suite — never relegated to an optional slow suite. If slow only due to the seed import, give it (and `api-score.test.ts`) a small ~50-event fixture so it stays fast.
3. **Isolate only genuinely data-volume-dependent tests.** `score-distribution.test.ts` needs the full 353-event set → move to `npm run test:slow`. Add `test` (fast, excludes slow), `test:slow`, `test:all` scripts.
4. **Push was not blocked by this.** Build passed (exit 0), `signalos` grep clean, full suite passed ×2, and the rules engine is independently proven live on Vercel (Fix 4: black-tier event → BLOCK / MULE_TARGET_PROHIBITED). A slow test pool cannot hide a defect that production already validates.

## Fix to apply (specified, not yet committed)

- `vitest.config.ts`: `pool: 'forks'`, `poolOptions: { forks: { maxForks: 2, minForks: 1 } }`; remove `vmForks`.
- Shrink `scenario-exclusion.test.ts` (and `api-score.test.ts` if needed) to a ~50-event representative fixture so they stay in the fast suite.
- `package.json`: `test` = `vitest run --exclude '**/score-distribution.test.ts'`; `test:slow` = run `score-distribution.test.ts`; `test:all` = `vitest run`.
- Verify: `npm test` well under 60s and passing (IP-gate test included); `npm run test:slow` passing; `npm run build` exit 0.

## Durable follow-up (tech-debt, not now)

The underlying cause is a 49MB seed committed and re-imported by every worker. Durable fix: trim the committed seed or gitignore it and regenerate via the migration script (`scripts/migrate-transactions.ts`). Track separately.

## Files at the center

- `vitest.config.ts` — pool config
- `tests/arbiter/score-distribution.test.ts` — the one genuinely heavy test
- `tests/arbiter/scenario-exclusion.test.ts` — IP-gate test that must stay fast
- `lib/seed-data.ts`, `data/arbiter/mockingbird-history.json` — the heavy imports
