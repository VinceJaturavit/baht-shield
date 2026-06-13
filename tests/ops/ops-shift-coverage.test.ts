import { describe, it, expect } from "vitest";
import { OPS_CASES } from "@/data/ops/ops-cases";
import { OPS_TEAM } from "@/data/ops/ops-team";
import { getTeamWithLoad } from "@/lib/ops/roster";
import {
  getShiftCoverage,
  getShiftCoverageStatus,
  getShiftHandoffCount,
} from "@/lib/ops/shift-coverage";
import type { OpsShiftName } from "@/lib/ops/roster-types";

const SHIFT_NAMES: OpsShiftName[] = ["Day", "Evening", "Night / On-call"];

describe("getShiftCoverage", () => {
  const teamWithLoad = getTeamWithLoad(OPS_TEAM, OPS_CASES);
  const coverage = getShiftCoverage(teamWithLoad, OPS_CASES);

  it("includes Day, Evening, and Night / On-call shifts", () => {
    expect(coverage).toHaveLength(3);
    expect(coverage.map((c) => c.shift)).toEqual(SHIFT_NAMES);
  });

  it("computes Fraud Analyst count per shift", () => {
    for (const row of coverage) {
      expect(row.fraudAnalysts.every((m) => m.role === "Fraud Analyst")).toBe(true);
      expect(row.fraudAnalysts.every((m) => m.shift === row.shift)).toBe(true);
    }
  });

  it("computes Junior Analyst count per shift", () => {
    for (const row of coverage) {
      expect(row.juniorAnalysts.every((m) => m.role === "Junior Analyst")).toBe(true);
      expect(row.juniorAnalysts.every((m) => m.shift === row.shift)).toBe(true);
    }
  });

  it("Covered requires decision authority and intake staffing", () => {
    for (const row of coverage) {
      const status = getShiftCoverageStatus(row);
      expect(row.status).toBe(status);

      if (status === "Covered") {
        expect(row.hasDecisionAuthority).toBe(true);
        expect(row.intakeCount).toBeGreaterThan(0);
        expect(row.gapReason).toBeUndefined();
      }
    }
  });

  it("missing Fraud Analyst produces Gap", () => {
    const day = coverage.find((c) => c.shift === "Day")!;
    const withoutAuthority = {
      ...day,
      fraudAnalysts: day.fraudAnalysts.map((m) => ({ ...m, attendance: "Off" as const })),
      hasDecisionAuthority: false,
      intakeCount: day.intakeCount,
      status: "Covered" as const,
      handoffCount: day.handoffCount,
    };
    expect(getShiftCoverageStatus(withoutAuthority)).toBe("Gap");
  });

  it("missing Junior Analyst produces Gap", () => {
    const day = coverage.find((c) => c.shift === "Day")!;
    const withoutIntake = {
      ...day,
      juniorAnalysts: day.juniorAnalysts.map((m) => ({ ...m, attendance: "Off" as const })),
      intakeCount: 0,
      status: "Covered" as const,
      handoffCount: day.handoffCount,
    };
    expect(getShiftCoverageStatus(withoutIntake)).toBe("Gap");
  });

  it("all three shifts are Covered with current roster", () => {
    for (const row of coverage) {
      expect(row.status).toBe("Covered");
    }
  });
});

describe("getShiftHandoffCount", () => {
  it("returns a number for each shift", () => {
    for (const shift of SHIFT_NAMES) {
      const count = getShiftHandoffCount(OPS_CASES, shift);
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  it("does not require new case data fields", () => {
    const sample = OPS_CASES[0];
    const keys = Object.keys(sample);
    expect(keys).not.toContain("handoffShift");
    expect(keys).not.toContain("shiftBoundary");
  });
});
