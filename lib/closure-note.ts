// Closure Note Builder utility — Spec-004
// Pure deterministic string assembly. No LLM. No API call. No external service.

import type {
  ClosureNoteInput,
  EvidenceToggleCategory,
  EvidenceToggleOption,
  GeneratedClosureNote,
} from "./types";
import type { EnrichedCase, WalletProfileData } from "./wallet-profile";
import { getScenarioFromCaseId, getScenarioFromRuleName } from "./scenario-utils";

// ---------------------------------------------------------------------------
// Scenario detection
// ---------------------------------------------------------------------------

function detectScenario(caseData: EnrichedCase): string {
  // 1. case_id prefix
  const fromCase = getScenarioFromCaseId(caseData.case_id);
  if (fromCase !== "Background") return fromCase;

  // 2. alert rule_name
  if (caseData.alert) {
    const fromRule = getScenarioFromRuleName(caseData.alert.rule_name);
    if (fromRule !== "Background") return fromRule;
  }

  // 3. matched pattern IDs via case_id prefix secondary check
  if (caseData.case_id.startsWith("CASE_MF") || caseData.case_id.includes("MULE_FARM")) {
    return "Onboarding Mule Farm";
  }
  if (caseData.case_id.startsWith("CASE_SM") || caseData.case_id.includes("SLEEPER")) {
    return "Sleeper Mule Activation";
  }
  if (caseData.case_id.startsWith("CASE_APP") || caseData.case_id.includes("APP_SCAM")) {
    return "APP Scam Cash-out Ring";
  }

  return "Background";
}

function detectMatchedPatternIds(caseData: EnrichedCase): string[] {
  const ids: string[] = [];
  const cid = caseData.case_id.toUpperCase();
  const rule = (caseData.alert?.rule_name ?? "").toUpperCase();

  if (cid.startsWith("CASE_MF") || rule.includes("MULE_FARM")) ids.push("PAT_MF_001");
  if (cid.startsWith("CASE_SM") || rule.includes("SLEEPER_MULE")) ids.push("PAT_SM_001");
  if (cid.startsWith("CASE_APP") || rule.includes("APP_SCAM")) ids.push("PAT_APP_001");
  if (rule.includes("CASHOUT_ENDPOINT")) ids.push("PAT_ENDPOINT_001");
  if (rule.includes("CROSS_BORDER")) ids.push("PAT_ENDPOINT_002");

  return [...new Set(ids)];
}

// ---------------------------------------------------------------------------
// Toggle builders
// ---------------------------------------------------------------------------

function makeToggle(
  id: string,
  label: string,
  description: string,
  category: EvidenceToggleCategory,
  defaultSelected: boolean,
  source: EvidenceToggleOption["source"]
): EvidenceToggleOption {
  return { id, label, description, category, defaultSelected, source };
}

function baseToggles(caseData: EnrichedCase, walletProfile: WalletProfileData): EvidenceToggleOption[] {
  const toggles: EvidenceToggleOption[] = [];
  const hasPatterns = walletProfile.matchedPatterns.length > 0;

  toggles.push(
    makeToggle(
      "base_pattern_present",
      "Matched analyst-curated pattern present",
      "At least one analyst-curated pattern is associated with this wallet or case.",
      "Pattern Match",
      hasPatterns,
      "pattern"
    )
  );

  toggles.push(
    makeToggle(
      "base_case_context",
      "Case has linked alert and investigation history",
      "A formal case record exists with linked alert, owner assignment, and investigation trail.",
      "Case Context",
      true,
      "case"
    )
  );

  if (walletProfile.transactions.length > 0) {
    toggles.push(
      makeToggle(
        "base_txn_reviewed",
        "Wallet activity reviewed in transaction sequence order",
        "Transaction records were reviewed in sequence order as part of this investigation.",
        "Transaction Behavior",
        true,
        "transaction"
      )
    );
  }

  toggles.push(
    makeToggle(
      "base_audit_documented",
      "Decision rationale documented for audit and control review",
      "The investigation rationale and decision are recorded in standardized form for control review.",
      "Case Context",
      true,
      "case"
    )
  );

  return toggles;
}

