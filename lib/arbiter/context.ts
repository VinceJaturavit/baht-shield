// Arbiter Phase 1/2 — Historical Context Adapter
//
// This module derives wallet/beneficiary/device history from the existing
// SignalOS synthetic seed (static JSON, no database). It is called server-side
// only; context is never accepted from client payloads.
//
// Spec-001b: transactions now have ISO-8601 timestamp and geo fields.
// All window aggregates use real rolling windows anchored to event.timestamp.
//
// Spec-002: mockingbird-history.json provides synthetic prior transaction
// history for Mockingbird fraud wallets so rolling-window features fire
// correctly. It is merged with seed transactions at query time.
// Seed files in data/seed/ are NOT modified.

import type { ArbiterEvent, ArbiterGeo, BeneficiaryRiskTier } from './contract';
import {
  transactions,
  walletAccounts,
  users,
  devices,
  beneficiaries,
  graphEdges,
} from '@/lib/seed-data';
import mockingbirdHistoryRaw from '@/data/arbiter/mockingbird-history.json';

export interface ArbiterHistoricalContext {
  walletCreatedAt: string;
  walletMeanOutbound30d: number;
  /** Number of outbound transactions in the 30d window — used for cold-start guard in features.ts. */
  walletOutboundCount30d: number;
  walletOutboundCountLast60m: number;
  walletOutboundSumLast1h: number;
  walletInboundSumLast24h: number;
  walletOutboundSumLast24h: number;
  walletOutboundMean180d: number;
  walletOutboundStd180d: number;
  dormancyDays: number;
  beneficiaryCreatedAt: string | null;
  beneficiaryRiskTier: BeneficiaryRiskTier;
  distinctWalletsOnDevice: number;
  previousGeo: ArbiterGeo | null;
  previousGeoTimestamp: string | null;
  patternMatchCount: number;
}

// ---------------------------------------------------------------------------
// Beneficiary risk tier derivation
// Seeds have no explicit risk_tier field. We derive deterministically from
// wallet_provider and country, which are stable seed fields.
// ---------------------------------------------------------------------------
function deriveBeneficiaryRiskTier(beneficiaryId: string | null): BeneficiaryRiskTier {
  if (!beneficiaryId) return 'clean';

  // Mockingbird ID-prefix conventions take priority — these apply even when the
  // beneficiary is not in the seed table (e.g. Mockingbird-generated IDs).
  if (beneficiaryId.startsWith('BEN_HIGHRISK_')) return 'black';
  if (beneficiaryId.startsWith('BEN_MEDRISK_')) return 'dark_grey';

  const ben = beneficiaries.find((b) => b.beneficiary_id === beneficiaryId);
  if (!ben) return 'clean';

  // High-risk exit points: agent cash-out nodes and cross-border wallets
  // to neighbouring corridors associated with mule logistics (public typology)
  if (ben.wallet_provider === 'agent_cashout') return 'light_grey';
  if (
    ben.wallet_provider === 'cross_border_wallet' &&
    ['MM', 'KH', 'LA'].includes(ben.country)
  ) {
    return 'dark_grey';
  }

  return 'clean';
}

// ---------------------------------------------------------------------------
// Population standard deviation helper
// ---------------------------------------------------------------------------
function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

// ---------------------------------------------------------------------------
// Rolling window helpers — all windows are exclusive of the event itself
// (transaction.timestamp < eventTs) to avoid double-counting.
// Transactions with missing timestamps are excluded from windowed queries.
// ---------------------------------------------------------------------------
function msAgo(eventTs: Date, ms: number): Date {
  return new Date(eventTs.getTime() - ms);
}

const MS_1H   = 60 * 60 * 1000;
const MS_24H  = 24 * MS_1H;
const MS_30D  = 30 * MS_24H;
const MS_180D = 180 * MS_24H;

// ---------------------------------------------------------------------------
// Mockingbird history — typed shape expected by rolling-window logic
// ---------------------------------------------------------------------------
interface MockingbirdHistoryRecord {
  wallet_id: string;
  timestamp: string;
  amount: number;
  direction: string;
  device_id: string;
  beneficiary_id: string | null;
  geo: ArbiterGeo | null;
  channel: string;
}

