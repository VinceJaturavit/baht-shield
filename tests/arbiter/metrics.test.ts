// Arbiter Phase 2 — Metrics Engine Unit Tests

import { describe, it, expect } from 'vitest';
import {
  isGroundTruthPositive,
  isPredictedPositive,
  computeArbiterMetrics,
  computeTypologyMetrics,
  computeMetricsDelta,
} from '@/lib/arbiter/metrics';
import type { LabeledPrediction } from '@/lib/arbiter/metrics';

// ---------------------------------------------------------------------------
// isGroundTruthPositive
// ---------------------------------------------------------------------------
describe('isGroundTruthPositive', () => {
  it('returns true for onboarding_mule_farm', () => {
    expect(isGroundTruthPositive('onboarding_mule_farm')).toBe(true);
  });
  it('returns true for sleeper_activation', () => {
    expect(isGroundTruthPositive('sleeper_activation')).toBe(true);
  });
  it('returns true for app_scam_cashout', () => {
    expect(isGroundTruthPositive('app_scam_cashout')).toBe(true);
  });
  it('returns false for background', () => {
    expect(isGroundTruthPositive('background')).toBe(false);
  });
  it('returns false for undefined', () => {
    expect(isGroundTruthPositive(undefined)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isPredictedPositive
// ---------------------------------------------------------------------------
describe('isPredictedPositive', () => {
  it('returns true for BLOCK', () => {
    expect(isPredictedPositive('BLOCK')).toBe(true);
  });
  it('returns true for REVIEW', () => {
    expect(isPredictedPositive('REVIEW')).toBe(true);
  });
  it('returns false for APPROVE', () => {
    expect(isPredictedPositive('APPROVE')).toBe(false);
  });
  it('returns false for STEP_UP', () => {
    expect(isPredictedPositive('STEP_UP')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// computeArbiterMetrics — all TPs
// ---------------------------------------------------------------------------
describe('computeArbiterMetrics — all true positives', () => {
  it('perfect recall, no FP: precision=1, recall=1, FPR=0, F1=1', () => {
    const preds: LabeledPrediction[] = [
      { scenarioLabel: 'onboarding_mule_farm', decision: 'BLOCK' },
      { scenarioLabel: 'sleeper_activation', decision: 'REVIEW' },
      { scenarioLabel: 'app_scam_cashout', decision: 'BLOCK' },
    ];
    const m = computeArbiterMetrics(preds);
    expect(m.confusionMatrix).toEqual({ tp: 3, fp: 0, tn: 0, fn: 0 });
    expect(m.precision).toBe(1);
    expect(m.recall).toBe(1);
    expect(m.falsePositiveRate).toBe(0);
    expect(m.f1).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// computeArbiterMetrics — all true negatives
// ---------------------------------------------------------------------------
describe('computeArbiterMetrics — all true negatives', () => {
  it('precision=0 (safe divide), recall=0, FPR=0, F1=0', () => {
    const preds: LabeledPrediction[] = [
      { scenarioLabel: 'background', decision: 'APPROVE' },
      { scenarioLabel: 'background', decision: 'STEP_UP' },
    ];
    const m = computeArbiterMetrics(preds);
    expect(m.confusionMatrix).toEqual({ tp: 0, fp: 0, tn: 2, fn: 0 });
    expect(m.precision).toBe(0);  // 0/0 → safe divide → 0
    expect(m.recall).toBe(0);     // 0/0 → safe divide → 0
    expect(m.falsePositiveRate).toBe(0);
    expect(m.f1).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// computeArbiterMetrics — mixed TP/FP/TN/FN
// ---------------------------------------------------------------------------
describe('computeArbiterMetrics — mixed', () => {
  it('computes correct values for TP=2, FP=1, TN=2, FN=1', () => {
    const preds: LabeledPrediction[] = [
      { scenarioLabel: 'onboarding_mule_farm', decision: 'REVIEW' },  // TP
      { scenarioLabel: 'sleeper_activation',    decision: 'BLOCK' },   // TP
      { scenarioLabel: 'background',            decision: 'REVIEW' },  // FP
      { scenarioLabel: 'background',            decision: 'APPROVE' }, // TN
      { scenarioLabel: 'background',            decision: 'STEP_UP' }, // TN
      { scenarioLabel: 'app_scam_cashout',      decision: 'APPROVE' }, // FN
    ];
    const m = computeArbiterMetrics(preds);
    expect(m.confusionMatrix).toEqual({ tp: 2, fp: 1, tn: 2, fn: 1 });
    expect(m.precision).toBeCloseTo(2 / 3);
    expect(m.recall).toBeCloseTo(2 / 3);
    expect(m.falsePositiveRate).toBeCloseTo(1 / 3);
    expect(m.f1).toBeCloseTo(2 / 3);
  });
});

// ---------------------------------------------------------------------------
// Safe divide — zero denominator never returns NaN
// ---------------------------------------------------------------------------
describe('safe divide — no NaN', () => {
  it('all FN case: precision=0, recall=0, FPR=0, F1=0 — no NaN', () => {
    const preds: LabeledPrediction[] = [
      { scenarioLabel: 'onboarding_mule_farm', decision: 'APPROVE' }, // FN
    ];
    const m = computeArbiterMetrics(preds);
    expect(m.precision).not.toBeNaN();
    expect(m.recall).not.toBeNaN();
    expect(m.falsePositiveRate).not.toBeNaN();
    expect(m.f1).not.toBeNaN();
  });

  it('empty set: all metrics = 0, no NaN', () => {
    const m = computeArbiterMetrics([]);
    expect(m.precision).toBe(0);
    expect(m.recall).toBe(0);
    expect(m.falsePositiveRate).toBe(0);
    expect(m.f1).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// computeTypologyMetrics
// ---------------------------------------------------------------------------
describe('computeTypologyMetrics', () => {
  const preds: LabeledPrediction[] = [
    // Mule farm events — 2 flagged, 1 missed
    { scenarioLabel: 'onboarding_mule_farm', decision: 'REVIEW' },
    { scenarioLabel: 'onboarding_mule_farm', decision: 'BLOCK' },
    { scenarioLabel: 'onboarding_mule_farm', decision: 'APPROVE' }, // FN
    // Sleeper events — 1 flagged
    { scenarioLabel: 'sleeper_activation', decision: 'REVIEW' },
    // App scam events — 1 flagged
    { scenarioLabel: 'app_scam_cashout', decision: 'BLOCK' },
    // Background events
    { scenarioLabel: 'background', decision: 'APPROVE' },
    { scenarioLabel: 'background', decision: 'REVIEW' },  // FP
  ];

  it('returns metrics for all 3 fraud typologies', () => {
    const typologyMetrics = computeTypologyMetrics(preds);
    expect(typologyMetrics).toHaveLength(3);
    const labels = typologyMetrics.map((t) => t.scenarioLabel);
    expect(labels).toContain('onboarding_mule_farm');
    expect(labels).toContain('sleeper_activation');
    expect(labels).toContain('app_scam_cashout');
  });

  it('mule farm: support=3, tp=2, fn=1', () => {
    const typologyMetrics = computeTypologyMetrics(preds);
    const mf = typologyMetrics.find((t) => t.scenarioLabel === 'onboarding_mule_farm')!;
    expect(mf.support).toBe(3);
    expect(mf.metrics.confusionMatrix.tp).toBe(2);
    expect(mf.metrics.confusionMatrix.fn).toBe(1);
  });

  it('sleeper: other fraud typologies excluded (not counted as FP/FN)', () => {
    const typologyMetrics = computeTypologyMetrics(preds);
    const sm = typologyMetrics.find((t) => t.scenarioLabel === 'sleeper_activation')!;
    // Only sleeper_activation (1 event) + background (2 events) are included
    // mule_farm and app_scam are excluded
    const total = sm.metrics.confusionMatrix.tp + sm.metrics.confusionMatrix.fp +
                  sm.metrics.confusionMatrix.tn + sm.metrics.confusionMatrix.fn;
    expect(total).toBe(3); // 1 sleeper + 2 background = 3
  });

  it('background not treated as fraud in any typology', () => {
    const typologyMetrics = computeTypologyMetrics(preds);
    for (const tm of typologyMetrics) {
      // Background events can be TN or FP — never TP or FN
      expect(tm.metrics.confusionMatrix.tp + tm.metrics.confusionMatrix.fn)
        .toBe(tm.support);
    }
  });
});

// ---------------------------------------------------------------------------
// computeMetricsDelta
// ---------------------------------------------------------------------------
describe('computeMetricsDelta', () => {
  it('computes deltas correctly', () => {
    const baseline = computeArbiterMetrics([
      { scenarioLabel: 'onboarding_mule_farm', decision: 'APPROVE' },
      { scenarioLabel: 'background', decision: 'APPROVE' },
    ]);
    const candidate = computeArbiterMetrics([
      { scenarioLabel: 'onboarding_mule_farm', decision: 'REVIEW' },
      { scenarioLabel: 'background', decision: 'APPROVE' },
    ]);
    const delta = computeMetricsDelta(baseline, candidate);
    expect(delta.tp).toBe(1);  // candidate caught the fraud event
    expect(delta.fn).toBe(-1); // no longer missed
    expect(delta.fp).toBe(0);  // no new FP
    expect(delta.recall).toBeGreaterThan(0); // recall improved
  });
});
