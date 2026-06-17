"use client";

import type { TraceReviewStatus } from "@/lib/trace/types";
import {
  TRACE_WORKFLOW_STEPS,
  type TraceWorkflowStepId,
  type TraceWorkflowStepState,
  getLockedReason,
  getStepStates,
  isStepLocked,
} from "@/lib/trace/workflow-steps";

interface TraceWorkflowStepperProps {
  activeStep: TraceWorkflowStepId;
  methodSaved: boolean;
  reviewStatus: TraceReviewStatus;
  onStepChange: (step: TraceWorkflowStepId) => void;
}

const STATE_LABELS: Record<TraceWorkflowStepState, string> = {
  complete: "Complete",
  current: "Current",
  pending: "Pending",
  locked: "Locked",
};

function StepStateBadge({ state }: { state: TraceWorkflowStepState }) {
  return (
    <span
      className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${
        state === "complete"
          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
          : state === "current"
            ? "bg-trace-primary/10 text-trace-primary border border-trace-primary/30"
            : state === "locked"
              ? "bg-trace-muted text-trace-secondary border border-trace-border"
              : "bg-trace-surface text-trace-secondary border border-trace-border"
      }`}
    >
      {STATE_LABELS[state]}
    </span>
  );
}

export function TraceWorkflowStepper({
  activeStep,
  methodSaved,
  reviewStatus,
  onStepChange,
}: TraceWorkflowStepperProps) {
  const stepStates = getStepStates(activeStep, methodSaved, reviewStatus);

  return (
    <nav aria-label="Recovery workflow steps" className="space-y-1">
      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {TRACE_WORKFLOW_STEPS.map((step) => {
          const state = stepStates[step.id];
          const locked = isStepLocked(step.id, methodSaved);
          const lockedReason = getLockedReason(step.id, methodSaved);
          const isActive = activeStep === step.id;

          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => !locked && onStepChange(step.id)}
                disabled={locked}
                aria-current={isActive ? "step" : undefined}
                aria-disabled={locked}
                className={`w-full text-left rounded border px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary focus-visible:ring-offset-2 focus-visible:ring-offset-trace-page ${
                  locked
                    ? "border-trace-border bg-trace-muted opacity-70 cursor-not-allowed"
                    : isActive
                      ? "border-trace-primary bg-trace-card ring-1 ring-trace-primary/20"
                      : "border-trace-border bg-trace-card hover:border-trace-primary/40 hover:bg-trace-surface"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono text-trace-secondary">
                    Step {step.stepNumber}
                  </span>
                  <StepStateBadge state={state} />
                </div>
                <span className="block text-xs font-semibold text-trace-heading leading-snug">
                  {step.label}
                </span>
                {locked && lockedReason && (
                  <span className="block mt-1 text-[10px] text-trace-secondary">{lockedReason}</span>
                )}
                {!locked && (
                  <span className="block mt-1 text-[10px] text-trace-secondary leading-snug">
                    {step.mainAction}
                  </span>
                )}
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-trace-secondary">
                  <span>AI assist: {step.aiAssist ? "Yes" : "No"}</span>
                  <span>Human approval: {step.humanApproval ? "Yes" : "No"}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { TRACE_WORKFLOW_STEPS };
