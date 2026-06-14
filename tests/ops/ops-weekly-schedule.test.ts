import { describe, it, expect } from "vitest";
import { OPS_TEAM } from "@/data/ops/ops-team";
import {
  OPS_WEEKLY_ASSIGNMENTS,
  OPS_WEEKLY_MEMBER_IDS,
} from "@/data/ops/ops-weekly-schedule";
import { OPS_CASES } from "@/data/ops/ops-cases";
import { getTeamWithLoad } from "@/lib/ops/roster";
import {
  formatCellDisplay,
  getAssignmentForCell,
  getQueueOwnershipStatus,
  getWeeklyAssignmentsForMember,
  getWeeklyCoverageByDay,
  isWorkingShift,
} from "@/lib/ops/weekly-schedule";
import {
  OPS_WEEKDAYS,
  type OpsShiftCode,
  type OpsWeeklyTaskTag,
} from "@/lib/ops/weekly-schedule-types";

const VALID_SHIFT_CODES: OpsShiftCode[] = ["D", "E", "N", "OFF", "LEAVE"];

const FRAUD_ANALYST_TASKS: OpsWeeklyTaskTag[] = [
  "RFR",
  "LAR",
  "PRO",
  "Urgent",
  "QA",
  "Handoff",
  "Off",
];

const JUNIOR_ANALYST_TASKS: OpsWeeklyTaskTag[] = ["DSP", "PRF", "Handoff", "Off"];

const DECISION_AUTHORITY_TASKS: OpsWeeklyTaskTag[] = ["RFR", "LAR", "PRO", "Urgent"];

describe("OPS_WEEKLY_ASSIGNMENTS", () => {
  it("covers every roster member with Mon–Sun entries", () => {
    expect(OPS_WEEKLY_MEMBER_IDS).toHaveLength(OPS_TEAM.length);

    for (const memberId of OPS_WEEKLY_MEMBER_IDS) {
      const assignments = getWeeklyAssignmentsForMember(memberId);
      expect(assignments).toHaveLength(7);
      expect(assignments.map((a) => a.day)).toEqual(OPS_WEEKDAYS);
    }
  });

  it("uses valid shift codes", () => {
    for (const a of OPS_WEEKLY_ASSIGNMENTS) {
      expect(VALID_SHIFT_CODES).toContain(a.shiftCode);
    }
  });

  it("uses valid task tags", () => {
    const allTags: OpsWeeklyTaskTag[] = [
      "RFR",
      "LAR",
      "PRO",
      "DSP",
      "PRF",
      "Urgent",
      "QA",
      "Handoff",
      "Off",
    ];
    for (const a of OPS_WEEKLY_ASSIGNMENTS) {
      expect(allTags).toContain(a.taskTag);
    }
  });

  it("Fraud Analysts assigned only to decision-authority-compatible tasks", () => {
    const fraudIds = OPS_TEAM.filter((m) => m.role === "Fraud Analyst").map((m) => m.id);
    for (const a of OPS_WEEKLY_ASSIGNMENTS.filter((x) => fraudIds.includes(x.memberId))) {
      if (isWorkingShift(a.shiftCode)) {
        expect(FRAUD_ANALYST_TASKS).toContain(a.taskTag);
        expect(DECISION_AUTHORITY_TASKS.includes(a.taskTag) || ["QA", "Handoff"].includes(a.taskTag)).toBe(true);
      }
    }
  });

  it("Junior Analysts assigned only to intake-compatible tasks", () => {
    const juniorIds = OPS_TEAM.filter((m) => m.role === "Junior Analyst").map((m) => m.id);
    for (const a of OPS_WEEKLY_ASSIGNMENTS.filter((x) => juniorIds.includes(x.memberId))) {
      if (isWorkingShift(a.shiftCode)) {
        expect(JUNIOR_ANALYST_TASKS).toContain(a.taskTag);
        expect(["RFR", "LAR", "PRO", "Urgent", "QA"]).not.toContain(a.taskTag);
      }
    }
  });

  it("includes at least one OFF assignment", () => {
    const offCount = OPS_WEEKLY_ASSIGNMENTS.filter((a) => a.shiftCode === "OFF").length;
    expect(offCount).toBeGreaterThan(0);
  });

  it("includes at least one LEAVE assignment", () => {
    const leaveCount = OPS_WEEKLY_ASSIGNMENTS.filter((a) => a.shiftCode === "LEAVE").length;
    expect(leaveCount).toBeGreaterThan(0);
  });

  it("includes at least one N · PRO or N · Urgent on-call for Fraud Analyst", () => {
    const onCall = OPS_WEEKLY_ASSIGNMENTS.filter(
      (a) =>
        a.memberId.startsWith("FA-") &&
        a.shiftCode === "N" &&
        (a.taskTag === "PRO" || a.taskTag === "Urgent"),
    );
    expect(onCall.length).toBeGreaterThan(0);
  });

  it("includes at least one handoff assignment", () => {
    const handoffs = OPS_WEEKLY_ASSIGNMENTS.filter((a) => a.taskTag === "Handoff");
    expect(handoffs.length).toBeGreaterThan(0);
  });
});

