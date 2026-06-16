"use client";

import type {
  VerityActionPlan,
  VerityDecisionDraft,
  VerityEvidencePack,
  VerityHumanDecision,
  VerityIntakeOutput,
  StageGateState,
  VerityAgentStage,
} from "@/lib/verity/agent-types";
import {
  getIntakeHeadline,
  getInvestigateHeadline,
  getDecideHeadline,
  getActionHeadline,
} from "@/lib/verity/agent-headlines";
import { VerityAgentHumanGate } from "./VerityAgentHumanGate";
import { VerityAgentEvidencePack } from "./VerityAgentEvidencePack";
import { VerityAgentDecisionDraft } from "./VerityAgentDecisionDraft";
import { VerityAgentActionPlan } from "./VerityAgentActionPlan";
import { VerityAgentDisclosureSection } from "./VerityAgentDisclosureSection";
import { SCENARIO_COLORS } from "@/lib/scenario-utils";

interface StageOutputs {
  intake?: VerityIntakeOutput;
  intakeEditedSummary?: string;
  evidence?: VerityEvidencePack;
  evidenceEditedSummary?: string;
  decision?: VerityDecisionDraft;
  decisionEditedStatement?: string;
  action?: VerityActionPlan;
}

interface VerityAgentStagePanelProps {
  activeStage: VerityAgentStage;
  gates: StageGateState[];
  outputs: StageOutputs;
  onGateAction: (
    stage: VerityAgentStage,
    decision: VerityHumanDecision,
    editedContent?: string
  ) => void;
}

function getGate(stage: VerityAgentStage, gates: StageGateState[]) {
  return gates.find((g) => g.stage === stage);
}

function StageHeadline({ children }: { children: string }) {
  return (
    <p className="mt-2 text-sm font-medium text-signal-ink">{children}</p>
  );
}

