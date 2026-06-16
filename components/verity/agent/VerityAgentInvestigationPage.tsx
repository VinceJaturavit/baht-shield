"use client";

import { useCallback, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  getVerityAgentSeedCases,
  runIntakeScoping,
  runEvidenceAssembly,
  runDecisionDraft,
  runActionProposal,
  createAuditEvent,
} from "@/lib/verity/agent-engine";
import {
  initialStageGates,
  applyHumanDecision,
  getStageStatus,
} from "@/lib/verity/agent-state";
import type {
  VerityAgentAuditEvent,
  VerityAgentStage,
  VerityHumanDecision,
  StageGateState,
} from "@/lib/verity/agent-types";
import { AGENT_STAGES } from "@/lib/verity/agent-types";
import { VerityAgentCaseSelector } from "./VerityAgentCaseSelector";
import { VerityAgentStepper } from "./VerityAgentStepper";
import { VerityAgentStagePanel } from "./VerityAgentStagePanel";
import { VerityAgentAuditTrail } from "./VerityAgentAuditTrail";
import { VerityAgentHowItWorks } from "./VerityAgentHowItWorks";

const seedCases = getVerityAgentSeedCases();

function firstActiveStage(gates: StageGateState[]): VerityAgentStage {
  const active = gates.find((g) => g.status === "active" || g.status === "denied");
  return active?.stage ?? "intake";
}

function summarizeStageOutput(stage: VerityAgentStage, caseId: string): string {
  switch (stage) {
    case "intake": {
      const out = runIntakeScoping(caseId);
      return out
        ? `Scope proposed for ${out.scenario}: ${out.proposedScope.length} checks`
        : "Intake failed";
    }
    case "investigate": {
      const out = runEvidenceAssembly(caseId);
      return out
        ? `Evidence pack: ${out.evidenceItems.length} items, ${out.atomicSteps.length} steps`
        : "Investigate failed";
    }
    case "decide": {
      const ev = runEvidenceAssembly(caseId);
      if (!ev) return "Decide failed";
      const out = runDecisionDraft(caseId, ev);
      return out
        ? `Draft: ${out.recommendation} (${out.confidence} confidence)`
        : "Decide failed";
    }
    case "action": {
      const ev = runEvidenceAssembly(caseId);
      if (!ev) return "Action failed";
      const dec = runDecisionDraft(caseId, ev);
      if (!dec) return "Action failed";
      const out = runActionProposal(caseId, dec);
      return out
        ? `${out.actions.length} proposed actions, pattern write-back included`
        : "Action failed";
    }
  }
}

