import { getCaseDetail } from "@/lib/cases";
import { getScenarioFromCaseId } from "@/lib/scenario-utils";
import { analystPatterns } from "@/lib/seed-data";
import { calculateRiskScore } from "./agent-risk";
import { createAuditEvent } from "./agent-state";
import {
  buildOnChainTraceForScenario,
  getOnChainExposureFinding,
} from "./onchain-trace";
import type {
  VerityActionPlan,
  VerityAgentAuditEvent,
  VerityAgentScenario,
  VerityAgentSeedCase,
  VerityDecisionDraft,
  VerityEvidencePack,
  VerityIntakeOutput,
} from "./agent-types";

const SEED_CASE_IDS: Record<VerityAgentScenario, string> = {
  "Onboarding Mule Farm": "CASE_MF_001",
  "Sleeper Mule Activation": "CASE_SM_001",
  "APP Scam Cash-out Ring": "CASE_APP_001",
};

const SCENARIO_TRIGGERS: Record<VerityAgentScenario, string> = {
  "Onboarding Mule Farm":
    "PATTERN_MULE_FARM_CLUSTER alert — clustered onboarding with shared device signals",
  "Sleeper Mule Activation":
    "PATTERN_SLEEPER_MULE alert — dormant account reactivation with velocity shock",
  "APP Scam Cash-out Ring":
    "PATTERN_APP_SCAM alert — authorised push payment scam cash-out pattern",
};

const SCENARIO_SIGNALS: Record<VerityAgentScenario, string[]> = {
  "Onboarding Mule Farm": [
    "Shared device across multiple new accounts",
    "Cluster liveness variance below threshold",
    "Pattern-library match PAT_MF_001",
    "Individual risk scores below naive rule threshold",
  ],
  "Sleeper Mule Activation": [
    "Dormant account sudden reactivation",
    "Velocity shock after long inactivity",
    "Pattern-library match PAT_SM_001",
    "Withdrawal spike inconsistent with history",
  ],
  "APP Scam Cash-out Ring": [
    "Rapid outbound transfers to new beneficiaries",
    "Cross-beneficiary fan-out pattern",
    "Pattern-library match PAT_APP_001",
    "Victim-reported scam indicators in case notes",
  ],
};

const SCOPE_CHECKS = [
  "account history",
  "transaction/relationship graph",
  "device/IP/funding links",
  "on-chain exposure",
  "prior flags",
  "pattern-library matches",
] as const;

function toAgentScenario(caseId: string): VerityAgentScenario | null {
  const scenario = getScenarioFromCaseId(caseId);
  if (scenario === "Background") return null;
  return scenario;
}

export function getVerityAgentSeedCases(): VerityAgentSeedCase[] {
  return (Object.entries(SEED_CASE_IDS) as [VerityAgentScenario, string][]).map(
    ([scenario, caseId]) => {
      const detail = getCaseDetail(caseId);
      return {
        caseId,
        alertId: detail?.alert_id,
        entityId: detail?.wallet_id ?? undefined,
        scenario,
      };
    }
  );
}

export function getVerityAgentCaseContext(caseId: string) {
  const detail = getCaseDetail(caseId);
  if (!detail) return null;
  const scenario = toAgentScenario(caseId);
  if (!scenario) return null;
  return {
    caseId,
    detail,
    scenario,
    patternName: detail.linked_pattern_name,
    patternId: detail.linked_pattern_id,
    walletId: detail.wallet_id,
    alertRule: detail.alert_rule_name,
    severity: detail.severity,
    whyThisCase: detail.why_this_case,
    noteCount: detail.note_count,
  };
}

export function runIntakeScoping(caseId: string): VerityIntakeOutput | null {
  const ctx = getVerityAgentCaseContext(caseId);
  if (!ctx) return null;

  const { scenario, detail } = ctx;

  return {
    caseId,
    caseSummary: `Synthetic case ${caseId} linked to alert ${detail.alert_id}${
      detail.wallet_id ? ` and wallet ${detail.wallet_id}` : ""
    }. ${detail.why_this_case}`,
    scenario,
    trigger: SCENARIO_TRIGGERS[scenario],
    initialRiskSignals: SCENARIO_SIGNALS[scenario],
    proposedScope: [...SCOPE_CHECKS],
    scopeRationale: `Scope checks are proposed for the ${scenario} typology. Each atomic step maps to a discrete evidence source in the Verity seed so the investigation stays grounded and auditable.`,
    stageLimitations:
      "This stage proposes scope only. No evidence is assembled and no disposition is suggested until the human approves the investigation plan.",
  };
}

