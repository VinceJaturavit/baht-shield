// Arbiter Phase 2 — Tuning Engine
//
// Client-side computation helpers for the tuning workspace.
// All heavy scoring is precomputed server-side; the functions here
// remap scores → decisions and reapply custom weights — no API calls needed.
//
// BOUNDARY: _scenario_label may flow through TunedEvent (it is ground truth
// for metrics), but it must NEVER influence score, features, or decisions.

import type { ArbiterDecision, ArbiterFeatureResult, ArbiterScenarioLabel } from './contract';
import type { ArbiterMetrics } from './metrics';
import { computeArbiterMetrics, computeTypologyMetrics } from './metrics';
import { normalizeFeatureValue } from './normalize';
import { ARBITER_FEATURE_WEIGHTS } from './score';

// ---------------------------------------------------------------------------
// Threshold configuration (decision band boundaries, score 0–100)
// ---------------------------------------------------------------------------

export interface ArbiterThresholds {
  /** APPROVE / STEP_UP boundary — score < this → APPROVE */
  approveStepUp: number;
  /** STEP_UP / REVIEW boundary — score < this → STEP_UP */
  stepUpReview: number;
  /** REVIEW / BLOCK boundary — score < this → REVIEW */
  reviewBlock: number;
}

export const DEFAULT_THRESHOLDS: ArbiterThresholds = {
  approveStepUp: 25,
  stepUpReview: 50,
  reviewBlock: 75,
};

/** Validate that thresholds are strictly ordered. */
export function validateThresholds(t: ArbiterThresholds): boolean {
  return t.approveStepUp < t.stepUpReview && t.stepUpReview < t.reviewBlock;
}

// ---------------------------------------------------------------------------
// applyThresholdsToScore
//
// Maps a precomputed score to a decision using the given threshold config.
// Does NOT re-run the Zen-Engine JDM or any feature computation.
// Threshold edits only remap score → decision bucket.
// ---------------------------------------------------------------------------
export function applyThresholdsToScore(
  score: number,
  thresholds: ArbiterThresholds,
): ArbiterDecision {
  if (score >= thresholds.reviewBlock) return 'BLOCK';
  if (score >= thresholds.stepUpReview) return 'REVIEW';
  if (score >= thresholds.approveStepUp) return 'STEP_UP';
  return 'APPROVE';
}

// ---------------------------------------------------------------------------
// applyWeightsToFeatures
//
// Recomputes the composite score from precomputed normalized feature values
// using a custom weight map. Used by the feature weight editor.
// Returns the new score (0–100).
// ---------------------------------------------------------------------------
export function applyWeightsToFeatures(
  features: ArbiterFeatureResult[],
  weights: Record<string, number>,
): number {
  const maxPositiveScore = Object.values(weights).reduce(
    (sum, w) => (w > 0 ? sum + w : sum),
    0,
  );
  if (maxPositiveScore === 0) return 0;

  let rawScore = 0;
  for (const feature of features) {
    const weight = weights[feature.key];
    if (weight === undefined) continue;
    const normalizedValue =
      feature.normalized_value !== undefined
        ? feature.normalized_value
        : normalizeFeatureValue(feature.key, feature.value);
    rawScore += weight * normalizedValue;
  }

  return Math.max(0, Math.min(100, Math.round((rawScore / maxPositiveScore) * 1000) / 10));
}

// ---------------------------------------------------------------------------
// TunedEvent — precomputed event for the tuning workspace
//
// Computed server-side once on page load.
// _scenario_label is preserved for metrics evaluation — it is stripped
// before scoring (see page.tsx / server-side scoring pipeline).
// ---------------------------------------------------------------------------
export interface TunedEvent {
  eventId: string;
  walletId: string;
  /** Retained for display and evaluation only — never used in scoring. */
  scenarioLabel: ArbiterScenarioLabel | undefined;
  /** Precomputed normalized features from the scoring pipeline. */
  features: ArbiterFeatureResult[];
  /** Base score with default weights. */
  baseScore: number;
}

// ---------------------------------------------------------------------------
// TuningResult — full workspace state after applying thresholds + weights
// ---------------------------------------------------------------------------
export interface TuningResult {
  events: Array<TunedEvent & { currentScore: number; decision: ArbiterDecision }>;
  overallMetrics: ArbiterMetrics;
  typologyMetrics: ReturnType<typeof computeTypologyMetrics>;
  baselineMetrics: ArbiterMetrics;
}

// ---------------------------------------------------------------------------
// computeTuningResults
//
// Applies custom thresholds and weights to the precomputed event set.
// Returns current decisions, metrics, and the baseline comparison.
// No API calls — pure client-side computation.
// ---------------------------------------------------------------------------
export function computeTuningResults(
  events: TunedEvent[],
  thresholds: ArbiterThresholds,
  weights: Record<string, number>,
): TuningResult {
  const baselineResults = events.map((e) => ({
    ...e,
    currentScore: e.baseScore,
    decision: applyThresholdsToScore(e.baseScore, DEFAULT_THRESHOLDS),
  }));

  const scoredEvents = events.map((e) => {
    const currentScore = applyWeightsToFeatures(e.features, weights);
    const decision = applyThresholdsToScore(currentScore, thresholds);
    return { ...e, currentScore, decision };
  });

  const toPrediction = (e: (typeof scoredEvents)[number]) => ({
    scenarioLabel: e.scenarioLabel,
    decision: e.decision,
  });

  const baselinePredictions = baselineResults.map(toPrediction);
  const currentPredictions  = scoredEvents.map(toPrediction);

  return {
    events: scoredEvents,
    overallMetrics: computeArbiterMetrics(currentPredictions),
    typologyMetrics: computeTypologyMetrics(currentPredictions),
    baselineMetrics: computeArbiterMetrics(baselinePredictions),
  };
}

// ---------------------------------------------------------------------------
// DEFAULT_WEIGHTS — exported for the tuning workspace reset button
// ---------------------------------------------------------------------------
export const DEFAULT_WEIGHTS: Record<string, number> = { ...ARBITER_FEATURE_WEIGHTS };
