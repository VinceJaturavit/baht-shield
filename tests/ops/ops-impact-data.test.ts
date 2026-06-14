import { describe, it, expect } from "vitest";
import { OPS_CASES } from "@/data/ops/ops-cases";
import { getAgingBucket } from "@/lib/ops/aging";
import { getSlaPressure, OPS_REFERENCE_NOW } from "@/lib/ops/sla";
import type { OpsImpactTier } from "@/lib/ops/types";

function tierRank(tier: OpsImpactTier): number {
  return { Critical: 0, High: 1, Moderate: 2, Low: 3 }[tier];
}

describe("OPS_CASES impact enrichment", () => {
  it("gives every case impact fields", () => {
    for (const caseItem of OPS_CASES) {
      expect(caseItem.impact).toBeDefined();
      expect(caseItem.impact.financialExposureThb).toBeGreaterThanOrEqual(0);
      expect(caseItem.impact.financialExposureBand).toBeTruthy();
      expect(caseItem.impact.socialPressure).toBeTruthy();
      expect(caseItem.impact.incidentSeverity).toBeTruthy();
      expect(caseItem.impact.impactTier).toBeTruthy();
      expect(caseItem.impact.impactRationale.length).toBeGreaterThan(0);
    }
  });

  it("keeps High/Critical cases a minority", () => {
    const elevated = OPS_CASES.filter((c) =>
      ["High", "Critical"].includes(c.impact.impactTier),
    );
    expect(elevated.length).toBeGreaterThan(0);
    expect(elevated.length / OPS_CASES.length).toBeLessThan(0.45);
  });

  it("includes at least one High/Critical case with Fresh or Mid SLA bucket", () => {
    const match = OPS_CASES.find(
      (c) =>
        ["High", "Critical"].includes(c.impact.impactTier) &&
        ["Fresh", "Mid"].includes(getAgingBucket(c)),
    );
    expect(match).toBeDefined();
  });

  it("includes at least one Low impact case with At-Risk or Breached SLA bucket", () => {
    const match = OPS_CASES.find(
      (c) =>
        c.impact.impactTier === "Low" &&
        ["At-Risk", "Breached"].includes(getAgingBucket(c)),
    );
    expect(match).toBeDefined();
  });

  it("includes at least one High/Critical case with At-Risk or Breached SLA pressure", () => {
    const match = OPS_CASES.find(
      (c) =>
        ["High", "Critical"].includes(c.impact.impactTier) &&
        ["Near breach", "Breached"].includes(getSlaPressure(c, OPS_REFERENCE_NOW)),
    );
    expect(match).toBeDefined();
  });

  it("includes at least one Moderate or Low case with Fresh SLA bucket", () => {
    const match = OPS_CASES.find(
      (c) =>
        ["Moderate", "Low"].includes(c.impact.impactTier) &&
        getAgingBucket(c) === "Fresh",
    );
    expect(match).toBeDefined();
  });

  it("does not perfectly correlate impact tier with SLA pressure", () => {
    const pairs = OPS_CASES.map((c) => ({
      impact: tierRank(c.impact.impactTier),
      sla: getSlaPressure(c, OPS_REFERENCE_NOW),
    }));

    const correlationGroups = new Map<string, number>();
    for (const pair of pairs) {
      const key = `${pair.impact}:${pair.sla}`;
      correlationGroups.set(key, (correlationGroups.get(key) ?? 0) + 1);
    }

    const dominantGroup = Math.max(...correlationGroups.values());
    expect(dominantGroup / OPS_CASES.length).toBeLessThan(0.5);
  });
});
