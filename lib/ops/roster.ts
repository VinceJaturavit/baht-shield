import type { OpsCase } from "./types";
import type {
  OpsLoadStatus,
  OpsTeamMember,
  OpsTeamMemberWithLoad,
  OpsTeamRole,
} from "./roster-types";

const CLOSED_STATUS = "Closed";

export function hasDecisionAuthority(member: OpsTeamMember): boolean {
  if (member.decisionAuthority !== undefined) {
    return member.decisionAuthority;
  }
  return member.role === "Fraud Analyst";
}

export function getOpenOpsCases(cases: OpsCase[]): OpsCase[] {
  return cases.filter((c) => c.status !== CLOSED_STATUS);
}

export function getCurrentLoadByOwner(cases: OpsCase[]): Record<string, number> {
  const load: Record<string, number> = {};
  for (const c of getOpenOpsCases(cases)) {
    load[c.owner] = (load[c.owner] ?? 0) + 1;
  }
  return load;
}

export function getAssignmentCapacity(member: OpsTeamMember): number {
  if (member.role === "Fraud Analyst") {
    return member.capacity - (member.protectedCapacityReserve ?? 0);
  }
  return member.capacity;
}

export function isMemberOverloaded(member: OpsTeamMember, currentLoad: number): boolean {
  return currentLoad > getAssignmentCapacity(member);
}

export function getLoadStatus(
  member: OpsTeamMember,
  currentLoad: number,
): OpsLoadStatus {
  if (member.attendance === "Off" || member.attendance === "Leave") {
    return "Off shift";
  }

  const assignmentCapacity = getAssignmentCapacity(member);
  if (currentLoad > assignmentCapacity) {
    return "Overloaded";
  }

  const ratio = assignmentCapacity > 0 ? currentLoad / assignmentCapacity : 0;
  if (ratio >= 0.85) {
    return "Near capacity";
  }

  return "On track";
}

export function getTeamWithLoad(
  team: OpsTeamMember[],
  cases: OpsCase[],
): OpsTeamMemberWithLoad[] {
  const loadByOwner = getCurrentLoadByOwner(cases);

  return team.map((member) => {
    const currentLoad = loadByOwner[member.name] ?? 0;
    const assignmentCapacity = getAssignmentCapacity(member);

    return {
      ...member,
      currentLoad,
      assignmentCapacity,
      isOverloaded: isMemberOverloaded(member, currentLoad),
      openCaseCount: currentLoad,
    };
  });
}

export function partitionTeamByRole(team: OpsTeamMemberWithLoad[]) {
  return {
    fraudAnalysts: team.filter((m) => m.role === "Fraud Analyst"),
    juniorAnalysts: team.filter((m) => m.role === "Junior Analyst"),
  };
}

export function isFraudAnalystRole(role: OpsTeamRole): boolean {
  return role === "Fraud Analyst";
}
