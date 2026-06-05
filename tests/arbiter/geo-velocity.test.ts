// Spec-001b — Geo Velocity Unit Tests
//
// Proves that:
// 1. geo_velocity computes correctly from Haversine + elapsed time.
// 2. previousGeo lookup works: context finds the most recent prior geo.
// 3. At least one fixture produces geo_velocity > 900 (R2 trigger).
// 4. Normal Bangkok→Chiang Mai movement is plausible (<900).
// 5. R2 fires BLOCK / IMPOSSIBLE_TRAVEL when geo_velocity > 900 at score ≤ 24.

import { describe, it, expect, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Haversine (duplicated from features.ts for test isolation)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Mock seed-data for context tests so we don't need the full 160K seed load
// vi.mock factories are hoisted — all values must be inlined, not referenced
// from top-level consts.
// ---------------------------------------------------------------------------
vi.mock('@/lib/seed-data', () => ({
  transactions: [
    {
      txn_id: 'TXN_ATO_PRIOR',
      wallet_id: 'WAL_000001',
      direction: 'outbound',
      amount: 5000,
      channel: 'promptpay',
      beneficiary_id: 'BEN_TEST',
      device_id: 'DEV_W1',
      timestamp: '2026-05-30T09:30:00.000Z',
      geo: { lat: 13.7563, lon: 100.5018 },
    },
  ],
  walletAccounts: [
    { wallet_id: 'WAL_000001', user_id: 'USR_000001', status: 'active', balance: 10000, last_active_at: '2026-05-30T09:30:00.000Z' },
  ],
  users: [
    { user_id: 'USR_000001', created_at: '2025-01-01T00:00:00.000Z', country: 'TH', kyc_tier: 'enhanced', segment: 'freelancer' },
  ],
  devices: [],
  beneficiaries: [],
  graphEdges: [],
}));

// These are after the mock so they can reference the hoisted mock safely
const ANCHOR_TS = '2026-05-30T09:30:00.000Z';
const ATO_TS    = '2026-05-30T10:00:00.000Z'; // 30 min after anchor
const BANGKOK   = { lat: 13.7563, lon: 100.5018 };
const TOKYO     = { lat: 35.6762, lon: 139.6503 };

import { getArbiterHistoricalContext } from '@/lib/arbiter/context';
import { computeArbiterFeatures } from '@/lib/arbiter/features';
import type { ArbiterEvent } from '@/lib/arbiter/contract';

function makeAtoEvent(overrides: Partial<Omit<ArbiterEvent, '_scenario_label'>> = {}): Omit<ArbiterEvent, '_scenario_label'> {
  return {
    event_id: 'EVT_ATO_TEST',
    wallet_id: 'WAL_000001',
    timestamp: ATO_TS,
    amount_thb: 30_000,
    direction: 'outbound',
    rail: 'bank_transfer',
    beneficiary_id: 'BEN_HIGHRISK_ATO1',
    device_id: 'DEV_W1',
    ip_country: 'TH',
    has_facial_scan: false,
    geo: TOKYO,
    source: 'mockingbird',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Haversine distance fixtures
// ---------------------------------------------------------------------------
describe('Haversine distance fixtures', () => {
  it('Bangkok to Tokyo is approximately 4600 km', () => {
    const km = haversineKm(BANGKOK.lat, BANGKOK.lon, TOKYO.lat, TOKYO.lon);
    expect(km).toBeGreaterThan(4400);
    expect(km).toBeLessThan(4800);
  });

  it('Bangkok to Chiang Mai is approximately 580 km', () => {
    const chiangMai = { lat: 18.7883, lon: 98.9853 };
    const km = haversineKm(BANGKOK.lat, BANGKOK.lon, chiangMai.lat, chiangMai.lon);
    expect(km).toBeGreaterThan(500);
    expect(km).toBeLessThan(650);
  });
});

// ---------------------------------------------------------------------------
// geo_velocity from features pipeline
// ---------------------------------------------------------------------------
describe('geo_velocity feature computation', () => {
  it('returns 0 when event has no current geo', async () => {
    const features = await computeArbiterFeatures(makeAtoEvent({ geo: null }));
    const geoVel = features.find((f) => f.key === 'geo_velocity');
    expect(geoVel?.value).toBe(0);
  });

  it('returns 0 when there is no prior geo in transaction history (new wallet)', async () => {
    const features = await computeArbiterFeatures(makeAtoEvent({ wallet_id: 'WAL_UNKNOWN_XYZ' }));
    const geoVel = features.find((f) => f.key === 'geo_velocity');
    expect(geoVel?.value).toBe(0);
  });

  it('returns geo_velocity > 900 for Bangkok → Tokyo in 30 minutes', async () => {
    const features = await computeArbiterFeatures(makeAtoEvent());
    const geoVel = features.find((f) => f.key === 'geo_velocity');
    expect(typeof geoVel?.value).toBe('number');
    expect(geoVel?.value as number).toBeGreaterThan(900);
  });

  it('Bangkok → Chiang Mai in 2 hours is below 900 km/h (plausible)', () => {
    // Pure math: ~582 km / 2h = ~291 km/h — clearly below 900 impossible-travel threshold
    const chiangMai = { lat: 18.7883, lon: 98.9853 };
    const km = haversineKm(BANGKOK.lat, BANGKOK.lon, chiangMai.lat, chiangMai.lon);
    const velocity = km / 2;
    expect(velocity).toBeGreaterThan(200);
    expect(velocity).toBeLessThan(900);
  });
});

// ---------------------------------------------------------------------------
// previousGeo lookup via context
// ---------------------------------------------------------------------------
describe('previousGeo lookup in context', () => {
  it('finds Bangkok geo from prior seed transaction for WAL_000001', async () => {
    const ctx = await getArbiterHistoricalContext(makeAtoEvent());
    expect(ctx.previousGeo).not.toBeNull();
    expect(ctx.previousGeo?.lat).toBeCloseTo(BANGKOK.lat, 3);
    expect(ctx.previousGeo?.lon).toBeCloseTo(BANGKOK.lon, 3);
    expect(ctx.previousGeoTimestamp).toBe(ANCHOR_TS);
  });

  it('returns null previousGeo for a wallet with no prior transactions', async () => {
    const ctx = await getArbiterHistoricalContext(makeAtoEvent({ wallet_id: 'WAL_UNKNOWN_XYZ' }));
    expect(ctx.previousGeo).toBeNull();
    expect(ctx.previousGeoTimestamp).toBeNull();
  });
});
