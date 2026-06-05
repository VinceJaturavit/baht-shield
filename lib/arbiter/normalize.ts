// Arbiter Phase 1 — Feature Normalization
//
// Maps raw feature values to a bounded [0, 1] range before weighted scoring.
// Each normalizer is deterministic and documented. No ML, no calibration.

import type { BeneficiaryRiskTier } from './contract';

// ---------------------------------------------------------------------------
// Numeric clamping helper
// ---------------------------------------------------------------------------
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ---------------------------------------------------------------------------
// Individual normalizers — one per feature
// ---------------------------------------------------------------------------

/**
 * F1: amt_to_mean_ratio — ratio of current amount to 30d wallet mean.
 * Cap at 10x; 1x = 0.1, 10x+ = 1.0.
 */
export function normalizeAmtToMeanRatio(ratio: number): number {
  return clamp(ratio / 10, 0, 1);
}

/**
 * F2: velocity_1h — outbound count in last 60 min.
 * 0 txns = 0, 5+ txns = 1.0.
 */
export function normalizeVelocity1h(count: number): number {
  return clamp(count / 5, 0, 1);
}

/**
 * F3: account_age_days — inverted: newer account = higher risk.
 * 0 days (brand-new) = 1.0, 365+ days = 0.0.
 */
export function normalizeAccountAgeDays(days: number): number {
  return clamp(1 - days / 365, 0, 1);
}

/**
 * F4: is_new_beneficiary — boolean. true = 1, false = 0.
 */
export function normalizeIsNewBeneficiary(isNew: boolean): number {
  return isNew ? 1 : 0;
}

/**
 * F5: device_account_count — distinct wallets on device.
 * 1 wallet = 0, 5+ wallets = 1.0.
 */
export function normalizeDeviceAccountCount(count: number): number {
  return clamp((count - 1) / 4, 0, 1);
}

/**
 * F6: withdrawal_after_deposit — outbound / (inbound + 1).
 * 0 = 0, 1.0+ = 1.0 (capped).
 */
export function normalizeWithdrawalAfterDeposit(ratio: number): number {
  return clamp(ratio, 0, 1);
}

/**
 * F7: sleeper_velocity_shock — z-score * ln(dormancy + e).
 * Soft-cap at 5.0 for normalization.
 */
export function normalizeSleeperVelocityShock(shock: number): number {
  return clamp(shock / 5, 0, 1);
}

/**
 * F8: geo_velocity — km/h.
 * 0 = 0, 1000+ km/h (impossible travel threshold) = 1.0.
 */
export function normalizeGeoVelocity(kmh: number): number {
  return clamp(kmh / 1000, 0, 1);
}

/**
 * F9: is_night_transaction — boolean. true = 1, false = 0.
 */
export function normalizeIsNightTransaction(isNight: boolean): number {
  return isNight ? 1 : 0;
}

/**
 * F10: daily_cumulative_thb — rolling 24h outbound sum in THB.
 * 0 = 0, 100 000+ THB = 1.0.
 */
export function normalizeDailyCumulativeThb(amount: number): number {
  return clamp(amount / 100_000, 0, 1);
}

/**
 * F11: beneficiary_risk_tier — categorical risk.
 * black = 1.0, dark_grey = 0.8, light_grey = 0.4, clean = 0.
 */
export function normalizeBeneficiaryRiskTier(tier: BeneficiaryRiskTier): number {
  const map: Record<BeneficiaryRiskTier, number> = {
    black: 1.0,
    dark_grey: 0.8,
    light_grey: 0.4,
    clean: 0.0,
  };
  return map[tier] ?? 0;
}

/**
 * F12: pattern_match_count — number of analyst patterns matched.
 * 0 = 0, 3+ = 1.0.
 */
export function normalizePatternMatchCount(count: number): number {
  return clamp(count / 3, 0, 1);
}

// ---------------------------------------------------------------------------
// Dispatch table: key → normalizer function
// ---------------------------------------------------------------------------
type NormalizerFn = (value: number | boolean | string) => number;

export const NORMALIZERS: Record<string, NormalizerFn> = {
  amt_to_mean_ratio: (v) => normalizeAmtToMeanRatio(Number(v)),
  velocity_1h: (v) => normalizeVelocity1h(Number(v)),
  account_age_days: (v) => normalizeAccountAgeDays(Number(v)),
  is_new_beneficiary: (v) => normalizeIsNewBeneficiary(Boolean(v)),
  device_account_count: (v) => normalizeDeviceAccountCount(Number(v)),
  withdrawal_after_deposit: (v) => normalizeWithdrawalAfterDeposit(Number(v)),
  sleeper_velocity_shock: (v) => normalizeSleeperVelocityShock(Number(v)),
  geo_velocity: (v) => normalizeGeoVelocity(Number(v)),
  is_night_transaction: (v) => normalizeIsNightTransaction(Boolean(v)),
  daily_cumulative_thb: (v) => normalizeDailyCumulativeThb(Number(v)),
  beneficiary_risk_tier: (v) => normalizeBeneficiaryRiskTier(v as BeneficiaryRiskTier),
  pattern_match_count: (v) => normalizePatternMatchCount(Number(v)),
};

export function normalizeFeatureValue(key: string, value: number | boolean | string): number {
  const fn = NORMALIZERS[key];
  return fn ? fn(value) : 0;
}
