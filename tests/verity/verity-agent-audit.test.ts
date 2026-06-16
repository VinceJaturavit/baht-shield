import { describe, it, expect } from "vitest";
import {
  createAuditEvent,
  initialStageGates,
  applyHumanDecision,
  canUnlockStage,
  getStageStatus,
} from "@/lib/verity/agent-state";

describe("verity agent audit and gates", () => {
  it("approve creates audit event", () => {
    const event = createAuditEvent({
      stage: "intake",
      inputSummary: "test input",
      agentOutputSummary: "test output",
      humanDecision: "approved",
    });
    expect(event.humanDecision).toBe("approved");
    expect(event.stage).toBe("intake");
  });

  it("deny creates audit event", () => {
    const event = createAuditEvent({
      stage: "investigate",
      inputSummary: "test input",
      agentOutputSummary: "test output",
      humanDecision: "denied",
    });
    expect(event.humanDecision).toBe("denied");
  });

  it("edit creates audit event with edited flag", () => {
    const event = createAuditEvent({
      stage: "decide",
      inputSummary: "test input",
      agentOutputSummary: "edited output",
      humanDecision: "edited",
      humanEdited: true,
    });
    expect(event.humanDecision).toBe("edited");
    expect(event.humanEdited).toBe(true);
  });

  it("stage cannot unlock without approval", () => {
    const gates = initialStageGates();
    expect(canUnlockStage(gates, "intake")).toBe(true);
    expect(canUnlockStage(gates, "investigate")).toBe(false);
    expect(getStageStatus(gates, "investigate")).toBe("locked");
  });

  it("approve unlocks next stage", () => {
    const gates = initialStageGates();
    const after = applyHumanDecision(gates, "intake", "approved");
    expect(getStageStatus(after, "intake")).toBe("approved");
    expect(getStageStatus(after, "investigate")).toBe("active");
    expect(canUnlockStage(after, "investigate")).toBe(true);
  });

  it("deny does not unlock next stage", () => {
    const gates = initialStageGates();
    const after = applyHumanDecision(gates, "intake", "denied");
    expect(getStageStatus(after, "intake")).toBe("denied");
    expect(getStageStatus(after, "investigate")).toBe("locked");
  });

  it("audit event includes timestamp", () => {
    const event = createAuditEvent({
      stage: "action",
      inputSummary: "input",
      agentOutputSummary: "output",
      timestamp: "2026-06-16T12:00:00.000Z",
    });
    expect(event.timestamp).toBe("2026-06-16T12:00:00.000Z");
  });

  it("audit event includes stage and human decision", () => {
    const event = createAuditEvent({
      stage: "decide",
      inputSummary: "gate on decide",
      agentOutputSummary: "draft judgment",
      humanDecision: "approved",
    });
    expect(event.stage).toBe("decide");
    expect(event.humanDecision).toBe("approved");
  });
});
