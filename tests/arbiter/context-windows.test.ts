// Spec-001b — Rolling Window Unit Tests
//
// Proves that context.ts computes real time-windowed aggregates, not all-time
// aliases. Each test constructs an explicit transaction set and event timestamp,
// calls getArbiterHistoricalContext, and asserts the expected window value.
//
// These tests FAIL if aliasing is reintroduced (e.g. walletOutboundSumLast24h
// = walletOutboundSumLast1h) because the explicit fixture has transactions
// inside 24h but outside 1h.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// We test getArbiterHistoricalContext by mocking the seed-data module so we
// control exactly which transactions are visible.
// ---------------------------------------------------------------------------
const EVENT_TS = '2026-06-01T12:00:00.000Z';
const eventDate = new Date(EVENT_TS);

// Helper: ms offset from event
const msFromEvent = (hoursAgo: number) =>
  new Date(eventDate.getTime() - hoursAgo * 3600 * 1000).toISOString();

const BASE_TXN = {
  wallet_id: 'WAL_TEST_WIN_001',
  beneficiary_id: 'BEN_TEST',
  device_id: 'DEV_TEST',
  channel: 'promptpay',
};

// ---------------------------------------------------------------------------
// Mock the heavy seed modules — we only need transactions for window tests
// ---------------------------------------------------------------------------
vi.mock('@/lib/seed-data', () => ({
  transactions: [] as unknown[],   // overridden per test via vi.mocked
  walletAccounts: [
    { wallet_id: 'WAL_TEST_WIN_001', user_id: 'USR_TEST_WIN', status: 'active', balance: 5000, last_active_at: '2026-05-01T00:00:00.000Z' },
  ],
  users: [
    { user_id: 'USR_TEST_WIN', created_at: '2025-01-01T00:00:00.000Z', country: 'TH', kyc_tier: 'verified', segment: 'personal' },
  ],
  devices: [],
  beneficiaries: [],
  graphEdges: [],
}));

// Helper to override transactions within a test
async function withTransactions(
  txns: unknown[],
  fn: () => Promise<void>,
): Promise<void> {
  const seedData = await import('@/lib/seed-data');
  const mocked = seedData as { transactions: unknown[] };
  mocked.transactions = txns;
  await fn();
}

import { getArbiterHistoricalContext } from '@/lib/arbiter/context';
import type { ArbiterEvent } from '@/lib/arbiter/contract';

function makeEvent(overrides: Partial<Omit<ArbiterEvent, '_scenario_label'>> = {}): Omit<ArbiterEvent, '_scenario_label'> {
  return {
    event_id: 'EVT_WIN_TEST',
    wallet_id: 'WAL_TEST_WIN_001',
    timestamp: EVENT_TS,
    amount_thb: 5000,
    direction: 'outbound',
    rail: 'promptpay',
    beneficiary_id: 'BEN_TEST',
    device_id: 'DEV_TEST',
    ip_country: 'TH',
    has_facial_scan: true,
    geo: null,
    source: 'seed',
    ...overrides,
  };
}

describe('Rolling window: walletOutboundCountLast60m', () => {
  it('counts outbound transactions strictly inside the 60-minute window', async () => {
    const txns = [
      { ...BASE_TXN, txn_id: 'T1', direction: 'outbound', amount: 1000, timestamp: msFromEvent(0.25) }, // 15 min ago — inside window
      { ...BASE_TXN, txn_id: 'T2', direction: 'outbound', amount: 1000, timestamp: msFromEvent(0.75) }, // 45 min ago — inside window
    ];
    await withTransactions(txns, async () => {
      const ctx = await getArbiterHistoricalContext(makeEvent());
      expect(ctx.walletOutboundCountLast60m).toBe(2);
    });
  });

  it('excludes outbound transactions older than 60 minutes', async () => {
    const txns = [
      { ...BASE_TXN, txn_id: 'T1', direction: 'outbound', amount: 1000, timestamp: msFromEvent(0.5) },  // inside
      { ...BASE_TXN, txn_id: 'T2', direction: 'outbound', amount: 1000, timestamp: msFromEvent(1.5) },  // outside (90 min ago)
      { ...BASE_TXN, txn_id: 'T3', direction: 'outbound', amount: 1000, timestamp: msFromEvent(25) },   // outside (25 h ago)
    ];
    await withTransactions(txns, async () => {
      const ctx = await getArbiterHistoricalContext(makeEvent());
      expect(ctx.walletOutboundCountLast60m).toBe(1);
    });
  });

  it('excludes inbound transactions from outbound count', async () => {
    const txns = [
      { ...BASE_TXN, txn_id: 'T1', direction: 'inbound',  amount: 1000, timestamp: msFromEvent(0.25) },
      { ...BASE_TXN, txn_id: 'T2', direction: 'outbound', amount: 1000, timestamp: msFromEvent(0.75) },
    ];
    await withTransactions(txns, async () => {
      const ctx = await getArbiterHistoricalContext(makeEvent());
      expect(ctx.walletOutboundCountLast60m).toBe(1); // only T2
    });
  });
});