type EvidenceProfile = {
  account_history: VerityEvidencePack["evidenceItems"][number]["confidence"];
  transaction_graph: VerityEvidencePack["evidenceItems"][number]["confidence"];
  device_ip_funding: VerityEvidencePack["evidenceItems"][number]["confidence"];
  onchain_exposure: VerityEvidencePack["evidenceItems"][number]["confidence"];
  prior_flags: VerityEvidencePack["evidenceItems"][number]["confidence"];
  pattern_match: VerityEvidencePack["evidenceItems"][number]["confidence"];
};

const SCENARIO_EVIDENCE_PROFILES: Record<VerityAgentScenario, EvidenceProfile> =
  {
    "APP Scam Cash-out Ring": {
      account_history: "Medium",
      transaction_graph: "High",
      device_ip_funding: "High",
      onchain_exposure: "High",
      prior_flags: "High",
      pattern_match: "High",
    },
    "Onboarding Mule Farm": {
      account_history: "Low",
      transaction_graph: "Medium",
      device_ip_funding: "High",
      onchain_exposure: "Low",
      prior_flags: "Medium",
      pattern_match: "High",
    },
    "Sleeper Mule Activation": {
      account_history: "Medium",
      transaction_graph: "Low",
      device_ip_funding: "Medium",
      onchain_exposure: "Low",
      prior_flags: "Low",
      pattern_match: "Medium",
    },
  };

function scenarioFinding(
  scenario: VerityAgentScenario,
  category: keyof EvidenceProfile,
  ctx: NonNullable<ReturnType<typeof getVerityAgentCaseContext>>,
  pattern: (typeof analystPatterns)[number] | undefined
): string {
  const wallet = ctx.walletId ?? "unknown";
  const patternLabel = pattern?.name ?? ctx.patternId ?? "N/A";

  const findings: Record<VerityAgentScenario, Record<keyof EvidenceProfile, string>> =
    {
      "APP Scam Cash-out Ring": {
        account_history: `Wallet ${wallet} shows rapid outbound activity with ${ctx.noteCount} victim-linked case notes. Account behaviour aligns with authorised push payment scam cash-out in seed data.`,
        transaction_graph: `Transaction graph shows fan-out movement consistent with APP scam cash-out behaviour. Graph edges link ${wallet} to multiple new beneficiaries and pattern ${ctx.patternId ?? "N/A"}.`,
        device_ip_funding: `Device and funding links show high-confidence overlap between victim-reported cash-out endpoints and related synthetic beneficiaries.`,
        onchain_exposure: `Synthetic on-chain exposure summary: outbound wallet hops show consolidation toward cash-out endpoints with high-confidence withdrawal exposure. No live chain query performed.`,
        prior_flags: `Prior flags show repeated complaint-linked cash-out exposure in the synthetic seed. Alert ${ctx.detail.alert_id} (${ctx.alertRule ?? "rule unknown"}) at severity ${ctx.severity}.`,
        pattern_match: `Pattern-library match is high-confidence against APP Scam Cash-out Ring indicators: ${patternLabel} (${ctx.patternId ?? "N/A"}) with variables ${pattern?.variables ?? "see seed"}.`,
      },
      "Onboarding Mule Farm": {
        account_history: `Wallet ${wallet} has ${ctx.noteCount} case notes on file. Account history is limited because the accounts are early-stage in the onboarding cluster.`,
        transaction_graph: `Transaction graph links ${wallet} to pattern ${ctx.patternId ?? "N/A"} with medium-confidence cluster edges. Relationship graph is developing but not yet as mature as cash-out scenarios.`,
        device_ip_funding: `Device and funding links show clustered onboarding behaviour across multiple synthetic accounts. Shared device and funding-source overlap detected in seed device/SIM bindings.`,
        onchain_exposure: `On-chain exposure is present but not yet as developed as the cash-out scenario. Synthetic hops show early consolidation toward pattern ${ctx.patternId ?? "N/A"} wallets.`,
        prior_flags: `Alert ${ctx.detail.alert_id} (${ctx.alertRule ?? "rule unknown"}) at severity ${ctx.severity}. Prior analyst flags note cluster onboarding signals for ${ctx.caseId}.`,
        pattern_match: `Matched pattern ${patternLabel} (${ctx.patternId ?? "N/A"}) with high-confidence cluster indicators: ${pattern?.variables ?? "see seed"}.`,
      },
      "Sleeper Mule Activation": {
        account_history: `Wallet ${wallet} shows dormant-to-active behaviour with ${ctx.noteCount} case notes, but cash-out evidence is still developing.`,
        transaction_graph: `Transaction graph is early and does not yet show broad fan-out. Graph edges link ${wallet} to pattern ${ctx.patternId ?? "N/A"} with limited counterparty breadth.`,
        device_ip_funding: `Device and funding links show moderate overlap consistent with reactivation, but cluster signals are less developed than onboarding-farm cases.`,
        onchain_exposure: `Synthetic on-chain exposure is limited. Early inbound/outbound hops are present but consolidation toward cash-out endpoints is not yet established.`,
        prior_flags: `Alert ${ctx.detail.alert_id} (${ctx.alertRule ?? "rule unknown"}) at severity ${ctx.severity}. Prior flags are sparse and consistent with an early activation signal.`,
        pattern_match: `Pattern match is moderate and should be treated as an early-warning signal: ${patternLabel} (${ctx.patternId ?? "N/A"}) with variables ${pattern?.variables ?? "see seed"}.`,
      },
    };

  return findings[scenario][category];
}

