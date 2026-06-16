import type {
  VerityDecisionDraft,
  VerityEvidenceItem,
  VerityEvidencePack,
  VerityRiskContribution,
  VerityRiskScore,
} from "./agent-types";

export const EVIDENCE_CATEGORY_LABELS: Record<
  VerityEvidenceItem["category"],
  string
> = {
  account_history: "Account history",
  transaction_graph: "Transaction graph",
  device_ip_funding: "Device / IP / funding",
  onchain_exposure: "On-chain exposure",
  prior_flags: "Prior flags",
  pattern_match: "Pattern match",
};

const CONFIDENCE_RANK: Record<VerityEvidenceItem["confidence"], number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export function getEvidenceCategoryLabel(
  category: VerityEvidenceItem["category"]
): string {
  return EVIDENCE_CATEGORY_LABELS[category] ?? category;
}

export function getEvidenceContributionMap(
  riskScore: VerityRiskScore
): Map<string, VerityRiskContribution> {
  return new Map(riskScore.contributions.map((c) => [c.evidenceId, c]));
}

export function getEvidenceContributionForItem(
  item: VerityEvidenceItem,
  riskScore: VerityRiskScore
): VerityRiskContribution | undefined {
  return getEvidenceContributionMap(riskScore).get(item.id);
}

export function getTopCompellingEvidence(
  evidenceItems: VerityEvidenceItem[],
  riskScore: VerityRiskScore,
  limit = 3
): Array<{
  item: VerityEvidenceItem;
  contribution?: VerityRiskContribution;
}> {
  const contributionMap = getEvidenceContributionMap(riskScore);

  return [...evidenceItems]
    .map((item) => ({
      item,
      contribution: contributionMap.get(item.id),
    }))
    .sort((a, b) => {
      const aContrib = a.contribution?.contribution ?? 0;
      const bContrib = b.contribution?.contribution ?? 0;
      if (bContrib !== aContrib) return bContrib - aContrib;
      return (
        CONFIDENCE_RANK[b.item.confidence] -
        CONFIDENCE_RANK[a.item.confidence]
      );
    })
    .slice(0, limit);
}

export function sortContributionsByScore(
  contributions: VerityRiskContribution[]
): VerityRiskContribution[] {
  return [...contributions].sort((a, b) => {
    if (b.contribution !== a.contribution) {
      return b.contribution - a.contribution;
    }
    return (
      CONFIDENCE_RANK[b.confidence] - CONFIDENCE_RANK[a.confidence]
    );
  });
}

export function getCitedEvidenceRows(
  citations: VerityDecisionDraft["evidenceCitations"],
  evidencePack: VerityEvidencePack
): Array<{
  citation: VerityDecisionDraft["evidenceCitations"][number];
  item?: VerityEvidenceItem;
  contribution?: VerityRiskContribution;
}> {
  const itemMap = new Map(
    evidencePack.evidenceItems.map((item) => [item.id, item])
  );
  const contributionMap = getEvidenceContributionMap(evidencePack.riskScore);

  return citations.map((citation) => ({
    citation,
    item: itemMap.get(citation.evidenceId),
    contribution: contributionMap.get(citation.evidenceId),
  }));
}
