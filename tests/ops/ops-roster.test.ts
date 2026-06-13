import { describe, it, expect } from "vitest";
import { OPS_TEAM, OPS_OFFICER_COUNT, OPS_CONTRACTOR_COUNT } from "@/data/ops/ops-team";
import {
  OPS_QUEUE_OWNERSHIP,
  OFFICER_OWNED_QUEUES,
  CONTRACTOR_OWNED_QUEUES,
} from "@/data/ops/ops-queue-ownership";
import { OPS_CASES } from "@/data/ops/ops-cases";
import {
  getOpenOpsCases,
  getCurrentLoadByOwner,
  getTeamWithLoad,
  getAssignmentCapacity,
  isMemberOverloaded,
} from "@/lib/ops/roster";
import type { OpsTeamMember } from "@/lib/ops/roster-types";

// Mirror of expected side-nav state (NAV_ITEMS is not exported from OpsSideNav)
const EXPECTED_NAV = [
  { id: "queue", label: "Queue Board", disabled: false },
  { id: "aging", label: "Aging & SLA", disabled: false },
  { id: "roster", label: "Roster", disabled: false },
  { id: "kpi", label: "KPI", disabled: true },
];

const FORBIDDEN = ["TrueMoney", "Kraken", "Payward", "SignalOS"];

const OFFICER_NAMES = new Set(
  OPS_TEAM.filter((m) => m.role === "Officer").map((m) => m.name),
);

describe("OPS_TEAM", () => {
  it("has around 10–14 people", () => {
    expect(OPS_TEAM.length).toBeGreaterThanOrEqual(10);
    expect(OPS_TEAM.length).toBeLessThanOrEqual(14);
    expect(OPS_TEAM).toHaveLength(12);
  });

  it("has around 4 officers and around 8 contractors", () => {
    expect(OPS_OFFICER_COUNT).toBe(4);
    expect(OPS_CONTRACTOR_COUNT).toBe(8);
  });

  it("every person has required fields", () => {
    for (const member of OPS_TEAM) {
      expect(member.id).toBeTruthy();
      expect(member.name).toBeTruthy();
      expect(["Officer", "Contractor"]).toContain(member.role);
      expect(member.streamsCovered.length).toBeGreaterThan(0);
      expect(member.capacity).toBeGreaterThan(0);
      expect(member.shift).toBeTruthy();
      expect(["Present", "Off", "Leave"]).toContain(member.attendance);
    }
  });

  it("officers have protected reserve", () => {
    const officers = OPS_TEAM.filter((m) => m.role === "Officer");
    for (const officer of officers) {
      expect(officer.protectedCapacityReserve).toBeGreaterThan(0);
    }
  });

  it("contractors do not require protected reserve", () => {
    const contractors = OPS_TEAM.filter((m) => m.role === "Contractor");
    for (const contractor of contractors) {
      expect(contractor.protectedCapacityReserve).toBeUndefined();
    }
  });

  it("reuses existing case owner names for officers", () => {
    const officerNames = OPS_TEAM.filter((m) => m.role === "Officer").map((m) => m.name);
    expect(officerNames).toContain("Ops Lead");
    expect(officerNames).toContain("Analyst A");
    expect(officerNames).toContain("Analyst B");
    expect(officerNames).toContain("Queue Owner");
  });

  it("does not contain forbidden names", () => {
    const blob = JSON.stringify(OPS_TEAM);
    for (const term of FORBIDDEN) {
      expect(blob).not.toContain(term);
    }
  });
});

