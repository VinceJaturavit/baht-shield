import { describe, it, expect } from "vitest";
import {
  getVerityAgentSeedCases,
  runIntakeScoping,
  runEvidenceAssembly,
  runDecisionDraft,
  runActionProposal,
} from "@/lib/verity/agent-engine";

describe("verity agent engine", () => {
  it("seed cases include all three scenarios", () => {
    const cases = getVerityAgentSeedCases();
    expect(cases).toHaveLength(3);
    const scenarios = cases.map((c) => c.scenario);
    expect(scenarios).toContain("Onboarding Mule Farm");
    expect(scenarios).toContain("Sleeper Mule Activation");
    expect(scenarios).toContain("APP Scam Cash-out Ring");
  });

  it("intake output is deterministic for same case", () => {
    const a = runIntakeScoping("CASE_MF_001");
    const b = runIntakeScoping("CASE_MF_001");
    expect(a).toEqual(b);
    expect(a?.scenario).toBe("Onboarding Mule Farm");
  });

  it("evidence assembly is deterministic for same case", () => {
    const a = runEvidenceAssembly("CASE_SM_001");
    const b = runEvidenceAssembly("CASE_SM_001");
    expect(a).toEqual(b);
  });

  it("evidence pack includes riskScore", () => {
    const pack = runEvidenceAssembly("CASE_MF_001");
    expect(pack).not.toBeNull();
    expect(pack!.riskScore).toBeDefined();
    expect(pack!.riskScore.score).toBeGreaterThanOrEqual(0);
    expect(pack!.riskScore.score).toBeLessThanOrEqual(100);
    expect(["Critical", "High", "Medium", "Low"]).toContain(pack!.riskScore.band);
    expect(pack!.riskScore.contributions).toHaveLength(pack!.evidenceItems.length);
    for (const c of pack!.riskScore.contributions) {
      const evidenceIds = pack!.evidenceItems.map((i) => i.id);
      expect(evidenceIds).toContain(c.evidenceId);
    }
  });

  it("decision confidence is not derived from risk band", () => {
    const appPack = runEvidenceAssembly("CASE_APP_001")!;
    const appDraft = runDecisionDraft("CASE_APP_001", appPack)!;
    expect(appDraft.confidence).toBe("High");
    expect(appPack.riskScore.band).toBe("High");

    const sleeperPack = runEvidenceAssembly("CASE_SM_001")!;
    const sleeperDraft = runDecisionDraft("CASE_SM_001", sleeperPack)!;
    expect(sleeperDraft.confidence).toBe("Medium");
    expect(sleeperPack.riskScore.band).toBe("Medium");
    // Draft confidence stays scenario-driven even when risk scores differ
    expect(sleeperPack.riskScore.score).not.toBe(appPack.riskScore.score);
  });

  it("all three scenarios build evidence with differentiated confidence profiles", () => {
    const app = runEvidenceAssembly("CASE_APP_001")!;
    const mule = runEvidenceAssembly("CASE_MF_001")!;
    const sleeper = runEvidenceAssembly("CASE_SM_001")!;

    const appConfidences = app.evidenceItems.map((i) => i.confidence).join(",");
    const muleConfidences = mule.evidenceItems.map((i) => i.confidence).join(",");
    const sleeperConfidences = sleeper.evidenceItems
      .map((i) => i.confidence)
      .join(",");

    expect(new Set([appConfidences, muleConfidences, sleeperConfidences]).size).toBe(3);
  });

  it("APP Scam has stronger evidence profile than Sleeper Mule Activation", () => {
    const app = runEvidenceAssembly("CASE_APP_001")!;
    const sleeper = runEvidenceAssembly("CASE_SM_001")!;

    const highCount = (items: typeof app.evidenceItems) =>
      items.filter((i) => i.confidence === "High").length;

    expect(highCount(app.evidenceItems)).toBeGreaterThan(
      highCount(sleeper.evidenceItems)
    );
    expect(app.riskScore.score).toBeGreaterThan(sleeper.riskScore.score);
  });

  it("Onboarding Mule Farm has strong device_ip_funding and pattern_match evidence", () => {
    const mule = runEvidenceAssembly("CASE_MF_001")!;
    const device = mule.evidenceItems.find(
      (i) => i.category === "device_ip_funding"
    );
    const pattern = mule.evidenceItems.find(
      (i) => i.category === "pattern_match"
    );
    expect(device?.confidence).toBe("High");
    expect(pattern?.confidence).toBe("High");
  });

  it("Sleeper Mule Activation does not have all-High evidence profile", () => {
    const sleeper = runEvidenceAssembly("CASE_SM_001")!;
    const allHigh = sleeper.evidenceItems.every((i) => i.confidence === "High");
    expect(allHigh).toBe(false);
  });

  it("same case produces same evidence profile twice", () => {
    const a = runEvidenceAssembly("CASE_APP_001")!;
    const b = runEvidenceAssembly("CASE_APP_001")!;
    expect(a.evidenceItems.map((i) => i.confidence)).toEqual(
      b.evidenceItems.map((i) => i.confidence)
    );
    expect(a.riskScore.score).toBe(b.riskScore.score);
  });

  it("evidence pack contains required atomic steps", () => {
    const pack = runEvidenceAssembly("CASE_APP_001");
    expect(pack).not.toBeNull();
    const labels = pack!.atomicSteps.map((s) => s.label);
    expect(labels).toContain("Account history");
    expect(labels).toContain("Transaction / relationship graph");
    expect(labels).toContain("Device, IP, and funding links");
    expect(labels).toContain("On-chain exposure");
    expect(labels).toContain("Prior flags");
    expect(labels).toContain("Pattern-library matches");
    expect(pack!.atomicSteps).toHaveLength(6);
  });

  it("evidence items have source refs", () => {
    const pack = runEvidenceAssembly("CASE_MF_001");
    expect(pack!.evidenceItems.every((i) => i.sourceRef.length > 0)).toBe(true);
  });

  it("decision draft cites Stage 2 evidence IDs", () => {
    const pack = runEvidenceAssembly("CASE_MF_001")!;
    const draft = runDecisionDraft("CASE_MF_001", pack)!;
    const evidenceIds = pack.evidenceItems.map((i) => i.id);
    for (const citation of draft.evidenceCitations) {
      expect(evidenceIds).toContain(citation.evidenceId);
    }
  });

  it("decision draft uses decision-support language", () => {
    const pack = runEvidenceAssembly("CASE_SM_001")!;
    const draft = runDecisionDraft("CASE_SM_001", pack)!;
    expect(draft.decisionSupportStatement.toLowerCase()).toContain("human");
    expect(draft.decisionSupportStatement.toLowerCase()).not.toContain("verdict executed");
    expect(draft.reasoningChain.some((r) => r.includes("decision-support"))).toBe(true);
  });

  it("action proposal includes only proposed actions", () => {
    const pack = runEvidenceAssembly("CASE_APP_001")!;
    const draft = runDecisionDraft("CASE_APP_001", pack)!;
    const plan = runActionProposal("CASE_APP_001", draft)!;
    expect(plan.actions.length).toBeGreaterThan(0);
    for (const action of plan.actions) {
      expect(action.description.toLowerCase()).not.toContain("executed");
    }
  });

  it("material/irreversible actions flagged human-required", () => {
    const pack = runEvidenceAssembly("CASE_MF_001")!;
    const draft = runDecisionDraft("CASE_MF_001", pack)!;
    const plan = runActionProposal("CASE_MF_001", draft)!;
    const irreversible = plan.actions.filter(
      (a) => a.reversibility === "Material / irreversible"
    );
    expect(irreversible.length).toBeGreaterThan(0);
    for (const action of irreversible) {
      expect(action.eligibility).toBe("Human-required");
    }
  });

  it("no action execution occurs", () => {
    const pack = runEvidenceAssembly("CASE_MF_001")!;
    const draft = runDecisionDraft("CASE_MF_001", pack)!;
    const plan = runActionProposal("CASE_MF_001", draft)!;
    expect(plan).toHaveProperty("actions");
    expect(plan).toHaveProperty("patternWriteBack");
    expect((plan as { executed?: boolean }).executed).toBeUndefined();
  });
});
