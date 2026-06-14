import type { OpsStreamCode } from "./types";
import type { OpsTeamMemberWithLoad } from "./roster-types";

export type OpsWeekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export const OPS_WEEKDAYS: OpsWeekday[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export type OpsShiftCode = "D" | "E" | "N" | "OFF" | "LEAVE";

export type OpsShiftFullName =
  | "Day"
  | "Evening"
  | "Night / On-call"
  | "Off"
  | "Leave";

export type OpsWeeklyTaskTag = OpsStreamCode | "Urgent" | "QA" | "Handoff" | "Off";

export interface OpsWeeklyAssignment {
  memberId: string;
  day: OpsWeekday;
  shiftCode: OpsShiftCode;
  shiftName: OpsShiftFullName;
  taskTag: OpsWeeklyTaskTag;
  taskLabel: string;
  isOwnerOfDay?: boolean;
  isBackup?: boolean;
  note?: string;
}

export interface OpsWeeklyCoverageDay {
  day: OpsWeekday;
  fraudAnalystCount: number;
  juniorAnalystCount: number;
  hasDecisionAuthority: boolean;
  hasIntakeCoverage: boolean;
  status: "Covered" | "Gap";
  gapReason?: string;
  handoffCount: number;
}

export interface OpsWeeklyGridRow {
  member: OpsTeamMemberWithLoad;
  assignmentsByDay: Record<OpsWeekday, OpsWeeklyAssignment>;
}

export type OpsQueueOwnershipStatus =
  | "Owner"
  | "Backup"
  | "Supporting"
  | "Not queue owner"
  | "Handoff support";
