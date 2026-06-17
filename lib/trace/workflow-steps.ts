import type { TraceReviewStatus } from "./types";

export type TraceWorkflowStepId =
  | "intake"
  | "vendor-evidence"
  | "frozen-funds"
  | "co-mingling"
  | "method-decision"
  | "victim-attribution"
  | "evidence-package"
  | "senior-review";

export type TraceWorkflowStepState = "complete" | "current" | "pending" | "locked";

export interface TraceWorkflowStepMeta {
  id: TraceWorkflowStepId;
  stepNumber: number;
  label: string;
  mainAction: string;
  aiAssist: boolean;
  humanApproval: boolean;
  lockedReason?: string;
}

export const TRACE_WORKFLOW_STEPS: TraceWorkflowStepMeta[] = [
  {
    id: "intake",
    stepNumber: 1,
    label: "Intake",
    mainAction: "Understand the recovery case.",
    aiAssist: true,
    humanApproval: false,
  },
  {
    id: "vendor-evidence",
    stepNumber: 2,
    label: "Imported tracing evidence",
    mainAction: "Review vendor-tracing evidence brought into Trace.",
    aiAssist: true,
    humanApproval: false,
  },
  {
    id: "frozen-funds",
    stepNumber: 3,
    label: "Frozen funds",
    mainAction: "Start from the frozen endpoint and recoverable pool.",
    aiAssist: true,
    humanApproval: false,
  },
  {
    id: "co-mingling",
    stepNumber: 4,
    label: "Co-mingling",
    mainAction: "Understand why method choice changes attribution.",
    aiAssist: true,
    humanApproval: false,
  },
  {
    id: "method-decision",
    stepNumber: 5,
    label: "Method decision",
    mainAction: "Select a defensible recovery method and rationale.",
    aiAssist: true,
    humanApproval: true,
  },
  {
    id: "victim-attribution",
    stepNumber: 6,
    label: "Victim attribution",
    mainAction: "Apply the selected method to claimant rows.",
    aiAssist: true,
    humanApproval: false,
    lockedReason: "Pending method selection",
  },
  {
    id: "evidence-package",
    stepNumber: 7,
    label: "Evidence package",
    mainAction: "Assemble a recovery memo for review.",
    aiAssist: true,
    humanApproval: false,
    lockedReason: "Method selection required",
  },
  {
    id: "senior-review",
    stepNumber: 8,
    label: "Senior review",
    mainAction: "Approve or reject the recovery package.",
    aiAssist: false,
    humanApproval: true,
    lockedReason: "Method selection required",
  },
];

const STEP_ORDER: TraceWorkflowStepId[] = TRACE_WORKFLOW_STEPS.map((s) => s.id);

export function getLockedReason(stepId: TraceWorkflowStepId, methodSaved: boolean): string | undefined {
  if (methodSaved) return undefined;
  const meta = TRACE_WORKFLOW_STEPS.find((s) => s.id === stepId);
  if (!meta?.lockedReason) return undefined;
  if (stepId === "victim-attribution" || stepId === "evidence-package" || stepId === "senior-review") {
    return meta.lockedReason;
  }
  return undefined;
}

export function isStepLocked(stepId: TraceWorkflowStepId, methodSaved: boolean): boolean {
  if (methodSaved) return false;
  return stepId === "victim-attribution" || stepId === "evidence-package" || stepId === "senior-review";
}

export function computeStepState(
  stepId: TraceWorkflowStepId,
  activeStep: TraceWorkflowStepId,
  methodSaved: boolean,
  reviewStatus: TraceReviewStatus,
): TraceWorkflowStepState {
  if (isStepLocked(stepId, methodSaved)) {
    return "locked";
  }

  if (stepId === "senior-review" && (reviewStatus === "approved" || reviewStatus === "rejected")) {
    return "complete";
  }

  const activeIndex = STEP_ORDER.indexOf(activeStep);
  const stepIndex = STEP_ORDER.indexOf(stepId);

  if (stepId === activeStep) {
    return "current";
  }

  if (methodSaved && stepIndex < STEP_ORDER.indexOf("victim-attribution")) {
    return "complete";
  }

  if (!methodSaved && stepIndex < STEP_ORDER.indexOf("method-decision")) {
    if (stepIndex < activeIndex) {
      return "complete";
    }
  }

  if (stepIndex < activeIndex) {
    return "complete";
  }

  return "pending";
}

export function getStepStates(
  activeStep: TraceWorkflowStepId,
  methodSaved: boolean,
  reviewStatus: TraceReviewStatus,
): Record<TraceWorkflowStepId, TraceWorkflowStepState> {
  return STEP_ORDER.reduce(
    (acc, id) => {
      acc[id] = computeStepState(id, activeStep, methodSaved, reviewStatus);
      return acc;
    },
    {} as Record<TraceWorkflowStepId, TraceWorkflowStepState>,
  );
}

export const REVIEW_GATE_LOCKED_COPY =
  "Select and save a recovery method before senior review.";