describe("getWeeklyCoverageByDay", () => {
  const teamWithLoad = getTeamWithLoad(OPS_TEAM, OPS_CASES);
  const coverage = getWeeklyCoverageByDay(teamWithLoad);

  it("returns seven days Mon–Sun", () => {
    expect(coverage).toHaveLength(7);
    expect(coverage.map((d) => d.day)).toEqual(OPS_WEEKDAYS);
  });

  it("Covered requires decision authority and intake coverage", () => {
    for (const day of coverage) {
      if (day.status === "Covered") {
        expect(day.hasDecisionAuthority).toBe(true);
        expect(day.hasIntakeCoverage).toBe(true);
        expect(day.gapReason).toBeUndefined();
      } else {
        expect(day.gapReason).toBeTruthy();
      }
    }
  });

  it("handoff count is derived from Handoff task tags", () => {
    for (const day of coverage) {
      const manual = OPS_WEEKLY_ASSIGNMENTS.filter(
        (a) => a.day === day.day && a.taskTag === "Handoff" && isWorkingShift(a.shiftCode),
      ).length;
      expect(day.handoffCount).toBe(manual);
    }
  });

  it("all days are Covered with current synthetic schedule", () => {
    for (const day of coverage) {
      expect(day.status).toBe("Covered");
    }
  });
});

describe("getAssignmentForCell", () => {
  it("returns assignment for member and day", () => {
    const assignment = getAssignmentForCell("FA-001", "Mon");
    expect(assignment).toBeDefined();
    expect(assignment?.shiftCode).toBe("D");
    expect(assignment?.taskTag).toBe("RFR");
  });
});

describe("formatCellDisplay", () => {
  it("shows compact codes for working shifts", () => {
    const assignment = getAssignmentForCell("FA-001", "Mon")!;
    expect(formatCellDisplay(assignment)).toBe("D · RFR");
  });

  it("shows OFF or LEAVE without task tag", () => {
    const off = getAssignmentForCell("FA-001", "Sat")!;
    expect(formatCellDisplay(off)).toBe("OFF");

    const leave = getAssignmentForCell("FA-003", "Wed")!;
    expect(formatCellDisplay(leave)).toBe("LEAVE");
  });
});

describe("getQueueOwnershipStatus", () => {
  it("returns Owner when person matches ownerOfDay", () => {
    expect(getQueueOwnershipStatus("Ops Lead", "RFR")).toBe("Owner");
  });

  it("returns Backup when person matches backup", () => {
    expect(getQueueOwnershipStatus("Analyst A", "RFR")).toBe("Backup");
  });

  it("returns Supporting for other Fraud Analysts on queue", () => {
    expect(getQueueOwnershipStatus("Analyst B", "RFR")).toBe("Supporting");
  });

  it("returns Handoff support for Handoff task", () => {
    expect(getQueueOwnershipStatus("Analyst A", "Handoff")).toBe("Handoff support");
  });

  it("returns Not queue owner for QA and Off", () => {
    expect(getQueueOwnershipStatus("Analyst A", "QA")).toBe("Not queue owner");
    expect(getQueueOwnershipStatus("Analyst A", "Off")).toBe("Not queue owner");
  });

  it("returns Owner for Junior Analyst on DSP", () => {
    expect(getQueueOwnershipStatus("Junior Analyst A", "DSP")).toBe("Owner");
  });
});
