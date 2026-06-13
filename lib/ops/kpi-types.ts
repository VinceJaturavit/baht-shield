import type { OpsStreamCode } from "./types";
import type { OpsTeamRole } from "./roster-types";

export type OpsKpiView = "team" | "individual" | "queueHealth";

export interface OpsStreamWeight {
  stream: OpsStreamCode;
  weight: number;
  rationale: string;
}

export interface OpsTeamKpiSummary {
  totalOpenCases: number;
  totalClosedCases: number;
  weightedThroughput: number;
  slaComplianceRate: number;
  breachRate: number;
  atRiskCount: number;
  overloadedPeopleCount: number;
}

export interface OpsIndividualKpi {
  memberId: string;
  name: string;
  role: OpsTeamRole;
  streamsCovered: OpsStreamCode[];
  rawHandledCases: number;
  weightedThroughput: number;
  slaComplianceRate: number;
  primaryQualityMetricLabel: string;
  primaryQualityMetricValue: number;
  secondaryMetricLabel: string;
  secondaryMetricValue: number;
  status: "On track" | "Watch" | "Needs review";
}

export interface OpsQueueHealthKpi {
  stream: OpsStreamCode;
  openBacklog: number;
  atRiskCount: number;
  breachedCount: number;
  slaComplianceRate: number;
  breachRate: number;
  weightedBacklog: number;
  queueStatus: "Stable" | "Watch" | "Pressure" | "Breached";
}
