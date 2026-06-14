# Ops-Spec-015 — Queue Board Impact-Tier Overlay

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-015  
**Issued from:** Ops-Brief-015  
**Build mode:** Cursor AUTO mode, one-session scope  
**Target executor:** Cursor  
**Push discipline:** Execute locally, run tests/build, report before push. Do not push without approval.

---

## Domain principle

```text
SLA pressure = time cost of delay.
Impact tier = consequence cost of delay.
```

A case can be near-breach but low-impact, fresh but high-impact, high-impact and near-breach, or low-impact and fresh. The Queue Board makes both dimensions visible. Impact is a **parallel signal** — it does not replace priority tier or SLA pressure.

---

## Implementation summary

### Impact model (`lib/ops/impact.ts`)

- Three synthetic inputs: financial exposure (THB + band), social/reputational pressure, incident severity
- Transparent point rule → derived tier: Critical / High / Moderate / Low
- Floor rules: Active incident ≥ High; Linked incident ≥ Moderate
- `sortByImpactThenSla` — impact rank first, then existing SLA pressure score

### OpsCase extension

- `impact: OpsCaseImpact` on every synthetic case in `data/ops/ops-cases.ts`
- Impact profiles assigned independently of SLA timing (default profile array + explicit overrides for two-axis examples)

### Queue Board UI

- Row indicator: Priority / SLA / Impact (indicator + label via `OpsIndicatorLabel`)
- Overlay lenses: By stream | Urgent | Impact
- Impact overlay ranks Critical/High first, then SLA pressure
- Filter bar: Impact tier (All / Critical / High / Moderate / Low) — AND-combined with existing filters
- Drawer: SLA breakdown unchanged + Impact breakdown section (`OpsImpactBreakdown`)
- Two-axis caption on Queue Board intro and Impact overlay

### Unchanged

- Priority tier logic, SLA pressure helpers, Urgent overlay, Aging model, KPI, people-management, Verity, Arbiter

### Tests

- `tests/ops/ops-impact.test.ts` — rule derivation, ranks, tones, sort
- `tests/ops/ops-impact-data.test.ts` — distribution, two-axis examples, decorrelation
- `tests/ops/ops-filters.test.ts` — impact tier filter AND-combine

### Two-axis synthetic examples

- **High-impact / fresh:** `OPS-PRO-008` — Critical impact, Fresh SLA bucket, On track pressure
- **Near-breach / low-impact:** `OPS-PRF-007` — Low impact, At-Risk SLA bucket

---

## Acceptance (done criteria)

See Ops-Brief-015 / build log for full checklist. Key: impact visible alongside priority + SLA; Impact overlay lens; filter + drawer breakdown; no SLA/Aging/KPI/people-management changes; tests + build pass.
