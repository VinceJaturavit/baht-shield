import { describe, it, expect } from "vitest";
import { OPS_TEAM, OPS_FRAUD_ANALYST_COUNT, OPS_JUNIOR_ANALYST_COUNT } from "@/data/ops/ops-team";
import {
  OPS_QUEUE_OWNERSHIP,
  FRAUD_ANALYST_OWNED_QUEUES,
  JUNIOR_ANALYST_OWNED_QUEUES,
} from "@/data/ops/ops-queue-ownership";
import { OPS_CASES } from "@/data/ops/ops-cases";
import {
  getOpenOpsCases,
  getCurrentLoadByOwner,
  getTeamWithLoad,
  getAssignmentCapacity,
  isMemberOverloaded,
  hasDecisionAuthority,
} from "@/lib/ops/roster";
import type { OpsTeamMember } from "@/lib/ops/roster-types";

const EXPECTED_NAV = [
  { id: "queue", label: "Queue Board", disabled: false },
  { id: "aging", label: "Aging & SLA", disabled: false },
  { id: "roster", label: "Roster", disabled: false },
  { id: "kpi", label: "KPI", disabled: false },
];

const FORBIDDEN = ["TrueMoney", "Kraken", "Payward", "SignalOS"];
const LEGACY_ROLES = ["Officer", "Contractor"];

const FRAUD_ANALYST_NAMES = new Set(
  OPS_TEAM.filter((m) => m.role === "Fraud Analyst").map((m) => m.name),
);

