// Arbiter Spec-005 — Feedback Loop Analysis
//
// Reads static ML artifacts only. No runtime inference. No /api/arbiter/score.
// _scenario_label is evaluation metadata for grouping misses — never a rule input.

import {
  getMlVsRuleComparison,
  type MlVsRuleRecord,
} from '@/lib/arbiter/ml-artifacts';

/** Maps artifact comparison_type to the canonical ML-high / rule-low label. */
export const ML_HIGH_RULE_LOW_TYPE = 'ML_HIGH_RULE_LOW' as const;

export type MissTypology = MlVsRuleRecord['scenario_label'];

export type FeaturePatternKey =
  | 'pass_through_dormant_account'
  | 'new_or_risky_beneficiary_pass_through'
  | 'moderate_pass_through_new_beneficiary'
  | 'device_sharing_below_rule_threshold'
  | 'dormancy_signal_below_review_band'
  | 'other';

export interface FeaturePatternGroup {
  pattern: FeaturePatternKey;
  label: string;
  count: number;
  share: number;
}

export interface TypologyMissSummary {
  typology: MissTypology;
  displayName: string;
  count: number;
  share: number;
  commonSignalPattern: string;
}

export interface MissClusterStats {
  avgWithdrawalAfterDeposit: number;
  shareNewBeneficiary: number;
  shareRiskyBeneficiary: number;
  avgDailyCumulativeThb: number;
  avgMlProbability: number;
  avgRuleScore: number;
}

export interface DominantMissCluster {
  typology: MissTypology;
  displayName: string;
  count: number;
  share: number;
  dominantPattern: FeaturePatternKey;
  dominantPatternLabel: string;
  stats: MissClusterStats;
}

const TYPOLOGY_DISPLAY: Record<string, string> = {
  app_scam_cashout: 'APP scam cash-out',
  sleeper_activation: 'Sleeper activation',
  onboarding_mule_farm: 'Mule farm',
  background: 'Background (false disagreement)',
};

const PATTERN_LABELS: Record<FeaturePatternKey, string> = {
  pass_through_dormant_account: 'Pass-through on dormant account',
  new_or_risky_beneficiary_pass_through: 'New/high-risk beneficiary + pass-through',
  moderate_pass_through_new_beneficiary: 'Moderate pass-through + new beneficiary',
  device_sharing_below_rule_threshold: 'Device sharing below hard threshold',
  dormancy_signal_below_review_band: 'Dormancy signal below review band',
  other: 'Mixed / other signal combination',
};

const RISKY_TIERS = new Set(['light_grey', 'dark_grey', 'black']);

function isMlHighRuleLow(record: MlVsRuleRecord): boolean {
  return record.comparison_type === ML_HIGH_RULE_LOW_TYPE;
}

/** Classify a miss case into a deterministic feature-pattern bucket. */
export function classifyFeaturePattern(
  features: Record<string, number | boolean | string>,
): FeaturePatternKey {
  const withdrawal = Number(features.withdrawal_after_deposit ?? 0);
  const isNewBen = Boolean(features.is_new_beneficiary);
  const tier = String(features.beneficiary_risk_tier ?? '');
  const deviceCount = Number(features.device_account_count ?? 0);
  const sleeperShock = Number(features.sleeper_velocity_shock ?? 0);
  const accountAge = Number(features.account_age_days ?? 0);

  if (withdrawal > 0.65 && isNewBen && RISKY_TIERS.has(tier)) {
    return 'new_or_risky_beneficiary_pass_through';
  }
  if (withdrawal > 0.5 && isNewBen) {
    return 'moderate_pass_through_new_beneficiary';
  }
  if (withdrawal > 0.5 && accountAge > 90) {
    return 'pass_through_dormant_account';
  }
  if (deviceCount >= 2 && deviceCount <= 3) {
    return 'device_sharing_below_rule_threshold';
  }
  if (sleeperShock > 0.3) {
    return 'dormancy_signal_below_review_band';
  }
  return 'other';
}

export function getMlHighRuleLowCases(): MlVsRuleRecord[] {
  return getMlVsRuleComparison().filter(isMlHighRuleLow);
}

