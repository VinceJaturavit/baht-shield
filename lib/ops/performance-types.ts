import type { OpsTeamRole } from "./roster-types";

export type OpsHandledCaseOutcome = "Closed" | "Handed off" | "Escalated";

export interface OpsHandledCase {
  id: string;
  analystId: string;
  analystName: string;
  stream: import("./types").OpsStreamCode;
  caseType: string;
  outcome: OpsHandledCaseOutcome;
  handledAt: string;
  wasUrgentOrNearBreach: boolean;
  slaMet: boolean;
}

export type OpsPerformanceStatus = "On track" | "Watch" | "Needs review";

export interface OpsPerformanceRow {
  analystId: string;
  analystName: string;
  role: OpsTeamRole;
  rawHandledCases: number;
  weightedThroughput: number;
  qaQualityScore: number;
  slaComplianceRate: number;
  roleMetricOneLabel: string;
  roleMetricOneValue: number;
  roleMetricTwoLabel: string;
  roleMetricTwoValue: number;
  status: OpsPerformanceStatus;
}
