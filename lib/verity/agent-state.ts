import type {
  VerityAgentAuditEvent,
  VerityAgentStage,
  VerityHumanDecision,
  StageGateState,
  StageGateStatus,
} from "./agent-types";

let auditCounter = 0;

export function createAuditEvent(input: {
  stage: VerityAgentStage;
  inputSummary: string;
  agentOutputSummary: string;
  humanDecision?: VerityHumanDecision;
  humanEdited?: boolean;
  notes?: string;
  timestamp?: string;
}): VerityAgentAuditEvent {
  auditCounter += 1;
  return {
    id: `audit-${auditCounter}`,
    timestamp: input.timestamp ?? new Date().toISOString(),
    stage: input.stage,
    inputSummary: input.inputSummary,
    agentOutputSummary: input.agentOutputSummary,
    humanDecision: input.humanDecision,
    humanEdited: input.humanEdited,
    notes: input.notes,
  };
}

export function initialStageGates(): StageGateState[] {
  return [
    { stage: "intake", status: "active" },
    { stage: "investigate", status: "locked" },
    { stage: "decide", status: "locked" },
    { stage: "action", status: "locked" },
  ];
}

export function canUnlockStage(
  gates: StageGateState[],
  stage: VerityAgentStage
): boolean {
  const index = gates.findIndex((g) => g.stage === stage);
  if (index <= 0) return true;
  return gates[index - 1].status === "approved";
}

export function getStageStatus(
  gates: StageGateState[],
  stage: VerityAgentStage
): StageGateStatus {
  return gates.find((g) => g.stage === stage)?.status ?? "locked";
}

export function applyHumanDecision(
  gates: StageGateState[],
  stage: VerityAgentStage,
  decision: VerityHumanDecision
): StageGateState[] {
  const index = gates.findIndex((g) => g.stage === stage);
  if (index === -1) return gates;

  const next = gates.map((g) => ({ ...g }));

  if (decision === "approved" || decision === "edited") {
    next[index] = {
      ...next[index],
      status: "approved",
      humanDecision: decision,
      humanEdited: decision === "edited",
    };
    if (index + 1 < next.length) {
      next[index + 1] = { ...next[index + 1], status: "active" };
    }
  } else if (decision === "denied") {
    next[index] = {
      ...next[index],
      status: "denied",
      humanDecision: "denied",
      humanEdited: false,
    };
  }

  return next;
}

export function resetRunState(): {
  gates: StageGateState[];
  auditEvents: VerityAgentAuditEvent[];
} {
  auditCounter = 0;
  return { gates: initialStageGates(), auditEvents: [] };
}
