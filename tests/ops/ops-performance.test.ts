import { describe, it, expect } from "vitest";
import { OPS_HANDLED_CASES, OPS_HANDLED_CASE_COUNT } from "@/data/ops/ops-handled-cases";
import { OPS_TEAM } from "@/data/ops/ops-team";
import { getStreamComplexityWeight } from "@/lib/ops/kpi";
import {
  getComplexityWeightedThroughput,
  getPerformanceDataSource,
  getPerformanceRows,
  getPerformanceStatus,
  getQaQualityScore,
  getRawHandledVolume,
} from "@/lib/ops/performance";
import type { OpsPerformanceRow } from "@/lib/ops/performance-types";

describe("handled-case dataset", () => {
  it("exists with enough records for performance views", () => {
    expect(OPS_HANDLED_CASE_COUNT).toBeGreaterThanOrEqual(80);
    expect(OPS_HANDLED_CASE_COUNT).toBeLessThanOrEqual(140);
    expect(getPerformanceDataSource()).toBe(OPS_HANDLED_CASES);
  });

  it("assigns handled cases to every analyst with reduced volume for off/leave", () => {
    for (const member of OPS_TEAM) {
      const volume = getRawHandledVolume(member.id);
      if (member.attendance === "Off" || member.attendance === "Leave") {
        expect(volume).toBeLessThan(8);
      } else {
        expect(volume).toBeGreaterThan(0);
      }
    }
  });
});

describe("getRawHandledVolume", () => {
  it("counts handled cases per analyst", () => {
    const fa001 = OPS_HANDLED_CASES.filter((c) => c.analystId === "FA-001").length;
    expect(getRawHandledVolume("FA-001")).toBe(fa001);
  });
});

describe("getComplexityWeightedThroughput", () => {
  it("uses stream complexity weights from KPI config", () => {
    const fa001Cases = OPS_HANDLED_CASES.filter((c) => c.analystId === "FA-001");
    const expected = fa001Cases.reduce(
      (sum, c) => sum + getStreamComplexityWeight(c.stream),
      0,
    );
    expect(getComplexityWeightedThroughput("FA-001")).toBe(Math.round(expected * 10) / 10);
  });

  it("can differ from raw volume when stream mix varies", () => {
    const rows = getPerformanceRows();
    const withDifference = rows.filter(
      (r) => r.rawHandledCases !== r.weightedThroughput,
    );
    expect(withDifference.length).toBeGreaterThan(0);
  });
});

describe("getQaQualityScore", () => {
  it("returns a percentage for each analyst", () => {
    for (const member of OPS_TEAM) {
      const score = getQaQualityScore(member.id);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });
});

describe("getPerformanceRows", () => {
  it("includes QA quality score in each row", () => {
    const rows = getPerformanceRows();
    expect(rows.length).toBe(OPS_TEAM.length);
    for (const row of rows) {
      expect(row.qaQualityScore).toBe(getQaQualityScore(row.analystId));
    }
  });

  it("includes Fraud Analyst role metrics", () => {
    const fraudRows = getPerformanceRows().filter((r) => r.role === "Fraud Analyst");
    for (const row of fraudRows) {
      expect(row.roleMetricOneLabel).toBe("Escalation accuracy");
      expect(row.roleMetricTwoLabel).toBe("Decision documentation");
    }
  });

  it("includes Junior Analyst role metrics", () => {
    const juniorRows = getPerformanceRows().filter((r) => r.role === "Junior Analyst");
    for (const row of juniorRows) {
      expect(row.roleMetricOneLabel).toBe("Evidence completeness");
      expect(row.roleMetricTwoLabel).toBe("SOP adherence");
    }
  });
});

describe("getPerformanceStatus", () => {
  it("flags needs review when QA or SLA is below 85", () => {
    const row: OpsPerformanceRow = {
      analystId: "FA-001",
      analystName: "Ops Lead",
      role: "Fraud Analyst",
      rawHandledCases: 20,
      weightedThroughput: 30,
      qaQualityScore: 84,
      slaComplianceRate: 95,
      roleMetricOneLabel: "Escalation accuracy",
      roleMetricOneValue: 90,
      roleMetricTwoLabel: "Decision documentation",
      roleMetricTwoValue: 92,
      status: "On track",
    };
    expect(getPerformanceStatus(row)).toBe("Needs review");
  });

  it("is not based only on raw volume", () => {
    const highVolumeLowQuality: OpsPerformanceRow = {
      analystId: "FA-002",
      analystName: "Analyst A",
      role: "Fraud Analyst",
      rawHandledCases: 50,
      weightedThroughput: 80,
      qaQualityScore: 80,
      slaComplianceRate: 80,
      roleMetricOneLabel: "Escalation accuracy",
      roleMetricOneValue: 90,
      roleMetricTwoLabel: "Decision documentation",
      roleMetricTwoValue: 92,
      status: "On track",
    };
    expect(getPerformanceStatus(highVolumeLowQuality)).toBe("Needs review");
  });
});
