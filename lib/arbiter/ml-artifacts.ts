// Arbiter Phase 3 — ML Artifact Loader
//
// Phase 3 ML artifacts are generated offline from synthetic data.
// This module only imports static JSON for display.
// Do not call Python, a model server, or /api/arbiter/score from here.
//
// Architecture boundary:
//   offline Python training → static JSON artifacts → this loader → UI display
//
// No runtime Python. No model server. No inference at request time.
// /api/arbiter/score is NOT called from this module.
// _scenario_label appears in artifact records only as evaluation metadata
// (offline label). It is never used as a runtime feature or rule input.

import mlScoresRaw             from '@/data/arbiter/ml/ml_scores.json';
import mlCoefficientsRaw       from '@/data/arbiter/ml/ml_coefficients.json';
import mlCalibrationBinsRaw    from '@/data/arbiter/ml/ml_calibration_bins.json';
import mlVsRuleComparisonRaw   from '@/data/arbiter/ml/ml_vs_rule_comparison.json';
import mlHeldoutMetricsRaw     from '@/data/arbiter/ml/ml_heldout_metrics.json';

// ---------------------------------------------------------------------------
// Types — shaped from the Python training script output
// ---------------------------------------------------------------------------

export type ComparisonType = 'AGREE_HIGH' | 'AGREE_LOW' | 'ML_HIGH_RULE_LOW' | 'ML_LOW_RULE_HIGH';

export interface MlDriverContribution {
  feature:      string;
  contribution: number;
}

export interface MlScoreRecord {
  event_id:            string;
  wallet_id:           string;
  scenario_label:      string;
  ground_truth_label:  'fraud' | 'background';
  ml_probability:      number;
  ml_score:            number;
  rule_weighted_score: number;
  rule_final_decision: string;
  rule_reason_codes:   string[];
  top_ml_drivers:      MlDriverContribution[];
  top_rule_drivers:    string[];
  features:            Record<string, number | boolean | string>;
}

export interface MlCoefficientItem {
  feature:         string;
  coefficient:     number;
  abs_coefficient: number;
  rank:            number;
  direction:       'fraud_positive' | 'fraud_negative';
  scaler_mean:     number;
  scaler_std:      number;
}

export interface MlCoefficients {
  model:          string;
  label_source:   string;
  intercept:      number;
  features:       MlCoefficientItem[];
  feature_order:  string[];
}

export interface MlCalibrationBin {
  bin_start:                    number;
  bin_end:                      number;
  count:                        number;
  mean_predicted_probability:   number;
  observed_fraud_rate:          number;
}

export interface MlCalibrationBins {
  bins: MlCalibrationBin[];
}

export interface MlVsRuleRecord {
  event_id:            string;
  wallet_id:           string;
  scenario_label:      string;
  ground_truth_label:  string;
  comparison_type:     ComparisonType;
  ml_probability:      number;
  ml_score:            number;
  rule_decision:       string;
  rule_weighted_score: number;
  rule_reason_codes:   string[];
  top_ml_drivers:      MlDriverContribution[];
  top_rule_drivers:    string[];
  features:            Record<string, number | boolean | string>;
}

export interface MlHeldoutMetrics {
  precision:        number;
  recall:           number;
  f1:               number;
  roc_auc:          number;
  threshold:        number;
  confusion_matrix: { tn: number; fp: number; fn: number; tp: number };
  support: {
    total_test:      number;
    fraud_test:      number;
    background_test: number;
  };
  train_test_split: {
    total:          number;
    train:          number;
    test:           number;
    test_fraction:  number;
    random_seed:    number;
  };
  per_typology_recall: Record<string, { support: number; recall: number }>;
  model:        string;
  label_source: string;
}

// ---------------------------------------------------------------------------
// Typed accessors — single source of truth for UI components
// ---------------------------------------------------------------------------

export function getMlScores(): MlScoreRecord[] {
  return mlScoresRaw as MlScoreRecord[];
}

export function getMlCoefficients(): MlCoefficients {
  return mlCoefficientsRaw as MlCoefficients;
}

export function getMlCalibrationBins(): MlCalibrationBins {
  return mlCalibrationBinsRaw as MlCalibrationBins;
}

export function getMlVsRuleComparison(): MlVsRuleRecord[] {
  return mlVsRuleComparisonRaw as MlVsRuleRecord[];
}

export function getMlHeldoutMetrics(): MlHeldoutMetrics {
  return mlHeldoutMetricsRaw as MlHeldoutMetrics;
}

export function getDisagreementCases(): MlVsRuleRecord[] {
  return (mlVsRuleComparisonRaw as MlVsRuleRecord[]).filter(
    (r) => r.comparison_type === 'ML_HIGH_RULE_LOW' || r.comparison_type === 'ML_LOW_RULE_HIGH',
  );
}

// ---------------------------------------------------------------------------
// Convenience: hand weights from score.ts — imported for comparison display.
// This import is display-only and does NOT change weight values or scoring.
// ---------------------------------------------------------------------------

export { ARBITER_FEATURE_WEIGHTS } from '@/lib/arbiter/score';
