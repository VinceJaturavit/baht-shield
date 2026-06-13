import type { OpsStreamCode } from "./types";

export type OpsTeamRole = "Fraud Analyst" | "Junior Analyst";

export type OpsAttendanceStatus = "Present" | "Off" | "Leave";

export type OpsShiftName = "Day" | "Evening" | "Night / On-call";

export interface OpsTeamMember {
  id: string;
  name: string;
  role: OpsTeamRole;
  streamsCovered: OpsStreamCode[];
  capacity: number;
  protectedCapacityReserve?: number;
  shift: OpsShiftName;
  attendance: OpsAttendanceStatus;
  decisionAuthority?: boolean;
}

export interface OpsTeamMemberWithLoad extends OpsTeamMember {
  currentLoad: number;
  assignmentCapacity: number;
  isOverloaded: boolean;
  openCaseCount: number;
}

export type OpsQueueOwnershipCode = "Urgent" | OpsStreamCode;

export interface OpsQueueOwnership {
  queueCode: OpsQueueOwnershipCode;
  queueLabel: string;
  ownerOfDay: string;
  backup: string;
  nextOwner: string;
  rotationNote: string;
  ownershipRule: string;
}

export type OpsLoadStatus = "On track" | "Near capacity" | "Overloaded" | "Off shift";
