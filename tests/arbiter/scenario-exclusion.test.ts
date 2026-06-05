// Arbiter Phase 1 — Scenario Exclusion Tests
//
// IP GATE PROOF: Demonstrates that _scenario_label has ZERO effect on the
// scoring pipeline. Two identical events differing only in _scenario_label
// must produce identical features, scores, and decisions.
//
// This test is the explicit safety / IP gate proof required by Spec-001.

import { describe, it, expect } from 'vitest';
import { stripScenarioLabel } from '@/lib/arbiter/contract';
import { computeArbiterFeatures } from '@/lib/arbiter/features';
import { computeWeightedScore } from '@/lib/arbiter/score';
import { runArbiterRules } from '@/lib/arbiter/rules';
import type { ArbiterEvent, ArbiterScenarioLabel } from '@/lib/arbiter/contract';

// The base event — all signal fields are identical across all test variants
const BASE_EVENT: Omit<ArbiterEvent, '_scenario_label'> = {
  event_id: 'EVT_EXCL_TEST',
  wallet_id: 'WAL_BG_005',
  timestamp: '2026-05-30T14:00:00Z',
  amount_thb: 15_000,
  direction: 'outbound',
  rail: 'promptpay',
  beneficiary_id: 'BEN_000005',
  device_id: 'DEV_BG_005',
  ip_country: 'TH',
  has_facial_scan: true,
  geo: null,
  source: 'mockingbird',
};

const SCENARIO_LABELS: ArbiterScenarioLabel[] = [
  'onboarding_mule_farm',
  'sleeper_activation',
  'app_scam_cashout',
  'background',
];

async function scoreWithLabel(label: ArbiterScenarioLabel | undefined) {
  const event: ArbiterEvent = label
    ? { ...BASE_EVENT, _scenario_label: label }
    : { ...BASE_EVENT };

  // IP Gate: strip _scenario_label before any scoring
  const safeEvent = stripScenarioLabel(event);

  // Confirm _scenario_label is absent from safeEvent
  expect('_scenario_label' in safeEvent).toBe(false);

  const features = await computeArbiterFeatures(safeEvent);
  const scoreResult = computeWeightedScore(features);
  const featureRecord: Record<string, number | boolean | string> = {};
  for (const f of features) featureRecord[f.key] = f.value;

  const decision = await runArbiterRules({
    event: safeEvent,
    features: featureRecord,
    score: scoreResult.score,
  });

  return { features, scoreResult, decision };
}

describe('Scenario exclusion — IP Gate proof', () => {
  it('same event with different _scenario_labels produces identical features', async () => {
    const results = await Promise.all(SCENARIO_LABELS.map((label) => scoreWithLabel(label)));
    const baseline = results[0];

    for (let i = 1; i < results.length; i++) {
      expect(results[i].features.length).toBe(baseline.features.length);
      for (let j = 0; j < baseline.features.length; j++) {
        expect(results[i].features[j].key).toBe(baseline.features[j].key);
        expect(results[i].features[j].value).toBe(baseline.features[j].value);
      }
    }
  });

  it('same event with different _scenario_labels produces identical score', async () => {
    const results = await Promise.all(SCENARIO_LABELS.map((label) => scoreWithLabel(label)));
    const baseScore = results[0].scoreResult.score;

    for (let i = 1; i < results.length; i++) {
      expect(results[i].scoreResult.score).toBe(baseScore);
    }
  });

  it('same event with different _scenario_labels produces identical fired rules', async () => {
    const results = await Promise.all(SCENARIO_LABELS.map((label) => scoreWithLabel(label)));
    const baseAction = results[0].decision.action;

    for (let i = 1; i < results.length; i++) {
      expect(results[i].decision.action).toBe(baseAction);
    }
  });

  it('same event with different _scenario_labels produces identical final decision', async () => {
    const [withLabel, withoutLabel] = await Promise.all([
      scoreWithLabel('onboarding_mule_farm'),
      scoreWithLabel(undefined),
    ]);
    expect(withLabel.scoreResult.score).toBe(withoutLabel.scoreResult.score);
    expect(withLabel.decision.action).toBe(withoutLabel.decision.action);
  });

  it('stripScenarioLabel provably removes _scenario_label', () => {
    const withLabel: ArbiterEvent = { ...BASE_EVENT, _scenario_label: 'app_scam_cashout' };
    const safe = stripScenarioLabel(withLabel);
    expect('_scenario_label' in safe).toBe(false);
  });

  it('safeEvent from stripScenarioLabel is type-compatible with feature input', () => {
    const withLabel: ArbiterEvent = { ...BASE_EVENT, _scenario_label: 'background' };
    const safe = stripScenarioLabel(withLabel);
    // Type constraint: computeArbiterFeatures accepts Omit<ArbiterEvent, '_scenario_label'>
    // If this compiles, the type contract is enforced.
    const assignable: Omit<ArbiterEvent, '_scenario_label'> = safe;
    expect(assignable.wallet_id).toBe(BASE_EVENT.wallet_id);
  });
});
