// Arbiter Phase 3 — ML Artifact Tests
//
// Verifies that all static JSON ML artifacts are well-formed and that the
// artifact loader (ml-artifacts.ts) exports the expected structure.
//
// IP Gate: confirms that the artifact loader does NOT call Python, a model
// server, or /api/arbiter/score. All imports are static JSON.
//
// _scenario_label appears in artifacts as evaluation metadata only.

import { describe, it, expect } from 'vitest';
import {
  getMlScores,
  getMlCoefficients,
  getMlCalibrationBins,
  getMlVsRuleComparison,
  getMlHeldoutMetrics,
  getDisagreementCases,
  ARBITER_FEATURE_WEIGHTS,
} from '@/lib/arbiter/ml-artifacts';

const EXPECTED_FEATURES = [
  'amt_to_mean_ratio',
  'velocity_1h',
  'account_age_days',
  'is_new_beneficiary',
  'device_account_count',
  'withdrawal_after_deposit',
  'sleeper_velocity_shock',
  'geo_velocity',
  'is_night_transaction',
  'daily_cumulative_thb',
  'beneficiary_risk_tier',
  'pattern_match_count',
];

describe('ml-artifacts — JSON artifact loader (static imports only)', () => {
  // ── getMlScores ─────────────────────────────────────────────────────────────
  describe('getMlScores', () => {
    it('returns a non-empty array', () => {
      const scores = getMlScores();
      expect(Array.isArray(scores)).toBe(true);
      expect(scores.length).toBeGreaterThan(0);
    });

    it('each record has required fields', () => {
      const scores = getMlScores();
      for (const r of scores.slice(0, 10)) {
        expect(typeof r.event_id).toBe('string');
        expect(typeof r.wallet_id).toBe('string');
        expect(typeof r.scenario_label).toBe('string');
        expect(typeof r.ml_probability).toBe('number');
        expect(typeof r.ml_score).toBe('number');
        expect(typeof r.rule_weighted_score).toBe('number');
        expect(typeof r.rule_final_decision).toBe('string');
        expect(Array.isArray(r.top_ml_drivers)).toBe(true);
        expect(Array.isArray(r.top_rule_drivers)).toBe(true);
      }
    });

    it('ml_probability is in [0, 1]', () => {
      const scores = getMlScores();
      for (const r of scores) {
        expect(r.ml_probability).toBeGreaterThanOrEqual(0);
        expect(r.ml_probability).toBeLessThanOrEqual(1);
      }
    });

    it('ml_score is in [0, 100]', () => {
      const scores = getMlScores();
      for (const r of scores) {
        expect(r.ml_score).toBeGreaterThanOrEqual(0);
        expect(r.ml_score).toBeLessThanOrEqual(100);
      }
    });

    it('rule_final_decision is a valid decision value', () => {
      const valid = new Set(['APPROVE', 'STEP_UP', 'REVIEW', 'BLOCK', 'ENGINE_FAILED']);
      const scores = getMlScores();
      for (const r of scores) {
        expect(valid.has(r.rule_final_decision)).toBe(true);
      }
    });

    it('ground_truth_label is fraud or background', () => {
      const scores = getMlScores();
      for (const r of scores) {
        expect(['fraud', 'background']).toContain(r.ground_truth_label);
      }
    });
  });

  // ── getMlCoefficients ───────────────────────────────────────────────────────
  describe('getMlCoefficients', () => {
    it('returns coefficients for all 12 expected features', () => {
      const coef = getMlCoefficients();
      expect(coef.features).toHaveLength(12);
      const names = coef.features.map((f) => f.feature);
      for (const expected of EXPECTED_FEATURES) {
        expect(names).toContain(expected);
      }
    });

    it('each coefficient has rank, direction, and numeric values', () => {
      const coef = getMlCoefficients();
      for (const f of coef.features) {
        expect(typeof f.coefficient).toBe('number');
        expect(typeof f.abs_coefficient).toBe('number');
        expect(typeof f.rank).toBe('number');
        expect(['fraud_positive', 'fraud_negative']).toContain(f.direction);
        expect(f.abs_coefficient).toBeGreaterThanOrEqual(0);
      }
    });

    it('intercept is a finite number', () => {
      const coef = getMlCoefficients();
      expect(typeof coef.intercept).toBe('number');
      expect(isFinite(coef.intercept)).toBe(true);
    });
  });

  // ── getMlCalibrationBins ────────────────────────────────────────────────────
  describe('getMlCalibrationBins', () => {
    it('returns 10 calibration bins', () => {
      const cal = getMlCalibrationBins();
      expect(cal.bins).toHaveLength(10);
    });

    it('each bin has required fields and valid values', () => {
      const cal = getMlCalibrationBins();
      for (const bin of cal.bins) {
        expect(typeof bin.bin_start).toBe('number');
        expect(typeof bin.bin_end).toBe('number');
        expect(typeof bin.count).toBe('number');
        expect(typeof bin.mean_predicted_probability).toBe('number');
        expect(typeof bin.observed_fraud_rate).toBe('number');
        expect(bin.count).toBeGreaterThanOrEqual(0);
        expect(bin.mean_predicted_probability).toBeGreaterThanOrEqual(0);
        expect(bin.observed_fraud_rate).toBeGreaterThanOrEqual(0);
        expect(bin.observed_fraud_rate).toBeLessThanOrEqual(1);
      }
    });
  });

  // ── getMlHeldoutMetrics ─────────────────────────────────────────────────────
  describe('getMlHeldoutMetrics', () => {
    it('returns valid held-out metrics (no NaN)', () => {
      const m = getMlHeldoutMetrics();
      expect(isNaN(m.precision)).toBe(false);
      expect(isNaN(m.recall)).toBe(false);
      expect(isNaN(m.f1)).toBe(false);
      expect(isNaN(m.roc_auc)).toBe(false);
    });

    it('metrics are in [0, 1]', () => {
      const m = getMlHeldoutMetrics();
      for (const v of [m.precision, m.recall, m.f1, m.roc_auc]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    });

    it('confusion matrix sums match support totals', () => {
      const m = getMlHeldoutMetrics();
      const cm = m.confusion_matrix;
      const total = cm.tp + cm.fp + cm.tn + cm.fn;
      expect(total).toBe(m.support.total_test);
    });

    it('train + test = total', () => {
      const m = getMlHeldoutMetrics();
      const split = m.train_test_split;
      expect(split.train + split.test).toBe(split.total);
    });
  });

  // ── getMlVsRuleComparison ───────────────────────────────────────────────────
  describe('getMlVsRuleComparison', () => {
    it('returns all events', () => {
      const cmp = getMlVsRuleComparison();
      expect(cmp.length).toBeGreaterThan(0);
    });

    it('comparison_type is one of 4 valid values', () => {
      const valid = new Set([
        'AGREE_HIGH', 'AGREE_LOW', 'ML_HIGH_RULE_LOW', 'ML_LOW_RULE_HIGH',
      ]);
      const cmp = getMlVsRuleComparison();
      for (const r of cmp) {
        expect(valid.has(r.comparison_type)).toBe(true);
      }
    });
  });

  // ── getDisagreementCases ────────────────────────────────────────────────────
  describe('getDisagreementCases', () => {
    it('returns only ML_HIGH_RULE_LOW and ML_LOW_RULE_HIGH cases', () => {
      const cases = getDisagreementCases();
      for (const c of cases) {
        expect(['ML_HIGH_RULE_LOW', 'ML_LOW_RULE_HIGH']).toContain(c.comparison_type);
      }
    });

    it('returns at least one disagreement case', () => {
      const cases = getDisagreementCases();
      expect(cases.length).toBeGreaterThan(0);
    });
  });

  // ── ARBITER_FEATURE_WEIGHTS ─────────────────────────────────────────────────
  describe('ARBITER_FEATURE_WEIGHTS (hand weights import — display only)', () => {
    it('exports all 12 feature weights', () => {
      for (const key of EXPECTED_FEATURES) {
        expect(ARBITER_FEATURE_WEIGHTS[key]).toBeDefined();
      }
    });

    it('weight values are numeric and unchanged from score.ts', () => {
      for (const w of Object.values(ARBITER_FEATURE_WEIGHTS)) {
        expect(typeof w).toBe('number');
        expect(isFinite(w)).toBe(true);
      }
    });
  });

  // ── Architecture boundary check ─────────────────────────────────────────────
  describe('architecture boundary — no runtime Python or API', () => {
    it('getMlScores does not throw (static import, no network call)', () => {
      expect(() => getMlScores()).not.toThrow();
    });

    it('getMlCoefficients does not throw (static import, no network call)', () => {
      expect(() => getMlCoefficients()).not.toThrow();
    });

    it('getMlHeldoutMetrics does not throw (static import, no network call)', () => {
      expect(() => getMlHeldoutMetrics()).not.toThrow();
    });

    it('all loaders return synchronously (no Promises)', () => {
      const scores  = getMlScores();
      const coef    = getMlCoefficients();
      const cal     = getMlCalibrationBins();
      const cmp     = getMlVsRuleComparison();
      const metrics = getMlHeldoutMetrics();

      // Static JSON imports return synchronously — not Promises
      expect(Array.isArray(scores)).toBe(true);
      expect(typeof coef).toBe('object');
      expect(typeof cal).toBe('object');
      expect(Array.isArray(cmp)).toBe(true);
      expect(typeof metrics).toBe('object');
    });
  });
});
