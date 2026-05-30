// IMPORTANT:
// transactions do not have timestamp fields.
// Transaction ordering must be derived from txn_id sequence only.
// Do not add or assume transaction timestamps.

import {
  alerts,
  analystPatterns,
  beneficiaries,
  caseNotes,
  cases,
  devices,
  graphEdges,
  kycEvents,
  simBindings,
  transactions,
  users,
  walletAccounts,
} from "./seed-data";

import type {
  Alert,
  Beneficiary,
  CaseNote,
  Device,
  FraudCase,
  KycEvent,
  SimBinding,
  Transaction,
  User,
  WalletAccount,
} from "./types";

// ---------------------------------------------------------------------------
// Exported interfaces
// ---------------------------------------------------------------------------

export interface EnrichedTransaction extends Transaction {
  sequence_ordinal: number;
  beneficiary: Beneficiary | null;
}

export interface EnrichedCase extends FraudCase {
  alert: Alert | null;
  notes: CaseNote[];
}

export interface MatchedPatternDisplay {
  pattern_id: string;
  name: string;
  cluster_type: string;
  status: string;
  variables: string;
  naive_miss_note: string;
}

export interface WalletProfileData {
  wallet: WalletAccount;
  user: User | null;
  latestKycEvent: KycEvent | null;
  devices: Device[];
  simBindings: SimBinding[];
  transactions: EnrichedTransaction[];
  cases: EnrichedCase[];
  matchedPatterns: MatchedPatternDisplay[];
}

// ---------------------------------------------------------------------------
// Sequence helpers
// ---------------------------------------------------------------------------

export function getTransactionSequenceOrdinal(txnId: string): number {
  const match = txnId.match(/(\d+)/g);
  if (!match || match.length === 0) return Number.MAX_SAFE_INTEGER;
  return Number(match[match.length - 1]);
}

export function getTransactionDirectionOrder(txnId: string): number {
  if (txnId.endsWith("_IN")) return 0;
  if (txnId.endsWith("_OUT")) return 1;
  return 2;
}

// ---------------------------------------------------------------------------
// Naive-miss notes
// ---------------------------------------------------------------------------

export function getNaiveMissNote(patternId: string): string {
  switch (patternId) {
    case "PAT_MF_001":
      return "Each account may pass KYC and show low standalone device risk; the signal is the shared-device/SIM cluster across accounts.";
    case "PAT_SM_001":
      return "The wallet may be aged with normal history; the signal is dormant-then-activation behavior and shared cash-out destinations.";
    case "PAT_APP_001":
      return "Each payment may look authorized and moderate in value; the signal is repeated endpoint convergence across victim-origin transfers.";
    case "PAT_ENDPOINT_001":
      return "A single transfer may look normal; the analyst layer recognizes the endpoint as recurring across prior cash-out cases.";
    case "PAT_ENDPOINT_002":
      return "The transaction may appear as a normal remittance; the pattern layer identifies the endpoint as part of a cross-border exit path.";
    default:
      return "Naive scoring may miss this because the signal is distributed across cases, endpoints, or prior analyst decisions.";
  }
}

// ---------------------------------------------------------------------------
// Pattern matching — three-tier fallback
// ---------------------------------------------------------------------------

function inferPatternIdFromRuleName(ruleName: string): string | null {
  const r = ruleName.toUpperCase();
  if (r.includes("MULE_FARM") || r.includes("PATTERN_MULE_FARM_CLUSTER")) return "PAT_MF_001";
  if (r.includes("SLEEPER_MULE") || r.includes("PATTERN_SLEEPER_MULE_ACTIVATION")) return "PAT_SM_001";
  if (r.includes("APP_SCAM") || r.includes("PATTERN_APP_SCAM_CASHOUT_RING")) return "PAT_APP_001";
  if (r.includes("CASHOUT_ENDPOINT")) return "PAT_ENDPOINT_001";
  if (r.includes("CROSS_BORDER")) return "PAT_ENDPOINT_002";
  return null;
}

function inferPatternIdFromCaseId(caseId: string): string | null {
  if (caseId.startsWith("CASE_MF")) return "PAT_MF_001";
  if (caseId.startsWith("CASE_SM")) return "PAT_SM_001";
  if (caseId.startsWith("CASE_APP")) return "PAT_APP_001";
  return null;
}