function scenarioToggles(scenario: string): EvidenceToggleOption[] {
  if (scenario === "Onboarding Mule Farm") {
    return [
      makeToggle(
        "mf_shared_device_sim",
        "Shared device / SIM cluster observed",
        "Multiple accounts share device fingerprints or SIM binding patterns consistent with coordinated onboarding.",
        "Device / SIM Evidence",
        true,
        "scenario"
      ),
      makeToggle(
        "mf_cluster_risk",
        "Cluster-level relationship increases risk",
        "When viewed as a cluster, the collective account relationships indicate elevated risk not apparent at the individual account level.",
        "Pattern Match",
        true,
        "scenario"
      ),
      makeToggle(
        "mf_kyc_repeat",
        "Repeated onboarding or KYC characteristics observed",
        "KYC document types or liveness patterns repeat across accounts in a way inconsistent with independent applicants.",
        "KYC / Onboarding",
        false,
        "scenario"
      ),
      makeToggle(
        "mf_individual_ok",
        "Individual account risk appears acceptable when viewed alone",
        "Standalone risk scores and KYC results for this account may appear within normal parameters; the signal is the cluster relationship.",
        "KYC / Onboarding",
        false,
        "scenario"
      ),
    ];
  }

  if (scenario === "Sleeper Mule Activation") {
    return [
      makeToggle(
        "sm_dormant_activation",
        "Dormant-then-activation behavior observed",
        "The wallet shows a distinct pattern of low-activity dormancy followed by a sudden activation event with elevated transaction volume.",
        "Transaction Behavior",
        true,
        "scenario"
      ),
      makeToggle(
        "sm_passthrough",
        "Inbound funds followed by rapid outbound pass-through",
        "Multiple inbound transfers are followed quickly by outbound disbursements, consistent with a pass-through role.",
        "Transaction Behavior",
        true,
        "scenario"
      ),
      makeToggle(
        "sm_low_risk_history",
        "Individual wallet history appears low-risk before activation",
        "The pre-activation history may show normal, low-risk patterns; the risk signal is the activation behavior itself.",
        "Case Context",
        false,
        "scenario"
      ),
      makeToggle(
        "sm_shared_endpoint",
        "Shared destination or cash-out endpoint observed",
        "Outbound funds converge on a destination or cash-out point that recurs across other reviewed cases.",
        "Endpoint / Beneficiary",
        false,
        "scenario"
      ),
    ];
  }

  if (scenario === "APP Scam Cash-out Ring") {
    return [
      makeToggle(
        "app_endpoint_recurs",
        "Destination endpoint appears across multiple cases",
        "The beneficiary or cash-out destination associated with this wallet appears in multiple prior or concurrent cases.",
        "Endpoint / Beneficiary",
        true,
        "scenario"
      ),
      makeToggle(
        "app_cashout_channel",
        "Funds route toward agent, convenience-store, or cross-border cash-out",
        "Transaction channels include agent cash-out, convenience-store top-up/withdrawal, or cross-border remittance, consistent with cash-out ring behavior.",
        "Endpoint / Beneficiary",
        true,
        "scenario"
      ),
      makeToggle(
        "app_victim_origin",
        "Victim-origin or authorized-push-payment behavior suspected",
        "Inbound fund patterns are consistent with victim-originated authorized-push-payment transfers, suggesting downstream role in an APP scam.",
        "Transaction Behavior",
        false,
        "scenario"
      ),
      makeToggle(
        "app_moderate_amounts",
        "Individual transaction amounts appear moderate",
        "Individual transaction values may fall below high-risk velocity thresholds; the signal is endpoint convergence, not per-transfer value.",
        "Transaction Behavior",
        false,
        "scenario"
      ),
    ];
  }

  return [];
}

function patternToggles(patternIds: string[]): EvidenceToggleOption[] {
  const map: Record<string, { label: string; description: string }> = {
    PAT_MF_001: {
      label: "Pattern PAT_MF_001 indicates mule-farm-style onboarding cluster",
      description:
        "Analyst-curated pattern PAT_MF_001 matched. This pattern identifies shared device/SIM clusters across multiple onboarding events.",
    },
    PAT_SM_001: {
      label: "Pattern PAT_SM_001 indicates sleeper mule activation behavior",
      description:
        "Analyst-curated pattern PAT_SM_001 matched. This pattern identifies dormant-then-activation sequences with shared cash-out destination characteristics.",
    },
    PAT_APP_001: {
      label: "Pattern PAT_APP_001 indicates APP scam cash-out ring behavior",
      description:
        "Analyst-curated pattern PAT_APP_001 matched. This pattern identifies recurring cash-out endpoint convergence across victim-origin payment flows.",
    },
    PAT_ENDPOINT_001: {
      label: "Pattern PAT_ENDPOINT_001 indicates known recurring cash-out endpoint",
      description:
        "Analyst-curated pattern PAT_ENDPOINT_001 matched. This pattern flags a beneficiary or endpoint appearing repeatedly across prior cash-out cases.",
    },
    PAT_ENDPOINT_002: {
      label: "Pattern PAT_ENDPOINT_002 indicates cross-border exit endpoint",
      description:
        "Analyst-curated pattern PAT_ENDPOINT_002 matched. This pattern identifies cross-border exit channels associated with fund exfiltration paths.",
    },
  };

  return patternIds
    .filter((pid) => pid in map)
    .map((pid) =>
      makeToggle(
        `pat_${pid.toLowerCase()}`,
        map[pid].label,
        map[pid].description,
        "Pattern Match",
        true,
        "pattern"
      )
    );
}

