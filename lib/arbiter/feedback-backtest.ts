// Arbiter Spec-005 — Feedback Loop Back-Test Simulation
//
// Simulates a compound candidate rule against the labelled comparison set.
// Reuses metrics.ts for evaluation. Does NOT modify JDM or live decisioning.
//
// Baseline decisions come from static ml_vs_rule_comparison.json artifacts.

import type { ArbiterDecision } from './contract';
import {
  computeArbiterMetrics,
  computeMetricsDelta,
  isPredictedPositive,
  type ArbiterMetrics,
} from './metrics';
import {
  getMlVsRuleComparison,
  type MlVsRuleRecord,
} from './ml-artifacts';
import { ML_HIGH_RULE_LOW_TYPE } from './feedback-analysis';

// ---------------------------------------------------------------------------
// Candidate rule — compound conditions, simulation only
// ---------------------------------------------------------------------------

export type FeedbackConditionOperator = 'gt' | 'lt' | 'eq' | 'in';

export interface FeedbackRuleCondition {
  featureKey: string;
  operator: FeedbackConditionOperator;
  threshold: number | string | boolean | string[];
}

export interface FeedbackCandidateRule {
  id: string;
  name: string;
  conditions: FeedbackRuleCondition[];
  action: ArbiterDecision;
  reasonCode: string;
  rationale: string;
}

export interface FeedbackCase {
  eventId: string;
  scenarioLabel: string | undefined;
  mlProbability: number;
  ruleDecisionBefore: ArbiterDecision;
  simulatedDecisionAfter: ArbiterDecision;
  keyFeatures: Record<string, number | boolean | string>;
  whyCandidateHit: string;
  kind: 'newly_caught_miss' | 'added_false_positive';
}

export interface FeedbackBacktestResult {
  baselineMetrics: ArbiterMetrics;
  candidateMetrics: ArbiterMetrics;
  delta: {
    tp: number;
    fp: number;
    fn: number;
    tn: number;
    precision: number;
    recall: number;
    falsePositiveRate: number;
    f1: number;
  };
  missCluster: {
    totalMisses: number;
    caughtByCandidate: number;
    recallGainOnMissCluster: number;
  };
  addedFalsePositives: number;
  newlyFlaggedCases: FeedbackCase[];
}

const PRECEDENCE: Record<ArbiterDecision, number> = {
  BLOCK: 4,
  REVIEW: 3,
  STEP_UP: 2,
  APPROVE: 1,
};

function evalCondition(
  condition: FeedbackRuleCondition,
  features: Record<string, number | boolean | string>,
): boolean {
  const value = features[condition.featureKey];
  if (value === undefined) return false;

  switch (condition.operator) {
    case 'gt':
      return Number(value) > Number(condition.threshold);
    case 'lt':
      return Number(value) < Number(condition.threshold);
    case 'eq':
      return value === condition.threshold || String(value) === String(condition.threshold);
    case 'in':
      return (
        Array.isArray(condition.threshold) &&
        condition.threshold.includes(String(value))
      );
    default:
      return false;
  }
}

export function evalCandidateRule(
  rule: FeedbackCandidateRule,
  features: Record<string, number | boolean | string>,
): boolean {
  return rule.conditions.every((c) => evalCondition(c, features));
}

function applyCandidateDecision(
  baseline: ArbiterDecision,
  candidateFires: boolean,
  candidateAction: ArbiterDecision,
): ArbiterDecision {
  if (!candidateFires) return baseline;
  const basePrec = PRECEDENCE[baseline] ?? 1;
  const candPrec = PRECEDENCE[candidateAction] ?? 1;
  return candPrec > basePrec ? candidateAction : baseline;
}

function describeWhyHit(rule: FeedbackCandidateRule): string {
  return rule.conditions
    .map((c) => {
      if (c.operator === 'gt') return `${c.featureKey} > ${c.threshold}`;
      if (c.operator === 'lt') return `${c.featureKey} < ${c.threshold}`;
      if (c.operator === 'eq') return `${c.featureKey} == ${c.threshold}`;
      if (c.operator === 'in') return `${c.featureKey} in [${(c.threshold as string[]).join(', ')}]`;
      return c.featureKey;
    })
    .join(' AND ');
}

