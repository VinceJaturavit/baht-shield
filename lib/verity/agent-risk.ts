import type {
  VerityEvidenceItem,
  VerityRiskBand,
  VerityRiskContribution,
  VerityRiskScore,
} from "./agent-types";

const CATEGORY_WEIGHTS: Record<VerityEvidenceItem["category"], number> = {
  pattern_match: 18,
  onchain_exposure: 16,
  transaction_graph: 14,
  device_ip_funding: 12,
  prior_flags: 10,
  account_history: 7,
};

const CONFIDENCE_MULTIPLIERS: Record<
  VerityEvidenceItem["confidence"],
  number
> = {
  High: 1.0,
  Medium: 0.7,
  Low: 0.4,
};

export const RISK_RULE_SUMMARY =
  "Risk is derived from deterministic evidence weights. Pattern matches and on-chain exposure carry more weight than account history. Confidence adjusts each item's contribution. This is a transparent rule, not an ML model.";

export const RISK_VS_CONFIDENCE_CAPTION =
  "Risk means how serious the case appears based on evidence. Confidence means how sure the draft judgment is. A case can be high-risk with medium confidence if the evidence is serious but still incomplete.";

export function getEvidenceCategoryWeight(
  category: VerityEvidenceItem["category"]
): number {
  return CATEGORY_WEIGHTS[category];
}

export function getConfidenceMultiplier(
  confidence: VerityEvidenceItem["confidence"]
): number {
  return CONFIDENCE_MULTIPLIERS[confidence];
}

export function calculateEvidenceContribution(
  item: VerityEvidenceItem
): VerityRiskContribution {
  const categoryWeight = getEvidenceCategoryWeight(item.category);
  const confidenceMultiplier = getConfidenceMultiplier(item.confidence);
  const contribution = categoryWeight * confidenceMultiplier;

  return {
    evidenceId: item.id,
    label: item.label,
    category: item.category,
    confidence: item.confidence,
    categoryWeight,
    confidenceMultiplier,
    contribution,
    rationale: `${item.category} weight ${categoryWeight} × ${item.confidence} confidence (${confidenceMultiplier})`,
  };
}

export function getRiskBand(score: number): VerityRiskBand {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

export function getRiskBandTone(
  band: VerityRiskBand
): "risk" | "watch" | "neutral" | "good" {
  const map: Record<VerityRiskBand, "risk" | "watch" | "neutral" | "good"> = {
    Critical: "risk",
    High: "watch",
    Medium: "neutral",
    Low: "good",
  };
  return map[band];
}

export function getRiskBandClasses(band: VerityRiskBand): string {
  const tone = getRiskBandTone(band);
  switch (tone) {
    case "risk":
      return "border border-risk-critical/40 bg-risk-critical/10 text-risk-critical";
    case "watch":
      return "border border-risk-high/40 bg-risk-high/10 text-risk-high";
    case "neutral":
      return "border border-risk-medium/40 bg-risk-medium/10 text-risk-medium";
    case "good":
      return "border border-signal-border bg-signal-muted text-signal-secondary";
  }
}

export function calculateRiskScore(
  evidenceItems: VerityEvidenceItem[]
): VerityRiskScore {
  const contributions = evidenceItems.map(calculateEvidenceContribution);
  const rawScore = contributions.reduce((sum, c) => sum + c.contribution, 0);
  const score = Math.min(100, Math.round(rawScore));
  const band = getRiskBand(score);

  return {
    score,
    band,
    contributions,
    ruleSummary: RISK_RULE_SUMMARY,
  };
}
