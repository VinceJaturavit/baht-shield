import { describe, it, expect } from "vitest";
import { OPS_TEAM } from "@/data/ops/ops-team";
import {
  getReviewAnalystList,
  getReviewHeadline,
  getReviewPackByAnalystId,
  getReliabilitySummary,
} from "@/lib/ops/reviews";

describe("getReviewAnalystList", () => {
  it("generates review packs for all analysts", () => {
    const list = getReviewAnalystList();
    expect(list.length).toBe(OPS_TEAM.length);
    expect(list.every((p) => p.analystId && p.name && p.role)).toBe(true);
  });

  it("groups Fraud Analysts and Junior Analysts by role", () => {
    const list = getReviewAnalystList();
    const fraud = list.filter((p) => p.role === "Fraud Analyst");
    const junior = list.filter((p) => p.role === "Junior Analyst");
    expect(fraud.length).toBe(OPS_TEAM.filter((m) => m.role === "Fraud Analyst").length);
    expect(junior.length).toBe(OPS_TEAM.filter((m) => m.role === "Junior Analyst").length);
    expect(fraud.every((p) => p.role === "Fraud Analyst")).toBe(true);
    expect(junior.every((p) => p.role === "Junior Analyst")).toBe(true);
  });
});

describe("getReviewPackByAnalystId", () => {
  it("returns pack with five separate signal sections", () => {
    const pack = getReviewPackByAnalystId("FA-001");
    expect(pack).toBeDefined();
    expect(pack!.workload).toBeDefined();
    expect(pack!.performance).toBeDefined();
    expect(pack!.quality).toBeDefined();
    expect(pack!.behaviour).toBeDefined();
    expect(pack!.reliability).toBeDefined();
  });

  it("does not contain a single combined review score", () => {
    for (const member of OPS_TEAM) {
      const pack = getReviewPackByAnalystId(member.id);
      expect(pack).toBeDefined();
      const serialized = JSON.stringify(pack);
      expect(serialized).not.toMatch(/combinedScore|overallScore|totalScore|reviewScore/i);
    }
  });
});

describe("workload section", () => {
  it("labels workload as distribution not performance", () => {
    const pack = getReviewPackByAnalystId("FA-001")!;
    expect(pack.workload.fairnessTag).toBeTruthy();
    expect(pack.workload.distributionNote).toMatch(/distribution|rostering|role average/i);
    expect(pack.workload.distributionNote).not.toMatch(/penalty|grade|poor performance/i);
  });

  it("includes weighted difficulty and role average", () => {
    const pack = getReviewPackByAnalystId("FA-002")!;
    expect(pack.workload.weightedDifficulty).toBeGreaterThan(0);
    expect(pack.workload.roleAverage).toBeGreaterThan(0);
  });
});

describe("performance section", () => {
  it("includes raw volume and weighted throughput", () => {
    const pack = getReviewPackByAnalystId("FA-001")!;
    expect(pack.performance.rawVolume).toBeGreaterThanOrEqual(0);
    expect(pack.performance.weightedThroughput).toBeGreaterThanOrEqual(0);
  });

  it("includes role-specific metrics", () => {
    const fraud = getReviewPackByAnalystId("FA-001")!;
    expect(fraud.performance.roleMetricOneLabel).toMatch(/Escalation|Decision|Evidence|SOP/i);
    const junior = getReviewPackByAnalystId("JA-001")!;
    expect(junior.performance.roleMetricOneLabel).toMatch(/Evidence|SOP|Escalation/i);
  });
});

describe("quality section", () => {
  it("includes QA score and sample count", () => {
    const pack = getReviewPackByAnalystId("FA-001")!;
    expect(pack.quality.qaScore).toBeGreaterThanOrEqual(0);
    expect(pack.quality.sampleCount).toBeGreaterThan(0);
    expect(pack.quality.passCount + pack.quality.failCount).toBe(pack.quality.sampleCount);
  });

  it("flags low sample when n < 5", () => {
    for (const member of OPS_TEAM) {
      const pack = getReviewPackByAnalystId(member.id)!;
      if (pack.quality.sampleCount < 5) {
        expect(pack.quality.lowSample).toBe(true);
      }
    }
  });
});

describe("behaviour section", () => {
  it("includes urgent pickup share and role-expected share", () => {
    const pack = getReviewPackByAnalystId("FA-001")!;
    expect(pack.behaviour.urgentPickupShare).toBeGreaterThanOrEqual(0);
    expect(pack.behaviour.roleExpectedShare).toBeGreaterThan(0);
    expect(["Healthy", "Watch", "Avoidance risk"]).toContain(pack.behaviour.behaviourRead);
  });
});

describe("reliability section", () => {
  it("includes assigned days, leave, and handoff count", () => {
    const summary = getReliabilitySummary("FA-002");
    expect(summary.assignedDays).toBeGreaterThanOrEqual(0);
    expect(summary.leaveDays).toBeGreaterThanOrEqual(0);
    expect(summary.handoffCount).toBeGreaterThanOrEqual(0);
    expect(summary.attendanceSummary).toBeTruthy();
  });
});

describe("getReviewHeadline", () => {
  it("assembles compact headline from separate signals", () => {
    const pack = getReviewPackByAnalystId("FA-001")!;
    const headline = getReviewHeadline(pack);
    expect(headline).toMatch(/Weighted throughput/);
    expect(headline).toMatch(/QA/);
    expect(headline).toMatch(/Fairness/);
    expect(headline).toMatch(/Behaviour/);
  });
});
