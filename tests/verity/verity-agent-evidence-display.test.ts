import { describe, it, expect } from "vitest";
import {
  getEvidenceContributionMap,
  getTopCompellingEvidence,
  getCitedEvidenceRows,
} from "@/lib/verity/agent-evidence-display";
import { calculateRiskScore } from "@/lib/verity/agent-risk";
import type {
  VerityDecisionDraft,
  VerityEvidenceItem,
  VerityEvidencePack,
} from "@/lib/verity/agent-types";

function makeItem(
  overrides: Partial<VerityEvidenceItem> & {
    category: VerityEvidenceItem["category"];
  }
): VerityEvidenceItem {
  return {
    id: "ev-test",
    label: "Test item",
    finding: "Test finding",
    sourceRef: "seed:test",
    confidence: "High",
    ...overrides,
  };
}

describe("verity agent evidence display", () => {
  const items = [
    makeItem({
      id: "ev-a",
      category: "pattern_match",
      confidence: "High",
      finding: "Pattern overlap",
    }),
    makeItem({
      id: "ev-b",
      category: "account_history",
      confidence: "Low",
      finding: "Account age mismatch",
    }),
    makeItem({
      id: "ev-c",
      category: "onchain_exposure",
      confidence: "Medium",
      finding: "Mixer exposure",
    }),
  ];
  const riskScore = calculateRiskScore(items);

  it("getEvidenceContributionMap maps contribution by evidenceId", () => {
    const map = getEvidenceContributionMap(riskScore);
    expect(map.get("ev-a")?.contribution).toBe(18);
    expect(map.get("ev-b")?.contribution).toBeCloseTo(2.8, 5);
    expect(map.get("ev-c")?.contribution).toBeCloseTo(11.2, 5);
  });

  it("getTopCompellingEvidence returns max 3 items", () => {
    const top = getTopCompellingEvidence(items, riskScore, 3);
    expect(top).toHaveLength(3);
    const topTwo = getTopCompellingEvidence(items, riskScore, 2);
    expect(topTwo).toHaveLength(2);
  });

  it("top compelling evidence is sorted by contribution descending", () => {
    const top = getTopCompellingEvidence(items, riskScore);
    const contributions = top.map((e) => e.contribution?.contribution ?? 0);
    for (let i = 1; i < contributions.length; i++) {
      expect(contributions[i - 1]).toBeGreaterThanOrEqual(contributions[i]);
    }
    expect(top[0]?.item.id).toBe("ev-a");
  });

  it("High confidence wins tie where contribution ties", () => {
    const tiedItems = [
      makeItem({
        id: "ev-tie-low",
        category: "prior_flags",
        confidence: "Low",
      }),
      makeItem({
        id: "ev-tie-high",
        category: "prior_flags",
        confidence: "High",
      }),
    ];
    const tiedScore = calculateRiskScore(tiedItems);
    const top = getTopCompellingEvidence(tiedItems, tiedScore, 1);
    expect(top[0]?.item.id).toBe("ev-tie-high");
  });

  it("getCitedEvidenceRows joins citations to evidence items", () => {
    const pack: VerityEvidencePack = {
      caseId: "CASE_TEST",
      atomicSteps: [],
      evidenceItems: items,
      summary: "summary",
      riskScore,
    };
    const citations: VerityDecisionDraft["evidenceCitations"] = [
      { evidenceId: "ev-a", citationLabel: "Pattern: overlap" },
      { evidenceId: "ev-c", citationLabel: "On-chain: mixer" },
    ];
    const rows = getCitedEvidenceRows(citations, pack);
    expect(rows).toHaveLength(2);
    expect(rows[0]?.item?.id).toBe("ev-a");
    expect(rows[0]?.contribution?.contribution).toBe(18);
    expect(rows[1]?.item?.finding).toContain("Mixer");
  });

  it("getCitedEvidenceRows preserves cited evidence IDs", () => {
    const pack: VerityEvidencePack = {
      caseId: "CASE_TEST",
      atomicSteps: [],
      evidenceItems: items,
      summary: "summary",
      riskScore,
    };
    const citations: VerityDecisionDraft["evidenceCitations"] = [
      { evidenceId: "ev-a", citationLabel: "A" },
      { evidenceId: "ev-b", citationLabel: "B" },
    ];
    const rows = getCitedEvidenceRows(citations, pack);
    expect(rows.map((r) => r.citation.evidenceId)).toEqual(["ev-a", "ev-b"]);
  });

  it("missing evidence item fallback does not throw", () => {
    const pack: VerityEvidencePack = {
      caseId: "CASE_TEST",
      atomicSteps: [],
      evidenceItems: items,
      summary: "summary",
      riskScore,
    };
    const citations: VerityDecisionDraft["evidenceCitations"] = [
      { evidenceId: "ev-missing", citationLabel: "Missing item label" },
    ];
    const rows = getCitedEvidenceRows(citations, pack);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.item).toBeUndefined();
    expect(rows[0]?.citation.evidenceId).toBe("ev-missing");
    expect(rows[0]?.citation.citationLabel).toBe("Missing item label");
  });
});
