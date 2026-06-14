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

  it("outputs disposition as label not number", () => {
    const review = generateMockCopilotReview(pack);
    expect([
      "Strong — recognise",
      "Solid — maintain",
      "Developing — coach",
      "Watch — review",
    ]).toContain(review.disposition);
    expect(review.dispositionReason).toBeTruthy();
  });

  it("outputs 1–2 manager actions", () => {
    const review = generateMockCopilotReview(pack);
    expect(review.managerActions.length).toBeGreaterThanOrEqual(1);
    expect(review.managerActions.length).toBeLessThanOrEqual(2);
  });

  it("closing line includes manager decision framing", () => {
    const review = generateMockCopilotReview(pack);
    expect(review.closingLine).toMatch(/decision-support|manager.*final call/i);
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
    }
  });

  it("does not penalise hard workload in scorecard", () => {
    const overloaded = getReviewPackByAnalystId("FA-001");
    if (overloaded?.workload.fairnessTag === "Over-loaded") {
      const review = generateMockCopilotReview(overloaded);
      expect(review.scorecard.workloadContext).toMatch(/not an analyst penalty|distribution|equity/i);
      expect(review.scorecard.workloadContext).not.toMatch(/poor|underperform|penal/i);
    }
  });

  it("marks generatedBy as mock deterministic copilot", () => {
    const review = generateMockCopilotReview(pack);
    expect(review.generatedBy).toBe("Mock deterministic copilot");
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
