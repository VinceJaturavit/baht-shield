// Arbiter Phase 2 — Rule Back-Test Tests

import { describe, it, expect } from 'vitest';
import { runRuleBacktest, type BacktestEvent, type CandidateRule } from '@/lib/arbiter/rule-backtest';
import { DEFAULT_THRESHOLDS } from '@/lib/arbiter/tuning';
import { existsSync } from 'fs';
import { resolve } from 'path';

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

function makeEvent(
  id: string,
  label: BacktestEvent['scenarioLabel'],
  features: Record<string, number>,
  baselineDecision: BacktestEvent['baselineDecision'] = 'APPROVE',
  baseScore = 10,
): BacktestEvent {
  return { eventId: id, scenarioLabel: label, features, baselineDecision, baseScore };
}

const FRAUD_EVENTS: BacktestEvent[] = [
  makeEvent('F1', 'onboarding_mule_farm', { device_account_count: 5 }, 'APPROVE', 22),
  makeEvent('F2', 'sleeper_activation',   { device_account_count: 2 }, 'APPROVE', 18),
  makeEvent('F3', 'app_scam_cashout',     { device_account_count: 6 }, 'REVIEW',  55),
];
const BG_EVENTS: BacktestEvent[] = [
  makeEvent('B1', 'background', { device_account_count: 1 }, 'APPROVE', 5),
  makeEvent('B2', 'background', { device_account_count: 2 }, 'APPROVE', 8),
  makeEvent('B3', 'background', { device_account_count: 4 }, 'REVIEW',  52),
];
const ALL_EVENTS = [...FRAUD_EVENTS, ...BG_EVENTS];

// ---------------------------------------------------------------------------
// Stricter R6 threshold (> 4 instead of > 3) reduces flagged events
// ---------------------------------------------------------------------------
describe('runRuleBacktest — R6 threshold adjustment', () => {
  const baseR6: CandidateRule = {
    name: 'R6 device_account_count > 3',
    condition: { featureKey: 'device_account_count', operator: 'gt', threshold: 3 },
    action: 'REVIEW',
  };
  const strictR6: CandidateRule = {
    name: 'R6 device_account_count > 4 (stricter)',
    condition: { featureKey: 'device_account_count', operator: 'gt', threshold: 4 },
    action: 'REVIEW',
  };
  const looseR6: CandidateRule = {
    name: 'R6 device_account_count > 2 (looser)',
    condition: { featureKey: 'device_account_count', operator: 'gt', threshold: 2 },
    action: 'REVIEW',
  };

  it('stricter R6 (> 4) flags fewer events than base (> 3)', () => {
    const baseResult   = runRuleBacktest(ALL_EVENTS, baseR6, DEFAULT_THRESHOLDS);
    const strictResult = runRuleBacktest(ALL_EVENTS, strictR6, DEFAULT_THRESHOLDS);

    const baselyFlagged   = baseResult.candidateMetrics.confusionMatrix.tp + baseResult.candidateMetrics.confusionMatrix.fp;
    const strictlyFlagged = strictResult.candidateMetrics.confusionMatrix.tp + strictResult.candidateMetrics.confusionMatrix.fp;

    // With > 4: only events with device_account_count ≥ 5 are flagged (F1, F3 — F3 already flagged)
    // With > 3: also flags B3 (device_account_count=4) which isn't flagged with > 4
    expect(strictlyFlagged).toBeLessThanOrEqual(baselyFlagged);
  });

  it('looser R6 (> 2) flags more events than base (> 3)', () => {
    const baseResult  = runRuleBacktest(ALL_EVENTS, baseR6, DEFAULT_THRESHOLDS);
    const looseResult = runRuleBacktest(ALL_EVENTS, looseR6, DEFAULT_THRESHOLDS);

    const baselyFlagged = baseResult.candidateMetrics.confusionMatrix.tp + baseResult.candidateMetrics.confusionMatrix.fp;
    const looselyFlagged = looseResult.candidateMetrics.confusionMatrix.tp + looseResult.candidateMetrics.confusionMatrix.fp;
    expect(looselyFlagged).toBeGreaterThanOrEqual(baselyFlagged);
  });
});

// ---------------------------------------------------------------------------
// Delta TP/FP computed correctly
// ---------------------------------------------------------------------------
describe('runRuleBacktest — delta computation', () => {
  it('candidate that catches a new TP produces positive tp delta', () => {
    const events: BacktestEvent[] = [
      makeEvent('X1', 'onboarding_mule_farm', { device_account_count: 5 }, 'APPROVE', 22),
      makeEvent('X2', 'background',           { device_account_count: 1 }, 'APPROVE', 5),
    ];
    const rule: CandidateRule = {
      name: 'catch high device count',
      condition: { featureKey: 'device_account_count', operator: 'gt', threshold: 3 },
      action: 'REVIEW',
    };
    const result = runRuleBacktest(events, rule, DEFAULT_THRESHOLDS);
    expect(result.delta.tp).toBeGreaterThan(0);  // caught the fraud event
    expect(result.delta.fp).toBe(0);              // no false positive added
  });

  it('candidate that over-flags produces positive fp delta', () => {
    const events: BacktestEvent[] = [
      makeEvent('Y1', 'background', { device_account_count: 4 }, 'APPROVE', 10),
      makeEvent('Y2', 'background', { device_account_count: 5 }, 'APPROVE', 12),
    ];
    const rule: CandidateRule = {
      name: 'loose device count',
      condition: { featureKey: 'device_account_count', operator: 'gt', threshold: 3 },
      action: 'REVIEW',
    };
    const result = runRuleBacktest(events, rule, DEFAULT_THRESHOLDS);
    expect(result.delta.fp).toBeGreaterThan(0);  // both are FP (background flagged)
    expect(result.delta.tp).toBe(0);              // no fraud events caught
  });
});