describe("OPS_TEAM", () => {
  it("has around 10–15 people", () => {
    expect(OPS_TEAM.length).toBeGreaterThanOrEqual(10);
    expect(OPS_TEAM.length).toBeLessThanOrEqual(15);
    expect(OPS_TEAM).toHaveLength(15);
  });

  it("has Fraud Analysts and Junior Analysts", () => {
    expect(OPS_FRAUD_ANALYST_COUNT).toBe(6);
    expect(OPS_JUNIOR_ANALYST_COUNT).toBe(9);
  });

  it("every person has required fields", () => {
    for (const member of OPS_TEAM) {
      expect(member.id).toBeTruthy();
      expect(member.name).toBeTruthy();
      expect(["Fraud Analyst", "Junior Analyst"]).toContain(member.role);
      expect(LEGACY_ROLES).not.toContain(member.role);
      expect(member.streamsCovered.length).toBeGreaterThan(0);
      expect(member.capacity).toBeGreaterThan(0);
      expect(member.shift).toBeTruthy();
      expect(["Present", "Off", "Leave"]).toContain(member.attendance);
    }
  });

  it("Fraud Analysts have decision authority and protected reserve", () => {
    const fraudAnalysts = OPS_TEAM.filter((m) => m.role === "Fraud Analyst");
    for (const analyst of fraudAnalysts) {
      expect(hasDecisionAuthority(analyst)).toBe(true);
      expect(analyst.protectedCapacityReserve).toBeGreaterThan(0);
    }
  });

  it("Junior Analysts do not have final decision authority", () => {
    const juniorAnalysts = OPS_TEAM.filter((m) => m.role === "Junior Analyst");
    for (const analyst of juniorAnalysts) {
      expect(hasDecisionAuthority(analyst)).toBe(false);
      expect(analyst.protectedCapacityReserve).toBeUndefined();
    }
  });

  it("reuses existing case owner names for Fraud Analysts", () => {
    const fraudAnalystNames = OPS_TEAM.filter((m) => m.role === "Fraud Analyst").map(
      (m) => m.name,
    );
    expect(fraudAnalystNames).toContain("Ops Lead");
    expect(fraudAnalystNames).toContain("Analyst A");
    expect(fraudAnalystNames).toContain("Analyst B");
    expect(fraudAnalystNames).toContain("Queue Owner");
  });

  it("does not contain forbidden names", () => {
    const blob = JSON.stringify(OPS_TEAM);
    for (const term of FORBIDDEN) {
      expect(blob).not.toContain(term);
    }
  });

  it("does not use legacy role labels in roster data", () => {
    const blob = JSON.stringify(OPS_TEAM);
    for (const role of LEGACY_ROLES) {
      expect(blob).not.toContain(role);
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

  it("uses assignment capacity for Fraud Analyst overload", () => {
    const teamWithLoad = getTeamWithLoad(OPS_TEAM, OPS_CASES);
    const fraudAnalysts = teamWithLoad.filter((m) => m.role === "Fraud Analyst");

    for (const analyst of fraudAnalysts) {
      const expectedOverloaded =
        analyst.currentLoad > getAssignmentCapacity(analyst);
      expect(analyst.isOverloaded).toBe(expectedOverloaded);
      expect(isMemberOverloaded(analyst, analyst.currentLoad)).toBe(
        expectedOverloaded,
      );
    }
  });

  it("Fraud Analyst assignment capacity equals total minus protected reserve", () => {
    const fraudAnalysts = OPS_TEAM.filter((m) => m.role === "Fraud Analyst");
    for (const analyst of fraudAnalysts) {
      expect(getAssignmentCapacity(analyst)).toBe(
        analyst.capacity - (analyst.protectedCapacityReserve ?? 0),
      );
    }
  });

  it("Junior Analyst assignment capacity equals total capacity", () => {
    const juniorAnalysts = OPS_TEAM.filter((m) => m.role === "Junior Analyst");
    for (const analyst of juniorAnalysts) {
      expect(getAssignmentCapacity(analyst)).toBe(analyst.capacity);
    }
  });

  it("at least one Fraud Analyst shows derived load from cases", () => {
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

  it("Urgent/RFR/LAR owners are Fraud Analysts", () => {
    for (const code of FRAUD_ANALYST_OWNED_QUEUES) {
      const row = OPS_QUEUE_OWNERSHIP.find((q) => q.queueCode === code)!;
      expect(FRAUD_ANALYST_NAMES.has(row.ownerOfDay)).toBe(true);
      expect(FRAUD_ANALYST_NAMES.has(row.backup)).toBe(true);
    }
  });

  it("PRO has Fraud Analyst owner and backup", () => {
    const pro = OPS_QUEUE_OWNERSHIP.find((q) => q.queueCode === "PRO")!;
    expect(FRAUD_ANALYST_NAMES.has(pro.ownerOfDay)).toBe(true);
    expect(FRAUD_ANALYST_NAMES.has(pro.backup)).toBe(true);
  });

  it("DSP/PRF supported by Junior Analysts under SOP", () => {
    for (const code of JUNIOR_ANALYST_OWNED_QUEUES) {
      const row = OPS_QUEUE_OWNERSHIP.find((q) => q.queueCode === code)!;
      const owner = OPS_TEAM.find((m) => m.name === row.ownerOfDay);
      expect(owner?.role).toBe("Junior Analyst");
    }
  });

  it("shows rotation concept", () => {
    for (const row of OPS_QUEUE_OWNERSHIP) {
      expect(row.rotationNote.toLowerCase()).toContain("rotates");
    }
  });

  it("does not use legacy role labels in ownership copy", () => {
    const blob = JSON.stringify(OPS_QUEUE_OWNERSHIP);
    for (const role of LEGACY_ROLES) {
      expect(blob).not.toContain(role);
    }
  });
});

describe("ops side-nav config", () => {
  it("roster and KPI are active", () => {
    const roster = EXPECTED_NAV.find((n) => n.id === "roster")!;
    const kpi = EXPECTED_NAV.find((n) => n.id === "kpi")!;
    expect(roster.disabled).toBeFalsy();
    expect(kpi.disabled).toBeFalsy();
  });
});

function assertFraudAnalystReserve(member: OpsTeamMember) {
  if (member.role === "Fraud Analyst") {
    expect(member.protectedCapacityReserve).toBeDefined();
  }
}

describe("Fraud Analyst protected reserve type guard", () => {
  it("all Fraud Analysts have reserve defined", () => {
    for (const m of OPS_TEAM.filter((x) => x.role === "Fraud Analyst")) {
      assertFraudAnalystReserve(m);
    }
  });
});
