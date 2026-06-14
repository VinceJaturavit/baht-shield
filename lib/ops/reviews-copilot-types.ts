import type { OpsReviewDisposition } from "./reviews-types";

export interface OpsCopilotScorecard {
  workloadContext: string;
  throughput: string;
  quality: string;
  behaviour: string;
  reliability: string;
}

export interface OpsCopilotReview {
  analystId: string;
  scorecard: OpsCopilotScorecard;
  disposition: OpsReviewDisposition;
  dispositionReason: string;
  managerActions: string[];
  closingLine: string;
  generatedBy: "Mock deterministic copilot";
}
