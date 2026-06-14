import { OPS_WEEKLY_ASSIGNMENTS } from "@/data/ops/ops-weekly-schedule";
import { getStreamComplexityWeight } from "./kpi";
import { partitionTeamByRole } from "./roster";
import type { OpsTeamMemberWithLoad, OpsTeamRole } from "./roster-types";
import type {
  OpsAnalystFairnessRow,
  OpsFairnessLoadTag,
  OpsFairnessResult,
  OpsFairnessStatus,
  OpsRoleFairnessSummary,
} from "./fairness-types";
import { getWeeklyAssignmentsForMember, isWorkingShift } from "./weekly-schedule";
import type { OpsWeeklyTaskTag } from "./weekly-schedule-types";
import type { OpsStreamCode } from "./types";

/** Load tag threshold: ±20% from role average. */
const LOAD_DEVIATION_THRESHOLD = 0.2;

/** Team imbalance: max exceeds 1.4× role average or min below 0.6× role average. */
const SPREAD_MAX_RATIO = 1.4;
const SPREAD_MIN_RATIO = 0.6;

const STREAM_TAGS: OpsStreamCode[] = ["RFR", "LAR", "PRO", "DSP", "PRF"];

function isStreamTag(tag: OpsWeeklyTaskTag): tag is OpsStreamCode {
  return (STREAM_TAGS as string[]).includes(tag);
}

export function getTaskDifficultyWeight(taskTag: OpsWeeklyTaskTag): number {
  if (isStreamTag(taskTag)) {
    return getStreamComplexityWeight(taskTag);
  }
  switch (taskTag) {
    case "Urgent":
      return 2.5;
    case "QA":
      return 2.25;
    case "Handoff":
      return 1.5;
    case "Off":
      return 0;
    default:
      return 0;
  }
}

function roundDifficulty(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getWeeklyWeightedDifficultyByMember(memberId: string): number {
  const assignments = getWeeklyAssignmentsForMember(memberId);
  const total = assignments.reduce((sum, a) => {
    if (!isWorkingShift(a.shiftCode)) return sum;
    return sum + getTaskDifficultyWeight(a.taskTag);
  }, 0);
  return roundDifficulty(total);
}

function countAssignedDays(memberId: string): number {
  const assignments = getWeeklyAssignmentsForMember(memberId);
  return assignments.filter(
    (a) => isWorkingShift(a.shiftCode) && getTaskDifficultyWeight(a.taskTag) > 0,
  ).length;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return roundDifficulty((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return roundDifficulty(sorted[mid]);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return roundDifficulty(values.reduce((sum, v) => sum + v, 0) / values.length);
}

export function getLoadTag(
  weeklyWeightedDifficulty: number,
  roleAverage: number,
): OpsFairnessLoadTag {
  if (roleAverage === 0) return "At role average";
  const ratio = weeklyWeightedDifficulty / roleAverage;
  if (ratio > 1 + LOAD_DEVIATION_THRESHOLD) return "Over-loaded";
  if (ratio < 1 - LOAD_DEVIATION_THRESHOLD) return "Under-loaded";
  return "At role average";
}

export function getRoleFairnessRows(
  teamWithLoad: OpsTeamMemberWithLoad[],
  role: OpsTeamRole,
): OpsAnalystFairnessRow[] {
  const members = teamWithLoad.filter((m) => m.role === role);
  const difficulties = members.map((m) => getWeeklyWeightedDifficultyByMember(m.id));
  const roleAverage = average(difficulties);
  const roleMedian = median(difficulties);

  return members.map((member) => {
    const weeklyWeightedDifficulty = getWeeklyWeightedDifficultyByMember(member.id);
    return {
      memberId: member.id,
      name: member.name,
      role: member.role,
      weeklyWeightedDifficulty,
      roleAverage,
      roleMedian,
      deltaFromRoleAverage: roundDifficulty(weeklyWeightedDifficulty - roleAverage),
      loadTag: getLoadTag(weeklyWeightedDifficulty, roleAverage),
      assignedDays: countAssignedDays(member.id),
    };
  });
}

export function getRoleFairnessSummary(
  rows: OpsAnalystFairnessRow[],
  role: OpsTeamRole,
): OpsRoleFairnessSummary {
  const values = rows.map((r) => r.weeklyWeightedDifficulty);
  const roleAverage = average(values);
  const roleMedian = median(values);
  const minWeightedDifficulty = values.length > 0 ? Math.min(...values) : 0;
  const maxWeightedDifficulty = values.length > 0 ? Math.max(...values) : 0;
  const spread = roundDifficulty(maxWeightedDifficulty - minWeightedDifficulty);

  const overLoadedCount = rows.filter((r) => r.loadTag === "Over-loaded").length;

  let status: OpsFairnessStatus = "Balanced";
  let imbalancedReason: string | undefined;

  if (roleAverage > 0 && maxWeightedDifficulty > SPREAD_MAX_RATIO * roleAverage) {
    status = "Imbalanced";
    imbalancedReason = "Highest weekly difficulty exceeds 1.4× role average";
  } else if (roleAverage > 0 && minWeightedDifficulty < SPREAD_MIN_RATIO * roleAverage) {
    status = "Imbalanced";
    imbalancedReason = "Lowest weekly difficulty falls below 0.6× role average";
  } else if (overLoadedCount > 1) {
    status = "Imbalanced";
    imbalancedReason = "More than one analyst is over-loaded for this role";
  }

  return {
    role,
    averageWeightedDifficulty: roleAverage,
    medianWeightedDifficulty: roleMedian,
    minWeightedDifficulty: roundDifficulty(minWeightedDifficulty),
    maxWeightedDifficulty: roundDifficulty(maxWeightedDifficulty),
    spread,
    status,
    imbalancedReason,
  };
}

export function getFairnessResult(teamWithLoad: OpsTeamMemberWithLoad[]): OpsFairnessResult {
  const { fraudAnalysts: fraudMembers, juniorAnalysts: juniorMembers } =
    partitionTeamByRole(teamWithLoad);

  const fraudAnalysts = getRoleFairnessRows(fraudMembers, "Fraud Analyst");
  const juniorAnalysts = getRoleFairnessRows(juniorMembers, "Junior Analyst");

  return {
    fraudAnalysts,
    juniorAnalysts,
    roleSummaries: [
      getRoleFairnessSummary(fraudAnalysts, "Fraud Analyst"),
      getRoleFairnessSummary(juniorAnalysts, "Junior Analyst"),
    ],
  };
}

/** Exposed for tests — confirms fairness derives from weekly schedule only. */
export function getFairnessDataSource(): typeof OPS_WEEKLY_ASSIGNMENTS {
  return OPS_WEEKLY_ASSIGNMENTS;
}
