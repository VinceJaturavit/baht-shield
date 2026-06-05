// Arbiter Phase 2 — Feature Weight Tuning Tests

import { describe, it, expect } from 'vitest';
import { applyWeightsToFeatures, DEFAULT_WEIGHTS } from '@/lib/arbiter/tuning';
import type { ArbiterFeatureResult } from '@/lib/arbiter/contract';

// Single normalized feature at full value
function makeFeature(key: string, value: number, normalized: number): ArbiterFeatureResult {
  return { key, value, normalized_value: normalized, explanation: '' };
}

describe('applyWeightsToFeatures — basic scoring', () => {
  it('zero normalized values → score 0', () => {
    const features = Object.keys(DEFAULT_WEIGHTS).map((k) => makeFeature(k, 0, 0));
    expect(applyWeightsToFeatures(features, DEFAULT_WEIGHTS)).toBe(0);
  });

  it('all positive features at max → score 100', () => {
    const features = Object.keys(DEFAULT_WEIGHTS)
      .filter((k) => DEFAULT_WEIGHTS[k] > 0)
      .map((k) => makeFeature(k, 1, 1));
    // Negative weight features absent → score = maxPositiveScore / maxPositiveScore * 100 = 100
    expect(applyWeightsToFeatures(features, DEFAULT_WEIGHTS)).toBe(100);
  });

  it('single feature at 1.0 produces predictable fractional score', () => {
    const features = [makeFeature('velocity_1h', 5, 1)];
    const maxPositive = Object.values(DEFAULT_WEIGHTS).reduce(
      (s, w) => (w > 0 ? s + w : s), 0,
    );
    const expected = Math.round((7 / maxPositive) * 1000) / 10;
    expect(applyWeightsToFeatures(features, DEFAULT_WEIGHTS)).toBeCloseTo(expected, 1);
  });

  it('zero weight map → score 0 (no division by zero)', () => {
    expect(applyWeightsToFeatures([], {})).toBe(0);
  });
});

describe('applyWeightsToFeatures — weight changes affect score', () => {
  it('doubling velocity_1h weight raises score', () => {
    const features = [makeFeature('velocity_1h', 5, 1)];
    const baseScore  = applyWeightsToFeatures(features, DEFAULT_WEIGHTS);
    const boosted = { ...DEFAULT_WEIGHTS, velocity_1h: 14 };
    const boostedScore = applyWeightsToFeatures(features, boosted);
    expect(boostedScore).toBeGreaterThan(baseScore);
  });

  it('zeroing a weight removes its contribution', () => {
    const features = [
      makeFeature('velocity_1h', 5, 1),
      makeFeature('device_account_count', 5, 1),
    ];
    const zeroVel = { ...DEFAULT_WEIGHTS, velocity_1h: 0 };
    const baseScore  = applyWeightsToFeatures(features, DEFAULT_WEIGHTS);
    const zeroedScore = applyWeightsToFeatures(features, zeroVel);
    expect(zeroedScore).toBeLessThan(baseScore);
  });

  it('custom weights produce same score as manual calculation', () => {
    const customWeights = { velocity_1h: 10, device_account_count: 5 };
    const features = [
      makeFeature('velocity_1h', 5, 0.6),
      makeFeature('device_account_count', 4, 0.75),
    ];
    // maxPositive = 10 + 5 = 15
    // rawScore = 10*0.6 + 5*0.75 = 6 + 3.75 = 9.75
    // score = 9.75/15 * 100 = 65
    expect(applyWeightsToFeatures(features, customWeights)).toBeCloseTo(65, 0);
  });
});

describe('applyWeightsToFeatures — score stays in [0, 100]', () => {
  it('extreme values do not produce score > 100', () => {
    const features = Object.keys(DEFAULT_WEIGHTS).map((k) => makeFeature(k, 999, 1));
    expect(applyWeightsToFeatures(features, DEFAULT_WEIGHTS)).toBeLessThanOrEqual(100);
  });

  it('negative weights do not produce score < 0', () => {
    const allNeg = { account_age_days: -100, is_night_transaction: -50 };
    const features = [
      makeFeature('account_age_days', 0, 1),
      makeFeature('is_night_transaction', true as unknown as number, 1),
    ];
    expect(applyWeightsToFeatures(features, allNeg)).toBeGreaterThanOrEqual(0);
  });
});
