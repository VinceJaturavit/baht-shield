import type { OpsTeamRole } from "./roster-types";

export type OpsReviewDisposition =
  | "Strong — recognise"
  | "Solid — maintain"
  | "Developing — coach"
  | "Watch — review";

export interface OpsReviewPack {
  analystId: string;
  name: string;
  role: OpsTeamRole;
  streamsCovered: string[];
  shiftSummary: string;
  capacitySummary: string;

  workload: {
    weightedDifficulty: number;
    roleAverage: number;
    fairnessTag: string;
    distributionNote: string;
  };

  performance: {
    rawVolume: number;
    weightedThroughput: number;
    qaQualityScore: number;
    roleMetricOneLabel: string;
    roleMetricOneValue: number;
    roleMetricTwoLabel: string;
    roleMetricTwoValue: number;
    read: "On track" | "Watch" | "Needs review";
  };

  quality: {
    qaScore: number;
    sampleCount: number;
    passCount: number;
    failCount: number;
    topDefectCategory?: string;
    lowSample: boolean;
  };

  behaviour: {
    urgentPickupShare: number;
    roleExpectedShare: number;
    behaviourRead: "Healthy" | "Watch" | "Avoidance risk";
    lowSample: boolean;
  };

  reliability: {
    assignedDays: number;
    leaveDays: number;
    offDays: number;
    handoffCount: number;
    attendanceSummary: string;
  };
}
