import { describe, it, expect } from "vitest";
import { OPS_REVIEWS_COPILOT_RUBRIC } from "@/lib/ops/reviews-copilot-rubric";
import {
  generateMockCopilotReview,
  getDispositionForReviewPack,
} from "@/lib/ops/reviews-copilot";
import { getReviewPackByAnalystId } from "@/lib/ops/reviews";

describe("OPS_REVIEWS_COPILOT_RUBRIC", () => {
  it("contains required key phrases verbatim", () => {
    expect(OPS_REVIEWS_COPILOT_RUBRIC).toContain("never merge into one score");
    expect(OPS_REVIEWS_COPILOT_RUBRIC).toContain("Never reward or penalise");
    expect(OPS_REVIEWS_COPILOT_RUBRIC).toContain("role peers");
    expect(OPS_REVIEWS_COPILOT_RUBRIC).toContain("decision-support draft");
  });
});

describe("generateMockCopilotReview", () => {
  const pack = getReviewPackByAnalystId("FA-001")!;

  it("is deterministic for the same analyst", () => {
    const first = generateMockCopilotReview(pack);
    const second = generateMockCopilotReview(pack);
    expect(first).toEqual(second);
  });

  it("outputs five-line scorecard fields", () => {
    const review = generateMockCopilotReview(pack);
    expect(review.scorecard.workloadContext).toBeTruthy();
    expect(review.scorecard.throughput).toBeTruthy();
    expect(review.scorecard.quality).toBeTruthy();
    expect(review.scorecard.behaviour).toBeTruthy();
    expect(review.scorecard.reliability).toBeTruthy();
  });

  it("scorecard has exactly five signal lines", () => {
    const review = generateMockCopilotReview(pack);
    const lines = Object.values(review.scorecard);
    expect(lines).toHaveLength(5);
    expect(lines.every((line) => line.length > 0)).toBe(true);
  });

  it("has analyst-facing summary with required fields", () => {
    const review = generateMockCopilotReview(pack);
    expect(review.analystFacingSummary.whatWentWell.length).toBeGreaterThan(0);
    expect(review.analystFacingSummary.whatToImprove.length).toBeGreaterThan(0);
    expect(review.analystFacingSummary.workloadReassurance).toBeTruthy();
    expect(review.analystFacingSummary.suggestedFocusActions.length).toBeGreaterThanOrEqual(1);
    expect(review.analystFacingSummary.suggestedFocusActions.length).toBeLessThanOrEqual(2);
  });

  it("has manager decision summary with required fields", () => {
    const review = generateMockCopilotReview(pack);
    const summary = review.managerDecisionSummary;
    expect([
      "Strong — recognise",
      "Solid — maintain",
      "Developing — coach",
      "Watch — review",
    ]).toContain(summary.disposition);
    expect(summary.dispositionReason).toBeTruthy();
    expect(summary.strongestEvidence.length).toBeGreaterThan(0);
    expect(summary.mainRiskOrCoachingPoint).toBeTruthy();
    expect(summary.managerActions.length).toBeGreaterThanOrEqual(1);
    expect(summary.managerActions.length).toBeLessThanOrEqual(2);
    expect(summary.confidenceAndCaveats.length).toBeGreaterThan(0);
    expect(summary.humanInLoopClosingLine).toMatch(/decision-support|manager.*final call/i);
  });

  it("does not include a single numeric overall score", () => {
    const review = generateMockCopilotReview(pack);
    const serialized = JSON.stringify(review);
    expect(serialized).not.toMatch(/overallScore|combinedScore|totalScore/i);
  });

  it("flags low QA sample with provisional language where applicable", () => {
    for (const id of ["FA-001", "FA-005", "JA-003"]) {
      const p = getReviewPackByAnalystId(id);
      if (!p || !p.quality.lowSample) continue;
      const review = generateMockCopilotReview(p);
      expect(review.scorecard.quality).toMatch(/provisional|n<5/i);
      const caveatText = review.managerDecisionSummary.confidenceAndCaveats.join(" ");
      expect(caveatText).toMatch(/provisional|n=/i);
    }
  });

  it("does not penalise hard workload in scorecard or analyst summary", () => {
    const overloaded = getReviewPackByAnalystId("FA-001");
    if (overloaded?.workload.fairnessTag === "Over-loaded") {
      const review = generateMockCopilotReview(overloaded);
      expect(review.scorecard.workloadContext).toMatch(/not an analyst penalty|distribution|equity|rostering/i);
      expect(review.scorecard.workloadContext).not.toMatch(/poor|underperform|penal/i);
      expect(review.analystFacingSummary.workloadReassurance).toMatch(
        /rostering|should not be counted against you|manager/i,
      );
      const managerCaveats = review.managerDecisionSummary.confidenceAndCaveats.join(" ");
      expect(managerCaveats).toMatch(/manager-controlled|do not downgrade/i);
    }
  });

  it("marks generatedBy as mock deterministic copilot", () => {
    const review = generateMockCopilotReview(pack);
    expect(review.generatedBy).toBe("Mock deterministic copilot");
  });

  it("analyst-facing summary is written to the analyst", () => {
    const review = generateMockCopilotReview(pack);
    const combined = [
      ...review.analystFacingSummary.whatWentWell,
      review.analystFacingSummary.workloadReassurance,
      ...review.analystFacingSummary.suggestedFocusActions,
    ].join(" ");
    expect(combined).toMatch(/\bYou\b|\byour\b/i);
  });
});

describe("getDispositionForReviewPack", () => {
  it("returns valid disposition for all analysts", () => {
    const valid = [
      "Strong — recognise",
      "Solid — maintain",
      "Developing — coach",
      "Watch — review",
    ];
    for (const id of ["FA-001", "FA-005", "JA-001", "JA-006"]) {
      const pack = getReviewPackByAnalystId(id)!;
      expect(valid).toContain(getDispositionForReviewPack(pack));
    }
  });
});