/** Default candidate derived from dominant sleeper pass-through miss pattern. */
export function getDefaultFeedbackCandidate(): FeedbackCandidateRule {
  return {
    id: 'R_SLEEPER_PASS_THROUGH_DORMANT',
    name: 'R_SLEEPER_PASS_THROUGH_DORMANT',
    conditions: [
      { featureKey: 'withdrawal_after_deposit', operator: 'gt', threshold: 0.65 },
      { featureKey: 'account_age_days', operator: 'gt', threshold: 90 },
    ],
    action: 'REVIEW',
    reasonCode: 'SLEEPER_PASS_THROUGH_REVIEW',
    rationale:
      'Sleeper activation misses show pass-through behaviour on aged accounts. ' +
      'The model combines withdrawal-after-deposit with account dormancy; hand rules ' +
      'treat R5 (withdrawal threshold 0.9) separately, so many cases remain APPROVE or STEP_UP.',
  };
}

function toDecision(raw: string): ArbiterDecision {
  const d = raw as ArbiterDecision;
  if (d === 'BLOCK' || d === 'REVIEW' || d === 'STEP_UP' || d === 'APPROVE') return d;
  return 'APPROVE';
}

export function runFeedbackBacktest(
  candidateRule: FeedbackCandidateRule = getDefaultFeedbackCandidate(),
  records: MlVsRuleRecord[] = getMlVsRuleComparison(),
): FeedbackBacktestResult {
  const baselinePredictions: Array<{ scenarioLabel: string | undefined; decision: ArbiterDecision }> = [];
  const candidatePredictions: Array<{ scenarioLabel: string | undefined; decision: ArbiterDecision }> = [];

  const missRecords = records.filter((r) => r.comparison_type === ML_HIGH_RULE_LOW_TYPE);
  let caughtMisses = 0;

  const newlyCaught: FeedbackCase[] = [];
  const addedFp: FeedbackCase[] = [];

  for (const record of records) {
    const baseline = toDecision(record.rule_decision);
    const fires = evalCandidateRule(candidateRule, record.features);
    const candidate = applyCandidateDecision(baseline, fires, candidateRule.action);

    baselinePredictions.push({
      scenarioLabel: record.scenario_label,
      decision: baseline,
    });
    candidatePredictions.push({
      scenarioLabel: record.scenario_label,
      decision: candidate,
    });

    const baselinePos = isPredictedPositive(baseline);
    const candidatePos = isPredictedPositive(candidate);
    const isMiss = record.comparison_type === ML_HIGH_RULE_LOW_TYPE;

    if (isMiss && !baselinePos && candidatePos) {
      caughtMisses++;
      if (newlyCaught.length < 8) {
        newlyCaught.push({
          eventId: record.event_id,
          scenarioLabel: record.scenario_label,
          mlProbability: record.ml_probability,
          ruleDecisionBefore: baseline,
          simulatedDecisionAfter: candidate,
          keyFeatures: record.features,
          whyCandidateHit: describeWhyHit(candidateRule),
          kind: 'newly_caught_miss',
        });
      }
    }

    if (!baselinePos && candidatePos && record.ground_truth_label !== 'fraud' && addedFp.length < 5) {
      addedFp.push({
        eventId: record.event_id,
        scenarioLabel: record.scenario_label,
        mlProbability: record.ml_probability,
        ruleDecisionBefore: baseline,
        simulatedDecisionAfter: candidate,
        keyFeatures: record.features,
        whyCandidateHit: describeWhyHit(candidateRule),
        kind: 'added_false_positive',
      });
    }
  }

  const baselineMetrics = computeArbiterMetrics(baselinePredictions);
  const candidateMetrics = computeArbiterMetrics(candidatePredictions);
  const delta = computeMetricsDelta(baselineMetrics, candidateMetrics);

  const totalMisses = missRecords.length;
  const recallGainOnMissCluster = totalMisses > 0 ? caughtMisses / totalMisses : 0;

  return {
    baselineMetrics,
    candidateMetrics,
    delta,
    missCluster: {
      totalMisses,
      caughtByCandidate: caughtMisses,
      recallGainOnMissCluster,
    },
    addedFalsePositives: delta.fp,
    newlyFlaggedCases: [...newlyCaught, ...addedFp],
  };
}
