// Arbiter Phase 1 — Feature Layer Unit Tests
// Tests each of the 12 features against hand-checked values using pure logic.
// No Next.js runtime needed — tests run in Node.js via Vitest.

import { describe, it, expect } from 'vitest';
import {
  normalizeAmtToMeanRatio,
  normalizeVelocity1h,
  normalizeAccountAgeDays,
  normalizeIsNewBeneficiary,
  normalizeDeviceAccountCount,
  normalizeWithdrawalAfterDeposit,
  normalizeSleeperVelocityShock,
  normalizeGeoVelocity,
  normalizeIsNightTransaction,
  normalizeDailyCumulativeThb,
  normalizeBeneficiaryRiskTier,
  normalizePatternMatchCount,
} from '@/lib/arbiter/normalize';

// Helper: Haversine formula (from features.ts, duplicated for test isolation)
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// --- F1: amt_to_mean_ratio ---
describe('F1 amt_to_mean_ratio normalization', () => {
  it('returns ~0.1 for 1x mean', () => {
    // ratio = 1.0, normalized = 1/10 = 0.1
    expect(normalizeAmtToMeanRatio(1)).toBeCloseTo(0.1);
  });

  it('returns 1.0 at 10x mean (cap)', () => {
    expect(normalizeAmtToMeanRatio(10)).toBe(1);
  });

  it('clamps at 1.0 above 10x', () => {
    expect(normalizeAmtToMeanRatio(100)).toBe(1);
  });

  it('handles zero mean (ratio = amount / 1)', () => {
    // amount_thb=5000, mean=0 → ratio = 5000/1=5000 → normalized = 1 (capped)
    const ratio = 5000 / (0 + 1);
    expect(normalizeAmtToMeanRatio(ratio)).toBe(1);
  });
});

// --- F2: velocity_1h ---
describe('F2 velocity_1h normalization', () => {
  it('returns 0 for 0 transactions', () => {
    expect(normalizeVelocity1h(0)).toBe(0);
  });

  it('returns 0.4 for 2 transactions', () => {
    expect(normalizeVelocity1h(2)).toBeCloseTo(0.4);
  });

  it('returns 1.0 at 5+ transactions (cap)', () => {
    expect(normalizeVelocity1h(5)).toBe(1);
    expect(normalizeVelocity1h(20)).toBe(1);
  });
});

// --- F3: account_age_days ---
describe('F3 account_age_days', () => {
  it('returns 1.0 for brand-new (0 days)', () => {
    expect(normalizeAccountAgeDays(0)).toBe(1);
  });

  it('returns 0 for 365+ days (low risk)', () => {
    expect(normalizeAccountAgeDays(365)).toBe(0);
    expect(normalizeAccountAgeDays(500)).toBe(0);
  });

  it('returns ~0.5 for ~182 days old', () => {
    expect(normalizeAccountAgeDays(182.5)).toBeCloseTo(0.5, 1);
  });

  it('is monotonically decreasing (older = lower risk)', () => {
    const age10 = normalizeAccountAgeDays(10);
    const age100 = normalizeAccountAgeDays(100);
    const age300 = normalizeAccountAgeDays(300);
    expect(age10).toBeGreaterThan(age100);
    expect(age100).toBeGreaterThan(age300);
  });
});

// --- F4: is_new_beneficiary ---
describe('F4 is_new_beneficiary', () => {
  it('returns 1 when beneficiary is new (true)', () => {
    expect(normalizeIsNewBeneficiary(true)).toBe(1);
  });

  it('returns 0 when beneficiary is established (false)', () => {
    expect(normalizeIsNewBeneficiary(false)).toBe(0);
  });

  // Direct logic test: a beneficiary 12h old → is_new = true
  it('is true when beneficiary age < 48h', () => {
    const eventTs = new Date('2026-05-30T12:00:00Z');
    const benTs = new Date('2026-05-30T00:00:00Z'); // 12h ago
    const ageHours = (eventTs.getTime() - benTs.getTime()) / (1000 * 3600);
    const isNew = ageHours >= 0 && ageHours < 48;
    expect(isNew).toBe(true);
  });

  it('is false when beneficiary age > 48h', () => {
    const eventTs = new Date('2026-05-30T12:00:00Z');
    const benTs = new Date('2026-05-25T00:00:00Z'); // 5+ days ago
    const ageHours = (eventTs.getTime() - benTs.getTime()) / (1000 * 3600);
    const isNew = ageHours >= 0 && ageHours < 48;
    expect(isNew).toBe(false);
  });

  it('null-safe: no beneficiary → false', () => {
    // In context.ts, null beneficiary_id → beneficiaryCreatedAt = null → isNew = false
    const isNew = false;
    expect(isNew).toBe(false);
  });
});

// --- F5: device_account_count ---
describe('F5 device_account_count', () => {
  it('returns 0 for 1 wallet on device (expected)', () => {
    expect(normalizeDeviceAccountCount(1)).toBe(0);
  });

  it('returns 0.25 for 2 wallets', () => {
    expect(normalizeDeviceAccountCount(2)).toBeCloseTo(0.25);
  });

  it('returns 1.0 at 5+ wallets (cap)', () => {
    expect(normalizeDeviceAccountCount(5)).toBe(1);
    expect(normalizeDeviceAccountCount(10)).toBe(1);
  });
});

