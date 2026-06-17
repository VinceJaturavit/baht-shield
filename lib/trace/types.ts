export type TraceMethod = "FIFO" | "LIFO" | "LIBR" | "pro-rata";

export type TraceAttributionStatus =
  | "attributed"
  | "partial"
  | "insufficient-evidence"
  | "rejected"
  | "pending-method";

export type TraceReviewStatus =
  | "draft"
  | "pending-review"
  | "approved"
  | "rejected";

export type TraceConfidence = "High" | "Medium" | "Low";

export type TraceTab =
  | "vendor-evidence"
  | "frozen-pool"
  | "method-comparison"
  | "victim-attribution"
  | "evidence-package"
  | "review-audit";

export interface TraceVendorHop {
  hopIndex: number;
  fromAddress: string;
  toAddress: string;
  serviceOrCluster: string;
  attributionConfidence: TraceConfidence;
  note: string;
}

export interface TraceVendorEvidencePacket {
  vendorName: "Synthetic Vendor Export";
  caseReference: string;
  exportTimestamp: string;
  seedAddress: string;
  chain: string;
  asset: string;
  traceHops: TraceVendorHop[];
  cashOutEndpoint: string;
  vaspHoldingFunds: string;
  notes: string;
  analystImportedBy: string;
}

export interface TracePoolLedgerEntry {
  txId: string;
  time: "t1" | "t2" | "t3" | "t4";
  depositor: string;
  role: "victim" | "scammer" | "outflow";
  direction: "in" | "out";
  amount: number;
  runningBalance: number;
  address: string;
  evidenceStatus: "supported" | "insufficient-evidence";
}

export interface TraceMethodAllocation {
  victimId: string;
  victimNameSynthetic: string;
  role: "victim" | "scammer" | "ambiguous";
  allocatedAmount: number;
}

export interface TraceMethodComparison {
  method: TraceMethod;
  assumption: string;
  allocations: TraceMethodAllocation[];
  weakness: string;
  defensibility: string;
  uncertainty: string;
}

export interface TraceVictimAttributionRow {
  victimId: string;
  victimNameSynthetic: string;
  depositTx: string;
  depositAmount: number;
  methodUsed?: TraceMethod;
  attributedAmount: number;
  confidence: TraceConfidence;
  evidenceCount: number;
  gaps: string[];
  status: TraceAttributionStatus;
}

export interface TraceAuditEvent {
  id: string;
  timestamp: string;
  actor: "AI assist" | "Investigator" | "Senior reviewer";
  action: string;
  detail: string;
}

export interface TraceCase {
  caseId: string;
  title: string;
  asset: string;
  chain: string;
  frozenAmount: number;
  poolTotalBeforeOutflow: number;
  remainingPoolBalance: number;
  vaspHoldingFunds: string;
  status: TraceReviewStatus;
  lastUpdated: string;
  vendorEvidence: TraceVendorEvidencePacket;
  poolLedger: TracePoolLedgerEntry[];
  methodComparisons: TraceMethodComparison[];
  ambiguousClaim: TraceVictimAttributionRow;
}

export interface TraceWorkspaceState {
  activeTab: TraceTab;
  selectedMethod: TraceMethod | null;
  methodRationale: string;
  reviewStatus: TraceReviewStatus;
  reviewerNote: string;
  auditEvents: TraceAuditEvent[];
}
