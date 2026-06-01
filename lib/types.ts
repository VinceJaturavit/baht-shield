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

// ---------------------------------------------------------------------------
// Spec-009 — Global Search / Command Bar
// ---------------------------------------------------------------------------

export type SearchResultType =
  | "command"
  | "wallet"
  | "alert"
  | "case"
  | "pattern"
  | "device"
  | "endpoint";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  route: string;
  keywords: string[];
}

// ---------------------------------------------------------------------------
// Spec-008 — Variable Chips + AI Copilot Panel
// ---------------------------------------------------------------------------

export type VariableCategory =
  | "Device/SIM"
  | "Endpoint/Beneficiary"
  | "Behavior/Velocity"
  | "Identity/KYC"
  | "Other";

export interface ParsedPatternVariable {
  raw: string;
  key: string;
  operator?: string;
  value?: string;
  label: string;
  category: VariableCategory;
  rank: number;
}

export interface AICopilotSummary {
  riskSummary: string;
  matchedPatternExplanation: string;
  naiveScoreMissed: string;
  suggestedNextStep: string;
  sourceCaseId?: string;
  sourcePatternId?: string;
}

// ---------------------------------------------------------------------------
// Spec-011 — Alert Queue Decision Hierarchy
// ---------------------------------------------------------------------------

export type AlertScenario =
  | "Onboarding Mule Farm"
  | "Sleeper Mule Activation"
  | "APP Scam Cash-out Ring"
  | "Endpoint Intelligence"
  | "Background";

export type AlertSavedView =
  | "all"
  | "critical_escalated"
  | "scenario_linked";

export interface EnrichedAlertQueueRow {
  alert_id: string;
  rule_name: string;
  severity: string;
  wallet_id: string;
  status: string;

  scenario: AlertScenario;
  linked_pattern_id: string | null;
  linked_pattern_name: string | null;
  linked_wallet_count: number;
  linked_case_count: number;

  linked_case_ids: string[];
  linked_case_loss_exposure: number;

  opened_at_source: "linked_case.opened_at" | null;
  earliest_case_opened_at: string | null;
  alert_age_label: string | null;

  next_action_hint: string;
}

export interface AlertQueueKpis {
  open_alert_count: number;
  escalated_alert_count: number;
  high_severity_count: number;
  total_synthetic_loss_exposure: number;
  scenario_linked_alert_count: number;
}