export function VerityAgentInvestigationPage() {
  const [selectedCaseId, setSelectedCaseId] = useState(seedCases[0]?.caseId ?? "");
  const [gates, setGates] = useState<StageGateState[]>(initialStageGates);
  const [auditEvents, setAuditEvents] = useState<VerityAgentAuditEvent[]>([]);
  const [activeStage, setActiveStage] = useState<VerityAgentStage>("intake");
  const [intakeEditedSummary, setIntakeEditedSummary] = useState<string | undefined>();
  const [evidenceEditedSummary, setEvidenceEditedSummary] = useState<string | undefined>();
  const [decisionEditedStatement, setDecisionEditedStatement] = useState<string | undefined>();

  const resetRun = useCallback((caseId: string) => {
    setGates(initialStageGates());
    setAuditEvents([]);
    setActiveStage("intake");
    setIntakeEditedSummary(undefined);
    setEvidenceEditedSummary(undefined);
    setDecisionEditedStatement(undefined);

    const intake = runIntakeScoping(caseId);
    if (intake) {
      setAuditEvents([
        createAuditEvent({
          stage: "intake",
          inputSummary: `Case ${caseId} selected`,
          agentOutputSummary: summarizeStageOutput("intake", caseId),
        }),
      ]);
    }
  }, []);

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    resetRun(caseId);
  };

  const outputs = useMemo(() => {
    const intake = runIntakeScoping(selectedCaseId) ?? undefined;
    const evidence = runEvidenceAssembly(selectedCaseId) ?? undefined;
    const decision =
      evidence ? runDecisionDraft(selectedCaseId, evidence) ?? undefined : undefined;
    const action =
      decision ? runActionProposal(selectedCaseId, decision) ?? undefined : undefined;

    return {
      intake,
      intakeEditedSummary,
      evidence,
      evidenceEditedSummary,
      decision,
      decisionEditedStatement,
      action,
    };
  }, [
    selectedCaseId,
    intakeEditedSummary,
    evidenceEditedSummary,
    decisionEditedStatement,
  ]);

  const handleGateAction = (
    stage: VerityAgentStage,
    decision: VerityHumanDecision,
    editedContent?: string
  ) => {
    if (decision === "edited" && editedContent !== undefined) {
      if (stage === "intake") setIntakeEditedSummary(editedContent);
      if (stage === "investigate") setEvidenceEditedSummary(editedContent);
      if (stage === "decide") setDecisionEditedStatement(editedContent);
    }

    const newGates = applyHumanDecision(gates, stage, decision);
    setGates(newGates);

    const outputSummary =
      decision === "edited" && editedContent
        ? `Human-edited: ${editedContent.slice(0, 120)}...`
        : summarizeStageOutput(stage, selectedCaseId);

    const event = createAuditEvent({
      stage,
      inputSummary: `Human gate on ${stage} for ${selectedCaseId}`,
      agentOutputSummary: outputSummary,
      humanDecision: decision,
      humanEdited: decision === "edited",
      notes:
        decision === "denied"
          ? "Stage denied — user remains on current stage"
          : decision === "approved"
            ? "Stage approved — next stage unlocked"
            : "Stage output edited and approved",
    });

    setAuditEvents((prev) => [...prev, event]);

    if (decision === "approved" || decision === "edited") {
      const nextStage = firstActiveStage(newGates);
      setActiveStage(nextStage);

      if (nextStage !== stage && getStageStatus(newGates, nextStage) === "active") {
        setAuditEvents((prev) => [
          ...prev,
          createAuditEvent({
            stage: nextStage,
            inputSummary: `Prior stage ${stage} approved`,
            agentOutputSummary: summarizeStageOutput(nextStage, selectedCaseId),
          }),
        ]);
      }
    }
  };

  const viewableStage = useMemo(() => {
    const approvedStages = gates
      .filter((g) => g.status === "approved")
      .map((g) => g.stage);
    const active = gates.find((g) => g.status === "active" || g.status === "denied");
    if (active && active.stage === activeStage) return activeStage;
    if (approvedStages.includes(activeStage)) return activeStage;
    return active?.stage ?? activeStage;
  }, [gates, activeStage]);

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-[30px] leading-[38px] font-semibold tracking-tight text-signal-ink">
          Agentic Investigation
        </h1>
        <p className="mt-2 text-[15px] leading-6 text-signal-slate">
          Human-gated investigation copilot over synthetic Verity seed cases.
          Deterministic engine — no live API, no autonomous action.
        </p>
      </div>

      <div className="space-y-6">
        <VerityAgentCaseSelector
          seedCases={seedCases}
          selectedCaseId={selectedCaseId}
          onSelect={handleCaseSelect}
        />

        <VerityAgentStepper gates={gates} activeStage={viewableStage} />

        <div className="flex flex-wrap gap-1 border-b border-signal-borderSubtle pb-3">
          {AGENT_STAGES.map((s) => {
            const status = getStageStatus(gates, s.id);
            const viewable =
              status === "approved" || status === "active" || status === "denied";
            return (
              <button
                key={s.id}
                type="button"
                disabled={!viewable}
                onClick={() => viewable && setActiveStage(s.id)}
                className={`rounded-signalSm px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2 ${
                  viewableStage === s.id
                    ? "bg-signal-indigoSubtle text-signal-indigo"
                    : viewable
                      ? "text-signal-slate hover:bg-signal-surfaceSubtle"
                      : "cursor-not-allowed text-signal-secondary opacity-50"
                }`}
              >
                View {s.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <VerityAgentStagePanel
            activeStage={viewableStage}
            gates={gates}
            outputs={outputs}
            onGateAction={handleGateAction}
          />

          <div className="space-y-6">
            <VerityAgentHowItWorks />
            <VerityAgentAuditTrail events={auditEvents} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