function resolveMatchedPatterns(
  walletId: string,
  walletAlerts: Alert[],
  walletCases: FraudCase[]
): MatchedPatternDisplay[] {
  const patternIds = new Set<string>();

  // Tier 1: direct graph edge pattern_match
  for (const edge of graphEdges) {
    if (edge.edge_type === "pattern_match") {
      if (edge.from_entity === walletId && edge.to_entity.startsWith("PAT_")) {
        patternIds.add(edge.to_entity);
      }
      if (edge.to_entity === walletId && edge.from_entity.startsWith("PAT_")) {
        patternIds.add(edge.from_entity);
      }
    }
  }

  // Tier 2: infer from alert rule_name
  if (patternIds.size === 0) {
    for (const alert of walletAlerts) {
      const pid = inferPatternIdFromRuleName(alert.rule_name);
      if (pid) patternIds.add(pid);
    }
  }

  // Tier 3: infer from case_id prefix
  if (patternIds.size === 0) {
    for (const c of walletCases) {
      const pid = inferPatternIdFromCaseId(c.case_id);
      if (pid) patternIds.add(pid);
    }
  }

  const result: MatchedPatternDisplay[] = [];
  for (const pid of patternIds) {
    const pattern = analystPatterns.find((p) => p.pattern_id === pid);
    result.push({
      pattern_id: pid,
      name: pattern?.name ?? pid,
      cluster_type: pattern?.cluster_type ?? "—",
      status: pattern?.status ?? "—",
      variables: pattern?.variables ?? "—",
      naive_miss_note: getNaiveMissNote(pid),
    });
  }
  return result;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function getWalletProfile(walletId: string): WalletProfileData | null {
  const wallet = walletAccounts.find((w) => w.wallet_id === walletId);
  if (!wallet) return null;

  // User
  const user = users.find((u) => u.user_id === wallet.user_id) ?? null;

  // KYC — use first available (no timestamp on kyc_events)
  const userKycEvents = kycEvents.filter((k) => k.user_id === wallet.user_id);
  const latestKycEvent = userKycEvents.length > 0 ? userKycEvents[0] : null;

  // Devices + SIM bindings
  const userDevices = devices.filter((d) => d.user_id === wallet.user_id);
  const userSimBindings = simBindings.filter((s) => s.user_id === wallet.user_id);

  // Transactions — enriched + sorted by txn_id sequence
  const rawTxns = transactions.filter((t) => t.wallet_id === walletId);
  const enrichedTxns: EnrichedTransaction[] = rawTxns.map((t) => ({
    ...t,
    sequence_ordinal: getTransactionSequenceOrdinal(t.txn_id),
    beneficiary: beneficiaries.find((b) => b.beneficiary_id === t.beneficiary_id) ?? null,
  }));
  enrichedTxns.sort((a, b) => {
    if (a.sequence_ordinal !== b.sequence_ordinal) return a.sequence_ordinal - b.sequence_ordinal;
    const da = getTransactionDirectionOrder(a.txn_id);
    const db = getTransactionDirectionOrder(b.txn_id);
    if (da !== db) return da - db;
    return a.txn_id.localeCompare(b.txn_id);
  });

  // Alerts linked to this wallet
  const walletAlerts = alerts.filter((a) => a.wallet_id === walletId);
  const alertIds = new Set(walletAlerts.map((a) => a.alert_id));

  // Cases linked to those alerts
  const walletCases = cases.filter((c) => alertIds.has(c.alert_id));

  // Enriched cases
  const enrichedCases: EnrichedCase[] = walletCases.map((c) => ({
    ...c,
    alert: walletAlerts.find((a) => a.alert_id === c.alert_id) ?? null,
    notes: caseNotes.filter((n) => n.case_id === c.case_id),
  }));

  // Matched analyst patterns
  const matchedPatterns = resolveMatchedPatterns(walletId, walletAlerts, walletCases);

  return {
    wallet,
    user,
    latestKycEvent,
    devices: userDevices,
    simBindings: userSimBindings,
    transactions: enrichedTxns,
    cases: enrichedCases,
    matchedPatterns,
  };
}
