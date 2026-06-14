import { describe, it, expect } from "vitest";
import { OPS_QA_SAMPLES, OPS_QA_SAMPLE_COUNT } from "@/data/ops/ops-qa-samples";
import { OPS_TEAM } from "@/data/ops/ops-team";
import {
  getQaDataSources,
  getQaDefectBreakdown,
  getQaRows,
  getQaScoreByAnalyst,
  getRoleExpectedUrgentPickupShare,
  getSlaPickupBehaviourStatus,
  getUrgentPickupShareByAnalyst,
  QA_REOPEN_LINKAGE_NOTE,
} from "@/lib/ops/qa";

describe("QA samples dataset", () => {
  it("exists with samples per analyst", () => {
    expect(OPS_QA_SAMPLE_COUNT).toBeGreaterThan(OPS_TEAM.length * 3);
    expect(getQaDataSources().samples).toBe(OPS_QA_SAMPLES);
  });

  it("includes pass and fail results", () => {
    const passes = OPS_QA_SAMPLES.filter((s) => s.result === "Pass").length;
    const fails = OPS_QA_SAMPLES.filter((s) => s.result === "Fail").length;
    expect(passes).toBeGreaterThan(0);
    expect(fails).toBeGreaterThan(0);
  });
});

describe("getQaScoreByAnalyst", () => {
  it("computes pass rate from samples", () => {
    for (const member of OPS_TEAM) {
      const samples = OPS_QA_SAMPLES.filter((s) => s.analystId === member.id);
      if (samples.length === 0) continue;
      const passed = samples.filter((s) => s.result === "Pass").length;
      const expected = Math.round((passed / samples.length) * 1000) / 10;
      expect(getQaScoreByAnalyst(member.id)).toBe(expected);
    }
  });
});

describe("getQaDefectBreakdown", () => {
  it("counts defect categories on failed samples", () => {
    const fa005Fails = OPS_QA_SAMPLES.filter(
      (s) => s.analystId === "FA-005" && s.result === "Fail",
    );
    const breakdown = getQaDefectBreakdown("FA-005");
    const totalDefects = Object.values(breakdown).reduce((sum, n) => sum + n, 0);
    expect(totalDefects).toBe(fa005Fails.length);
  });
});

describe("SLA-pickup behaviour", () => {
  it("computes urgent pickup share from handled cases", () => {
    for (const member of OPS_TEAM) {
      const share = getUrgentPickupShareByAnalyst(member.id);
      expect(share).toBeGreaterThanOrEqual(0);
      expect(share).toBeLessThanOrEqual(100);
    }
  });

  it("computes role expected share within role", () => {
    const fraudExpected = getRoleExpectedUrgentPickupShare("Fraud Analyst");
    const juniorExpected = getRoleExpectedUrgentPickupShare("Junior Analyst");
    expect(fraudExpected).toBeGreaterThan(0);
    expect(juniorExpected).toBeGreaterThan(0);
    expect(fraudExpected).not.toBe(juniorExpected);
  });

  it("returns Healthy, Watch, or Avoidance risk", () => {
    const statuses = new Set(
      OPS_TEAM.map((m) => getSlaPickupBehaviourStatus(m.id).status),
    );
    expect(statuses.has("Healthy") || statuses.has("Watch")).toBe(true);
  });

  it("flags lower urgent pickup for demo analysts", () => {
    const fa005 = getSlaPickupBehaviourStatus("FA-005");
    expect(["Watch", "Avoidance risk"]).toContain(fa005.status);
  });
});

describe("getQaRows", () => {
  it("does not use raw volume as primary QA read", () => {
    const rows = getQaRows();
    for (const row of rows) {
      expect(row.qaReadStatus).toBeDefined();
      expect(["On track", "Watch", "Needs review"]).toContain(row.qaReadStatus);
      expect(row).not.toHaveProperty("rawHandledCases");
    }
  });
});

describe("reopen linkage", () => {
  it("is text-only with no workflow engine implied", () => {
    expect(QA_REOPEN_LINKAGE_NOTE).toContain("Reopened queue");
    expect(QA_REOPEN_LINKAGE_NOTE).toContain("does not build a reopen workflow engine");
  });
});
