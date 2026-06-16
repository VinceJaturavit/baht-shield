"use client";

import type { StageGateState, VerityAgentStage } from "@/lib/verity/agent-types";
import { AGENT_STAGES } from "@/lib/verity/agent-types";

interface VerityAgentStepperProps {
  gates: StageGateState[];
  activeStage: VerityAgentStage;
}

function gateLabel(status: StageGateState["status"]): string {
  switch (status) {
    case "approved":
      return "Approved";
    case "denied":
      return "Denied";
    case "active":
      return "In review";
    default:
      return "Locked";
  }
}

export function VerityAgentStepper({ gates, activeStage }: VerityAgentStepperProps) {
  return (
    <nav aria-label="Investigation stages" className="border-b border-signal-border pb-4">
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
        {AGENT_STAGES.map((stage, index) => {
          const gate = gates.find((g) => g.stage === stage.id);
          const status = gate?.status ?? "locked";
          const isActive = activeStage === stage.id;
          const isApproved = status === "approved";
          const isDenied = status === "denied";
          const isLocked = status === "locked";

          return (
            <li key={stage.id} className="flex flex-1 items-center min-w-0">
              <div
                className={`flex w-full min-w-0 flex-col rounded-signalSm border px-3 py-2.5 ${
                  isActive
                    ? "border-signal-indigo bg-signal-indigoSubtle"
                    : isApproved
                      ? "border-signal-border bg-signal-surface"
                      : isDenied
                        ? "border-signal-amberBorder bg-signal-amberSubtle"
                        : "border-signal-borderSubtle bg-signal-surfaceSubtle opacity-70"
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="text-xs font-medium text-signal-secondary">
                  Stage {index + 1}
                </span>
                <span className="truncate text-sm font-semibold text-signal-ink">
                  {stage.label}
                </span>
                <span
                  className={`mt-0.5 text-xs ${
                    isDenied
                      ? "text-signal-amber"
                      : isApproved
                        ? "text-signal-indigo"
                        : "text-signal-slate"
                  }`}
                >
                  {gateLabel(status)}
                  {isLocked ? " — awaiting prior approval" : ""}
                </span>
              </div>
              {index < AGENT_STAGES.length - 1 && (
                <span
                  className="mx-1 hidden shrink-0 text-signal-borderStrong sm:inline"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
