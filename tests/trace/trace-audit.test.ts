import { describe, it, expect, beforeEach } from "vitest";
import {
  createAiAssistEvent,
  createMethodSelectedEvent,
  createReviewApprovedEvent,
  createReviewRejectedEvent,
  validateMethodSave,
  validateReviewReject,
  validateReviewApprove,
  resetAuditCounter,
} from "@/lib/trace/audit";

beforeEach(() => {
  resetAuditCounter();
});

describe("method selection audit", () => {
  it("rationale required before save", () => {
    expect(validateMethodSave("FIFO", "").ok).toBe(false);
    expect(validateMethodSave("FIFO", "  ").ok).toBe(false);
    expect(validateMethodSave(null, "reason").ok).toBe(false);
    expect(validateMethodSave("FIFO", "Valid rationale").ok).toBe(true);
  });

  it("saving method selection creates audit events", () => {
    const events = createMethodSelectedEvent("FIFO", "Chronology-first theory.");
    expect(events.length).toBeGreaterThanOrEqual(3);
    expect(events.some((e) => e.action === "Method selected")).toBe(true);
    expect(events.some((e) => e.action === "Method rationale saved")).toBe(true);
    expect(events.some((e) => e.action.includes("Attribution table"))).toBe(true);
    expect(events.every((e) => e.actor === "Investigator")).toBe(true);
  });
});

describe("review audit", () => {
  it("approve creates reviewer audit event", () => {
    const event = createReviewApprovedEvent("Looks defensible.");
    expect(event.actor).toBe("Senior reviewer");
    expect(event.action).toBe("Review approved");
  });

  it("reject creates reviewer audit event", () => {
    const event = createReviewRejectedEvent("Method not justified.");
    expect(event.actor).toBe("Senior reviewer");
    expect(event.action).toBe("Review rejected");
  });

  it("reject requires reviewer note", () => {
    expect(validateReviewReject("").ok).toBe(false);
    expect(validateReviewReject("Needs rework").ok).toBe(true);
  });

  it("approve requires method and rationale first", () => {
    expect(validateReviewApprove(null, "").ok).toBe(false);
    expect(validateReviewApprove("FIFO", "Rationale here").ok).toBe(true);
  });
});

describe("AI assist audit", () => {
  it("AI assist event is labelled decision-support", () => {
    const event = createAiAssistEvent("Summary text.");
    expect(event.actor).toBe("AI assist");
    expect(event.action).toMatch(/decision-support/i);
  });
});
