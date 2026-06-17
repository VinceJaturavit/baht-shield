import { describe, it, expect } from "vitest";
import {
  TRACE_WORKFLOW_STEPS,
  getLockedReason,
  isStepLocked,
  computeStepState,
  REVIEW_GATE_LOCKED_COPY,
} from "@/lib/trace/workflow-steps";

describe("trace workflow stepper", () => {
  it("workflow has 8 steps", () => {
    expect(TRACE_WORKFLOW_STEPS).toHaveLength(8);
  });

  it("steps 6–8 are locked before method save", () => {
    expect(isStepLocked("victim-attribution", false)).toBe(true);
    expect(isStepLocked("evidence-package", false)).toBe(true);
    expect(isStepLocked("senior-review", false)).toBe(true);
  });

  it("victim attribution locked copy says Pending method selection", () => {
    expect(getLockedReason("victim-attribution", false)).toBe("Pending method selection");
  });

  it("evidence package locked copy says Method selection required", () => {
    expect(getLockedReason("evidence-package", false)).toBe("Method selection required");
  });

  it("senior review locked copy says Method selection required", () => {
    expect(getLockedReason("senior-review", false)).toBe("Method selection required");
  });

  it("steps 6–8 unlock after method save", () => {
    expect(isStepLocked("victim-attribution", true)).toBe(false);
    expect(isStepLocked("evidence-package", true)).toBe(false);
    expect(isStepLocked("senior-review", true)).toBe(false);
  });

  it("senior review reflects approved state", () => {
    expect(computeStepState("senior-review", "senior-review", true, "approved")).toBe("complete");
  });

  it("senior review reflects rejected state", () => {
    expect(computeStepState("senior-review", "evidence-package", true, "rejected")).toBe("complete");
  });

  it("review gate locked copy matches spec", () => {
    expect(REVIEW_GATE_LOCKED_COPY).toBe(
      "Select and save a recovery method before senior review.",
    );
  });

  it("method decision is current when active before save", () => {
    expect(computeStepState("method-decision", "method-decision", false, "draft")).toBe("current");
  });
});
