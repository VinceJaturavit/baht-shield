// Arbiter Phase 1 — Weighted Score
//
// Takes computed feature results, applies weights, normalizes to 0–100.
// Transparent and deterministic — no ML, no hidden model.
// Weights are editable in this file for Phase 1; no UI sliders.

import type { ArbiterFeatureResult, ArbiterScoreResult, ArbiterFeatureContribution } from './contract';
import { normalizeFeatureValue } from './normalize';

// ---------------------------------------------------------------------------
// Feature weights — Phase 1 synthetic prototype defaults.
// Sum of absolute weights = 117. Score = sum(weight * normalized) / 117 * 100.
// Negative weight (account_age_days): older wallets reduce risk.
// ---------------------------------------------------------------------------
export const ARBITER_FEATURE_WEIGHTS: Record<string, number> = {
  amt_to_mean_ratio: 8,
  velocity_1h: 7,
  account_age_days: -3,       // inverted: older account = lower risk
  is_new_beneficiary: 10,
  device_account_count: 12,
  withdrawal_after_deposit: 12,
  sleeper_velocity_shock: 14,
  geo_velocity: 15,
  is_night_transaction: 3,
  daily_cumulative_thb: 8,
  beneficiary_risk_tier: 15,
  pattern_match_count: 10,
} as const;

// Pre-compute the total of absolute weights (used for normalization to 0–100)
const TOTAL_ABS_WEIGHT = Object.values(ARBITER_FEATURE_WEIGHTS).reduce(
  (sum, w) => sum + Math.abs(w),
  0,
);

// ---------------------------------------------------------------------------
// computeWeightedScore
//
// Input: array of ArbiterFeatureResult (from computeArbiterFeatures).
// _scenario_label cannot appear here because features.ts does not emit it.
// Output: ArbiterScoreResult with score 0–100 and ordered contributions.
// ---------------------------------------------------------------------------
export function computeWeightedScore(features: ArbiterFeatureResult[]): ArbiterScoreResult {
  const contributions: ArbiterFeatureContribution[] = [];

  for (const feature of features) {
    const weight = ARBITER_FEATURE_WEIGHTS[feature.key];
    if (weight === undefined) continue;

    const normalizedValue =
      feature.normalized_value !== undefined
        ? feature.normalized_value
        : normalizeFeatureValue(feature.key, feature.value);

    const points = weight * normalizedValue;

    contributions.push({
      key: feature.key,
      value: feature.value,
      weight,
      points,
      explanation: feature.explanation,
    });
  }

  // Raw score: sum of (weight * normalized_value) for all features
  const rawScore = contributions.reduce((sum, c) => sum + c.points, 0);

  // Max possible positive score = sum of positive weights * 1.0
  // This ensures score is always in [0, 100] even with the negative age weight
  const maxPositiveScore = Object.values(ARBITER_FEATURE_WEIGHTS).reduce(
    (sum, w) => (w > 0 ? sum + w : sum),
    0,
  );

  // Normalize to [0, 100]
  const score = Math.max(0, Math.min(100, (rawScore / maxPositiveScore) * 100));

  // Sort contributions by absolute contribution descending (most impactful first)
  contributions.sort((a, b) => Math.abs(b.points) - Math.abs(a.points));

  return {
    score: Math.round(score * 10) / 10,
    contributions,
  };
}
