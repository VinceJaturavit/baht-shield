import type {
  VerityActionProposal,
  VerityDecisionDraft,
  VerityEvidencePack,
  VerityIntakeOutput,
} from "./agent-types";

export function getIntakeHeadline(intakeOutput: VerityIntakeOutput): string {
  return `Scope: ${intakeOutput.proposedScope.length} checks across selected scenario signals.`;
}

export function getInvestigateHeadline(evidencePack: VerityEvidencePack): string {
  return `${evidencePack.evidenceItems.length} evidence items · Risk ${evidencePack.riskScore.score} / ${evidencePack.riskScore.band}.`;
}

export function getDecideHeadline(
  decisionDraft: VerityDecisionDraft | undefined
): string {
  if (!decisionDraft) {
    return "Decision draft pending.";
  }
  return `Proposed: ${decisionDraft.recommendation} · ${decisionDraft.confidence} confidence.`;
}

export function getActionHeadline(
  actions: VerityActionProposal[] | undefined
): string {
  if (!actions || actions.length === 0) {
    return "Action plan pending.";
  }
  const humanRequired = actions.filter(
    (a) => a.eligibility === "Human-required"
  ).length;
  return `${actions.length} actions proposed · ${humanRequired} human-required.`;
}
