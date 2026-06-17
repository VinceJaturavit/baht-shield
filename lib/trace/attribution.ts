import type {
  TraceAttributionStatus,
  TraceCase,
  TraceMethod,
  TraceVictimAttributionRow,
} from "./types";
import { TRACE_VICTIM_IDS } from "./boundary";
import { getMethodComparison } from "./methods";

function deriveStatus(
  depositAmount: number,
  attributedAmount: number,
  explicitStatus?: TraceAttributionStatus,
): TraceAttributionStatus {
  if (explicitStatus === "insufficient-evidence" || explicitStatus === "rejected") {
    return explicitStatus;
  }
  if (attributedAmount === depositAmount) return "attributed";
  if (attributedAmount > 0 && attributedAmount < depositAmount) return "partial";
  if (attributedAmount === 0 && depositAmount > 0) return "partial";
  return "attributed";
}

const POOL_PARTY_META: Record<
  string,
  {
    victimNameSynthetic: string;
    depositTx: string;
    depositAmount: number;
    confidence: "High" | "Medium" | "Low";
    evidenceCount: number;
    gaps: string[];
    role: "victim" | "scammer";
  }
> = {
  [TRACE_VICTIM_IDS.alice]: {
    victimNameSynthetic: "Alice",
    depositTx: "SYNTH-TX-ALICE-T1",
    depositAmount: 10_000,
    confidence: "High",
    evidenceCount: 4,
    gaps: [],
    role: "victim",
  },
  [TRACE_VICTIM_IDS.bob]: {
    victimNameSynthetic: "Bob",
    depositTx: "SYNTH-TX-BOB-T2",
    depositAmount: 10_000,
    confidence: "High",
    evidenceCount: 4,
    gaps: [],
    role: "victim",
  },
  [TRACE_VICTIM_IDS.scammer]: {
    victimNameSynthetic: "Scammer",
    depositTx: "SYNTH-TX-SCAMMER-T3",
    depositAmount: 5_000,
    confidence: "Medium",
    evidenceCount: 2,
    gaps: ["Dirty funds co-mingled with victim deposits"],
    role: "scammer",
  },
};

export function buildAttributionRows(
  traceCase: TraceCase,
  selectedMethod: TraceMethod | null,
  rejectedVictimIds: string[] = [],
): TraceVictimAttributionRow[] {
  const poolRows: TraceVictimAttributionRow[] = Object.entries(
    POOL_PARTY_META,
  ).map(([victimId, meta]) => {
    if (!selectedMethod) {
      return {
        victimId,
        victimNameSynthetic: meta.victimNameSynthetic,
        depositTx: meta.depositTx,
        depositAmount: meta.depositAmount,
        attributedAmount: 0,
        confidence: meta.confidence,
        evidenceCount: meta.evidenceCount,
        gaps: meta.gaps,
        status: "pending-method" as TraceAttributionStatus,
      };
    }

    const comparison = getMethodComparison(traceCase, selectedMethod);
    const allocation =
      comparison?.allocations.find((a) => a.victimId === victimId)
        ?.allocatedAmount ?? 0;

    const status = rejectedVictimIds.includes(victimId)
      ? "rejected"
      : deriveStatus(meta.depositAmount, allocation);

    return {
      victimId,
      victimNameSynthetic: meta.victimNameSynthetic,
      depositTx: meta.depositTx,
      depositAmount: meta.depositAmount,
      methodUsed: selectedMethod,
      attributedAmount: allocation,
      confidence: meta.confidence,
      evidenceCount: meta.evidenceCount,
      gaps: meta.gaps,
      status,
    };
  });

  const ambiguous: TraceVictimAttributionRow = {
    ...traceCase.ambiguousClaim,
    methodUsed: selectedMethod ?? undefined,
    status: "insufficient-evidence",
    attributedAmount: 0,
  };

  return [...poolRows, ambiguous];
}

export function canProceedToReview(
  selectedMethod: TraceMethod | null,
  methodRationale: string,
): boolean {
  return selectedMethod !== null && methodRationale.trim().length > 0;
}
