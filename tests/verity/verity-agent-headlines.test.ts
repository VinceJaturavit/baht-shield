import { describe, it, expect } from "vitest";
import {
  getIntakeHeadline,
  getInvestigateHeadline,
  getDecideHeadline,
  getActionHeadline,
} from "@/lib/verity/agent-headlines";
import {
  runIntakeScoping,
  runEvidenceAssembly,
  runDecisionDraft,
  runActionProposal,
} from "@/lib/verity/agent-engine";

describe("verity agent headlines", () => {
  it("intake headline includes scope count", () => {
    const intake = runIntakeScoping("CASE_MF_001")!;
    const headline = getIntakeHeadline(intake);
    expect(headline).toContain(`${intake.proposedScope.length} checks`);
    expect(headline).toContain("Scope:");
  });

  it("investigate headline includes evidence count and risk", () => {
    const pack = runEvidenceAssembly("CASE_SM_001")!;
    const headline = getInvestigateHeadline(pack);
    expect(headline).toContain(`${pack.evidenceItems.length} evidence items`);
    expect(headline).toContain(`Risk ${pack.riskScore.score}`);
    expect(headline).toContain(pack.riskScore.band);
  });

  it("decide headline includes recommendation and confidence", () => {
    const pack = runEvidenceAssembly("CASE_APP_001")!;
    const draft = runDecisionDraft("CASE_APP_001", pack)!;
    const headline = getDecideHeadline(draft);
    expect(headline).toContain(draft.recommendation);
    expect(headline).toContain(draft.confidence);
    expect(headline).toContain("Proposed:");
  });

  it("action headline includes action count and human-required count", () => {
    const pack = runEvidenceAssembly("CASE_MF_001")!;
    const draft = runDecisionDraft("CASE_MF_001", pack)!;
    const plan = runActionProposal("CASE_MF_001", draft)!;
    const humanRequired = plan.actions.filter(
      (a) => a.eligibility === "Human-required"
    ).length;
    const headline = getActionHeadline(plan.actions);
    expect(headline).toContain(`${plan.actions.length} actions proposed`);
    expect(headline).toContain(`${humanRequired} human-required`);
  });
});
