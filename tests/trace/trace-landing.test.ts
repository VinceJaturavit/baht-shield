import { describe, it, expect } from "vitest";
import { traceCases } from "@/data/trace/trace-cases";
import {
  tracePreviewCases,
  TRACE_LANDING_THESIS,
  TRACE_THREE_STEP_EXPLAINER,
} from "@/data/trace/trace-preview-cases";

describe("trace landing preview cases", () => {
  it("TRACE-CASE-001 is functional", () => {
    const anchor = traceCases.find((c) => c.caseId === "TRACE-CASE-001");
    expect(anchor).toBeDefined();
    expect(anchor?.caseId).toBe("TRACE-CASE-001");
  });

  it("TRACE-CASE-002 is locked preview", () => {
    const preview = tracePreviewCases.find((c) => c.caseId === "TRACE-CASE-002");
    expect(preview).toBeDefined();
    expect(preview?.locked).toBe(true);
    expect(preview?.status).toMatch(/preview/i);
  });

  it("TRACE-CASE-003 is locked preview", () => {
    const preview = tracePreviewCases.find((c) => c.caseId === "TRACE-CASE-003");
    expect(preview).toBeDefined();
    expect(preview?.locked).toBe(true);
    expect(preview?.status).toMatch(/preview/i);
  });

  it("preview cards do not have active case route CTA", () => {
    for (const preview of tracePreviewCases) {
      expect(preview.locked).toBe(true);
    }
  });

  it("three-step explainer contains required steps", () => {
    const titles = TRACE_THREE_STEP_EXPLAINER.map((s) => s.title);
    expect(titles).toContain("Vendor trace comes in");
    expect(titles).toContain("Recovery method is selected");
    expect(titles).toContain("Evidence package goes to review");
  });

  it("landing thesis is present", () => {
    expect(TRACE_LANDING_THESIS).toMatch(/human-reviewed recovery workflow/i);
  });
});
