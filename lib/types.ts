// IMPORTANT:
// transactions do not have timestamp fields.
// Transaction ordering must be derived from txn_id sequence only.
// Do not add or assume transaction timestamps.
// Example ordering: TXN_SM_000001_IN precedes TXN_SM_000001_OUT by ID convention.

export type AlertSeverity = "low" | "medium" | "high" | "critical";

export type AlertStatus =
  | "new"
  | "in_review"
  | "escalated"
  | "closed"
  | string;

export type CaseDecision =
  | "pending"
  | "clear"
  | "close_account"
  | "escalate_compliance"
  | "monitor"
  | "suspend_wallet"
  | string;

export interface Alert {
  alert_id: string;
  rule_name: string;
  severity: AlertSeverity | string;
  wallet_id: string;
  status: AlertStatus;
}

export interface FraudCase {
  case_id: string;
  alert_id: string;
  owner: string;
  decision: CaseDecision;
  loss_amount: number;
  opened_at: string;
  closed_at: string | null;
}

export interface Transaction {
  txn_id: string;
  wallet_id: string;
  direction: string;
  amount: number;
  channel: string;
  beneficiary_id: string;
  device_id: string;
  // NO timestamp field — order via txn_id sequence only
}

export interface WalletAccount {
  wallet_id: string;
  user_id: string;
  status: string;
  balance: number;
  last_active_at: string;
}

export interface AnalystPattern {
  pattern_id: string;
  name: string;
  variables: string;
  cluster_type: string;
  status: string;
  created_by: string;
}

export interface User {
  user_id: string;
  created_at: string;
  country: string;
  kyc_tier: string;
  segment: string;
}

export interface KycEvent {
  kyc_event_id: string;
  user_id: string;
  doc_type: string;
  liveness_score: number;
  decision: string;
}

export interface Device {
  device_id: string;
  user_id: string;
  first_seen_at: string;
  os: string;
  risk_score: number;
}

export interface SimBinding {
  binding_id: string;
  user_id: string;
  msisdn: string;
  sim_change_count: number;
}

export interface Beneficiary {
  beneficiary_id: string;
  name: string;
  bank_code: string;
  wallet_provider: string;
  country: string;
}

export interface CaseNote {
  note_id: string;
  case_id: string;
  author_type: string;
  content: string;
  timestamp: string;
}

export interface GraphEdge {
  from_entity: string;
  to_entity: string;
  edge_type: string;
  weight: number;
}

// ---------------------------------------------------------------------------
// Pattern Intelligence — Spec-005
// ---------------------------------------------------------------------------

export type PatternFamily =
  | "Onboarding Mule Farm"
  | "Sleeper Mule Activation"
  | "APP Scam Cash-out"
  | "Endpoint Intelligence"
  | "Other";

export interface LinkedPatternWallet {
  wallet_id: string;
  linked_case_count: number;
  linked_alert_count: number;
}

export interface PatternSummary {
  pattern_id: string;
  name: string;
  variables: string;
  cluster_type: string;
  status: string;
  created_by: string;
  family: PatternFamily;
  linked_wallet_count: number;
  linked_case_count: number;
  linked_wallets: LinkedPatternWallet[];
  naive_miss_note: string;
}

// ---------------------------------------------------------------------------
// Closure Note Builder — Spec-004
// ---------------------------------------------------------------------------

export type EvidenceToggleCategory =
  | "Pattern Match"
  | "Device / SIM Evidence"
  | "Transaction Behavior"
  | "KYC / Onboarding"
  | "Endpoint / Beneficiary"
  | "Case Context";

export interface EvidenceToggleOption {
  id: string;
  label: string;
  description: string;
  category: EvidenceToggleCategory;
  defaultSelected: boolean;
  source: "scenario" | "pattern" | "wallet" | "transaction" | "case" | "manual";
}

export interface ClosureNoteInput {
  caseId: string;
  walletId: string;
  decision: string;
  selectedEvidence: EvidenceToggleOption[];
  patternNames: string[];
  scenarioLabel: string;
  lossAmount: number;
}

export interface GeneratedClosureNote {
  caseReference: string;
  decision: string;
  evidenceSummary: string;
  patternBasis: string;
  recommendedAction: string;
  auditControlNote: string;
  fullText: string;
}