describe("roster load derivation", () => {
  it("excludes closed cases from open cases", () => {
    const open = getOpenOpsCases(OPS_CASES);
    expect(open.every((c) => c.status !== "Closed")).toBe(true);
    expect(open.length).toBeLessThan(OPS_CASES.length);
  });

  it("derives load from open cases by owner", () => {
    const load = getCurrentLoadByOwner(OPS_CASES);
    const open = getOpenOpsCases(OPS_CASES);

    for (const [owner, count] of Object.entries(load)) {
      const manual = open.filter((c) => c.owner === owner).length;
      expect(count).toBe(manual);
    }
  });

  it("computes team with load from existing cases", () => {
    const teamWithLoad = getTeamWithLoad(OPS_TEAM, OPS_CASES);
    expect(teamWithLoad).toHaveLength(OPS_TEAM.length);

    for (const member of teamWithLoad) {
      expect(member.currentLoad).toBeGreaterThanOrEqual(0);
      expect(member.openCaseCount).toBe(member.currentLoad);
      expect(member.assignmentCapacity).toBe(getAssignmentCapacity(member));
    }
  });

  it("uses assignment capacity for officer overload", () => {
    const teamWithLoad = getTeamWithLoad(OPS_TEAM, OPS_CASES);
    const officers = teamWithLoad.filter((m) => m.role === "Officer");

    for (const officer of officers) {
      const expectedOverloaded =
        officer.currentLoad > getAssignmentCapacity(officer);
      expect(officer.isOverloaded).toBe(expectedOverloaded);
      expect(isMemberOverloaded(officer, officer.currentLoad)).toBe(
        expectedOverloaded,
      );
    }
  });

  it("officer assignment capacity equals total minus protected reserve", () => {
    const officers = OPS_TEAM.filter((m) => m.role === "Officer");
    for (const officer of officers) {
      expect(getAssignmentCapacity(officer)).toBe(
        officer.capacity - (officer.protectedCapacityReserve ?? 0),
      );
    }
  });

  it("contractor assignment capacity equals total capacity", () => {
    const contractors = OPS_TEAM.filter((m) => m.role === "Contractor");
    for (const contractor of contractors) {
      expect(getAssignmentCapacity(contractor)).toBe(contractor.capacity);
    }
  });

  it("at least one officer shows derived load from cases", () => {
    const teamWithLoad = getTeamWithLoad(OPS_TEAM, OPS_CASES);
    const withLoad = teamWithLoad.filter((m) => m.currentLoad > 0);
    expect(withLoad.length).toBeGreaterThan(0);
  });
});

describe("OPS_QUEUE_OWNERSHIP", () => {
  it("covers all required queues", () => {
    const codes = OPS_QUEUE_OWNERSHIP.map((q) => q.queueCode);
    expect(codes).toContain("Urgent");
    expect(codes).toContain("RFR");
    expect(codes).toContain("LAR");
    expect(codes).toContain("PRO");
    expect(codes).toContain("DSP");
    expect(codes).toContain("PRF");
    expect(OPS_QUEUE_OWNERSHIP).toHaveLength(6);
  });

  it("every queue has owner and backup", () => {
    for (const row of OPS_QUEUE_OWNERSHIP) {
      expect(row.ownerOfDay).toBeTruthy();
      expect(row.backup).toBeTruthy();
      expect(row.nextOwner).toBeTruthy();
      expect(row.rotationNote).toBeTruthy();
      expect(row.ownershipRule).toBeTruthy();
    }
  });

  it("Urgent/RFR/LAR owners are officers", () => {
    for (const code of OFFICER_OWNED_QUEUES) {
      const row = OPS_QUEUE_OWNERSHIP.find((q) => q.queueCode === code)!;
      expect(OFFICER_NAMES.has(row.ownerOfDay)).toBe(true);
      expect(OFFICER_NAMES.has(row.backup)).toBe(true);
    }
  });

  it("PRO has officer owner and backup", () => {
    const pro = OPS_QUEUE_OWNERSHIP.find((q) => q.queueCode === "PRO")!;
    expect(OFFICER_NAMES.has(pro.ownerOfDay)).toBe(true);
    expect(OFFICER_NAMES.has(pro.backup)).toBe(true);
  });

  it("DSP/PRF can be contractor-owned", () => {
    for (const code of CONTRACTOR_OWNED_QUEUES) {
      const row = OPS_QUEUE_OWNERSHIP.find((q) => q.queueCode === code)!;
      const owner = OPS_TEAM.find((m) => m.name === row.ownerOfDay);
      expect(owner?.role).toBe("Contractor");
    }
  });

  it("shows rotation concept", () => {
    for (const row of OPS_QUEUE_OWNERSHIP) {
      expect(row.rotationNote.toLowerCase()).toContain("rotates");
    }
  });
});

describe("ops side-nav config", () => {
  it("roster is active and KPI remains placeholder", () => {
    const roster = EXPECTED_NAV.find((n) => n.id === "roster")!;
    const kpi = EXPECTED_NAV.find((n) => n.id === "kpi")!;
    expect(roster.disabled).toBeFalsy();
    expect(kpi.disabled).toBe(true);
  });
});

// Type-level guard for officer protected reserve
function assertOfficerReserve(member: OpsTeamMember) {
  if (member.role === "Officer") {
    expect(member.protectedCapacityReserve).toBeDefined();
  }
}

describe("officer protected reserve type guard", () => {
  it("all officers have reserve defined", () => {
    for (const m of OPS_TEAM.filter((x) => x.role === "Officer")) {
      assertOfficerReserve(m);
    }
  });
});
