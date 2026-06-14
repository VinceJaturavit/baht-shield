import { OPS_QUEUE_OWNERSHIP } from "@/data/ops/ops-queue-ownership";
import { OPS_WEEKLY_ASSIGNMENTS } from "@/data/ops/ops-weekly-schedule";
import { hasDecisionAuthority } from "./roster";
import type { OpsTeamMemberWithLoad } from "./roster-types";
import type {
  OpsQueueOwnershipStatus,
  OpsShiftCode,
  OpsWeekday,
  OpsWeeklyAssignment,
  OpsWeeklyCoverageDay,
  OpsWeeklyGridRow,
  OpsWeeklyTaskTag,
} from "./weekly-schedule-types";
import { OPS_WEEKDAYS } from "./weekly-schedule-types";

const NON_WORKING_SHIFT_CODES: OpsShiftCode[] = ["OFF", "LEAVE"];

export function isWorkingShift(shiftCode: OpsShiftCode): boolean {
  return !NON_WORKING_SHIFT_CODES.includes(shiftCode);
}

export function getWeeklyAssignmentsForMember(memberId: string): OpsWeeklyAssignment[] {
  return OPS_WEEKLY_ASSIGNMENTS.filter((a) => a.memberId === memberId);
}

export function getAssignmentForCell(
  memberId: string,
  day: OpsWeekday,
): OpsWeeklyAssignment | undefined {
  return OPS_WEEKLY_ASSIGNMENTS.find((a) => a.memberId === memberId && a.day === day);
}

export function getShiftCodeLabel(code: OpsShiftCode): string {
  const labels: Record<OpsShiftCode, string> = {
    D: "Day",
    E: "Evening",
    N: "Night / On-call",
    OFF: "Off",
    LEAVE: "Leave",
  };
  return labels[code];
}

export function getTaskTagLabel(tag: OpsWeeklyTaskTag): string {
  const labels: Record<OpsWeeklyTaskTag, string> = {
    RFR: "Regulatory Fraud Reporting",
    LAR: "Legal & Authority Requests",
    PRO: "Proactive Alerts",
    DSP: "Dispute & Complaint",
    PRF: "Profile Review",
    Urgent: "Cross-stream urgent overlay",
    QA: "Quality / escalation review",
    Handoff: "Shift-boundary handoff work",
    Off: "Not assigned",
  };
  return labels[tag];
}

export function formatCellDisplay(assignment: OpsWeeklyAssignment): string {
  if (!isWorkingShift(assignment.shiftCode)) {
    return assignment.shiftCode;
  }
  return `${assignment.shiftCode} · ${assignment.taskTag}`;
}

export function getWeeklyGridRows(teamWithLoad: OpsTeamMemberWithLoad[]): OpsWeeklyGridRow[] {
  return teamWithLoad.map((member) => {
    const memberAssignments = getWeeklyAssignmentsForMember(member.id);
    const assignmentsByDay = {} as Record<OpsWeekday, OpsWeeklyAssignment>;

    for (const day of OPS_WEEKDAYS) {
      const assignment = memberAssignments.find((a) => a.day === day);
      if (assignment) {
        assignmentsByDay[day] = assignment;
      }
    }

    return { member, assignmentsByDay };
  });
}

function isDecisionAuthorityPresent(
  assignments: OpsWeeklyAssignment[],
  teamWithLoad: OpsTeamMemberWithLoad[],
): boolean {
  const teamById = new Map(teamWithLoad.map((m) => [m.id, m]));

  return assignments.some((a) => {
    if (!isWorkingShift(a.shiftCode)) return false;
    if (a.taskTag === "Off") return false;

    const member = teamById.get(a.memberId);
    if (!member) return false;
    if (member.role !== "Fraud Analyst") return false;
    if (member.attendance !== "Present") return false;

    return hasDecisionAuthority(member);
  });
}

function isIntakeCovered(
  assignments: OpsWeeklyAssignment[],
  teamWithLoad: OpsTeamMemberWithLoad[],
): boolean {
  const teamById = new Map(teamWithLoad.map((m) => [m.id, m]));

  return assignments.some((a) => {
    if (!isWorkingShift(a.shiftCode)) return false;
    const member = teamById.get(a.memberId);
    if (!member) return false;
    if (member.role !== "Junior Analyst") return false;
    if (member.attendance !== "Present") return false;
    return a.taskTag !== "Off";
  });
}

function countWorkingByRole(
  assignments: OpsWeeklyAssignment[],
  teamWithLoad: OpsTeamMemberWithLoad[],
  role: "Fraud Analyst" | "Junior Analyst",
): number {
  const teamById = new Map(teamWithLoad.map((m) => [m.id, m]));

  return assignments.filter((a) => {
    if (!isWorkingShift(a.shiftCode)) return false;
    const member = teamById.get(a.memberId);
    return member?.role === role && member.attendance === "Present";
  }).length;
}

function getHandoffCountForDay(assignments: OpsWeeklyAssignment[]): number {
  return assignments.filter((a) => a.taskTag === "Handoff" && isWorkingShift(a.shiftCode)).length;
}

export function getWeeklyCoverageByDay(
  teamWithLoad: OpsTeamMemberWithLoad[],
  assignments: OpsWeeklyAssignment[] = OPS_WEEKLY_ASSIGNMENTS,
): OpsWeeklyCoverageDay[] {
  return OPS_WEEKDAYS.map((day) => {
    const dayAssignments = assignments.filter((a) => a.day === day);
    const fraudAnalystCount = countWorkingByRole(dayAssignments, teamWithLoad, "Fraud Analyst");
    const juniorAnalystCount = countWorkingByRole(dayAssignments, teamWithLoad, "Junior Analyst");
    const hasDecisionAuthority = isDecisionAuthorityPresent(dayAssignments, teamWithLoad);
    const hasIntakeCoverage = isIntakeCovered(dayAssignments, teamWithLoad);
    const handoffCount = getHandoffCountForDay(dayAssignments);

    let status: "Covered" | "Gap" = "Covered";
    let gapReason: string | undefined;

    if (!hasDecisionAuthority) {
      status = "Gap";
      gapReason = "No decision authority";
    } else if (!hasIntakeCoverage) {
      status = "Gap";
      gapReason = "Intake coverage gap";
    }

    return {
      day,
      fraudAnalystCount,
      juniorAnalystCount,
      hasDecisionAuthority,
      hasIntakeCoverage,
      status,
      gapReason,
      handoffCount,
    };
  });
}

export function getQueueOwnershipStatus(
  personName: string,
  taskTag: OpsWeeklyTaskTag,
): OpsQueueOwnershipStatus {
  if (taskTag === "Handoff") return "Handoff support";
  if (taskTag === "QA" || taskTag === "Off") return "Not queue owner";

  const queueRow = OPS_QUEUE_OWNERSHIP.find((q) => q.queueCode === taskTag);
  if (!queueRow) return "Supporting";

  if (queueRow.ownerOfDay === personName) return "Owner";
  if (queueRow.backup === personName) return "Backup";
  return "Supporting";
}
