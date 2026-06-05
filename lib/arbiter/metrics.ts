// Arbiter Phase 2 — Metrics Engine
//
// Computes confusion matrix and standard evaluation metrics from a labeled
// synthetic event set.
//
// BOUNDARY RULE — _scenario_label usage:
//   _scenario_label is evaluation ground truth for the Phase 2 tuning sandbox
//   ONLY. It is never used by feature computation, scoring, rule execution,
//   or live decisioning. This file is the single permitted consumer.
//
// Import restriction:
//   isGroundTruthPositive() must NOT be imported into features.ts, score.ts,
//   normalize.ts, rules.ts, context.ts, or any API route. Only metrics.ts
//   and tuning-workspace code may call it.

import type { ArbiterDecision, ArbiterScenarioLabel } from './contract';

// ---------------------------------------------------------------------------
// Ground-truth and prediction mappings — single source of truth
// ---------------------------------------------------------------------------

/**
 * Evaluation ground-truth mapping.
 * PERMITTED only inside metrics/evaluation code — never in scoring pipeline.
 *
 * Positive (fraud): onboarding_mule_farm | sleeper_activation | app_scam_cashout
 * Negative (legit): background
 * undefined: treated as negative (defensive; should not occur in labeled set)
 */
export function isGroundTruthPositive(scenarioLabel: string | undefined): boolean {
  return (
    scenarioLabel === 'onboarding_mule_farm' ||
    scenarioLabel === 'sleeper_activation' ||
    scenarioLabel === 'app_scam_cashout'
  );
}

/**
 * Prediction mapping for confusion matrix.
 *
 * For Phase 2 tuning, REVIEW/BLOCK are treated as fraud-positive operational
 * interventions. APPROVE/STEP_UP are treated as negative for confusion-matrix
 * purposes. This is an evaluation mapping only, not a production fraud label.
 *
 * Predicted positive: BLOCK | REVIEW
 * Predicted negative: APPROVE | STEP_UP
 */
export function isPredictedPositive(decision: ArbiterDecision): boolean {
  return decision === 'BLOCK' || decision === 'REVIEW';
}

// ---------------------------------------------------------------------------
// Confusion matrix and metrics types
// ---------------------------------------------------------------------------

export interface ArbiterConfusionMatrix {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}

export interface ArbiterMetrics {
  confusionMatrix: ArbiterConfusionMatrix;
  /** TP / (TP + FP). Returns 0 if denominator is 0. */
  precision: number;
  /** TP / (TP + FN). Returns 0 if denominator is 0. */
  recall: number;
  /** FP / (FP + TN). Returns 0 if denominator is 0. */
  falsePositiveRate: number;
  /** 2 × precision × recall / (precision + recall). Returns 0 if denominator is 0. */
  f1: number;
}

export interface ArbiterTypologyMetrics {
  scenarioLabel: ArbiterScenarioLabel;
  /** Overall metrics for this typology (one-vs-background). */
  metrics: ArbiterMetrics;
  /** Number of events for this typology in the evaluation set. */
  support: number;
}

// ---------------------------------------------------------------------------
// Labeled prediction — one row from the evaluation set
// ---------------------------------------------------------------------------

export interface LabeledPrediction {
  scenarioLabel: string | undefined;
  decision: ArbiterDecision;
}

// ---------------------------------------------------------------------------
// Safe divide — returns 0 when denominator is 0 to prevent NaN
// ---------------------------------------------------------------------------
function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return numerator / denominator;
}

// ---------------------------------------------------------------------------
// computeArbiterMetrics
//
// Computes overall confusion matrix + precision/recall/FPR/F1 from a set
// of labeled predictions.
//
// Math:
//   TP = predicted positive AND ground-truth positive
//   FP = predicted positive AND ground-truth negative
//   TN = predicted negative AND ground-truth negative
//   FN = predicted negative AND ground-truth positive
//   precision  = TP / (TP + FP)
//   recall     = TP / (TP + FN)
//   FPR        = FP / (FP + TN)
//   F1         = 2 × precision × recall / (precision + recall)
// ---------------------------------------------------------------------------
export function computeArbiterMetrics(predictions: LabeledPrediction[]): ArbiterMetrics {
  let tp = 0, fp = 0, tn = 0, fn = 0;

  for (const { scenarioLabel, decision } of predictions) {
    const groundPos = isGroundTruthPositive(scenarioLabel);
    const predPos   = isPredictedPositive(decision);

    if (predPos && groundPos)  tp++;
    else if (predPos && !groundPos) fp++;
    else if (!predPos && !groundPos) tn++;
    else fn++; // !predPos && groundPos
  }

  const precision         = safeDivide(tp, tp + fp);
  const recall            = safeDivide(tp, tp + fn);
  const falsePositiveRate = safeDivide(fp, fp + tn);
  const f1                = safeDivide(2 * precision * recall, precision + recall);

  return {
    confusionMatrix: { tp, fp, tn, fn },
    precision,
    recall,
    falsePositiveRate,
    f1,
  };
}

// ---------------------------------------------------------------------------
// computeTypologyMetrics
//
// Per-typology one-vs-background evaluation.
//
// For each fraud typology:
//   - Positive: events of that typology only
//   - Negative: background events only
//   - Other fraud typologies are EXCLUDED from that typology's calculation
//
// This gives a clean signal: "does the pipeline flag this specific fraud
// type against a clean baseline?" without cross-contamination from other
// fraud types inflating or deflating numbers.
// ---------------------------------------------------------------------------
export function computeTypologyMetrics(
  predictions: LabeledPrediction[],
): ArbiterTypologyMetrics[] {
  const typologies: ArbiterScenarioLabel[] = [
    'onboarding_mule_farm',
    'sleeper_activation',
    'app_scam_cashout',
  ];

  return typologies.map((typology) => {
    // One-vs-background: only include this typology's events + background events
    const filtered = predictions.filter(
      (p) => p.scenarioLabel === typology || p.scenarioLabel === 'background',
    );

    const metrics = computeArbiterMetrics(filtered);
    const support = predictions.filter((p) => p.scenarioLabel === typology).length;

    return { scenarioLabel: typology, metrics, support };
  });
}

// ---------------------------------------------------------------------------
// computeMetricsDelta
//
// Computes the quantified difference between two sets of metrics.
// Used by WhatChangedSummary and RuleBacktestPanel.
// ---------------------------------------------------------------------------
export interface ArbiterMetricsDelta {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  precision: number;
  recall: number;
  falsePositiveRate: number;
  f1: number;
}

export function computeMetricsDelta(
  baseline: ArbiterMetrics,
  candidate: ArbiterMetrics,
): ArbiterMetricsDelta {
  return {
    tp: candidate.confusionMatrix.tp - baseline.confusionMatrix.tp,
    fp: candidate.confusionMatrix.fp - baseline.confusionMatrix.fp,
    tn: candidate.confusionMatrix.tn - baseline.confusionMatrix.tn,
    fn: candidate.confusionMatrix.fn - baseline.confusionMatrix.fn,
    precision: candidate.precision - baseline.precision,
    recall: candidate.recall - baseline.recall,
    falsePositiveRate: candidate.falsePositiveRate - baseline.falsePositiveRate,
    f1: candidate.f1 - baseline.f1,
  };
}
