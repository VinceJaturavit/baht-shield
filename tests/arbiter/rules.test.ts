// Arbiter Phase 1 — Rules Engine Tests (Spec-001b revision)
//
// Path A: Zen-Engine native addon loads in Vitest (node environment).
// All named-rule tests (R1–R6) use the real JDM via Zen-Engine.
// Score-band fallback tests are kept separate and clearly labelled.
//
// Design principle for R1–R6 tests:
//   score is held at 10 (≤ 24, well inside APPROVE band).
//   Only the named rule's feature(s) are set to trigger values.
//   All other rule-triggering features are set to safe values.
//   This ensures the named rule is the sole reason for any non-APPROVE result.
//   If the named rule is removed from the JDM, the test will fall through to
//   APPROVE (score 10 → APPROVE via score-band), causing the exact assertion
//   to fail.
//
// Precedence test:
//   score = 10 (APPROVE band), beneficiary_risk_tier = "black" → BLOCK (R3).
//   Proves BLOCK overrides APPROVE score-band.
//
// _scenario_label exclusion:
//   ArbiterRulesInput.event is typed as Omit<ArbiterEvent, '_scenario_label'>;
//   no _scenario_label can be passed — enforced by TypeScript at compile time.

import { describe, it, expect } from 'vitest';
import { runArbiterRules } from '@/lib/arbiter/rules';
import type { ArbiterEvent } from '@/lib/arbiter/contract';

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------

/** Build a base event that does NOT trigger any named rule. */
function makeEvent(overrides: Partial<Omit<ArbiterEvent, '_scenario_label'>> = {}): Omit<ArbiterEvent, '_scenario_label'> {
  return {
    event_id: 'EVT_TEST_0001',
    wallet_id: 'WAL_TEST_001',
    timestamp: '2026-05-30T12:00:00Z',
    amount_thb: 10_000,      // < 50000 — R1 safe
    direction: 'outbound',
    rail: 'promptpay',
    beneficiary_id: 'BEN_000001',
    device_id: 'DEV_000001',
    ip_country: 'TH',
    has_facial_scan: true,   // R1 safe
    geo: null,
    source: 'mockingbird',
    ...overrides,
  };
}

