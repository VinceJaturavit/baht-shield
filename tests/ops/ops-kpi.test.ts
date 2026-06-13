import { describe, it, expect } from "vitest";
import { OPS_CASES } from "@/data/ops/ops-cases";
import { OPS_TEAM } from "@/data/ops/ops-team";
import { OPS_SYNTHETIC_QUALITY_SCORES } from "@/data/ops/ops-kpi-quality";
import { OPS_STREAM_COMPLEXITY_WEIGHTS } from "@/data/ops/ops-kpi-config";
import { OPS_STREAM_CODES } from "@/lib/ops/streams";
import {
  getStreamComplexityWeight,
  getWeightedCaseValue,
  getTeamKpiSummary,
  getIndividualKpis,
  getQueueHealthKpis,
} from "@/lib/ops/kpi";
import type { OpsCase } from "@/lib/ops/types";

const LEGACY_ROLES = ["Officer", "Contractor"];

describe("OPS_STREAM_COMPLEXITY_WEIGHTS", () => {
  it("defines weights for all five streams", () => {
    expect(OPS_STREAM_COMPLEXITY_WEIGHTS).toHaveLength(5);
    for (const code of OPS_STREAM_CODES) {
      expect(OPS_STREAM_COMPLEXITY_WEIGHTS.some((w) => w.stream === code)).toBe(true);
      expect(getStreamComplexityWeight(code)).toBeGreaterThan(0);
    }
  });

  it("weights RFR/LAR above DSP/PRF", () => {
    expect(getStreamComplexityWeight("RFR")).toBeGreaterThan(getStreamComplexityWeight("DSP"));
    expect(getStreamComplexityWeight("RFR")).toBeGreaterThan(getStreamComplexityWeight("PRF"));
    expect(getStreamComplexityWeight("LAR")).toBeGreaterThan(getStreamComplexityWeight("DSP"));
    expect(getStreamComplexityWeight("LAR")).toBeGreaterThan(getStreamComplexityWeight("PRF"));
  });
});

describe("weighted throughput", () => {
  it("differs from raw count when streams differ", () => {
    const rfrClosed = OPS_CASES.find(
      (c) => c.stream === "RFR" && c.status === "Closed",
    )!;
    const prfClosed = OPS_CASES.find(
      (c) => c.stream === "PRF" && c.status === "Closed",
    )!;

    expect(getWeightedCaseValue(rfrClosed)).toBeGreaterThan(getWeightedCaseValue(prfClosed));

    const rawCount = 2;
    const weightedSum =
      getWeightedCaseValue(rfrClosed) + getWeightedCaseValue(prfClosed);
    expect(weightedSum).not.toBe(rawCount);
  });

  it("uses only existing case fields", () => {
    const sample: OpsCase = OPS_CASES[0];
    const keys = Object.keys(sample);
    expect(keys).not.toContain("qaScore");
    expect(keys).not.toContain("kpiWeight");
    expect(getWeightedCaseValue(sample)).toBe(getStreamComplexityWeight(sample.stream));
  });
});

describe("getTeamKpiSummary", () => {
  it("computes from existing cases and roster", () => {
    const summary = getTeamKpiSummary(OPS_CASES, OPS_TEAM);
    expect(summary.totalOpenCases).toBeGreaterThan(0);
    expect(summary.totalClosedCases).toBeGreaterThan(0);
    expect(summary.weightedThroughput).toBeGreaterThan(0);
    expect(summary.slaComplianceRate).toBeGreaterThanOrEqual(0);
    expect(summary.slaComplianceRate).toBeLessThanOrEqual(100);
    expect(summary.atRiskCount).toBeGreaterThanOrEqual(0);
    expect(summary.overloadedPeopleCount).toBeGreaterThanOrEqual(0);
  });
});

describe("getIndividualKpis", () => {
  it("includes Fraud Analyst QA / escalation / documentation metrics", () => {
    const kpis = getIndividualKpis(OPS_CASES, OPS_TEAM);
    const fraudAnalysts = kpis.filter((k) => k.role === "Fraud Analyst");

    expect(fraudAnalysts.length).toBe(6);
    for (const analyst of fraudAnalysts) {
      expect(analyst.primaryQualityMetricLabel).toBe("QA quality");
      expect(analyst.secondaryMetricLabel).toBe("Escalation accuracy");
      const quality = OPS_SYNTHETIC_QUALITY_SCORES[analyst.memberId];
      expect(quality?.role).toBe("Fraud Analyst");
      if (quality?.role === "Fraud Analyst") {
        expect(analyst.primaryQualityMetricValue).toBe(quality.qaQuality);
        expect(analyst.secondaryMetricValue).toBe(quality.escalationAccuracy);
        expect(quality.decisionDocumentation).toBeGreaterThan(0);
      }
    }
  });

  it("includes Junior Analyst evidence / SOP / hand-off metrics", () => {
    const kpis = getIndividualKpis(OPS_CASES, OPS_TEAM);
    const juniorAnalysts = kpis.filter((k) => k.role === "Junior Analyst");

    expect(juniorAnalysts.length).toBe(9);
    for (const analyst of juniorAnalysts) {
      expect(analyst.primaryQualityMetricLabel).toBe("Evidence completeness");
      expect(analyst.secondaryMetricLabel).toBe("SOP adherence");
      const quality = OPS_SYNTHETIC_QUALITY_SCORES[analyst.memberId];
      expect(quality?.role).toBe("Junior Analyst");
      if (quality?.role === "Junior Analyst") {
        expect(analyst.primaryQualityMetricValue).toBe(quality.evidenceCompleteness);
        expect(analyst.secondaryMetricValue).toBe(quality.sopAdherence);
        expect(quality.handoffQuality).toBeGreaterThan(0);
      }
    }
  });

  it("does not use legacy role labels", () => {
    const kpis = getIndividualKpis(OPS_CASES, OPS_TEAM);
    const blob = JSON.stringify(kpis);
    for (const role of LEGACY_ROLES) {
      expect(blob).not.toContain(role);
    }
  });

  it("derives weighted throughput separately from raw handled count", () => {
    const kpis = getIndividualKpis(OPS_CASES, OPS_TEAM);
    const withHandled = kpis.filter((k) => k.rawHandledCases > 0);
    expect(withHandled.length).toBeGreaterThan(0);

    for (const kpi of withHandled) {
      if (kpi.rawHandledCases > 1) {
        expect(kpi.weightedThroughput).toBeGreaterThanOrEqual(kpi.rawHandledCases);
      }
    }
  });
});

describe("getQueueHealthKpis", () => {
  it("computes per stream from existing cases", () => {
    const kpis = getQueueHealthKpis(OPS_CASES);
    expect(kpis).toHaveLength(5);

    for (const kpi of kpis) {
      expect(OPS_STREAM_CODES).toContain(kpi.stream);
      expect(kpi.openBacklog).toBeGreaterThanOrEqual(0);
      expect(kpi.slaComplianceRate).toBeGreaterThanOrEqual(0);
      expect(kpi.slaComplianceRate).toBeLessThanOrEqual(100);
      expect(["Stable", "Watch", "Pressure", "Breached"]).toContain(kpi.queueStatus);
    }
  });
});
