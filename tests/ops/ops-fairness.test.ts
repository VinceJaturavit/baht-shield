import { describe, it, expect } from "vitest";
import { OPS_TEAM } from "@/data/ops/ops-team";
import { OPS_CASES } from "@/data/ops/ops-cases";
import { OPS_STREAM_COMPLEXITY_WEIGHTS } from "@/data/ops/ops-kpi-config";
import { getTeamWithLoad } from "@/lib/ops/roster";
import {
  getFairnessResult,
  getLoadTag,
  getRoleFairnessRows,
  getRoleFairnessSummary,
  getTaskDifficultyWeight,
  getWeeklyWeightedDifficultyByMember,
} from "@/lib/ops/fairness";
import type { OpsFairnessResult } from "@/lib/ops/fairness-types";

describe("getTaskDifficultyWeight", () => {
  it("matches required stream weights from KPI config", () => {
    expect(getTaskDifficultyWeight("RFR")).toBe(2.5);
    expect(getTaskDifficultyWeight("LAR")).toBe(2.25);
    expect(getTaskDifficultyWeight("PRO")).toBe(1.75);
    expect(getTaskDifficultyWeight("DSP")).toBe(1);
    expect(getTaskDifficultyWeight("PRF")).toBe(0.8);
  });

  it("uses KPI config stream weights directly", () => {
    for (const { stream, weight } of OPS_STREAM_COMPLEXITY_WEIGHTS) {
      expect(getTaskDifficultyWeight(stream)).toBe(weight);
    }
  });

  it("treats Urgent and QA as high-difficulty planned work", () => {
    expect(getTaskDifficultyWeight("Urgent")).toBe(2.5);
    expect(getTaskDifficultyWeight("QA")).toBe(2.25);
    expect(getTaskDifficultyWeight("Handoff")).toBe(1.5);
  });

  it("counts Off as zero difficulty", () => {
    expect(getTaskDifficultyWeight("Off")).toBe(0);
  });
});

describe("getWeeklyWeightedDifficultyByMember", () => {
  it("sums per-day task weights for working shifts only", () => {
    const fa001 = getWeeklyWeightedDifficultyByMember("FA-001");
    // Mon RFR 2.5 + Tue LAR 2.25 + Wed Urgent 2.5 + Thu PRO 1.75 + Fri RFR 2.5
    expect(fa001).toBe(11.5);
  });

  it("counts OFF and LEAVE days as zero contribution", () => {
    const fa003 = getWeeklyWeightedDifficultyByMember("FA-003");
    // Wed/Thu LEAVE with Off tag = 0; Mon PRO 1.75 + Tue LAR 2.25 + Fri RFR 2.5 + Sat Urgent 2.5
    expect(fa003).toBe(9);
  });
});

describe("getLoadTag", () => {
  it("computes over/at/under against role average with ±20% threshold", () => {
    expect(getLoadTag(100, 100)).toBe("At role average");
    expect(getLoadTag(85, 100)).toBe("At role average");
    expect(getLoadTag(79, 100)).toBe("Under-loaded");
    expect(getLoadTag(121, 100)).toBe("Over-loaded");
    expect(getLoadTag(120, 100)).toBe("At role average");
  });
});

describe("getRoleFairnessRows", () => {
  const teamWithLoad = getTeamWithLoad(OPS_TEAM, OPS_CASES);

  it("compares Fraud Analysts only within Fraud Analyst role", () => {
    const rows = getRoleFairnessRows(teamWithLoad, "Fraud Analyst");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.role === "Fraud Analyst")).toBe(true);
    const roleAverage = rows[0]?.roleAverage ?? 0;
    expect(rows.every((r) => r.roleAverage === roleAverage)).toBe(true);
  });

  it("compares Junior Analysts only within Junior Analyst role", () => {
    const rows = getRoleFairnessRows(teamWithLoad, "Junior Analyst");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.role === "Junior Analyst")).toBe(true);
    const roleAverage = rows[0]?.roleAverage ?? 0;
    expect(rows.every((r) => r.roleAverage === roleAverage)).toBe(true);
  });

  it("includes assigned days count per analyst", () => {
    const rows = getRoleFairnessRows(teamWithLoad, "Fraud Analyst");
    for (const row of rows) {
      expect(row.assignedDays).toBeGreaterThanOrEqual(0);
      expect(row.assignedDays).toBeLessThanOrEqual(7);
    }
  });
});

describe("getRoleFairnessSummary", () => {
  const teamWithLoad = getTeamWithLoad(OPS_TEAM, OPS_CASES);

  it("returns Balanced or Imbalanced status label per role", () => {
    const fraudRows = getRoleFairnessRows(teamWithLoad, "Fraud Analyst");
    const summary = getRoleFairnessSummary(fraudRows, "Fraud Analyst");
    expect(["Balanced", "Imbalanced"]).toContain(summary.status);
    expect(summary.averageWeightedDifficulty).toBeGreaterThan(0);
    expect(summary.spread).toBeGreaterThanOrEqual(0);
  });
});

describe("getFairnessResult", () => {
  const teamWithLoad = getTeamWithLoad(OPS_TEAM, OPS_CASES);
  let result: OpsFairnessResult;

  it("returns role-grouped analyst rows and role summaries", () => {
    result = getFairnessResult(teamWithLoad);
    expect(result.fraudAnalysts.length).toBe(6);
    expect(result.juniorAnalysts.length).toBe(9);
    expect(result.roleSummaries).toHaveLength(2);
    expect(result.roleSummaries.map((s) => s.role)).toEqual([
      "Fraud Analyst",
      "Junior Analyst",
    ]);
  });

  it("does not include volume or SLA-pickup fields", () => {
    result = getFairnessResult(teamWithLoad);
    const serialized = JSON.stringify(result);
    expect(serialized).not.toMatch(/volume/i);
    expect(serialized).not.toMatch(/sla/i);
    expect(serialized).not.toMatch(/throughput/i);
    expect(serialized).not.toMatch(/performance/i);
    expect(serialized).not.toMatch(/qaScore/i);

    for (const row of [...result.fraudAnalysts, ...result.juniorAnalysts]) {
      expect(row).not.toHaveProperty("volume");
      expect(row).not.toHaveProperty("slaPickup");
      expect(row).not.toHaveProperty("openCaseCount");
    }
  });
});
