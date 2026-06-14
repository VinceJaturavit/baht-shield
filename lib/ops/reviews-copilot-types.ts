import type { OpsReviewDisposition } from "./reviews-types";

export interface OpsCopilotScorecard {
  workloadContext: string;
  throughput: string;
  quality: string;
  behaviour: string;
  reliability: string;
}

export interface OpsAnalystFacingSummary {
  whatWentWell: string[];
  whatToImprove: string[];
  workloadReassurance: string;
  suggestedFocusActions: string[];
}

export interface OpsManagerDecisionSummary {
  disposition: OpsReviewDisposition;
  dispositionReason: string;
  strongestEvidence: string[];
  mainRiskOrCoachingPoint: string;
  managerActions: string[];
  confidenceAndCaveats: string[];
  humanInLoopClosingLine: string;
}

export interface OpsCopilotReview {
  analystId: string;
  scorecard: OpsCopilotScorecard;
  analystFacingSummary: OpsAnalystFacingSummary;
  managerDecisionSummary: OpsManagerDecisionSummary;
  generatedBy: "Mock deterministic copilot";
}
