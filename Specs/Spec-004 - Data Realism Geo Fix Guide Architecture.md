# Spec-004 — Data Realism, Geo Fix, and Guide Technical Architecture

**Project:** Ourox / Arbiter
**Spec:** Spec-004
**Issued from:** Brief-004
**Target executor:** Cursor
**Write this spec to:** `Specs/Spec-004 - Data Realism Geo Fix Guide Architecture.md`
**Push discipline:** Execute locally, regenerate data, retrain offline ML, run build/tests, report new metrics before push. Do not push without approval.

---

## 0. Objective

Fix the synthetic dataset so the ML model behaves like a believable learning-grade fraud model rather than a trivially perfect toy model.

This loop does three things:

1. Add realistic class overlap to the Mockingbird synthetic generator so held-out ML metrics are believable.
2. Land the geo-realism fix so `geo_velocity > 900` / R2 `IMPOSSIBLE_TRAVEL` characterises ATO-style events, not mule-farm wallets.
3. Add a public-safe Technical Architecture section to `/guide`.

This spec does **not** change scoring or rule logic.

---

## 1. Locked IP Gate

Allowed:

* synthetic data generation changes
* Mockingbird generator changes
* offline ML retraining
* static ML artifact regeneration
* guide content
* guide styling
* build/test/reporting

Forbidden:

* no real customer data
* no employer data
* no prior-employer system names
* no prior-employer model/scoring logic
* no vendor reverse engineering
* no scoring logic changes
* no rule logic changes
* no JDM changes
* no weight changes
* no `/api/arbiter/score` changes
* no runtime Python
* no runtime inference
* no FastAPI
* no Kafka
* no production ML claims

`_scenario_label` is allowed only as:

```text
offline training label
offline evaluation label
static analysis artifact metadata
```

`_scenario_label` must never enter:

```text
runtime feature computation
runtime score computation
runtime rules path
/api/arbiter/score
JDM input
```

`scenario-exclusion.test.ts` must still pass.

---

## 2. Out of Scope

Do not build:

* no new scoring features
* no new rule logic
* no JDM update
* no weight re-tuning
* no runtime model
* no model server
* no live Verity feedback loop
* no production ML pipeline
* no UI rebuild
* no new product
* no guide mention of real/prior-employer systems
* no public prototype lineage references such as Baht-Shield/SignalOS

Guide content must describe only **Ourox**, **Verity**, **Arbiter**, synthetic data, and public-safe architecture.

---

*(Full spec body continues per Brief-004 — see vault Ourox/Briefs/Brief-004-guide-architecture-phase3-followup.md)*
