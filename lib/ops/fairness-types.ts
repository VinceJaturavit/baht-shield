import type { OpsTeamRole } from "./roster-types";

export type OpsFairnessStatus = "Balanced" | "Imbalanced";

export type OpsFairnessLoadTag = "Under-loaded" | "At role average" | "Over-loaded";

export interface OpsAnalystFairnessRow {
  memberId: string;
  name: string;
  role: OpsTeamRole;
  weeklyWeightedDifficulty: number;
  roleAverage: number;
  roleMedian: number;
  deltaFromRoleAverage: number;
  loadTag: OpsFairnessLoadTag;
  assignedDays: number;
}

export interface OpsRoleFairnessSummary {
  role: OpsTeamRole;
  averageWeightedDifficulty: number;
  medianWeightedDifficulty: number;
  minWeightedDifficulty: number;
  maxWeightedDifficulty: number;
  spread: number;
  status: OpsFairnessStatus;
  imbalancedReason?: string;
}

export interface OpsFairnessResult {
  fraudAnalysts: OpsAnalystFairnessRow[];
  juniorAnalysts: OpsAnalystFairnessRow[];
  roleSummaries: OpsRoleFairnessSummary[];
}