function walletDerivedToggles(
  walletProfile: WalletProfileData,
  matchedPatternIds: string[]
): EvidenceToggleOption[] {
  const toggles: EvidenceToggleOption[] = [];

  // Device / SIM evidence
  if (walletProfile.devices.length > 0) {
    toggles.push(
      makeToggle(
        "dev_profile_reviewed",
        "Device profile reviewed for anomaly or cluster relationship",
        "Device fingerprint and risk attributes were reviewed as part of the investigation workflow.",
        "Device / SIM Evidence",
        true,
        "wallet"
      )
    );
  }

  const hasSimChange = walletProfile.simBindings.some((s) => s.sim_change_count > 0);
  if (hasSimChange) {
    toggles.push(
      makeToggle(
        "sim_change_history",
        "SIM binding change history present",
        "One or more SIM binding changes are recorded on this account, which may be relevant to identity or account-takeover assessment.",
        "Device / SIM Evidence",
        true,
        "wallet"
      )
    );
  }

  const hasLowRiskDevice = walletProfile.devices.some((d) => d.risk_score < 40);
  if (hasLowRiskDevice && matchedPatternIds.length > 0) {
    toggles.push(
      makeToggle(
        "dev_low_score_cluster",
        "Standalone device score is not high; cluster relationship drives concern",
        "The device risk score for this account is individually below high-risk thresholds. The concern is driven by cluster relationship, not standalone score.",
        "Device / SIM Evidence",
        true,
        "wallet"
      )
    );
  }

  // Transaction behavior derived
  const directions = new Set(walletProfile.transactions.map((t) => t.direction));
  if (directions.has("inbound") && directions.has("outbound")) {
    toggles.push(
      makeToggle(
        "txn_inbound_outbound",
        "Wallet shows inbound and outbound movement pattern",
        "Transaction records include both inbound receipts and outbound disbursements, consistent with active fund-flow activity.",
        "Transaction Behavior",
        true,
        "transaction"
      )
    );
  }

  const cashoutChannels = ["agent_cashout", "convenience_cashout", "cross_border_remittance"];
  const hasCashoutChannel = walletProfile.transactions.some((t) =>
    cashoutChannels.includes(t.channel)
  );
  if (hasCashoutChannel) {
    toggles.push(
      makeToggle(
        "txn_cashout_channel",
        "Outbound movement includes cash-out or cross-border channel",
        "One or more outbound transactions use agent cash-out, convenience-store, or cross-border remittance channels.",
        "Endpoint / Beneficiary",
        true,
        "transaction"
      )
    );
  }

  // Endpoint / Beneficiary
  const hasBeneficiary = walletProfile.transactions.some((t) => t.beneficiary !== null);
  if (hasBeneficiary && matchedPatternIds.length > 0) {
    toggles.push(
      makeToggle(
        "endpoint_relevant",
        "Destination endpoint appears relevant to pattern match",
        "Beneficiary or destination endpoint data was reviewed in the context of the matched analyst pattern.",
        "Endpoint / Beneficiary",
        false,
        "wallet"
      )
    );
  }

  return toggles;
}

// ---------------------------------------------------------------------------
// Main exported functions
// ---------------------------------------------------------------------------

export function deriveEvidenceToggleOptions(params: {
  caseData: EnrichedCase;
  walletProfile: WalletProfileData;
}): EvidenceToggleOption[] {
  const { caseData, walletProfile } = params;
  const scenario = detectScenario(caseData);
  const matchedPatternIds = detectMatchedPatternIds(caseData);

  const seen = new Set<string>();
  const all: EvidenceToggleOption[] = [];

  function addUnique(opts: EvidenceToggleOption[]) {
    for (const opt of opts) {
      if (!seen.has(opt.id)) {
        seen.add(opt.id);
        all.push(opt);
      }
    }
  }

  addUnique(baseToggles(caseData, walletProfile));
  addUnique(scenarioToggles(scenario));
  addUnique(patternToggles(matchedPatternIds));
  addUnique(walletDerivedToggles(walletProfile, matchedPatternIds));

  return all;
}

