// Arbiter Phase 2 — Rule Back-Test Engine
//
// Applies a candidate rule modification across the full labeled eval set
// and computes baseline vs candidate metrics.
//
// SANDBOX ONLY — this never modifies the live JDM file. All results are
// computed in memory. No file writes, no production config changes.
//
// _scenario_label flows through this module only as evaluation ground truth
// (passed to computeArbiterMetrics). It never influences rule evaluation.

import type { ArbiterDecision, ArbiterScenarioLabel } from './contract';
import {
  computeArbiterMetrics,
  computeMetricsDelta,
  type ArbiterMetrics,
  type ArbiterMetricsDelta,
} from './metrics';
import { applyThresholdsToScore, type ArbiterThresholds, DEFAULT_THRESHOLDS } from './tuning';

// ---------------------------------------------------------------------------
// Candidate rule condition — simple feature-level conditions for Phase 2
// ---------------------------------------------------------------------------

export type ConditionOperator = 'gt' | 'lt' | 'eq' | 'in';

export interface CandidateRuleCondition {
  featureKey: string;
  operator: ConditionOperator;
  threshold: number | string | string[];
}

export interface CandidateRule {
  /** Human-readable name for display (e.g. "R6 device_account_count > 4") */
  name: string;
  condition: CandidateRuleCondition;
  /** Action to apply when condition is met */
  action: ArbiterDecision;
}

/** Evaluate a single condition against a feature map. */
function evalCondition(
  condition: CandidateRuleCondition,
  features: Record<string, number | boolean | string>,
): boolean {
  const value = features[condition.featureKey];
  if (value === undefined) return false;

  switch (condition.operator) {
    case 'gt': return Number(value) > Number(condition.threshold);
    case 'lt': return Number(value) < Number(condition.threshold);
    case 'eq': return String(value) === String(condition.threshold);
    case 'in':
      return Array.isArray(condition.threshold) &&
             condition.threshold.includes(String(value));
    default: return false;
  }
}

// ---------------------------------------------------------------------------
// BacktestEvent — minimal event representation for backtest
// ---------------------------------------------------------------------------

export interface BacktestEvent {
  eventId: string;
  scenarioLabel: ArbiterScenarioLabel | undefined;
  /** Precomputed normalized features. */
  features: Record<string, number | boolean | string>;
  /** Precomputed base score. */
  baseScore: number;
  /** Baseline decision (from JDM + score bands, computed server-side). */
  baselineDecision: ArbiterDecision;
}

// ---------------------------------------------------------------------------
// ArbiterBacktestSample — a representative event in the delta lists
// ---------------------------------------------------------------------------

export interface ArbiterBacktestSample {
  eventId: string;
  scenarioLabel: ArbiterScenarioLabel | undefined;
  baselineDecision: ArbiterDecision;
  candidateDecision: ArbiterDecision;
  score: number;
}

// ---------------------------------------------------------------------------
// RuleBacktestResult
// ---------------------------------------------------------------------------

export interface RuleBacktestResult {
  baselineMetrics: ArbiterMetrics;
  candidateMetrics: ArbiterMetrics;
  delta: ArbiterMetricsDelta;
  /** Events that the candidate rule now flags that baseline did not. */
  newlyFlaggedEvents: ArbiterBacktestSample[];
  /** Events that baseline flagged but candidate no longer flags. */
  noLongerFlaggedEvents: ArbiterBacktestSample[];
  /** Events where shadow rule would fire but live decision is unchanged. */
  shadowHits: ArbiterBacktestSample[];
}