function buildEvidenceItems(
  caseId: string,
  scenario: VerityAgentScenario,
  ctx: NonNullable<ReturnType<typeof getVerityAgentCaseContext>>
): VerityEvidencePack["evidenceItems"] {
  const prefix = caseId.replace(/[^A-Z0-9]/gi, "").slice(0, 8);
  const pattern = analystPatterns.find(
    (p) => p.pattern_id === ctx.patternId
  );
  const profile = SCENARIO_EVIDENCE_PROFILES[scenario];

  return [
    {
      id: `ev-${prefix}-acct`,
      label: "Account history review",
      category: "account_history",
      finding: scenarioFinding(scenario, "account_history", ctx, pattern),
      sourceRef: `seed:wallet_accounts/${ctx.walletId ?? caseId}`,
      confidence: profile.account_history,
    },
    {
      id: `ev-${prefix}-txn`,
      label: "Transaction / relationship graph",
      category: "transaction_graph",
      finding: scenarioFinding(scenario, "transaction_graph", ctx, pattern),
      sourceRef: `seed:graph_edges/from=${ctx.walletId ?? caseId}`,
      confidence: profile.transaction_graph,
    },
    {
      id: `ev-${prefix}-device`,
      label: "Device, IP, and funding links",
      category: "device_ip_funding",
      finding: scenarioFinding(scenario, "device_ip_funding", ctx, pattern),
      sourceRef: `seed:devices+phone_sim_bindings/${ctx.walletId ?? caseId}`,
      confidence: profile.device_ip_funding,
    },
    {
      id: `ev-${prefix}-chain`,
      label: "On-chain exposure",
      category: "onchain_exposure",
      finding: scenarioFinding(scenario, "onchain_exposure", ctx, pattern),
      sourceRef: `seed:synthetic_onchain/${caseId}`,
      confidence: profile.onchain_exposure,
    },
    {
      id: `ev-${prefix}-flags`,
      label: "Prior flags",
      category: "prior_flags",
      finding: scenarioFinding(scenario, "prior_flags", ctx, pattern),
      sourceRef: `seed:alerts/${ctx.detail.alert_id}`,
      confidence: profile.prior_flags,
    },
    {
      id: `ev-${prefix}-pattern`,
      label: "Pattern-library match",
      category: "pattern_match",
      finding: scenarioFinding(scenario, "pattern_match", ctx, pattern),
      sourceRef: `seed:analyst_patterns/${ctx.patternId ?? "N/A"}`,
      confidence: profile.pattern_match,
    },
  ];
}