// ---------------------------------------------------------------------------
// Decision action mapping
// ---------------------------------------------------------------------------

const DECISION_ACTION_MAP: Record<string, string> = {
  close_account: "Close or restrict wallet pending internal review",
  suspend_wallet: "Suspend wallet and preserve evidence trail",
  escalate_compliance: "Escalate to compliance / financial crime review",
  monitor: "Monitor wallet and linked entities",
  clear: "Clear case with documented rationale",
  pending: "Keep case pending for analyst review",
};

function mapDecisionToAction(decision: string): string {
  return DECISION_ACTION_MAP[decision.toLowerCase()] ?? "Pending analyst determination";
}

// ---------------------------------------------------------------------------
// Note generation
// ---------------------------------------------------------------------------

export function generateClosureNote(input: ClosureNoteInput): GeneratedClosureNote {
  const { caseId, walletId, decision, selectedEvidence, patternNames, scenarioLabel } = input;

  // Section 1 — Case Reference
  const caseReference = `Case Reference:\nCase ${caseId} for wallet ${walletId}. This note was generated from selected structured evidence toggles using synthetic demo data.`;

  // Section 2 — Decision
  const decisionNorm = (decision ?? "").toLowerCase();
  const decisionText =
    decisionNorm === "pending" || decisionNorm === ""
      ? `Decision:\nRecommended decision: pending analyst review.`
      : `Decision:\nRecommended decision: ${decision}.`;

  // Section 3 — Evidence Summary
  let evidenceSummary: string;
  if (selectedEvidence.length === 0) {
    evidenceSummary =
      "Evidence Summary:\nNo evidence indicators were selected. Analyst review is required before disposition.";
  } else {
    const lines = selectedEvidence
      .map((e) => `- ${e.label}: ${e.description}`)
      .join("\n");
    evidenceSummary = `Evidence Summary:\nThe following evidence indicators were selected during review:\n${lines}`;
  }

  // Section 4 — Pattern Basis
  let patternBasis: string;
  if (patternNames.length > 0) {
    const patternList = patternNames.join(", ");
    patternBasis = `Pattern Basis:\nThis case is associated with ${scenarioLabel}. Matched analyst-curated pattern(s): ${patternList}. The pattern basis supports review beyond standalone risk score or naive velocity logic.`;
  } else {
    patternBasis =
      "Pattern Basis:\nNo analyst-curated pattern match was identified for this wallet. Review should rely on case context, transaction behavior, and analyst judgment.";
  }

  // Section 5 — Recommended Action
  const action = mapDecisionToAction(decision);
  const recommendedAction = `Recommended Action:\n${action}. Ensure the rationale remains available for quality review and control testing.`;

  // Section 6 — Audit / Control Note
  const auditControlNote =
    "Audit / Control Note:\nThis rationale is standardized for audit and control review. It is based on synthetic demo data and demonstrates how structured evidence selection can improve consistency across fraud investigation outcomes.";

  const fullText = [
    caseReference,
    decisionText,
    evidenceSummary,
    patternBasis,
    recommendedAction,
    auditControlNote,
  ].join("\n\n");

  return {
    caseReference,
    decision: decisionText,
    evidenceSummary,
    patternBasis,
    recommendedAction,
    auditControlNote,
    fullText,
  };
}

// ---------------------------------------------------------------------------
// Format for copy
// ---------------------------------------------------------------------------

export function formatClosureNoteForCopy(note: GeneratedClosureNote): string {
  return note.fullText;
}

// ---------------------------------------------------------------------------
// Helper: get scenario label and pattern names from case + wallet for ClosureNoteInput assembly
// ---------------------------------------------------------------------------

export function buildClosureNoteInput(
  caseData: EnrichedCase,
  walletProfile: WalletProfileData,
  selectedEvidence: EvidenceToggleOption[]
): ClosureNoteInput {
  const scenarioLabel = detectScenario(caseData);
  const patternNames = walletProfile.matchedPatterns.map((p) => p.name);

  return {
    caseId: caseData.case_id,
    walletId: walletProfile.wallet.wallet_id,
    decision: caseData.decision ?? "pending",
    selectedEvidence,
    patternNames,
    scenarioLabel,
    lossAmount: caseData.loss_amount ?? 0,
  };
}
