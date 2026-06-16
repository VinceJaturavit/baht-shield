"use client";

import type {
  VerityAgentScenario,
  VerityAgentStage,
  VerityDecisionDraft,
  VerityEvidencePack,
  StageGateState,
} from "@/lib/verity/agent-types";
import { AGENT_STAGES } from "@/lib/verity/agent-types";
import { SCENARIO_COLORS } from "@/lib/scenario-utils";
import { getRiskBandClasses } from "@/lib/verity/agent-risk";
import { VerityAgentConfidenceChip } from "./VerityAgentConfidenceChip";

interface VerityAgentCaseDashboardHeaderProps {
  caseId: string;
  scenario: VerityAgentScenario;
  activeStage: VerityAgentStage;
  gates: StageGateState[];
  evidence?: VerityEvidencePack;
  decision?: VerityDecisionDraft;
}

function getCurrentStageLabel(
  activeStage: VerityAgentStage,
  gates: StageGateState[]
): string {
  const allApproved = gates.every((g) => g.status === "approved");
  if (allApproved) return "Complete";
  const stage = AGENT_STAGES.find((s) => s.id === activeStage);
  return stage?.label ?? activeStage;
}

export function VerityAgentCaseDashboardHeader({
  caseId,
  scenario,
  activeStage,
  gates,
  evidence,
  decision,
}: VerityAgentCaseDashboardHeaderProps) {
  const stageLabel = getCurrentStageLabel(activeStage, gates);
  const riskScore = evidence?.riskScore;

  return (
    <section
      aria-label="Case dashboard"
      className="rounded-signal border border-signal-border bg-signal-surface px-5 py-4 shadow-signalSubtle"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-signal-secondary">
              Case
            </span>
            <span className="font-mono text-sm font-semibold text-signal-indigo">
              {caseId}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SCENARIO_COLORS[scenario]}`}
            >
              {scenario}
            </span>
          </div>
          <p className="text-sm text-signal-slate">
            <span className="font-medium text-signal-body">Current stage: </span>
            {stageLabel}
          </p>
          <p className="text-sm text-signal-slate">
            <span className="font-medium text-signal-body">Recommendation: </span>
            {decision ? (
              <span className="inline-flex flex-wrap items-center gap-2">
                {decision.recommendation}
                <VerityAgentConfidenceChip confidence={decision.confidence} />
              </span>
            ) : (
              <span className="text-signal-secondary">Recommendation pending</span>
            )}
          </p>
        </div>

        {riskScore && (
          <div className="shrink-0 text-left lg:text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-signal-secondary">
              Risk score
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2 lg:justify-end">
              <span className="text-signal-figure tabular-nums text-signal-ink">
                {riskScore.score}
              </span>
              <span className="text-sm text-signal-secondary">/ 100</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRiskBandClasses(riskScore.band)}`}
              >
                {riskScore.band}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
