import type { AICopilotSummary } from "./types";
import type { WalletProfileData, EnrichedCase } from "./wallet-profile";
import { getNaiveMissNote } from "./wallet-profile";
import { getPatternFamily } from "./scenario-utils";
import { parsePatternVariables, rankChips } from "./variable-chips";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickPrimaryCase(
  cases: WalletProfileData["cases"]
): EnrichedCase | null {
  if (cases.length === 0) return null;

  // Prefer scenario-linked cases
  const scenario = cases.find(
    (c) =>
      c.case_id.startsWith("CASE_MF") ||
      c.case_id.startsWith("CASE_SM") ||
      c.case_id.startsWith("CASE_APP")
  );
  if (scenario) return scenario;

  // Highest loss_amount
  return [...cases].sort((a, b) => b.loss_amount - a.loss_amount)[0] ?? null;
}

function pickPrimaryPattern(
  matchedPatterns: WalletProfileData["matchedPatterns"],
  primaryCase: EnrichedCase | null
) {
  if (matchedPatterns.length === 0) return null;

  if (primaryCase) {
    // PAT_MF/SM/APP match to case prefix
    const casePrefix = primaryCase.case_id.split("_").slice(0, 2).join("_");
    const associated = matchedPatterns.find((p) =>
      p.pattern_id.startsWith(casePrefix.replace("CASE_", "PAT_"))
    );
    if (associated) return associated;
  }

  return matchedPatterns[0];
}

function getAICopilotNote(cases: WalletProfileData["cases"]): string | null {
  for (const c of cases) {
    const note = c.notes.find((n) => n.author_type === "ai_copilot");
    if (note) return note.content;
  }
  return null;
}

function topChipLabels(variables: string, family: ReturnType<typeof getPatternFamily>, n = 3): string {
  const chips = rankChips(parsePatternVariables(variables), family);
  const top = chips.slice(0, n).map((c) => c.label.toLowerCase());
  if (top.length === 0) return "cluster-level signals";
  if (top.length === 1) return top[0];
  const last = top.pop();
  return `${top.join(", ")} and ${last}`;
}

// ---------------------------------------------------------------------------
// Suggested next step by scenario family
// ---------------------------------------------------------------------------

function getSuggestedNextStep(
  family: ReturnType<typeof getPatternFamily>
): string {
  switch (family) {
    case "Onboarding Mule Farm":
      return "Review linked accounts sharing device or SIM characteristics, compare KYC and onboarding artifacts, and confirm whether the cluster should be escalated or monitored as coordinated mule onboarding.";
    case "Sleeper Mule Activation":
      return "Review the recent inbound-to-outbound sequence, check shared cash-out destinations, and compare activity against other dormant wallets activated in the same synthetic cluster.";
    case "APP Scam Cash-out":
      return "Review destination endpoint reuse, confirm whether funds route toward agent, convenience-store, or cross-border cash-out, and preserve the evidence trail for control review.";
    case "Endpoint Intelligence":
      return "Review other wallets linked to the same endpoint and determine whether the endpoint should remain treated as a recurring cash-out risk indicator.";
    default:
      return "Review the wallet manually and determine whether any emerging pattern should be added to the analyst-curated layer.";
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function generateDeterministicCopilotSummary(
  walletProfile: WalletProfileData
): AICopilotSummary {
  const primaryCase = pickPrimaryCase(walletProfile.cases);
  const primaryPattern = pickPrimaryPattern(
    walletProfile.matchedPatterns,
    primaryCase
  );
  const aiNote = getAICopilotNote(walletProfile.cases);

  const family = primaryPattern
    ? getPatternFamily({
        pattern_id: primaryPattern.pattern_id,
        name: primaryPattern.name,
        cluster_type: primaryPattern.cluster_type,
      })
    : "Other";

  // Risk summary
  let riskSummary: string;

  if (primaryPattern) {
    const variableSummary = topChipLabels(primaryPattern.variables, family, 3);
    if (aiNote) {
      // Use ai_copilot note as the anchor; trim to a clean paragraph
      const cleanNote = aiNote.split(".").slice(0, 3).join(". ").trim();
      riskSummary = `${cleanNote}. The account may not appear high-risk from standalone scoring alone — the copilot is surfacing this cluster-level evidence for analyst review.`;
    } else {
      riskSummary = `This wallet is linked to a synthetic ${family.toLowerCase()} pattern. The review context shows ${variableSummary}. The account may not appear high-risk from standalone scoring alone, so the copilot is surfacing the cluster-level evidence for analyst review.`;
    }
  } else {
    riskSummary =
      "No analyst-curated pattern is currently linked to this wallet. The copilot summary is limited to available wallet, transaction, and case context. Analyst review remains required before disposition.";
  }

  // Matched pattern explanation
  let matchedPatternExplanation: string;

  if (primaryPattern) {
    const topSignals = topChipLabels(primaryPattern.variables, family, 3);
    matchedPatternExplanation = `Matched pattern: ${primaryPattern.name}. This pattern focuses on ${primaryPattern.cluster_type.replace(/_/g, " ")} behavior and keys on ${topSignals}.`;
  } else {
    matchedPatternExplanation =
      "No matched analyst-curated pattern is available for this wallet.";
  }

  // Naive score missed
  const naiveScoreMissed = primaryPattern
    ? getNaiveMissNote(primaryPattern.pattern_id)
    : "A naive score may miss weak or distributed risk signals when they are not concentrated in one account, transaction, or device.";

  // Suggested next step
  const suggestedNextStep = getSuggestedNextStep(family);

  return {
    riskSummary,
    matchedPatternExplanation,
    naiveScoreMissed,
    suggestedNextStep,
    sourceCaseId: primaryCase?.case_id,
    sourcePatternId: primaryPattern?.pattern_id,
  };
}