const mockingbirdHistory = mockingbirdHistoryRaw as MockingbirdHistoryRecord[];

// ---------------------------------------------------------------------------
// Main context resolver
// ---------------------------------------------------------------------------
export async function getArbiterHistoricalContext(
  event: Omit<ArbiterEvent, '_scenario_label'>,
): Promise<ArbiterHistoricalContext> {
  const { wallet_id, device_id, beneficiary_id, timestamp } = event;
  const eventTs = new Date(timestamp);

  // --- Wallet account ---
  const wallet = walletAccounts.find((w) => w.wallet_id === wallet_id);

  // --- User (joined for created_at; WalletAccount has no created_at field) ---
  const user = wallet ? users.find((u) => u.user_id === wallet.user_id) : undefined;

  // Use user.created_at as wallet age proxy
  const walletCreatedAt = user?.created_at ?? new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString();

  // --- Transaction history for this wallet ---
  // Merge seed transactions with Mockingbird synthetic history (Spec-002).
  // Mockingbird history provides prior transaction records for Mockingbird
  // fraud wallets so rolling-window features (velocity_1h, withdrawal_after_deposit,
  // daily_cumulative_thb, sleeper_velocity_shock) compute meaningful values.
  // Seed files in data/seed/ are NOT modified by this merge.
  // Only include records that occurred strictly before the current event.
  const seedTxns = transactions.filter((t) => t.wallet_id === wallet_id && t.timestamp !== undefined);
  const mbTxns = mockingbirdHistory.filter((t) => t.wallet_id === wallet_id);

  // Normalise mockingbird history into the same shape context.ts expects
  const mbNormalised = mbTxns.map((t) => ({
    wallet_id: t.wallet_id,
    timestamp: t.timestamp,
    amount: t.amount,
    direction: t.direction,
    device_id: t.device_id,
    beneficiary_id: t.beneficiary_id,
    geo: t.geo,
    channel: t.channel,
  }));

  // Combined prior history — source of truth for all rolling windows below
  const walletTxns = [...seedTxns, ...mbNormalised] as Array<{
    wallet_id: string;
    timestamp: string | undefined;
    amount: number;
    direction: string;
    device_id: string;
    beneficiary_id?: string | null;
    geo?: ArbiterGeo | null;
    channel?: string;
  }>;

  // Type-guarded filter: priorTxns has timestamp typed as string (not undefined)
  type WalletTxnWithTs = (typeof walletTxns)[number] & { timestamp: string };
  const priorTxns = walletTxns.filter((t): t is WalletTxnWithTs => {
    if (!t.timestamp) return false;
    return new Date(t.timestamp) < eventTs;
  });

  const priorOutbound = priorTxns.filter((t) => t.direction === 'outbound');
  const priorInbound  = priorTxns.filter((t) => t.direction === 'inbound');

  // --- 30-day outbound mean and count (used for amt_to_mean_ratio + cold-start guard) ---
  const cutoff30d = msAgo(eventTs, MS_30D);
  const outbound30d = priorOutbound.filter((t) => new Date(t.timestamp) >= cutoff30d);
  const amounts30d  = outbound30d.map((t) => t.amount);
  const walletMeanOutbound30d =
    amounts30d.length > 0 ? amounts30d.reduce((a, b) => a + b, 0) / amounts30d.length : 0;
  const walletOutboundCount30d = outbound30d.length;

  // --- 60-minute outbound count ---
  const cutoff1h = msAgo(eventTs, MS_1H);
  const outbound1h = priorOutbound.filter((t) => new Date(t.timestamp) >= cutoff1h);
  const walletOutboundCountLast60m = outbound1h.length;

  // --- 1-hour outbound sum ---
  const walletOutboundSumLast1h = outbound1h.reduce((a, t) => a + t.amount, 0);

  // --- 24-hour inbound sum ---
  const cutoff24h = msAgo(eventTs, MS_24H);
  const inbound24h = priorInbound.filter((t) => new Date(t.timestamp) >= cutoff24h);
  const walletInboundSumLast24h = inbound24h.reduce((a, t) => a + t.amount, 0);

  // --- 24-hour outbound sum (distinct from 1h sum) ---
  const outbound24h = priorOutbound.filter((t) => new Date(t.timestamp) >= cutoff24h);
  const walletOutboundSumLast24h = outbound24h.reduce((a, t) => a + t.amount, 0);

  // --- 180-day outbound mean and std (distinct from 30-day mean) ---
  const cutoff180d = msAgo(eventTs, MS_180D);
  const outbound180d = priorOutbound.filter((t) => new Date(t.timestamp) >= cutoff180d);
  const amounts180d  = outbound180d.map((t) => t.amount);
  const walletOutboundMean180d =
    amounts180d.length > 0 ? amounts180d.reduce((a, b) => a + b, 0) / amounts180d.length : 0;
  const walletOutboundStd180d = stdDev(amounts180d);

  // --- Dormancy: days since last_active_at ---
  const lastActiveAt = wallet?.last_active_at
    ? new Date(wallet.last_active_at)
    : new Date(eventTs.getTime() - 1 * 24 * 3600 * 1000);
  const dormancyDays = Math.max(
    0,
    Math.floor((eventTs.getTime() - lastActiveAt.getTime()) / (1000 * 3600 * 24)),
  );

  // --- Beneficiary context ---
  // Seed has no beneficiary.created_at; is_new_beneficiary is derived from
  // ID prefix conventions used by Mockingbird (BEN_NEW_* = new within 48h)
  const beneficiaryCreatedAt: string | null = (() => {
    if (!beneficiary_id) return null;
    if (beneficiary_id.startsWith('BEN_NEW_')) {
      return new Date(eventTs.getTime() - 12 * 3600 * 1000).toISOString();
    }
    return null;
  })();

  const beneficiaryRiskTier = deriveBeneficiaryRiskTier(beneficiary_id);

  // --- Device account count: distinct wallets sharing device_id ---
  // Include both seed and mockingbird history for accurate device-sharing signal.
  const deviceTxnsSeed = transactions.filter((t) => t.device_id === device_id);
  const deviceTxnsMb   = mockingbirdHistory.filter((t) => t.device_id === device_id);
  const walletIdsOnDevice = new Set([
    ...deviceTxnsSeed.map((t) => t.wallet_id),
    ...deviceTxnsMb.map((t) => t.wallet_id),
  ]);
  const deviceRecord = devices.find((d) => d.device_id === device_id);
  if (deviceRecord) walletIdsOnDevice.add(wallet_id);
  const distinctWalletsOnDevice = Math.max(walletIdsOnDevice.size, 1);

  // --- Previous geo lookup ---
  // Find the most recent prior transaction for this wallet that has geo data.
  // Transactions with missing timestamp or null geo are excluded.
  const priorGeoTxns = priorTxns
    .filter((t) => t.geo != null)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const previousGeo: ArbiterGeo | null =
    priorGeoTxns.length > 0 ? (priorGeoTxns[0].geo as ArbiterGeo) : null;
  const previousGeoTimestamp: string | null =
    priorGeoTxns.length > 0 ? priorGeoTxns[0].timestamp : null;

  // --- Pattern match count: graph_edges with edge_type "pattern_match" for this wallet ---
  const patternMatchCount = graphEdges.filter(
    (e) => e.from_entity === wallet_id && e.edge_type === 'pattern_match',
  ).length;

  return {
    walletCreatedAt,
    walletMeanOutbound30d,
    walletOutboundCountLast60m,
    walletOutboundCount30d,
    walletOutboundSumLast1h,
    walletInboundSumLast24h,
    walletOutboundSumLast24h,
    walletOutboundMean180d,
    walletOutboundStd180d,
    dormancyDays,
    beneficiaryCreatedAt,
    beneficiaryRiskTier,
    distinctWalletsOnDevice,
    previousGeo,
    previousGeoTimestamp,
    patternMatchCount,
  };
}