// ---------------------------------------------------------------------------
// runRuleBacktest
//
// Applies a candidate rule to each event and computes the metric impact.
// The candidate rule fires AFTER score-band threshold logic — if the
// candidate condition matches, it overrides the threshold decision with
// the candidate action (using BLOCK > REVIEW > STEP_UP > APPROVE precedence).
//
// IMPORTANT: Does NOT modify the JDM file. Sandbox only.
// ---------------------------------------------------------------------------
export function runRuleBacktest(
  events: BacktestEvent[],
  candidateRule: CandidateRule,
  thresholds: ArbiterThresholds = DEFAULT_THRESHOLDS,
): RuleBacktestResult {
  const PRECEDENCE: Record<ArbiterDecision, number> = {
    BLOCK: 4, REVIEW: 3, STEP_UP: 2, APPROVE: 1,
  };

  const newlyFlagged: ArbiterBacktestSample[] = [];
  const noLongerFlagged: ArbiterBacktestSample[] = [];
  const shadowHits: ArbiterBacktestSample[] = [];

  const baselinePredictions: Array<{ scenarioLabel: string | undefined; decision: ArbiterDecision }> = [];
  const candidatePredictions: Array<{ scenarioLabel: string | undefined; decision: ArbiterDecision }> = [];

  for (const event of events) {
    const baselineDecision = event.baselineDecision;
    const thresholdDecision = applyThresholdsToScore(event.baseScore, thresholds);

    // Candidate rule fires on precomputed features
    const conditionFires = evalCondition(candidateRule.condition, event.features);

    // Apply precedence: take the higher-priority of threshold decision and candidate action
    let candidateDecision: ArbiterDecision;
    if (conditionFires) {
      const candPrec = PRECEDENCE[candidateRule.action] ?? 1;
      const thresPrec = PRECEDENCE[thresholdDecision] ?? 1;
      candidateDecision = candPrec > thresPrec ? candidateRule.action : thresholdDecision;
    } else {
      candidateDecision = thresholdDecision;
    }

    baselinePredictions.push({ scenarioLabel: event.scenarioLabel, decision: baselineDecision });
    candidatePredictions.push({ scenarioLabel: event.scenarioLabel, decision: candidateDecision });

    const sample: ArbiterBacktestSample = {
      eventId: event.eventId,
      scenarioLabel: event.scenarioLabel,
      baselineDecision,
      candidateDecision,
      score: event.baseScore,
    };

    const baselinePositive = baselineDecision === 'BLOCK' || baselineDecision === 'REVIEW';
    const candidatePositive = candidateDecision === 'BLOCK' || candidateDecision === 'REVIEW';

    if (!baselinePositive && candidatePositive) newlyFlagged.push(sample);
    if (baselinePositive && !candidatePositive) noLongerFlagged.push(sample);

    // Shadow hit: candidate would have fired but live decision unchanged
    if (conditionFires && candidateDecision !== baselineDecision) {
      shadowHits.push(sample);
    }
  }

  const baselineMetrics  = computeArbiterMetrics(baselinePredictions);
  const candidateMetrics = computeArbiterMetrics(candidatePredictions);
  const delta            = computeMetricsDelta(baselineMetrics, candidateMetrics);

  return {
    baselineMetrics,
    candidateMetrics,
    delta,
    newlyFlaggedEvents: newlyFlagged.slice(0, 20),   // cap samples for UI
    noLongerFlaggedEvents: noLongerFlagged.slice(0, 20),
    shadowHits: shadowHits.slice(0, 20),
  };
}

// ---------------------------------------------------------------------------
// PRESET_RULES — the named rules from phase1_decisioning.jdm.json that
// the RuleBacktestPanel lets the analyst tune.
// These are display definitions — they do NOT reflect live JDM thresholds.
// ---------------------------------------------------------------------------

export const PRESET_RULES: Array<{ id: string; label: string; rule: CandidateRule; defaultThreshold: number }> = [
  {
    id: 'R5',
    label: 'R5 — Withdrawal after deposit',
    rule: {
      name: 'R5 withdrawal_after_deposit > threshold',
      condition: { featureKey: 'withdrawal_after_deposit', operator: 'gt', threshold: 0.9 },
      action: 'REVIEW',
    },
    defaultThreshold: 0.9,
  },
  {
    id: 'R6',
    label: 'R6 — Device account count',
    rule: {
      name: 'R6 device_account_count > threshold',
      condition: { featureKey: 'device_account_count', operator: 'gt', threshold: 3 },
      action: 'REVIEW',
    },
    defaultThreshold: 3,
  },
  {
    id: 'R4',
    label: 'R4 — Daily cumulative cap',
    rule: {
      name: 'R4 daily_cumulative_thb > threshold',
      condition: { featureKey: 'daily_cumulative_thb', operator: 'gt', threshold: 50000 },
      action: 'STEP_UP',
    },
    defaultThreshold: 50000,
  },
];
