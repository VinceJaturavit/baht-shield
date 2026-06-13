import type { OpsStreamCode } from "./types";

export type OpsTeamRole = "Officer" | "Contractor";

export type OpsAttendanceStatus = "Present" | "Off" | "Leave";

export interface OpsTeamMember {
  id: string;
  name: string;
  role: OpsTeamRole;
  streamsCovered: OpsStreamCode[];
  capacity: number;
  protectedCapacityReserve?: number;
  shift: string;
  attendance: OpsAttendanceStatus;
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
