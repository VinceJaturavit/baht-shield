import { describe, it, expect } from "vitest";
import {
  getEvidenceCategoryWeight,
  getConfidenceMultiplier,
  calculateEvidenceContribution,
  calculateRiskScore,
  getRiskBand,
  getRiskBandTone,
  RISK_RULE_SUMMARY,
} from "@/lib/verity/agent-risk";
import type { VerityEvidenceItem } from "@/lib/verity/agent-types";

const ALL_CATEGORIES: VerityEvidenceItem["category"][] = [
  "account_history",
  "transaction_graph",
  "device_ip_funding",
  "onchain_exposure",
  "prior_flags",
  "pattern_match",
];

function makeItem(
  overrides: Partial<VerityEvidenceItem> & {
    category: VerityEvidenceItem["category"];
  }
): VerityEvidenceItem {
  return {
    id: "ev-test",
    label: "Test item",
    finding: "Test finding",
    sourceRef: "seed:test",
    confidence: "High",
    ...overrides,
  };
}

describe("verity agent risk score", () => {
  it("category weights exist for all evidence categories", () => {
    for (const category of ALL_CATEGORIES) {
      expect(getEvidenceCategoryWeight(category)).toBeGreaterThan(0);
    }
    expect(getEvidenceCategoryWeight("pattern_match")).toBe(18);
    expect(getEvidenceCategoryWeight("onchain_exposure")).toBe(16);
    expect(getEvidenceCategoryWeight("account_history")).toBe(7);
  });

  it("confidence multipliers exist for Low/Medium/High", () => {
    expect(getConfidenceMultiplier("High")).toBe(1.0);
    expect(getConfidenceMultiplier("Medium")).toBe(0.7);
    expect(getConfidenceMultiplier("Low")).toBe(0.4);
  });

  it("risk score is deterministic", () => {
    const items = [
      makeItem({ id: "a", category: "pattern_match", confidence: "High" }),
      makeItem({ id: "b", category: "account_history", confidence: "Low" }),
    ];
    const a = calculateRiskScore(items);
    const b = calculateRiskScore(items);
    expect(a).toEqual(b);
  });

  it("risk score is capped at 100", () => {
    const items = ALL_CATEGORIES.map((category, i) =>
      makeItem({
        id: `ev-${i}`,
        category,
        confidence: "High",
      })
    );
    const result = calculateRiskScore(items);
    expect(result.score).toBeLessThanOrEqual(100);
    // All high-confidence max weights sum to 77, under 100
    expect(result.score).toBe(77);
  });

  it("Critical band threshold works", () => {
    expect(getRiskBand(80)).toBe("Critical");
    expect(getRiskBand(100)).toBe("Critical");
  });

  it("High band threshold works", () => {
    expect(getRiskBand(60)).toBe("High");
    expect(getRiskBand(79)).toBe("High");
  });

  it("Medium band threshold works", () => {
    expect(getRiskBand(35)).toBe("Medium");
    expect(getRiskBand(59)).toBe("Medium");
  });

  it("Low band threshold works", () => {
    expect(getRiskBand(0)).toBe("Low");
    expect(getRiskBand(34)).toBe("Low");
  });

  it("band tone exists for every band", () => {
    expect(getRiskBandTone("Critical")).toBe("risk");
    expect(getRiskBandTone("High")).toBe("watch");
    expect(getRiskBandTone("Medium")).toBe("neutral");
    expect(getRiskBandTone("Low")).toBe("good");
  });

  it("pattern_match contributes more than account_history at same confidence", () => {
    const pattern = calculateEvidenceContribution(
      makeItem({ category: "pattern_match", confidence: "High" })
    );
    const account = calculateEvidenceContribution(
      makeItem({ category: "account_history", confidence: "High" })
    );
    expect(pattern.contribution).toBeGreaterThan(account.contribution);
  });

  it("onchain_exposure contributes more than account_history at same confidence", () => {
    const onchain = calculateEvidenceContribution(
      makeItem({ category: "onchain_exposure", confidence: "High" })
    );
    const account = calculateEvidenceContribution(
      makeItem({ category: "account_history", confidence: "High" })
    );
    expect(onchain.contribution).toBeGreaterThan(account.contribution);
  });

  it("breakdown includes evidence id, category, confidence, weight, multiplier, contribution", () => {
    const item = makeItem({
      id: "ev-breakdown",
      category: "transaction_graph",
      confidence: "Medium",
    });
    const result = calculateRiskScore([item]);
    const c = result.contributions[0];
    expect(c.evidenceId).toBe("ev-breakdown");
    expect(c.category).toBe("transaction_graph");
    expect(c.confidence).toBe("Medium");
    expect(c.categoryWeight).toBe(14);
    expect(c.confidenceMultiplier).toBe(0.7);
    expect(c.contribution).toBeCloseTo(9.8, 5);
    expect(c.rationale).toContain("transaction_graph");
  });

  it("rule summary is transparent and non-ML", () => {
    const result = calculateRiskScore([makeItem({ category: "prior_flags" })]);
    expect(result.ruleSummary).toBe(RISK_RULE_SUMMARY);
    expect(result.ruleSummary.toLowerCase()).toContain("transparent");
    expect(result.ruleSummary).toContain("not an ML model");
  });

  it("risk breakdown contributions can be sorted descending", () => {
    const items = [
      makeItem({ id: "ev-low", category: "account_history", confidence: "Low" }),
      makeItem({ id: "ev-high", category: "pattern_match", confidence: "High" }),
    ];
    const result = calculateRiskScore(items);
    const sorted = [...result.contributions].sort(
      (a, b) => b.contribution - a.contribution
    );
    expect(sorted[0]?.evidenceId).toBe("ev-high");
    expect(sorted[0]!.contribution).toBeGreaterThan(sorted[1]!.contribution);
  });

  it("contribution includes category weight, confidence multiplier, and points", () => {
    const item = makeItem({
      id: "ev-fields",
      category: "device_ip_funding",
      confidence: "Medium",
    });
    const c = calculateEvidenceContribution(item);
    expect(c.categoryWeight).toBe(12);
    expect(c.confidenceMultiplier).toBe(0.7);
    expect(c.contribution).toBeCloseTo(8.4, 5);
  });
});
