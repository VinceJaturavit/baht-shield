import { OPS_CASES } from "@/data/ops/ops-cases";
import { OPS_TEAM } from "@/data/ops/ops-team";
import { getRoleFairnessRows } from "./fairness";
import { getPerformanceRows } from "./performance";
import { getQaRows, getSlaPickupBehaviourStatus } from "./qa";
import { getTeamWithLoad } from "./roster";
import type { OpsTeamMember } from "./roster-types";
import type { OpsReviewPack } from "./reviews-types";
import { getWeeklyAssignmentsForMember, isWorkingShift } from "./weekly-schedule";

function buildShiftSummary(member: OpsTeamMember): string {
  return `${member.shift} shift · ${member.attendance}`;
}

function buildCapacitySummary(member: OpsTeamMember): string {
  if (member.role === "Fraud Analyst") {
    const reserve = member.protectedCapacityReserve ?? 0;
    return `Capacity ${member.capacity} · protected reserve ${reserve}`;
  }
  return `Capacity ${member.capacity}`;
}

function buildDistributionNote(loadTag: string, deltaFromAverage: number): string {
  const absDelta = Math.abs(deltaFromAverage).toFixed(1);
  if (loadTag === "Over-loaded") {
    return `Assigned difficulty is ${absDelta} above role average — a rostering distribution note, not a performance penalty.`;
  }
  if (loadTag === "Under-loaded") {
    return `Assigned difficulty is ${absDelta} below role average — distribution context for the manager.`;
  }
  return "Weekly difficulty aligns with role average — distribution within normal range for this role.";
}

export function getReliabilitySummary(analystId: string): OpsReviewPack["reliability"] {
  const assignments = getWeeklyAssignmentsForMember(analystId);
  const member = OPS_TEAM.find((m) => m.id === analystId);

  let assignedDays = 0;
  let leaveDays = 0;
  let offDays = 0;
  let handoffCount = 0;

  for (const a of assignments) {
    if (a.shiftCode === "LEAVE") leaveDays++;
    else if (a.shiftCode === "OFF") offDays++;

    if (isWorkingShift(a.shiftCode) && a.taskTag !== "Off") {
      assignedDays++;
    }
    if (isWorkingShift(a.shiftCode) && a.taskTag === "Handoff") {
      handoffCount++;
    }
  }

  let attendanceSummary = "Present and scheduled as expected";
  if (member?.attendance === "Leave") {
    attendanceSummary = "On leave this week — reliability context only";
  } else if (member?.attendance === "Off") {
    attendanceSummary = "Off shift this week";
  } else if (leaveDays > 0) {
    attendanceSummary = `${leaveDays} planned leave day${leaveDays > 1 ? "s" : ""} in weekly schedule`;
  } else if (handoffCount > 0) {
    attendanceSummary = `Participated in ${handoffCount} handoff${handoffCount > 1 ? "s" : ""} this week`;
  }

  return { assignedDays, leaveDays, offDays, handoffCount, attendanceSummary };
}

function buildReviewPack(analystId: string): OpsReviewPack | undefined {
  const member = OPS_TEAM.find((m) => m.id === analystId);
  if (!member) return undefined;

  const teamWithLoad = getTeamWithLoad(OPS_TEAM, OPS_CASES);
  const fairnessRow = getRoleFairnessRows(teamWithLoad, member.role).find(
    (r) => r.memberId === analystId,
  );
  const perf = getPerformanceRows().find((r) => r.analystId === analystId);
  const qa = getQaRows().find((r) => r.analystId === analystId);

  if (!fairnessRow || !perf || !qa) return undefined;

  const pickupStatus = getSlaPickupBehaviourStatus(analystId);
  const behaviourLowSample = pickupStatus.detail === "low sample";

  return {
    analystId: member.id,
    name: member.name,
    role: member.role,
    streamsCovered: member.streamsCovered,
    shiftSummary: buildShiftSummary(member),
    capacitySummary: buildCapacitySummary(member),
    workload: {
      weightedDifficulty: fairnessRow.weeklyWeightedDifficulty,
      roleAverage: fairnessRow.roleAverage,
      fairnessTag: fairnessRow.loadTag,
      distributionNote: buildDistributionNote(
        fairnessRow.loadTag,
        fairnessRow.deltaFromRoleAverage,
      ),
    },
    performance: {
      rawVolume: perf.rawHandledCases,
      weightedThroughput: perf.weightedThroughput,
      qaQualityScore: perf.qaQualityScore,
      roleMetricOneLabel: perf.roleMetricOneLabel,
      roleMetricOneValue: perf.roleMetricOneValue,
      roleMetricTwoLabel: perf.roleMetricTwoLabel,
      roleMetricTwoValue: perf.roleMetricTwoValue,
      read: perf.status,
    },
    quality: {
      qaScore: qa.qaScore,
      sampleCount: qa.qaSampleCount,
      passCount: qa.qaPassCount,
      failCount: qa.qaFailCount,
      topDefectCategory: qa.topDefectCategory,
      lowSample: qa.qaSampleCount < 5,
    },
    behaviour: {
      urgentPickupShare: qa.urgentPickupShare,
      roleExpectedShare: qa.roleExpectedUrgentPickupShare,
      behaviourRead: qa.slaPickupStatus,
      lowSample: behaviourLowSample,
    },
    reliability: getReliabilitySummary(analystId),
  };
}

export function getReviewPackByAnalystId(analystId: string): OpsReviewPack | undefined {
  return buildReviewPack(analystId);
}

export function getReviewAnalystList(): OpsReviewPack[] {
  return OPS_TEAM.map((m) => buildReviewPack(m.id)).filter(
    (p): p is OpsReviewPack => p !== undefined,
  );
}

export function getReviewHeadline(pack: OpsReviewPack): string {
  const fairnessShort =
    pack.workload.fairnessTag === "At role average"
      ? "At role average"
      : pack.workload.fairnessTag;
  return `Weighted throughput ${pack.performance.weightedThroughput.toFixed(1)} · QA ${pack.quality.qaScore}% · Fairness ${fairnessShort} · Behaviour ${pack.behaviour.behaviourRead}`;
}