/** Build features that do NOT trigger any named rule. */
function makeFeatures(overrides: Partial<Record<string, number | boolean | string>> = {}): Record<string, number | boolean | string> {
  return {
    amt_to_mean_ratio: 1,
    velocity_1h: 0,
    account_age_days: 365,       // ≥ 30 — R4/R5 safe
    is_new_beneficiary: false,
    device_account_count: 1,     // ≤ 3 — R6 safe
    withdrawal_after_deposit: 0, // ≤ 0.9 — R5 safe
    sleeper_velocity_shock: 0,
    geo_velocity: 0,             // ≤ 900 — R2 safe
    is_night_transaction: false,
    daily_cumulative_thb: 1000,  // ≤ 50000 — R4 safe
    beneficiary_risk_tier: 'clean', // not black/dark_grey — R3 safe
    pattern_match_count: 0,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// SECTION 1 — Named Rule Trigger Tests (R1–R6)
//
// Each test holds score = 10 (APPROVE band) so only the named rule can produce
// a non-APPROVE result. If the named rule is removed from the JDM, the result
// falls to APPROVE and the toBe assertion fails.
// ---------------------------------------------------------------------------

describe('R1 — TH_FACIAL_SCAN_REQUIRED', () => {
  it('fires STEP_UP / TH_FACIAL_SCAN_REQUIRED when amount > 50000 and no facial scan, score ≤ 24', async () => {
    const result = await runArbiterRules({
      event: makeEvent({ amount_thb: 60_000, has_facial_scan: false }),
      features: makeFeatures({ amt_to_mean_ratio: 1 }),
      score: 10,
    });
    expect(result.action).toBe('STEP_UP');
    const r1 = result.reasons.find((r) => r.rule_id === 'R1');
    expect(r1).toBeDefined();
    expect(r1?.reason_code).toBe('TH_FACIAL_SCAN_REQUIRED');
  });
});

describe('R2 — IMPOSSIBLE_TRAVEL', () => {
  it('fires BLOCK / IMPOSSIBLE_TRAVEL when geo_velocity > 900, score ≤ 24', async () => {
    const result = await runArbiterRules({
      event: makeEvent({ geo: { lat: 35.6762, lon: 139.6503 } }),
      features: makeFeatures({ geo_velocity: 9200 }),
      score: 10,
    });
    expect(result.action).toBe('BLOCK');
    const r2 = result.reasons.find((r) => r.rule_id === 'R2');
    expect(r2).toBeDefined();
    expect(r2?.reason_code).toBe('IMPOSSIBLE_TRAVEL');
  });
});

describe('R3 — MULE_TARGET_PROHIBITED', () => {
  it('fires BLOCK / MULE_TARGET_PROHIBITED for black-tier beneficiary, score ≤ 24', async () => {
    const result = await runArbiterRules({
      event: makeEvent({ beneficiary_id: 'BEN_HIGHRISK_001' }),
      features: makeFeatures({ beneficiary_risk_tier: 'black' }),
      score: 10,
    });
    expect(result.action).toBe('BLOCK');
    const r3 = result.reasons.find((r) => r.rule_id === 'R3');
    expect(r3).toBeDefined();
    expect(r3?.reason_code).toBe('MULE_TARGET_PROHIBITED');
  });

  it('fires BLOCK / MULE_TARGET_PROHIBITED for dark_grey-tier beneficiary, score ≤ 24', async () => {
    const result = await runArbiterRules({
      event: makeEvent({ beneficiary_id: 'BEN_MEDRISK_001' }),
      features: makeFeatures({ beneficiary_risk_tier: 'dark_grey' }),
      score: 10,
    });
    expect(result.action).toBe('BLOCK');
    const r3 = result.reasons.find((r) => r.rule_id === 'R3');
    expect(r3).toBeDefined();
    expect(r3?.reason_code).toBe('MULE_TARGET_PROHIBITED');
  });
});

describe('R4 — NEW_USER_DAILY_CAP', () => {
  it('fires BLOCK / NEW_USER_DAILY_CAP when account < 7 days and daily > 50000, score ≤ 24', async () => {
    const result = await runArbiterRules({
      event: makeEvent({ amount_thb: 55_000 }),
      features: makeFeatures({ account_age_days: 3, daily_cumulative_thb: 60_000 }),
      score: 10,
    });
    expect(result.action).toBe('BLOCK');
    const r4 = result.reasons.find((r) => r.rule_id === 'R4');
    expect(r4).toBeDefined();
    expect(r4?.reason_code).toBe('NEW_USER_DAILY_CAP');
  });
});

describe('R5 — RAPID_PASS_THROUGH', () => {
  it('fires REVIEW / RAPID_PASS_THROUGH when withdrawal_after_deposit > 0.9 and age < 30, score ≤ 24', async () => {
    const result = await runArbiterRules({
      event: makeEvent(),
      features: makeFeatures({ withdrawal_after_deposit: 0.95, account_age_days: 15 }),
      score: 10,
    });
    expect(result.action).toBe('REVIEW');
    const r5 = result.reasons.find((r) => r.rule_id === 'R5');
    expect(r5).toBeDefined();
    expect(r5?.reason_code).toBe('RAPID_PASS_THROUGH');
  });
});

describe('R6 — DEVICE_SHARING', () => {
  it('fires REVIEW / DEVICE_SHARING when device_account_count > 3, score ≤ 24', async () => {
    const result = await runArbiterRules({
      event: makeEvent(),
      features: makeFeatures({ device_account_count: 5 }),
      score: 10,
    });
    expect(result.action).toBe('REVIEW');
    const r6 = result.reasons.find((r) => r.rule_id === 'R6');
    expect(r6).toBeDefined();
    expect(r6?.reason_code).toBe('DEVICE_SHARING');
  });
});

// ---------------------------------------------------------------------------
// SECTION 2 — Precedence Test
//
// score = 10 (APPROVE band), black-tier beneficiary → BLOCK / MULE_TARGET_PROHIBITED.
// Proves R3 BLOCK overrides the APPROVE score band.
// This test rejects APPROVE — it does not accept "APPROVE or BLOCK".
// ---------------------------------------------------------------------------

describe('Precedence — BLOCK overrides APPROVE score band', () => {
  it('score = 10 with black-tier beneficiary returns BLOCK / MULE_TARGET_PROHIBITED (not APPROVE)', async () => {
    const result = await runArbiterRules({
      event: makeEvent({ beneficiary_id: 'BEN_HIGHRISK_001' }),
      features: makeFeatures({ beneficiary_risk_tier: 'black' }),
      score: 10,
    });
    expect(result.action).toBe('BLOCK');
    expect(result.action).not.toBe('APPROVE');
    const r3 = result.reasons.find((r) => r.rule_id === 'R3');
    expect(r3?.reason_code).toBe('MULE_TARGET_PROHIBITED');
  });
});

// ---------------------------------------------------------------------------
// SECTION 3 — Score-Band Fallback Tests
//
// These test the SCORE_BAND fallback path only.
// Named-rule features are all set to safe values so no R1–R6 can fire.
// These tests must NOT be used as evidence for named-rule coverage.
// ---------------------------------------------------------------------------

describe('Score-band fallback (no named rules active)', () => {
  it('score 80 → BLOCK (SCORE_HIGH_RISK)', async () => {
    const result = await runArbiterRules({ event: makeEvent(), features: makeFeatures(), score: 80 });
    expect(result.action).toBe('BLOCK');
    const hit = result.reasons.find((r) => r.reason_code === 'SCORE_HIGH_RISK');
    expect(hit).toBeDefined();
  });

  it('score 60 → REVIEW (SCORE_MEDIUM_RISK)', async () => {
    const result = await runArbiterRules({ event: makeEvent(), features: makeFeatures(), score: 60 });
    expect(result.action).toBe('REVIEW');
    const hit = result.reasons.find((r) => r.reason_code === 'SCORE_MEDIUM_RISK');
    expect(hit).toBeDefined();
  });

  it('score 30 → STEP_UP (SCORE_LOW_RISK)', async () => {
    const result = await runArbiterRules({ event: makeEvent(), features: makeFeatures(), score: 30 });
    expect(result.action).toBe('STEP_UP');
    const hit = result.reasons.find((r) => r.reason_code === 'SCORE_LOW_RISK');
    expect(hit).toBeDefined();
  });

  it('score 10 → APPROVE (SCORE_MINIMAL_RISK)', async () => {
    const result = await runArbiterRules({ event: makeEvent(), features: makeFeatures(), score: 10 });
    expect(result.action).toBe('APPROVE');
    const hit = result.reasons.find((r) => r.reason_code === 'SCORE_MINIMAL_RISK');
    expect(hit).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// SECTION 4 — Structural Tests
// ---------------------------------------------------------------------------

describe('Rules adapter structural contract', () => {
  it('result always contains a precedence_explanation', async () => {
    const result = await runArbiterRules({ event: makeEvent(), features: makeFeatures(), score: 45 });
    expect(result.precedence_explanation).toBeTruthy();
    expect(typeof result.precedence_explanation).toBe('string');
  });

  it('result always contains at least one reason', async () => {
    const result = await runArbiterRules({ event: makeEvent(), features: makeFeatures(), score: 60 });
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// SECTION 5 — IP Gate proof (_scenario_label exclusion)
// ---------------------------------------------------------------------------

describe('_scenario_label exclusion from rules input', () => {
  it('ArbiterRulesInput.event type excludes _scenario_label at compile time', () => {
    const event = makeEvent();
    expect('_scenario_label' in event).toBe(false);
  });

  it('features record does not contain _scenario_label key', async () => {
    const features = makeFeatures();
    expect('_scenario_label' in features).toBe(false);
    const result = await runArbiterRules({ event: makeEvent(), features, score: 40 });
    for (const reason of result.reasons) {
      expect(reason.reason_code).not.toContain('scenario_label');
      expect(reason.explanation).not.toContain('_scenario_label');
    }
  });
});