export function groupMissesByTypology(): TypologyMissSummary[] {
  const misses = getMlHighRuleLowCases();
  const total = misses.length || 1;
  const counts = new Map<string, MlVsRuleRecord[]>();

  for (const record of misses) {
    const key = record.scenario_label;
    const bucket = counts.get(key) ?? [];
    bucket.push(record);
    counts.set(key, bucket);
  }

  return [...counts.entries()]
    .map(([typology, records]) => {
      const patternCounts = new Map<FeaturePatternKey, number>();
      for (const r of records) {
        const p = classifyFeaturePattern(r.features);
        patternCounts.set(p, (patternCounts.get(p) ?? 0) + 1);
      }
      const topPattern = [...patternCounts.entries()].sort((a, b) => b[1] - a[1])[0];
      const patternKey = topPattern?.[0] ?? 'other';

      return {
        typology,
        displayName: TYPOLOGY_DISPLAY[typology] ?? typology,
        count: records.length,
        share: records.length / total,
        commonSignalPattern: PATTERN_LABELS[patternKey],
      };
    })
    .sort((a, b) => b.count - a.count);
}

export function groupMissesByFeaturePattern(): FeaturePatternGroup[] {
  const misses = getMlHighRuleLowCases();
  const total = misses.length || 1;
  const counts = new Map<FeaturePatternKey, number>();

  for (const record of misses) {
    const pattern = classifyFeaturePattern(record.features);
    counts.set(pattern, (counts.get(pattern) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([pattern, count]) => ({
      pattern,
      label: PATTERN_LABELS[pattern],
      count,
      share: count / total,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getDominantMissCluster(): DominantMissCluster {
  const misses = getMlHighRuleLowCases();
  const byTypology = groupMissesByTypology();
  const top = byTypology[0];
  const clusterRecords = misses.filter((r) => r.scenario_label === top?.typology);

  const patternGroups = groupMissesByFeaturePattern();
  const dominantInCluster = patternGroups
    .filter((g) => clusterRecords.some((r) => classifyFeaturePattern(r.features) === g.pattern))
    .sort((a, b) => {
      const aCount = clusterRecords.filter((r) => classifyFeaturePattern(r.features) === a.pattern).length;
      const bCount = clusterRecords.filter((r) => classifyFeaturePattern(r.features) === b.pattern).length;
      return bCount - aCount;
    })[0];

  const dominantPattern = dominantInCluster?.pattern ?? 'other';

  return {
    typology: top?.typology ?? 'sleeper_activation',
    displayName: top?.displayName ?? 'Sleeper activation',
    count: top?.count ?? 0,
    share: top?.share ?? 0,
    dominantPattern,
    dominantPatternLabel: PATTERN_LABELS[dominantPattern],
    stats: summarizeMissCluster(clusterRecords),
  };
}

export function summarizeMissCluster(records: MlVsRuleRecord[]): MissClusterStats {
  if (records.length === 0) {
    return {
      avgWithdrawalAfterDeposit: 0,
      shareNewBeneficiary: 0,
      shareRiskyBeneficiary: 0,
      avgDailyCumulativeThb: 0,
      avgMlProbability: 0,
      avgRuleScore: 0,
    };
  }

  const n = records.length;
  let sumWithdrawal = 0;
  let sumDaily = 0;
  let sumMl = 0;
  let sumRule = 0;
  let newBen = 0;
  let riskyBen = 0;

  for (const r of records) {
    const f = r.features;
    sumWithdrawal += Number(f.withdrawal_after_deposit ?? 0);
    sumDaily += Number(f.daily_cumulative_thb ?? 0);
    sumMl += r.ml_probability;
    sumRule += r.rule_weighted_score;
    if (f.is_new_beneficiary) newBen++;
    if (RISKY_TIERS.has(String(f.beneficiary_risk_tier ?? ''))) riskyBen++;
  }

  return {
    avgWithdrawalAfterDeposit: sumWithdrawal / n,
    shareNewBeneficiary: newBen / n,
    shareRiskyBeneficiary: riskyBen / n,
    avgDailyCumulativeThb: sumDaily / n,
    avgMlProbability: sumMl / n,
    avgRuleScore: sumRule / n,
  };
}
