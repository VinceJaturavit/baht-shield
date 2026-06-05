#!/usr/bin/env tsx
/**
 * Spec-001b Migration — Add timestamps and geo to seed transactions.
 *
 * One-time script. Reads data/seed/transactions.json and writes it back
 * with two new fields on every record:
 *   timestamp: ISO-8601 string
 *   geo:       { lat, lon } | null
 *
 * Rules:
 * - Timestamps are deterministic (no Math.random): derived from txn_id number
 *   and wallet created_at so every run produces the same output.
 * - Geo is Thailand-centered for most transactions (~95%); 5% null.
 * - ATO anchor wallets (WAL_000001–3) get Bangkok geo on their last transaction
 *   at a known timestamp so Mockingbird ATO events can trigger geo_velocity > 900.
 *
 * Run: npx tsx scripts/migrate-transactions.ts
 */

import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Types (inline — avoid import chain issues in a bare script)
// ---------------------------------------------------------------------------
interface Transaction {
  txn_id: string;
  wallet_id: string;
  direction: string;
  amount: number;
  channel: string;
  beneficiary_id: string;
  device_id: string;
  timestamp?: string;
  geo?: { lat: number; lon: number } | null;
}

interface WalletAccount {
  wallet_id: string;
  user_id: string;
  status: string;
  balance: number;
  last_active_at: string;
}

interface User {
  user_id: string;
  created_at: string;
  country: string;
  kyc_tier: string;
  segment: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const BASE_TS = new Date('2026-05-30T12:00:00.000Z');
// ATO anchor: last transaction for these wallets gets Bangkok geo at this timestamp.
// Mockingbird ATO events reference the same wallets 30 min later with Tokyo geo.
// WAL_000001, WAL_000003, WAL_000004 all have 26 transactions in the seed.
// WAL_000002 has 0 transactions and is excluded.
const ATO_ANCHOR_WALLETS: Record<string, { lat: number; lon: number; anchorTs: string }> = {
  WAL_000001: { lat: 13.7563, lon: 100.5018, anchorTs: '2026-05-30T09:30:00.000Z' },
  WAL_000003: { lat: 13.7600, lon: 100.5100, anchorTs: '2026-05-30T09:00:00.000Z' },
  WAL_000004: { lat: 13.7450, lon: 100.4900, anchorTs: '2026-05-30T08:45:00.000Z' },
};

// Thailand bounding box for synthetic geo
const TH_LAT_MIN = 5.6;
const TH_LAT_MAX = 20.5;
const TH_LON_MIN = 97.3;
const TH_LON_MAX = 105.7;

// ---------------------------------------------------------------------------
// Deterministic pseudo-random (LCG) — seeded per txn_id to avoid Math.random
// ---------------------------------------------------------------------------
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function txnSeed(txn_id: string): number {
  // Parse numeric part of TXN_0000001 → 1
  const n = parseInt(txn_id.replace(/\D/g, ''), 10) || 1;
  return n;
}

// ---------------------------------------------------------------------------
// Load seed files
// ---------------------------------------------------------------------------
const root = path.resolve(__dirname, '..');

function loadJson<T>(relPath: string): T {
  return JSON.parse(fs.readFileSync(path.join(root, relPath), 'utf8')) as T;
}

const transactions = loadJson<Transaction[]>('data/seed/transactions.json');
const walletAccounts = loadJson<WalletAccount[]>('data/seed/wallet_accounts.json');
const users = loadJson<User[]>('data/seed/users.json');

// ---------------------------------------------------------------------------
// Build wallet → created_at map
// ---------------------------------------------------------------------------
const userMap = new Map(users.map((u) => [u.user_id, u]));
const walletCreatedAt = new Map<string, Date>();
for (const wa of walletAccounts) {
  const user = userMap.get(wa.user_id);
  if (user) {
    walletCreatedAt.set(wa.wallet_id, new Date(user.created_at));
  }
}

// ---------------------------------------------------------------------------
// Group transactions by wallet_id, preserving order (txn_id sequence)
// ---------------------------------------------------------------------------
const byWallet = new Map<string, Transaction[]>();
for (const txn of transactions) {
  const arr = byWallet.get(txn.wallet_id) ?? [];
  arr.push(txn);
  byWallet.set(txn.wallet_id, arr);
}

// ---------------------------------------------------------------------------
// Assign timestamps and geo
// ---------------------------------------------------------------------------
const outputMap = new Map<string, Transaction>();

for (const [wallet_id, txns] of byWallet) {
  const createdAt = walletCreatedAt.get(wallet_id) ?? new Date(BASE_TS.getTime() - 365 * 24 * 3600 * 1000);
  const walletSpanMs = BASE_TS.getTime() - createdAt.getTime();
  const count = txns.length;

  const atoAnchor = ATO_ANCHOR_WALLETS[wallet_id];

  for (let i = 0; i < txns.length; i++) {
    const txn = txns[i];
    const rng = lcg(txnSeed(txn.txn_id));

    // --- Timestamp ---
    let ts: string;
    if (atoAnchor && i === count - 1) {
      // Last transaction for ATO-anchor wallets: use the anchor timestamp
      ts = atoAnchor.anchorTs;
    } else {
      // Spread proportionally: slot i out of count, with ±5% jitter
      const fraction = count > 1 ? i / (count - 1) : 0.5;
      const jitter = (rng() - 0.5) * 0.05; // ±2.5%
      const clampedFraction = Math.max(0, Math.min(0.9999, fraction + jitter));
      const offsetMs = walletSpanMs > 0 ? clampedFraction * walletSpanMs : 0;
      ts = new Date(createdAt.getTime() + offsetMs).toISOString();
    }

    // --- Geo ---
    let geo: { lat: number; lon: number } | null;
    if (atoAnchor && i === count - 1) {
      // ATO anchor: Bangkok geo
      geo = { lat: atoAnchor.lat, lon: atoAnchor.lon };
    } else {
      const geoRoll = rng();
      if (geoRoll < 0.05) {
        // ~5% null
        geo = null;
      } else {
        // Thailand-centered synthetic geo (deterministic)
        const lat = TH_LAT_MIN + rng() * (TH_LAT_MAX - TH_LAT_MIN);
        const lon = TH_LON_MIN + rng() * (TH_LON_MAX - TH_LON_MIN);
        geo = { lat: parseFloat(lat.toFixed(4)), lon: parseFloat(lon.toFixed(4)) };
      }
    }

    outputMap.set(txn.txn_id, { ...txn, timestamp: ts, geo });
  }
}

// ---------------------------------------------------------------------------
// Reassemble in original order
// ---------------------------------------------------------------------------
const migrated: Transaction[] = transactions.map((txn) => outputMap.get(txn.txn_id) ?? txn);

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------
const outPath = path.join(root, 'data/seed/transactions.json');
fs.writeFileSync(outPath, JSON.stringify(migrated, null, 2) + '\n', 'utf8');

console.log(`Migration complete: ${migrated.length} transactions written to ${outPath}`);
const sample = migrated.slice(0, 3);
console.log('Sample (first 3):');
for (const t of sample) {
  console.log(`  ${t.txn_id}  ts=${t.timestamp}  geo=${t.geo ? `${t.geo.lat},${t.geo.lon}` : 'null'}`);
}
// Verify ATO anchors
for (const [wid, anchor] of Object.entries(ATO_ANCHOR_WALLETS)) {
  const walletTxns = migrated.filter((t) => t.wallet_id === wid);
  const last = walletTxns[walletTxns.length - 1];
  console.log(`ATO anchor ${wid}: last txn ts=${last?.timestamp}  geo=${JSON.stringify(last?.geo)}`);
}