export function runEvidenceAssembly(caseId: string): VerityEvidencePack | null {
  const ctx = getVerityAgentCaseContext(caseId);
  if (!ctx) return null;

  const onChainTrace = buildOnChainTraceForScenario({
    caseId,
    scenario: ctx.scenario,
  });

  const evidenceItems = buildEvidenceItems(caseId, ctx.scenario, ctx);
  const chainItemIndex = evidenceItems.findIndex(
    (i) => i.category === "onchain_exposure"
  );
  if (chainItemIndex >= 0) {
    evidenceItems[chainItemIndex] = {
      ...evidenceItems[chainItemIndex],
      finding: getOnChainExposureFinding(onChainTrace),
    };
  }

  const prefix = caseId.replace(/[^A-Z0-9]/gi, "").slice(0, 8);

  const atomicSteps = [
    {
      id: `step-${prefix}-acct`,
      label: "Account history",
      status: "completed" as const,
      output: evidenceItems[0].finding,
      evidenceRefs: [evidenceItems[0].id],
    },
    {
      id: `step-${prefix}-txn`,
      label: "Transaction / relationship graph",
      status: "completed" as const,
      output: evidenceItems[1].finding,
      evidenceRefs: [evidenceItems[1].id],
    },
    {
      id: `step-${prefix}-device`,
      label: "Device, IP, and funding links",
      status: "completed" as const,
      output: evidenceItems[2].finding,
      evidenceRefs: [evidenceItems[2].id],
    },
    {
      id: `step-${prefix}-chain`,
      label: "On-chain exposure",
      status: "completed" as const,
      output: evidenceItems[chainItemIndex].finding,
      evidenceRefs: [evidenceItems[chainItemIndex].id],
    },
    {
      id: `step-${prefix}-flags`,
      label: "Prior flags",
      status: "completed" as const,
      output: evidenceItems[4].finding,
      evidenceRefs: [evidenceItems[4].id],
    },
    {
      id: `step-${prefix}-pattern`,
      label: "Pattern-library matches",
      status: "completed" as const,
      output: evidenceItems[5].finding,
      evidenceRefs: [evidenceItems[5].id],
    },
  ];

  const summary = `The selected synthetic case (${caseId}) shows clustered signals across account history, transaction graph links, device/IP/funding overlap, synthetic on-chain exposure, prior flags, and pattern-library overlap with the ${ctx.scenario} scenario. The evidence supports further review but does not by itself execute a final decision.`;

  const riskScore = calculateRiskScore(evidenceItems);

  return {
    caseId,
    atomicSteps,
    evidenceItems,
    summary,
    riskScore,
    onChainTrace,
  };
}

function scenarioRecommendation(
  scenario: VerityAgentScenario
): VerityDecisionDraft["recommendation"] {
  const map: Record<VerityAgentScenario, VerityDecisionDraft["recommendation"]> =
    {
      "Onboarding Mule Farm": "Escalate",
      "Sleeper Mule Activation": "Hold for senior review",
      "APP Scam Cash-out Ring": "Confirm fraud",
    };
  return map[scenario];
}

function comparableCases(
  caseId: string,
  scenario: VerityAgentScenario
): VerityDecisionDraft["comparableSeedCases"] {
  const all = Object.entries(SEED_CASE_IDS) as [VerityAgentScenario, string][];
  return all
    .filter(([, id]) => id !== caseId)
    .map(([sc, id]) => ({
      caseId: id,
      scenario: sc,
      similarityReason:
        sc === scenario
          ? `Same ${sc} typology with shared pattern-library and device-cluster signals`
          : `Cross-scenario reference for disposition calibration within synthetic seed`,
    }));
}

