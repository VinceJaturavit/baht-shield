# Mockingbird — Arbiter Synthetic Event Generator

## What it is

Mockingbird is an **offline, one-time Python script** that generates synthetic
`ArbiterEvent` rows for Arbiter Phase 1 demo coverage. It is named after the
technique of generating plausible-sounding synthetic data from public typologies.

## What it is NOT

- It is **not** imported by Next.js.
- It is **not** called by any API route.
- It is **not** part of the request path.
- It does **not** use any real customer data.
- It does **not** reproduce any prior-employer logic or vendor rules.

All generated data uses public/general fraud typologies (mule farming,
sleeper activation, APP scam cash-out) described in publicly available
financial crime literature.

## How to run

```bash
# From the repo root
python3 scripts/mockingbird/generate-arbiter-events.py
```

Output: `data/arbiter/mockingbird-events.json`

Requires Python 3.8+. No additional dependencies.

## Scenarios generated

| Scenario label         | Count | Characteristics |
|------------------------|-------|-----------------|
| `onboarding_mule_farm` | 15    | Shared devices, new accounts, some missing facial scan |
| `sleeper_activation`   | 10    | Long-dormant wallets with sudden outbound |
| `app_scam_cashout`     | 12    | New/high-risk beneficiaries, round amounts |
| `background`           | 20    | Normal low-risk transactions |

## Data schema

Each generated row conforms to the `ArbiterEvent` TypeScript contract
defined in `lib/arbiter/contract.ts`. The `_scenario_label` field is
present as a synthetic annotation for UI filtering and QA only.

**`_scenario_label` must never enter feature computation, scoring, or rules.**
See `lib/arbiter/contract.ts → stripScenarioLabel()` for the enforcement point.

## Reproducibility

The script uses a fixed random seed (`20260530`) for deterministic output.
Re-running the script produces identical events.
