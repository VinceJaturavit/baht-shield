// Arbiter Phase 1 — Weighted Score Unit Tests

import { describe, it, expect } from 'vitest';
import { computeWeightedScore, ARBITER_FEATURE_WEIGHTS } from '@/lib/arbiter/score';
import type { ArbiterFeatureResult } from '@/lib/arbiter/contract';

// Helper: build a minimal clean-baseline feature set
function makeCleanFeatures(overrides: Partial<Record<string, number | boolean | string>> = {}): ArbiterFeatureResult[] {
  const defaults: Record<string, number | boolean | string> = {
    amt_to_mean_ratio: 1,          // 1x mean — low
    velocity_1h: 0,
    account_age_days: 365,         // old account
    is_new_beneficiary: false,
    device_account_count: 1,
    withdrawal_after_deposit: 0,
    sleeper_velocity_shock: 0,
    geo_velocity: 0,
    is_night_transaction: false,
    daily_cumulative_thb: 1000,
    beneficiary_risk_tier: 'clean',
    pattern_match_count: 0,
  };
  const merged = { ...defaults, ...overrides };

  return Object.entries(ARBITER_FEATURE_WEIGHTS).map(([key]) => ({
    key,
    value: merged[key] ?? 0,
    explanation: `Test: ${key}`,
  }));
}

function makeRiskyFeatures(): ArbiterFeatureResult[] {
  return makeCleanFeatures({
    amt_to_mean_ratio: 15,
    velocity_1h: 8,
    account_age_days: 1,
    is_new_beneficiary: true,
    device_account_count: 6,
    withdrawal_after_deposit: 1.2,
    sleeper_velocity_shock: 8,
    geo_velocity: 1100,
    is_night_transaction: true,
    daily_cumulative_thb: 120_000,
    beneficiary_risk_tier: 'black',
    pattern_match_count: 4,
  });
}

describe('computeWeightedScore', () => {
  it('always returns a score in [0, 100]', () => {
    const cleanScore = computeWeightedScore(makeCleanFeatures()).score;
    const riskyScore = computeWeightedScore(makeRiskyFeatures()).score;
    expect(cleanScore).toBeGreaterThanOrEqual(0);
    expect(cleanScore).toBeLessThanOrEqual(100);
    expect(riskyScore).toBeGreaterThanOrEqual(0);
    expect(riskyScore).toBeLessThanOrEqual(100);
  });

  it('higher-risk features produce a higher score', () => {
    const clean = computeWeightedScore(makeCleanFeatures()).score;
    const risky = computeWeightedScore(makeRiskyFeatures()).score;
    expect(risky).toBeGreaterThan(clean);
  });

  it('clean baseline produces a low score (< 30)', () => {
    const score = computeWeightedScore(makeCleanFeatures()).score;
    expect(score).toBeLessThan(30);
  });

  it('risky profile produces a high score (> 70)', () => {
    const score = computeWeightedScore(makeRiskyFeatures()).score;
    expect(score).toBeGreaterThan(70);
  });

  it('risky beneficiary materially increases score', () => {
    const baseline = computeWeightedScore(makeCleanFeatures({ beneficiary_risk_tier: 'clean' })).score;
    const blackTier = computeWeightedScore(makeCleanFeatures({ beneficiary_risk_tier: 'black' })).score;
    expect(blackTier).toBeGreaterThan(baseline + 10);
  });

  it('contributions are ordered by absolute points descending', () => {
    const result = computeWeightedScore(makeRiskyFeatures());
    const absPoints = result.contributions.map((c) => Math.abs(c.points));
    for (let i = 0; i < absPoints.length - 1; i++) {
      expect(absPoints[i]).toBeGreaterThanOrEqual(absPoints[i + 1]);
    }
  });

  it('missing features (empty array) return score of 0', () => {
    const result = computeWeightedScore([]);
    expect(result.score).toBe(0);
    expect(result.contributions).toHaveLength(0);
  });

  it('unknown feature key is skipped without crash', () => {
    const features: ArbiterFeatureResult[] = [
      { key: 'nonexistent_feature', value: 999, explanation: 'test' },
    ];
    expect(() => computeWeightedScore(features)).not.toThrow();
    expect(computeWeightedScore(features).score).toBe(0);
  });

  it('_scenario_label does not appear in any contribution key', () => {
    const result = computeWeightedScore(makeRiskyFeatures());
    const keys = result.contributions.map((c) => c.key);
    expect(keys).not.toContain('_scenario_label');
  });

  it('score is deterministic for same inputs', () => {
    const features = makeCleanFeatures({ amt_to_mean_ratio: 5, velocity_1h: 3 });
    const s1 = computeWeightedScore(features).score;
    const s2 = computeWeightedScore(features).score;
    expect(s1).toBe(s2);
  });
});