// ---------------------------------------------------------------------------
// Shadow mode: logs hits without changing live decisions
// ---------------------------------------------------------------------------
describe('runRuleBacktest — shadow mode behavior', () => {
  it('shadow hits are logged but baseline decisions unchanged', () => {
    const events: BacktestEvent[] = [
      makeEvent('S1', 'onboarding_mule_farm', { device_account_count: 5 }, 'APPROVE', 22),
      makeEvent('S2', 'background',           { device_account_count: 1 }, 'APPROVE', 5),
    ];
    const rule: CandidateRule = {
      name: 'shadow R6',
      condition: { featureKey: 'device_account_count', operator: 'gt', threshold: 3 },
      action: 'REVIEW',
    };
    const result = runRuleBacktest(events, rule, DEFAULT_THRESHOLDS);

    // Shadow hit found for S1 (condition fires, decision changes from APPROVE→REVIEW)
    const s1Hit = result.shadowHits.find((h) => h.eventId === 'S1');
    expect(s1Hit).toBeDefined();
    // Baseline decision is unchanged (still APPROVE from the original baseline)
    expect(s1Hit!.baselineDecision).toBe('APPROVE');
    // Candidate (shadow) decision shows what it WOULD have been
    expect(s1Hit!.candidateDecision).toBe('REVIEW');
  });
});

// ---------------------------------------------------------------------------
// Newly-flagged and no-longer-flagged sample lists work
// ---------------------------------------------------------------------------
describe('runRuleBacktest — sample lists', () => {
  it('newlyFlaggedEvents contains events that baseline missed but candidate caught', () => {
    const events: BacktestEvent[] = [
      makeEvent('N1', 'onboarding_mule_farm', { device_account_count: 5 }, 'APPROVE', 22),
    ];
    const rule: CandidateRule = {
      name: 'catch mule farm',
      condition: { featureKey: 'device_account_count', operator: 'gt', threshold: 3 },
      action: 'REVIEW',
    };
    const result = runRuleBacktest(events, rule, DEFAULT_THRESHOLDS);
    expect(result.newlyFlaggedEvents).toHaveLength(1);
    expect(result.newlyFlaggedEvents[0].eventId).toBe('N1');
  });

  it('noLongerFlaggedEvents contains events baseline flagged but candidate does not', () => {
    const events: BacktestEvent[] = [
      makeEvent('M1', 'background', { device_account_count: 4 }, 'REVIEW', 52),
    ];
    // Stricter rule: > 5 — won't flag device_account_count=4 anymore
    const strictRule: CandidateRule = {
      name: 'strict R6',
      condition: { featureKey: 'device_account_count', operator: 'gt', threshold: 5 },
      action: 'REVIEW',
    };
    // Custom thresholds that would also approve score=52 if rule doesn't fire
    const approveThresholds = { approveStepUp: 60, stepUpReview: 70, reviewBlock: 85 };
    const result = runRuleBacktest(events, strictRule, approveThresholds);
    // M1 baseline=REVIEW, candidate=(score 52 → APPROVE with raised thresholds, rule doesn't fire)
    expect(result.noLongerFlaggedEvents).toHaveLength(1);
    expect(result.noLongerFlaggedEvents[0].eventId).toBe('M1');
  });
});

// ---------------------------------------------------------------------------
// Production JDM file must NOT be modified
// ---------------------------------------------------------------------------
describe('runRuleBacktest — no production files modified', () => {
  it('JDM file is not modified by backtest operations', () => {
    const jdmPath = resolve(
      process.cwd(),
      'rules/arbiter/phase1_decisioning.jdm.json',
    );
    const before = existsSync(jdmPath)
      ? require('fs').readFileSync(jdmPath, 'utf-8')
      : null;

    const events: BacktestEvent[] = [makeEvent('Z1', 'background', { device_account_count: 5 }, 'APPROVE', 10)];
    const rule: CandidateRule = {
      name: 'test rule',
      condition: { featureKey: 'device_account_count', operator: 'gt', threshold: 3 },
      action: 'REVIEW',
    };
    runRuleBacktest(events, rule, DEFAULT_THRESHOLDS);

    const after = existsSync(jdmPath)
      ? require('fs').readFileSync(jdmPath, 'utf-8')
      : null;

    expect(after).toBe(before);  // file unchanged
  });
});