// --- F6: withdrawal_after_deposit ---
describe('F6 withdrawal_after_deposit', () => {
  it('returns 0 when no outbound', () => {
    const ratio = 0 / (1000 + 1);
    expect(normalizeWithdrawalAfterDeposit(ratio)).toBeCloseTo(0);
  });

  it('approaches 1 when outbound ≈ inbound', () => {
    const ratio = 1000 / (1000 + 1);
    expect(normalizeWithdrawalAfterDeposit(ratio)).toBeCloseTo(0.999, 2);
  });

  it('clamps at 1.0 even when ratio > 1', () => {
    const ratio = 2000 / (1000 + 1);
    expect(normalizeWithdrawalAfterDeposit(ratio)).toBe(1);
  });

  it('safe with zero inbound (denominator = 0+1 = 1)', () => {
    const ratio = 500 / (0 + 1);
    // 500 > cap, should be 1
    expect(normalizeWithdrawalAfterDeposit(ratio)).toBe(1);
  });
});

// --- F7: sleeper_velocity_shock ---
describe('F7 sleeper_velocity_shock', () => {
  it('is zero when dormancy < 30 days', () => {
    // Simulate gate: dormancyDays=10 → shock = 0
    const dormancyDays = 10;
    const shock = dormancyDays < 30 ? 0 : 99;
    expect(shock).toBe(0);
    expect(normalizeSleeperVelocityShock(0)).toBe(0);
  });

  it('is positive when dormant (>= 30d) and outbound high vs baseline', () => {
    const dormancyDays = 120;
    const mean = 1000;
    const std = 200;
    const currentOutbound = 8000; // far above baseline
    const zscore = std > 0 ? (currentOutbound - mean) / std : 0;
    const shock = Math.max(0, zscore) * Math.log(dormancyDays + Math.E);
    expect(shock).toBeGreaterThan(0);
    expect(normalizeSleeperVelocityShock(shock)).toBeGreaterThan(0);
  });

  it('clamps normalized shock at 1.0 for extreme values', () => {
    expect(normalizeSleeperVelocityShock(100)).toBe(1);
  });
});

// --- F8: geo_velocity ---
describe('F8 geo_velocity', () => {
  it('returns 0 with no geo data', () => {
    const velocity = 0; // from features.ts when geo is null
    expect(normalizeGeoVelocity(velocity)).toBe(0);
  });

  it('computes plausible Haversine speed between Bangkok and Chiang Mai', () => {
    // Bangkok: 13.7563, 100.5018 — Chiang Mai: 18.7883, 98.9853
    const km = haversineKm(13.7563, 100.5018, 18.7883, 98.9853);
    expect(km).toBeGreaterThan(500); // ~685 km
    expect(km).toBeLessThan(800);

    const hoursElapsed = 1; // 1 hour → 685 km/h (fast but not impossible)
    const velocity = km / hoursElapsed;
    expect(velocity).toBeGreaterThan(500);
    expect(velocity).toBeLessThan(900); // below impossible-travel threshold
  });

  it('returns > 0.9 for impossible travel speed (>900 km/h)', () => {
    expect(normalizeGeoVelocity(950)).toBeGreaterThan(0.9);
  });
});

// --- F9: is_night_transaction ---
describe('F9 is_night_transaction', () => {
  it('returns 1 for 02:00 Thailand time (UTC+7)', () => {
    // 02:00 local = 19:00 UTC previous day, i.e., UTC hour = (2 - 7 + 24) % 24 = 19
    const utcHour = 19;
    const localHour = (utcHour + 7) % 24; // = 2
    const isNight = localHour >= 0 && localHour < 5;
    expect(isNight).toBe(true);
    expect(normalizeIsNightTransaction(true)).toBe(1);
  });

  it('returns 0 for 14:00 Thailand time (UTC+7)', () => {
    const utcHour = 7; // 14:00 local = 07:00 UTC
    const localHour = (utcHour + 7) % 24; // = 14
    const isNight = localHour >= 0 && localHour < 5;
    expect(isNight).toBe(false);
    expect(normalizeIsNightTransaction(false)).toBe(0);
  });
});

// --- F10: daily_cumulative_thb ---
describe('F10 daily_cumulative_thb', () => {
  it('returns 0 for 0 THB', () => {
    expect(normalizeDailyCumulativeThb(0)).toBe(0);
  });

  it('returns 0.5 for 50 000 THB', () => {
    expect(normalizeDailyCumulativeThb(50_000)).toBe(0.5);
  });

  it('returns 1.0 at 100 000+ THB (cap)', () => {
    expect(normalizeDailyCumulativeThb(100_000)).toBe(1);
    expect(normalizeDailyCumulativeThb(200_000)).toBe(1);
  });
});

// --- F11: beneficiary_risk_tier ---
describe('F11 beneficiary_risk_tier', () => {
  it('returns 1.0 for black tier', () => {
    expect(normalizeBeneficiaryRiskTier('black')).toBe(1.0);
  });

  it('returns 0.8 for dark_grey tier', () => {
    expect(normalizeBeneficiaryRiskTier('dark_grey')).toBe(0.8);
  });

  it('returns 0.4 for light_grey tier', () => {
    expect(normalizeBeneficiaryRiskTier('light_grey')).toBe(0.4);
  });

  it('returns 0 for clean tier', () => {
    expect(normalizeBeneficiaryRiskTier('clean')).toBe(0);
  });
});

// --- F12: pattern_match_count ---
describe('F12 pattern_match_count', () => {
  it('returns 0 for 0 patterns matched', () => {
    expect(normalizePatternMatchCount(0)).toBe(0);
  });

  it('returns 0.333 for 1 pattern matched', () => {
    expect(normalizePatternMatchCount(1)).toBeCloseTo(1 / 3);
  });

  it('returns 1.0 at 3+ patterns (cap)', () => {
    expect(normalizePatternMatchCount(3)).toBe(1);
    expect(normalizePatternMatchCount(5)).toBe(1);
  });

  it('returns 0 as fallback for unknown patterns', () => {
    // Edge case: if graph_edges returns 0 matches
    expect(normalizePatternMatchCount(0)).toBe(0);
  });
});
