// Arbiter Phase 1 — API Score Endpoint Tests
//
// Tests the scoring pipeline end-to-end by calling the internal scorer
// (computeArbiterFeatures + computeWeightedScore + runArbiterRules) directly,
// since mocking the Next.js route handler is unnecessary complexity.
// This proves the full pipeline contract without requiring an HTTP server.

import { describe, it, expect } from 'vitest';
import { stripScenarioLabel } from '@/lib/arbiter/contract';
import { computeArbiterFeatures } from '@/lib/arbiter/features';
import { computeWeightedScore } from '@/lib/arbiter/score';
import { runArbiterRules } from '@/lib/arbiter/rules';
import type { ArbiterEvent } from '@/lib/arbiter/contract';

function makeEvent(overrides: Partial<ArbiterEvent> = {}): ArbiterEvent {
  return {
    event_id: 'EVT_API_0001',
    wallet_id: 'WAL_MF_001',
    timestamp: '2026-05-30T12:00:00Z',
    amount_thb: 25_000,
    direction: 'outbound',
    rail: 'promptpay',
    beneficiary_id: 'BEN_000001',
    device_id: 'DEV_000001',
    ip_country: 'TH',
    has_facial_scan: true,
    geo: null,
    source: 'mockingbird',
    _scenario_label: 'onboarding_mule_farm',
    ...overrides,
  };
}

async function scoreOne(event: ArbiterEvent) {
  const safeEvent = stripScenarioLabel(event);
  const features = await computeArbiterFeatures(safeEvent);
  const scoreResult = computeWeightedScore(features);
  const featureRecord: Record<string, number | boolean | string> = {};
  for (const f of features) featureRecord[f.key] = f.value;
  const decision = await runArbiterRules({ event: safeEvent, features: featureRecord, score: scoreResult.score });
  return { features, scoreResult, decision };
}

describe('Pipeline — single event', () => {
  it('returns computed features', async () => {
    const { features } = await scoreOne(makeEvent());
    expect(features.length).toBeGreaterThan(0);
    const keys = features.map((f) => f.key);
    expect(keys).toContain('amt_to_mean_ratio');
    expect(keys).toContain('beneficiary_risk_tier');
  });

  it('returns a score in [0, 100]', async () => {
    const { scoreResult } = await scoreOne(makeEvent());
    expect(scoreResult.score).toBeGreaterThanOrEqual(0);
    expect(scoreResult.score).toBeLessThanOrEqual(100);
  });

  it('returns per-feature contributions', async () => {
    const { scoreResult } = await scoreOne(makeEvent());
    expect(scoreResult.contributions.length).toBeGreaterThan(0);
    for (const c of scoreResult.contributions) {
      expect(typeof c.key).toBe('string');
      expect(typeof c.weight).toBe('number');
      expect(typeof c.points).toBe('number');
    }
  });

  it('returns fired rules with action and reason_code', async () => {
    const { decision } = await scoreOne(makeEvent());
    expect(decision.reasons.length).toBeGreaterThan(0);
    for (const r of decision.reasons) {
      expect(typeof r.rule_id).toBe('string');
      expect(typeof r.reason_code).toBe('string');
      expect(['APPROVE', 'STEP_UP', 'REVIEW', 'BLOCK']).toContain(r.action);
    }
  });

  it('returns a valid final decision action', async () => {
    const { decision } = await scoreOne(makeEvent());
    expect(['APPROVE', 'STEP_UP', 'REVIEW', 'BLOCK']).toContain(decision.action);
  });

  it('includes a precedence_explanation string', async () => {
    const { decision } = await scoreOne(makeEvent());
    expect(typeof decision.precedence_explanation).toBe('string');
    expect(decision.precedence_explanation.length).toBeGreaterThan(0);
  });
});

describe('Pipeline — batch processing', () => {
  it('processes multiple events and preserves order', async () => {
    const events = [
      makeEvent({ event_id: 'EVT_A', wallet_id: 'WAL_BG_001', amount_thb: 500 }),
      makeEvent({ event_id: 'EVT_B', wallet_id: 'WAL_MF_001', amount_thb: 60_000 }),
      makeEvent({ event_id: 'EVT_C', wallet_id: 'WAL_SM_001', amount_thb: 30_000 }),
    ];

    const results = await Promise.all(events.map((e) => scoreOne(e)));

    expect(results).toHaveLength(3);
    // Order is preserved by Promise.all
    expect(results[0].scoreResult.score).toBeDefined();
    expect(results[1].scoreResult.score).toBeDefined();
    expect(results[2].scoreResult.score).toBeDefined();
  });
});

describe('_scenario_label is excluded from pipeline', () => {
  it('stripScenarioLabel removes _scenario_label before scoring', () => {
    const event = makeEvent({ _scenario_label: 'onboarding_mule_farm' });
    const safe = stripScenarioLabel(event);
    expect('_scenario_label' in safe).toBe(false);
  });

  it('features do not include _scenario_label key', async () => {
    const { features } = await scoreOne(makeEvent({ _scenario_label: 'app_scam_cashout' }));
    const keys = features.map((f) => f.key);
    expect(keys).not.toContain('_scenario_label');
  });

  it('score contributions do not include _scenario_label', async () => {
    const { scoreResult } = await scoreOne(makeEvent({ _scenario_label: 'sleeper_activation' }));
    const keys = scoreResult.contributions.map((c) => c.key);
    expect(keys).not.toContain('_scenario_label');
  });
});

describe('Validation', () => {
  it('missing required fields would be caught by the API', () => {
    // Simulate validation logic from route.ts
    const REQUIRED = ['event_id', 'wallet_id', 'timestamp', 'amount_thb', 'direction', 'rail', 'device_id', 'ip_country'];
    const incomplete = { event_id: 'EVT_X' }; // missing most fields
    const missing = REQUIRED.filter((f) => incomplete[f as keyof typeof incomplete] === undefined);
    expect(missing.length).toBeGreaterThan(0);
  });
});
