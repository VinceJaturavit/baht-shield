// Arbiter Phase 1 — Sample Event Loader
//
// Provides ArbiterEvent[] for the /arbiter UI.
// Combines:
//   1. Mockingbird-generated events (data/arbiter/mockingbird-events.json)
//   2. A small set of seed-derived events built from existing wallet/transaction seed
//
// This module is server-side only (used by the page server component and API route).
// It does NOT run Mockingbird — it reads the pre-generated output file.

import type { ArbiterEvent } from './contract';
import mockingbirdRaw from '@/data/arbiter/mockingbird-events.json';
import { transactions, walletAccounts, users, devices } from '@/lib/seed-data';

// ---------------------------------------------------------------------------
// Mockingbird events — typed cast
// ---------------------------------------------------------------------------
const mockingbirdEvents = mockingbirdRaw as ArbiterEvent[];

// ---------------------------------------------------------------------------
// Seed-derived events
// Build a representative sample from the existing SignalOS seed transactions.
// We take the first 20 distinct wallets that have outbound transactions,
// create a synthetic ArbiterEvent for each, preserving their real amounts
// and device IDs. Timestamps are synthesized from user.created_at + offset.
// ---------------------------------------------------------------------------
function buildSeedEvents(): ArbiterEvent[] {
  const walletMap = new Map(walletAccounts.map((w) => [w.wallet_id, w]));
  const userMap = new Map(users.map((u) => [u.user_id, u]));
  const deviceMap = new Map(devices.map((d) => [d.device_id, d]));

  const seen = new Set<string>();
  const result: ArbiterEvent[] = [];
  let counter = 1;

  for (const txn of transactions) {
    if (result.length >= 20) break;
    if (txn.direction !== 'outbound') continue;
    if (seen.has(txn.wallet_id)) continue;
    seen.add(txn.wallet_id);

    const wallet = walletMap.get(txn.wallet_id);
    const user = wallet ? userMap.get(wallet.user_id) : undefined;
    const device = deviceMap.get(txn.device_id);

    // Synthesize a timestamp: user.created_at + 30 days + counter hours
    const baseTs = user?.created_at
      ? new Date(new Date(user.created_at).getTime() + 30 * 24 * 3600 * 1000 + counter * 3600 * 1000)
      : new Date('2026-05-01T12:00:00Z');

    const rail = txn.channel === 'wallet_transfer' ? 'internal'
      : txn.channel === 'cross_border_remittance' ? 'bank_transfer'
      : 'promptpay';

    result.push({
      event_id: `EVT_SEED_${String(counter).padStart(4, '0')}`,
      wallet_id: txn.wallet_id,
      timestamp: baseTs.toISOString(),
      amount_thb: txn.amount,
      direction: 'outbound',
      rail,
      beneficiary_id: txn.beneficiary_id || null,
      device_id: txn.device_id,
      ip_country: user?.country ?? 'TH',
      has_facial_scan: device ? device.risk_score < 50 : true,
      geo: null,
      source: 'seed',
      _scenario_label: 'background',
    });

    counter++;
  }

  return result;
}

let _cachedSeedEvents: ArbiterEvent[] | null = null;

export async function getArbiterSampleEvents(): Promise<ArbiterEvent[]> {
  if (!_cachedSeedEvents) {
    _cachedSeedEvents = buildSeedEvents();
  }
  // Mockingbird events first (more interesting for demo), seed events second
  return [...mockingbirdEvents, ..._cachedSeedEvents];
}
