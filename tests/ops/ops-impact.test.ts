import { describe, it, expect } from "vitest";
import {
  buildCaseImpact,
  deriveImpactTier,
  getFinancialExposureBand,
  getFinancialExposurePoints,
  getImpactRationale,
  getImpactTierRank,
  getImpactTone,
  getIncidentSeverityPoints,
  getSocialPressurePoints,
  sortByImpactThenSla,
  totalImpactPoints,
} from "@/lib/ops/impact";
import { getSlaPressure, OPS_REFERENCE_NOW } from "@/lib/ops/sla";
import { OPS_CASES } from "@/data/ops/ops-cases";
import type { OpsImpactTier } from "@/lib/ops/types";

describe("getFinancialExposureBand", () => {
  it("maps THB amounts to bands", () => {
    expect(getFinancialExposureBand(50_000)).toBe("Low");
    expect(getFinancialExposureBand(250_000)).toBe("Moderate");
    expect(getFinancialExposureBand(1_000_000)).toBe("High");
    expect(getFinancialExposureBand(5_000_000)).toBe("Severe");
  });
});

describe("impact points", () => {
  it("maps social pressure points", () => {
    expect(getSocialPressurePoints("None")).toBe(0);
    expect(getSocialPressurePoints("Emerging")).toBe(1);
    expect(getSocialPressurePoints("Elevated")).toBe(2);
    expect(getSocialPressurePoints("High")).toBe(3);
  });

  it("maps incident severity points", () => {
    expect(getIncidentSeverityPoints("None")).toBe(0);
    expect(getIncidentSeverityPoints("Linked")).toBe(2);
    expect(getIncidentSeverityPoints("Active incident")).toBe(3);
  });

  it("maps financial exposure points", () => {
    expect(getFinancialExposurePoints("Low")).toBe(0);
    expect(getFinancialExposurePoints("Moderate")).toBe(1);
    expect(getFinancialExposurePoints("High")).toBe(2);
    expect(getFinancialExposurePoints("Severe")).toBe(3);
  });
});

describe("deriveImpactTier", () => {
  it("derives Critical tier", () => {
    expect(
      deriveImpactTier({
        financialExposureBand: "Severe",
        socialPressure: "High",
        incidentSeverity: "None",
      }),
    ).toBe("Critical");

    expect(
      deriveImpactTier({
        financialExposureBand: "High",
        socialPressure: "None",
        incidentSeverity: "Active incident",
      }),
    ).toBe("Critical");

    expect(
      deriveImpactTier({
        financialExposureBand: "Low",
        socialPressure: "High",
        incidentSeverity: "Active incident",
      }),
    ).toBe("Critical");
  });

  it("derives High tier", () => {
    expect(
      deriveImpactTier({
        financialExposureBand: "Low",
        socialPressure: "None",
        incidentSeverity: "Active incident",
      }),
    ).toBe("High");

    expect(
      deriveImpactTier({
        financialExposureBand: "Severe",
        socialPressure: "None",
        incidentSeverity: "None",
      }),
    ).toBe("High");

    expect(
      deriveImpactTier({
        financialExposureBand: "High",
        socialPressure: "High",
        incidentSeverity: "None",
      }),
    ).toBe("High");
  });

  it("derives Moderate tier", () => {
    expect(
      deriveImpactTier({
        financialExposureBand: "Moderate",
        socialPressure: "None",
        incidentSeverity: "None",
      }),
    ).toBe("Moderate");

    expect(
      deriveImpactTier({
        financialExposureBand: "Low",
        socialPressure: "Emerging",
        incidentSeverity: "None",
      }),
    ).toBe("Moderate");

    expect(
      deriveImpactTier({
        financialExposureBand: "Low",
        socialPressure: "None",
        incidentSeverity: "Linked",
      }),
    ).toBe("Moderate");
  });

  it("derives Low tier", () => {
    expect(
      deriveImpactTier({
        financialExposureBand: "Low",
        socialPressure: "None",
        incidentSeverity: "None",
      }),
    ).toBe("Low");
  });

  it("ensures Active incident is at least High", () => {
    const tier = deriveImpactTier({
      financialExposureBand: "Low",
      socialPressure: "None",
      incidentSeverity: "Active incident",
    });
    expect(["High", "Critical"]).toContain(tier);
  });

  it("ensures Linked incident is at least Moderate", () => {
    const tier = deriveImpactTier({
      financialExposureBand: "Low",
      socialPressure: "None",
      incidentSeverity: "Linked",
    });
    expect(["Moderate", "High", "Critical"]).toContain(tier);
    expect(tier).not.toBe("Low");
  });
});

describe("getImpactTierRank", () => {
  it("orders Critical > High > Moderate > Low", () => {
    expect(getImpactTierRank("Critical")).toBeLessThan(getImpactTierRank("High"));
    expect(getImpactTierRank("High")).toBeLessThan(getImpactTierRank("Moderate"));
    expect(getImpactTierRank("Moderate")).toBeLessThan(getImpactTierRank("Low"));
  });
});

describe("getImpactTone", () => {
  it("returns a tone for every tier", () => {
    const tiers: OpsImpactTier[] = ["Critical", "High", "Moderate", "Low"];
    for (const tier of tiers) {
      expect(getImpactTone(tier)).toBeTruthy();
    }
  });
});

describe("sortByImpactThenSla", () => {
  it("ranks impact tier before SLA pressure", () => {
    const lowImpactNearBreach = OPS_CASES.find(
      (c) =>
        c.impact.impactTier === "Low" &&
        getSlaPressure(c, OPS_REFERENCE_NOW) === "Breached",
    );
    const criticalImpactOnTrack = OPS_CASES.find(
      (c) =>
        c.impact.impactTier === "Critical" &&
        getSlaPressure(c, OPS_REFERENCE_NOW) === "On track",
    );

    expect(lowImpactNearBreach).toBeDefined();
    expect(criticalImpactOnTrack).toBeDefined();

    const sorted = sortByImpactThenSla([lowImpactNearBreach!, criticalImpactOnTrack!]);
    expect(sorted[0].impact.impactTier).toBe("Critical");
    expect(sorted[1].impact.impactTier).toBe("Low");
  });
});

describe("getImpactRationale", () => {
  it("returns explainable rationale lines", () => {
    const impact = buildCaseImpact({
      financialExposureThb: 6_000_000,
      socialPressure: "High",
      incidentSeverity: "Active incident",
    });
    const rationale = getImpactRationale({
      financialExposureBand: impact.financialExposureBand,
      socialPressure: impact.socialPressure,
      incidentSeverity: impact.incidentSeverity,
      impactTier: impact.impactTier,
    });
    expect(rationale.length).toBeGreaterThan(0);
    expect(rationale.some((line) => line.includes("Critical") || line.includes("High"))).toBe(
      true,
    );
  });
});

describe("totalImpactPoints", () => {
  it("sums the three input dimensions", () => {
    expect(
      totalImpactPoints({
        financialExposureBand: "Severe",
        socialPressure: "High",
        incidentSeverity: "Active incident",
      }),
    ).toBe(9);
  });
});
