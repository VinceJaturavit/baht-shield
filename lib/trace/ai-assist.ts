import type { TraceCase } from "./types";

export interface TraceAiAssistOutput {
  methodDifferenceSummary: string;
  gapFlags: string[];
  rationaleStarter: string;
  reviewerQuestions: string[];
}

export function generateDeterministicAiAssist(traceCase: TraceCase): TraceAiAssistOutput {
  return {
    methodDifferenceSummary:
      "AI assist: LIFO attributes the full dirty 5,000 to the seized outflow, while FIFO attributes none of it. This is the core dispute. A reviewer should focus on whether the case theory follows chronology, rapid layering, lowest intermediate balance, or proportional allocation.",
    gapFlags: [
      "Ambiguous Claimant (CLAIM-AMB-001) has insufficient evidence and is excluded from pool method allocation.",
      "Scammer deposit is supported in the ledger but attribution outcome varies sharply by method.",
      "Vendor export is synthetic read-only input — Ourox Trace does not perform the trace.",
    ],
    rationaleStarter:
      "Based on the co-mingled pool timeline and supported deposits, I selected [METHOD] because [chronology / layering / balance constraint / proportional mix]. The main trade-off is [victim outcome difference vs alternative method].",
    reviewerQuestions: [
      "Does the case theory align with the chosen method assumption?",
      "Are all pool contributors correctly scoped for this method?",
      "Is the ambiguous claim clearly excluded with documented gaps?",
      "Would a challenger prefer FIFO chronology or LIFO layering for this outflow?",
    ],
  };
}

export function getAiAssistFullSummary(output: TraceAiAssistOutput): string {
  return output.methodDifferenceSummary;
}