describe('Rolling window: 1h vs 24h differ', () => {
  it('walletOutboundSumLast1h differs from walletOutboundSumLast24h when history supports it', async () => {
    const txns = [
      { ...BASE_TXN, txn_id: 'T1', direction: 'outbound', amount: 500,  timestamp: msFromEvent(0.5) },  // inside 1h
      { ...BASE_TXN, txn_id: 'T2', direction: 'outbound', amount: 2000, timestamp: msFromEvent(3) },    // inside 24h, outside 1h
      { ...BASE_TXN, txn_id: 'T3', direction: 'outbound', amount: 3000, timestamp: msFromEvent(10) },   // inside 24h, outside 1h
    ];
    await withTransactions(txns, async () => {
      const ctx = await getArbiterHistoricalContext(makeEvent());
      expect(ctx.walletOutboundSumLast1h).toBe(500);
      expect(ctx.walletOutboundSumLast24h).toBe(5500); // 500+2000+3000
      expect(ctx.walletOutboundSumLast1h).not.toBe(ctx.walletOutboundSumLast24h);
    });
  });
});

describe('Rolling window: walletInboundSumLast24h counts inbound only', () => {
  it('returns sum of inbound amounts in last 24h, ignoring outbound', async () => {
    const txns = [
      { ...BASE_TXN, txn_id: 'T1', direction: 'inbound',  amount: 4000, timestamp: msFromEvent(2) },
      { ...BASE_TXN, txn_id: 'T2', direction: 'outbound', amount: 9999, timestamp: msFromEvent(3) },
      { ...BASE_TXN, txn_id: 'T3', direction: 'inbound',  amount: 1000, timestamp: msFromEvent(20) },
    ];
    await withTransactions(txns, async () => {
      const ctx = await getArbiterHistoricalContext(makeEvent());
      expect(ctx.walletInboundSumLast24h).toBe(5000); // 4000 + 1000, not 9999
    });
  });
});

describe('Rolling window: 180d mean differs from 30d mean', () => {
  it('returns different mean when amounts differ between 30d and 30d–180d ranges', async () => {
    // Build transactions:
    // - 3 txns in last 30 days with small amounts (mean ~1000)
    // - 3 txns in days 31-180 with large amounts (mean ~50000)
    const txns = [
      { ...BASE_TXN, txn_id: 'T1', direction: 'outbound', amount: 900,  timestamp: msFromEvent(24 * 5) },   // 5 days ago (30d)
      { ...BASE_TXN, txn_id: 'T2', direction: 'outbound', amount: 1000, timestamp: msFromEvent(24 * 15) },  // 15 days ago (30d)
      { ...BASE_TXN, txn_id: 'T3', direction: 'outbound', amount: 1100, timestamp: msFromEvent(24 * 25) },  // 25 days ago (30d)
      { ...BASE_TXN, txn_id: 'T4', direction: 'outbound', amount: 40000, timestamp: msFromEvent(24 * 45) }, // 45 days ago (180d only)
      { ...BASE_TXN, txn_id: 'T5', direction: 'outbound', amount: 50000, timestamp: msFromEvent(24 * 90) }, // 90 days ago (180d only)
      { ...BASE_TXN, txn_id: 'T6', direction: 'outbound', amount: 60000, timestamp: msFromEvent(24 * 150) },// 150 days ago (180d only)
    ];
    await withTransactions(txns, async () => {
      const ctx = await getArbiterHistoricalContext(makeEvent());
      // 30d mean: (900+1000+1100)/3 = 1000
      expect(ctx.walletMeanOutbound30d).toBeCloseTo(1000, 0);
      // 180d mean: (900+1000+1100+40000+50000+60000)/6 = 153000/6 = 25500
      expect(ctx.walletOutboundMean180d).toBeCloseTo(25500, 0);
      expect(ctx.walletMeanOutbound30d).not.toBeCloseTo(ctx.walletOutboundMean180d, 0);
    });
  });
});

describe('Rolling window: current event excluded from prior history', () => {
  it('does not count a transaction timestamped at exactly event.timestamp', async () => {
    const txns = [
      { ...BASE_TXN, txn_id: 'T1', direction: 'outbound', amount: 1000, timestamp: EVENT_TS }, // exactly at event — must be excluded
    ];
    await withTransactions(txns, async () => {
      const ctx = await getArbiterHistoricalContext(makeEvent());
      // T1 should be excluded (not prior to event — equal timestamp excluded by < check)
      expect(ctx.walletOutboundCountLast60m).toBe(0);
      expect(ctx.walletOutboundSumLast1h).toBe(0);
    });
  });
});

describe('Rolling window: missing timestamps are excluded safely', () => {
  it('ignores transactions without a timestamp field', async () => {
    const txns = [
      { ...BASE_TXN, txn_id: 'T1', direction: 'outbound', amount: 9999 }, // no timestamp — must be ignored
      { ...BASE_TXN, txn_id: 'T2', direction: 'outbound', amount: 500, timestamp: msFromEvent(0.5) }, // valid
    ];
    await withTransactions(txns, async () => {
      const ctx = await getArbiterHistoricalContext(makeEvent());
      expect(ctx.walletOutboundSumLast1h).toBe(500); // only T2
    });
  });
});
