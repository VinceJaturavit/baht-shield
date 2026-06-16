export type VerityAgentScenario =
  | "Onboarding Mule Farm"
  | "Sleeper Mule Activation"
  | "APP Scam Cash-out Ring";

export type VerityAgentStage =
  | "intake"
  | "investigate"
  | "decide"
  | "action";

export type VerityHumanDecision =
  | "approved"
  | "denied"
  | "edited";

export interface VerityAgentSeedCase {
  caseId: string;
  alertId?: string;
  entityId?: string;
  scenario: VerityAgentScenario;
}

export interface VerityAgentAuditEvent {
  id: string;
  timestamp: string;
  stage: VerityAgentStage;
  inputSummary: string;
  agentOutputSummary: string;
  humanDecision?: VerityHumanDecision;
  humanEdited?: boolean;
  notes?: string;
}

export interface VerityEvidenceItem {
  id: string;
  label: string;
  category:
    | "account_history"
    | "transaction_graph"
    | "device_ip_funding"
    | "onchain_exposure"
    | "prior_flags"
    | "pattern_match";
  finding: string;
  sourceRef: string;
  confidence: "Low" | "Medium" | "High";
}

export interface VerityEvidenceStep {
  id: string;
  label: string;
  status: "completed";
  output: string;
  evidenceRefs: string[];
}

export type VerityRiskBand = "Critical" | "High" | "Medium" | "Low";

export interface VerityRiskContribution {
  evidenceId: string;
  label: string;
  category: VerityEvidenceItem["category"];
  confidence: VerityEvidenceItem["confidence"];
  categoryWeight: number;
  confidenceMultiplier: number;
  contribution: number;
  rationale: string;
}

export interface VerityRiskScore {
  score: number;
  band: VerityRiskBand;
  contributions: VerityRiskContribution[];
  ruleSummary: string;
}

export type VerityChainType = "ETH" | "BTC" | "TRON" | "Polygon";

export type VerityTraceAsset =
  | "USDT-ETH"
  | "USDT-TRON"
  | "BTC"
  | "USDC-Polygon";

export type VerityTraceHopType =
  | "transfer"
  | "peel"
  | "bridge"
  | "mixer"
  | "consolidation"
  | "cash-out";

export type VerityTraceAttributionType =
  | "synthetic_exchange_vasp"
  | "synthetic_mixer"
  | "synthetic_bridge"
  | "unknown_cluster"
  | "self_custody_cluster";

export type VerityTracingMethod =
  | "FIFO"
  | "LIFO"
  | "LIBR"
  | "pro-rata"
  | "not_applicable";

export type VerityLedgerModel = "account_based" | "utxo";

export interface VerityOnChainTraceHop {
  index: number;
  fromAddress: string;
  toAddress: string;
  chain: VerityChainType;
  asset: VerityTraceAsset;
  amount: number;
  hopType: VerityTraceHopType;
  attributionType: VerityTraceAttributionType;
  attributionLabel: string;
  isCoMingled: boolean;
  tracingMethod: VerityTracingMethod;
  methodNote?: string;
  ledgerModel: VerityLedgerModel;
  note: string;
}

export interface VerityCashOutEndpoint {
  hopIndex: number;
  vaspLabel: string;
  address: string;
  asset: VerityTraceAsset;
  chain: VerityChainType;
  amount: number;
  whyActionable: string;
  recoveryPointLabel: string;
}

export interface VerityOnChainTrace {
  id: string;
  caseId: string;
  scenario: VerityAgentScenario;
  traceDirection: "forward";
  traceLabel: string;
  summary: string;
  ledgerAwarenessNote: string;
  hops: VerityOnChainTraceHop[];
  cashOutEndpoint: VerityCashOutEndpoint;
  methodologyNotes: string[];
  syntheticBoundary: string;
}

export interface VerityEvidencePack {
  caseId: string;
  atomicSteps: VerityEvidenceStep[];
  evidenceItems: VerityEvidenceItem[];
  summary: string;
  riskScore: VerityRiskScore;
  onChainTrace?: VerityOnChainTrace;
}

export interface VerityIntakeOutput {
  caseId: string;
  caseSummary: string;
  scenario: VerityAgentScenario;
  trigger: string;
  initialRiskSignals: string[];
  proposedScope: string[];
  scopeRationale: string;
  stageLimitations: string;
}

export interface VerityDecisionDraft {
  caseId: string;
  recommendation:
    | "Confirm fraud"
    | "Clear"
    | "Escalate"
    | "Hold for senior review";
  confidence: "Low" | "Medium" | "High";
  reasoningChain: string[];
  comparableSeedCases: Array<{
    caseId: string;
    scenario: VerityAgentScenario;
    similarityReason: string;
  }>;
  evidenceCitations: Array<{
    evidenceId: string;
    citationLabel: string;
  }>;
  decisionSupportStatement: string;
}

export type VerityActionEligibility =
  | "Agent-eligible with human approval"
  | "Human-required";

export interface VerityActionProposal {
  id: string;
  label: string;
  description: string;
  reversibility: "Reversible" | "Material / irreversible";
  eligibility: VerityActionEligibility;
  rationale: string;
}

export interface VerityPatternWriteBackProposal {
  patternName: string;
  scenario: VerityAgentScenario;
  evidenceIndicators: string[];
  confidence: "Low" | "Medium" | "High";
  requiresHumanApproval: true;
}

export interface VerityActionPlan {
  caseId: string;
  actions: VerityActionProposal[];
  patternWriteBack: VerityPatternWriteBackProposal;
}

export type StageGateStatus = "locked" | "active" | "approved" | "denied";

export interface StageGateState {
  stage: VerityAgentStage;
  status: StageGateStatus;
  humanDecision?: VerityHumanDecision;
  humanEdited?: boolean;
}

export const AGENT_STAGES: Array<{ id: VerityAgentStage; label: string }> = [
  { id: "intake", label: "Intake & scoping" },
  { id: "investigate", label: "Investigate" },
  { id: "decide", label: "Decide" },
  { id: "action", label: "Action" },
];