export function runDecisionDraft(
  caseId: string,
  evidencePack: VerityEvidencePack
): VerityDecisionDraft | null {
  const ctx = getVerityAgentCaseContext(caseId);
  if (!ctx) return null;

  const recommendation = scenarioRecommendation(ctx.scenario);
  const confidence: VerityDecisionDraft["confidence"] =
    ctx.scenario === "APP Scam Cash-out Ring" ? "High" : "Medium";

  return {
    caseId,
    recommendation,
    confidence,
    reasoningChain: [
      `Alert trigger (${SCENARIO_TRIGGERS[ctx.scenario]}) aligns with ${ctx.scenario} typology in seed data.`,
      `Evidence pack ${evidencePack.evidenceItems.length} items show converging signals across account, graph, device, and pattern dimensions.`,
      `Comparable seed cases suggest analysts historically escalated or held similar ${ctx.scenario} profiles for human disposition.`,
      `No automated verdict — this draft is decision-support for human review only.`,
    ],
    comparableSeedCases: comparableCases(caseId, ctx.scenario),
    evidenceCitations: evidencePack.evidenceItems.map((item) => ({
      evidenceId: item.id,
      citationLabel: `${item.label}: ${item.finding.slice(0, 80)}...`,
    })),
    decisionSupportStatement: `Proposed judgment for human review (not an automated verdict): based on cited evidence, a ${recommendation} disposition is suggested with ${confidence} confidence. The analyst owns the final decision.`,
  };
}

export function runActionProposal(
  caseId: string,
  decisionDraft: VerityDecisionDraft
): VerityActionPlan | null {
  const ctx = getVerityAgentCaseContext(caseId);
  if (!ctx) return null;

  const pattern = analystPatterns.find((p) => p.pattern_id === ctx.patternId);

  return {
    caseId,
    actions: [
      {
        id: `act-${caseId}-route`,
        label: "Route case to senior fraud queue",
        description:
          "Open or route the case to the senior review queue for disposition. Reversible routing — no account state change.",
        reversibility: "Reversible",
        eligibility: "Agent-eligible with human approval",
        rationale: `Supports ${decisionDraft.recommendation} draft with cited evidence from ${decisionDraft.evidenceCitations.length} items.`,
      },
      {
        id: `act-${caseId}-hold`,
        label: "Place reversible hold",
        description:
          "Temporary hold on outbound transfers pending senior review. Automatically reversible on human release.",
        reversibility: "Reversible",
        eligibility: "Agent-eligible with human approval",
        rationale: `Mitigates further loss exposure while ${ctx.scenario} evidence is reviewed.`,
      },
      {
        id: `act-${caseId}-senior`,
        label: "Queue senior review",
        description:
          "Assign to senior analyst for judgment review. No autonomous disposition.",
        reversibility: "Reversible",
        eligibility: "Agent-eligible with human approval",
        rationale: `Decision draft confidence ${decisionDraft.confidence} warrants senior oversight.`,
      },
      {
        id: `act-${caseId}-le`,
        label: "Prepare LE referral package",
        description:
          "Compile evidence pack and case timeline for law-enforcement referral. Package only — submission requires human approval.",
        reversibility: "Reversible",
        eligibility: "Agent-eligible with human approval",
        rationale: `Evidence chain supports structured referral preparation for ${ctx.scenario}.`,
      },
      {
        id: `act-${caseId}-close`,
        label: "Final account closure",
        description:
          "Permanent account closure — material and irreversible. Requires human execution outside this demo.",
        reversibility: "Material / irreversible",
        eligibility: "Human-required",
        rationale: "Irreversible customer impact — not agent-executable.",
      },
      {
        id: `act-${caseId}-report`,
        label: "Submit external fraud report",
        description:
          "Final submission to external reporting body. Irreversible regulatory action.",
        reversibility: "Material / irreversible",
        eligibility: "Human-required",
        rationale: "External report submission requires human authorization.",
      },
    ],
    patternWriteBack: {
      patternName: pattern?.name ?? ctx.patternName ?? `${ctx.scenario} pattern`,
      scenario: ctx.scenario,
      evidenceIndicators: decisionDraft.evidenceCitations.map(
        (c) => c.citationLabel
      ),
      confidence: decisionDraft.confidence,
      requiresHumanApproval: true,
    },
  };
}

export { createAuditEvent };
export type { VerityAgentAuditEvent };