export function VerityAgentStagePanel({
  activeStage,
  gates,
  outputs,
  onGateAction,
}: VerityAgentStagePanelProps) {
  const gate = getGate(activeStage, gates);
  const canAct = gate?.status === "active" || gate?.status === "denied";

  if (gate?.status === "locked") {
    return (
      <div className="rounded-signal border border-signal-border bg-signal-surfaceSubtle p-6 text-sm text-signal-slate">
        This stage is locked. Approve the prior stage to continue.
      </div>
    );
  }

  return (
    <div className="rounded-signal border border-signal-border bg-signal-surface p-6 shadow-signalSubtle">
      {activeStage === "intake" && outputs.intake && (
        <>
          <h2 className="text-lg font-semibold text-signal-ink">
            Stage 1 — Intake &amp; scoping
          </h2>
          <StageHeadline>{getIntakeHeadline(outputs.intake)}</StageHeadline>

          <VerityAgentDisclosureSection title="Intake details" defaultOpen>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-medium text-signal-body">Selected case</dt>
                <dd className="mt-0.5 font-mono text-signal-indigo">
                  {outputs.intake.caseId}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-signal-body">Scenario</dt>
                <dd className="mt-0.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SCENARIO_COLORS[outputs.intake.scenario]}`}
                  >
                    {outputs.intake.scenario}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-signal-body">Trigger</dt>
                <dd className="mt-0.5 text-signal-slate">{outputs.intake.trigger}</dd>
              </div>
              <div>
                <dt className="font-medium text-signal-body">Initial risk signals</dt>
                <dd className="mt-0.5">
                  <ul className="list-disc pl-5 text-signal-slate">
                    {outputs.intake.initialRiskSignals.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-signal-body">Case summary</dt>
                <dd className="mt-0.5 text-signal-slate">
                  {outputs.intakeEditedSummary ?? outputs.intake.caseSummary}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-signal-body">Proposed scope</dt>
                <dd className="mt-0.5">
                  <ul className="list-disc pl-5 text-signal-slate">
                    {outputs.intake.proposedScope.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-signal-body">Why these checks</dt>
                <dd className="mt-0.5 text-signal-slate">
                  {outputs.intake.scopeRationale}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-signal-body">Stage limitations</dt>
                <dd className="mt-0.5 text-signal-slate">
                  {outputs.intake.stageLimitations}
                </dd>
              </div>
            </dl>
          </VerityAgentDisclosureSection>

          <VerityAgentHumanGate
            stageLabel="Intake & scoping"
            canAct={canAct}
            currentDecision={gate?.humanDecision}
            humanEdited={gate?.humanEdited}
            editableContent={
              outputs.intakeEditedSummary ?? outputs.intake.caseSummary
            }
            onApprove={() => onGateAction("intake", "approved")}
            onDeny={() => onGateAction("intake", "denied")}
            onSaveEdit={(edited) => onGateAction("intake", "edited", edited)}
          />
        </>
      )}

      {activeStage === "investigate" && outputs.evidence && (
        <>
          <h2 className="text-lg font-semibold text-signal-ink">
            Stage 2 — Investigate
          </h2>
          <StageHeadline>{getInvestigateHeadline(outputs.evidence)}</StageHeadline>

          <div className="mt-4">
            <VerityAgentEvidencePack
              pack={outputs.evidence}
              displaySummary={
                outputs.evidenceEditedSummary ?? outputs.evidence.summary
              }
            />
          </div>
          <VerityAgentHumanGate
            stageLabel="Investigate"
            canAct={canAct}
            currentDecision={gate?.humanDecision}
            humanEdited={gate?.humanEdited}
            editableContent={
              outputs.evidenceEditedSummary ?? outputs.evidence.summary
            }
            onApprove={() => onGateAction("investigate", "approved")}
            onDeny={() => onGateAction("investigate", "denied")}
            onSaveEdit={(edited) =>
              onGateAction("investigate", "edited", edited)
            }
          />
        </>
      )}

      {activeStage === "decide" && outputs.decision && (
        <>
          <h2 className="text-lg font-semibold text-signal-ink">
            Stage 3 — Decide
          </h2>
          <StageHeadline>{getDecideHeadline(outputs.decision)}</StageHeadline>

          <div className="mt-4">
            <VerityAgentDecisionDraft
              draft={outputs.decision}
              displayStatement={
                outputs.decisionEditedStatement ??
                outputs.decision.decisionSupportStatement
              }
              riskScore={outputs.evidence?.riskScore.score}
              riskBand={outputs.evidence?.riskScore.band}
            />
          </div>
          <VerityAgentHumanGate
            stageLabel="Decide"
            canAct={canAct}
            currentDecision={gate?.humanDecision}
            humanEdited={gate?.humanEdited}
            editableContent={
              outputs.decisionEditedStatement ??
              outputs.decision.decisionSupportStatement
            }
            onApprove={() => onGateAction("decide", "approved")}
            onDeny={() => onGateAction("decide", "denied")}
            onSaveEdit={(edited) => onGateAction("decide", "edited", edited)}
          />
        </>
      )}

      {activeStage === "action" && outputs.action && (
        <>
          <h2 className="text-lg font-semibold text-signal-ink">
            Stage 4 — Action
          </h2>
          <StageHeadline>
            {getActionHeadline(outputs.action.actions)}
          </StageHeadline>

          <div className="mt-4">
            <VerityAgentActionPlan plan={outputs.action} />
          </div>
          <VerityAgentHumanGate
            stageLabel="Action"
            canAct={canAct}
            currentDecision={gate?.humanDecision}
            humanEdited={gate?.humanEdited}
            editableContent="Action plan reviewed and approved for human execution."
            onApprove={() => onGateAction("action", "approved")}
            onDeny={() => onGateAction("action", "denied")}
            onSaveEdit={(edited) => onGateAction("action", "edited", edited)}
          />
        </>
      )}
    </div>
  );
}
